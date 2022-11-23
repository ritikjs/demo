var pdf = require("pdf-creator-node");
var fs = require("fs");
const express = require("express");
const router = express.Router();
const s3Details = require("../../configs/awspdf");
const PaySlipModal = require("../../model/payslip");
const employeeModal = require("../../model/employee");
 
// Read HTML Template
// options and document for pdf.create


const options = {
    formate: 'A4',
    orientation: 'portrait',
    border: '2mm',
}



router.post("", async (req, res) => {

    try {
        //destructor  all the details getting from req.body

        const { employeeCode, monthAndYear } = req.body
        // console.log(employeeName, employeeCode, monthAndYear)

        // finding payslip data is alredy created or not 
        const payslipdata = await PaySlipModal.findOne({
                employeeCode
        }).lean();

     
        // console.log("this is payslipdata" , payslipdata)

        
        //if payslip slip data is alredy there 
        //checking payslipdata is empty or not 
        
        if (payslipdata) {
            
        
            //checking given month pay slip is alredy created or not
            
            // const monthpayslip = await PaySlipModal.findOne({
            //     employeeCode,
            //     'paySlipList': {
            //         $elemMatch: { "monthAndYear": monthAndYear }
            //     }
            // });


            

            const monthpayslip = await PaySlipModal.aggregate([
                { $match: { "employeeCode": employeeCode } },
                {
                    $project: {
                        paySlipList: {
                            $filter: {
                                input: '$paySlipList',
                                as: 'paySlipList',
                                cond:  {
                                    $eq: [ "$$paySlipList.monthAndYear", monthAndYear ]
                                }    
                            }
                        },
                        _id: 0
                    }
                }
            ])

            console.log(monthpayslip[0])

            return res.status(200).send(monthpayslip[0].paySlipList)





            // console.log("this is monthpayslip", monthpayslip)

            // if month pay slip is not created yet
            if (!monthpayslip) {

                // calling createpdf function and creating new pdf
                const creatpdf = await CreateNewPdf(employeeCode, monthAndYear)
                
               
                return res.status(creatpdf.status).send({
                    status: creatpdf.Secondstatus,
                    msg: creatpdf.msg,
                    data: creatpdf.data
                })
                

            }
            // returning the alredy created data 
            else {
                //sending all data if all reday present            
                return res.status(200).send({
                    status: "success",
                    msg: "payslip credited successfully",
                    data: [monthpayslip]
                })
            }

        }
        else {

            // console.log("working createpdf")
             
            const EmployeeData = await AddEmployeeData(employeeCode, monthAndYear)
            
            // console.log(creatpdf)

            return res.status(creatpdf.status || 500).send({
                status: creatpdf.Secondstatus,
                msg: creatpdf.msg ||" Something Went Wrong" ,
                data: creatpdf.data || []
            })
        }
        // // if payslip data is empty need to create mongoose payslip data with pdf

        // else {
            
        // }

        // res.status(200).send("working")
    }
    catch (err) {
        // console.log("this is errr",err)
        res.status(500).json(err.message);
    }
});


// function throwObjWithStacktrace() {
//     const someError = { statusCode: 204 }
//     Error.captureStackTrace(someError)
//     throw someError;
// }



async function AddEmployeeData(employeeCode, monthAndYear) {

    const employeeData = await employeeModal.findOne({ employeeCode }).lean();


    if (!employeeData) {

        return {
            "status": 500,
            "Secondstatus": "failure",
            "msg": "Employee Code is Invalid",
            "data": []
        }

    }


    const newMonthyear = monthAndYear.split(" ").join("-")

    //console.log("this is new monthyear", newMonthyear)

    const filename = newMonthyear + '.pdf';


    // saving html file into html variable 
    var html = fs.readFileSync("template.html", "utf8");

    // obj for html file data
    const obj = { ...employeeData }


    const document = {
        html: html,
        data: {
            data: obj
        },
        type: "buffer"
    }



    //pdf create function
    const awspdfD = await pdf.create(document, options)
        .then((awspdf) => {
            return awspdf
        }).catch((err) => {
            return {
                "status": 500,
                "Secondstatus": "failure",
                "msg": err.message || "Something Went Wrong Pdf not created",
                "data": []
            }
        })

    // awspfD is buffer data

    if (awspdfD) {
        // params for s3data
        const params = {
            Key: `${employeeCode}/${filename}`,
            acl: 'public-read',
            Body: awspdfD,
            Bucket: process.env.AWS_PDF_BUCKET_NAME,
            ContentType: 'application/pdf',
            metadata: function (req, file, cb) {
                cb(null, { fieldName: file.fieldname });
            },

        }


        const s3Data = await s3Details.upload(params).promise()
        
        // updaing new payslip list with s3 pdf url and awskey
        
        if (!s3Data) {
            return {
                "status": 500,
                "Secondstatus": "failure",
                "msg": "Pdf not uploaded on Aws",
                "data": []
            }
        }


        const updatePayslip = await PaySlipModal.create({
                "employeeCode": employeeCode,
                "employeeName": employeeData.employeeName,
                paySlipList: [{
                    monthAndYear: monthAndYear,
                    awsKey: s3Data.Key,
                    pdfUrl: s3Data.Location
                }]
        })


        if (!updatePayslip) {
            return {
                "status": 500,
                "Secondstatus": "failure",
                "msg": "Pdf Created but not added",
                "data": []
            }
        }


        return {
            "status": 200,
            "Secondstatus": "success",
            "msg": "Pay Slip created successfully",
            "data": [updatePayslip]
        }
    }
    else {
        return {
            "status": 500,
            "Secondstatus": "failure",
            "msg": "Something Went Wrong Pdf not created",
            "data": []
        }
    }



    // return s3Data



    //  return payslipdata




}



async function CreateNewPdf(employeeCode, monthAndYear) {

    const employeeData = await employeeModal.findOne({ employeeCode }).lean();


    if (!employeeData){
       
        return {
            "status": 500,
            "Secondstatus": "failure",
            "msg":"Employee Code is Invalid",
            "data": []
        }
    
    }


    const newMonthyear = monthAndYear.split(" ").join("-")

    //console.log("this is new monthyear", newMonthyear)

    const filename = newMonthyear + '.pdf';


    // saving html file into html variable 
    var html = fs.readFileSync("template.html", "utf8");

    // obj for html file data
    const obj = { ...employeeData }


    const document = {
        html: html,
        data: {
            data: obj
        },
        type: "buffer"
    }



    //pdf create function
    const awspdfD = await pdf.create(document, options)
        .then((awspdf) => {
            return awspdf
        }).catch((err) => {
            return {
                "status": 500,
                "Secondstatus": "failure",
                "msg": err.message ||  "Something Went Wrong Pdf not created", 
                "data": []
            }
        })

    // awspfD is buffer data

    if (awspdfD) {
        // params for s3data
        const params = {
            Key: `${employeeCode}/${filename}`,
            acl: 'public-read',
            Body: awspdfD,
            Bucket: process.env.AWS_PDF_BUCKET_NAME,
            ContentType: 'application/pdf',
            metadata: function (req, file, cb) {
                cb(null, { fieldName: file.fieldname });
            },
            
        }


        const s3Data = await s3Details.upload(params).promise()
        // updaing new payslip list with s3 pdf url and awskey
        if (!s3Data) {
            return {
                "status": 500,
                "Secondstatus": "failure",
                "msg": "Pdf not uploaded on Aws",
                "data": []
            }
        }
        

        const updatePayslip = await PaySlipModal.findOneAndUpdate(
            { employeeCode },{
                $push: {
                    paySlipList: {
                        monthAndYear: monthAndYear,
                        awsKey: s3Data.Key,
                        pdfUrl: s3Data.Location
                    }
                }
            }, {
            new: true,
        })
        
        if (!updatePayslip) {
            return {
                "status": 500,
                "Secondstatus": "failure",
                "msg": "Pdf Created but not added",
                "data": []
            }
        }
        

        return {
            "status": 200,
            "Secondstatus": "success",
            "msg": "Pay Slip created successfully",
            "data": [updatePayslip]
        }
    }
    else {
        return {
            "status": 500,
            "Secondstatus": "failure",
            "msg": "Something Went Wrong Pdf not created",
            "data": []
        }
    }



    // return s3Data



    //  return payslipdata




}



router.get("/demo", async (req, res) => {
    try {
        const payslipdata = await PaySlipModal.find();

        // console.log(payslipdata)

        res.send(payslipdata).status(200)
    }
    catch (err) {
        res.send(err).status(500)
    }

});



router.post("/demo", async (req, res) => {
    try {

        const payslipdata = await PaySlipModal.create(req.body);

        console.log(payslipdata)

        res.send(payslipdata).status(200)       
    }
    catch (err) {
        res.send(err).status(500)
    }
    
});





module.exports = router;




//this code is for getsignedurl back after pdf deployed on aws

//   const url = s3.getSignedUrl('getObject', {
        //         Bucket: process.env.AWS_PDF_BUCKET_NAME,
        //         Key: filename,
        //     })

        //     console.log(url)
        //     return url



// [
//     {
//         "_id": "6360edb642623db95d45cacf",
//         "enrollementFormNo": "first",
//         "enrollementFee": 100,
//         "PFNo": "112233",
//         "ESICNo": "2233",
//         "salary": 2000,
//         "uniformType": "hh",
//         "uniformCharges": 200,
//         "uniformCotain": {
//             "shirt": false,
//             "pant": false,
//             "belt": false,
//             "cap": false,
//             "linearAndWhistle": false,
//             "shoe": false,
//             "batton": false,
//             "tie": false,
//             "torch": false,
//             "jacket": false,
//             "ceremonial": false,
//             "mobile": false
//         },
//         "children": [],
//         "educationalQualification": [],
//         "otherEmployees": {
//             "YesOrNo": false
//         },
//         "courtCase": {
//             "YesOrNo": false
//         },
//         "convictedByCourt": false,
//         "historySheetor": false,
//         "contagiousDisease": {
//             "YesOrNo": false
//         },
//         "appliedEarlier": {
//             "YesOrNo": false
//         },
//         "companyDetails": "633ab0e6ea1bedec8961c773",
//         "unitDetails": "6360ed2df4744996efb56cac",
//         "createdAt": "2022-11-01T09:58:14.510Z",
//         "updatedAt": "2022-11-01T09:58:14.510Z"
//     }
// ]