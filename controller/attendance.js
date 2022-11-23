const express = require("express");
const  EmployeeCode = require("../middlewares/attendance");
const router = express.Router();
const employeeModal = require("../model/employee");
require('dotenv').config();
const companyModal = require("../model/company");
const { body, validationResult } = require('express-validator');
const SiteModal = require("../model/siteModal");


// get all employee atten
router.get("", async (req, res) => {
    try {
        //{ isActive : true}
        const employee = await employeeModal
            .find({},
                { attendance: 1, employeeName: 1, employeeCode: 1  },
          
        )
            .then((list) => {

                if (list.length <= 0) {
                    return res.status(500).send({
                        status: "failure",
                        msg: ("attendance list is Empty"),
                        data: []
                    })
                }
                else {
                    return res.status(200).send({
                        status: "success",
                        msg: "attendance list",
                        data: list
                    })
                };

            })
            .catch((err) => {

                return res.status(500).send({
                    status: "failure",
                    msg: (err.message || "Internal Server Error"),
                    data: []
                })

            });

    }
    catch (err) {
        return res.status(500).send({
            status: "failure",
            msg: (err.message || "Internal Server Error"),
            data: []
        })

    }
});



// get single employee attendance data
router.get("/employee/:employeeid", async (req, res) => {
    try {
        const employee = await employeeModal
            .findOne({
                employeeCode: req.params.employeeid
            })
            .select({ attendance: 1 })
            .then((list) => {
                if (list.length <= 0) {
                    return res.status(500).send({
                        status: "failure",
                        msg: ("attendance list is Empty"),
                        data: []
                    })
                }
                else {
                    return res.status(200).send({
                        status: "success",
                        msg: "attendance list",
                        data: list
                    })
                };

            })
            .catch((err) => {

                return res.status(500).send({
                    status: "failure",
                    msg: (err.message || "Internal Server Error"),
                    data: []
                })

            });

    }
    catch (err) {
        return res.status(500).send({
            status: "failure",
            msg: (err.message || "Internal Server Error"),
            data: []
        })

    }
});


//mark attedance by id id == emplopyeecode 

router.patch("/in/:id",
    body("inTime")
        .trim()
        .not()
        .isEmpty()
        .bail()
        .withMessage("please provide inTime"),
    body("siteCode")
        .trim()
        .not()
        .isEmpty()
        .bail()
        .withMessage("please provide your siteCode "),
    body("nationality")
        .not()
        .isEmpty()
        .bail()
        .withMessage("please provide Your Nationality"),
    EmployeeCode, async (req, res) => {
    try {              
        const todayDate = getDate()

        // console.log(todayDate)
        // console.log(req.body)
        
        const lastAttendancedata = await employeeModal
            .findOne({ employeeCode: req.params.id },
                { attendance: { $elemMatch: { date: todayDate } } },
                { "attendance.$": 1});
        
        // console.log(req.params.id)
        // console.log(lastAttendancedata)
        
        const [attendacne] = lastAttendancedata?.attendance

                
        // console.log("this is attendance" , attendacne)

        if (attendacne) {
            
            const attendacneId = attendacne?._id

            // console.log(attendacneId)
            const _id = attendacneId.toString();

            // const employee = await employeeModal.findOneAndUpdate(
            //     { "attendance._id": attendacneId },
            //     {
            //         "$set":
            //             { 'attendance.$.outTime': req.body.outTime }
            //     }, { "attendance.$": 1 , new: true },
               
            // )
            return res.status(500).send({
                status: "failure",
                msg: "Attendance already marked",
                data: [lastAttendancedata]
            });



        }
        else {
            // console.log("this is eles condition ")

            const employee = await employeeModal.findOneAndUpdate(
                { employeeCode: req.params.id },
                {
                    $push: {
                        attendance: {
                            date: todayDate,
                            inTime: req.body.inTime,
                            siteCode: req.body.siteCode,
                            siteCost: req.body.siteCost
                        }
                    }
                },
                { new: true, "attendance": 1 })
            
                return res.status(200).send({
                    status: "success",
                    msg: "Employee Attendance Marked",
                    data: [employee]
                });
        }
            } catch (err) {
                // console.log(err)
                return res.status(500).send({
                    status: "failure",
                    msg: (err.message || "Internal Server Error"),
                    data: []
                });
            }
});


router.patch("/out/:id", EmployeeCode, async (req, res) => {
    try {
        const todayDate = getDate()

        // console.log(todayDate)
        // console.log(req.body)

        const lastAttendancedata = await employeeModal
            .findOne({ employeeCode: req.params.id },
                { attendance: { $elemMatch: { date: todayDate } } },
                { "attendance.$": 1 });

        // console.log(req.params.id)
        // console.log(lastAttendancedata)

        const [attendacne] = lastAttendancedata?.attendance


        // console.log("this is attendance" , attendacne)

        if (attendacne && attendacne.outTime && attendacne.inTime) {

            const attendacneId = attendacne?._id

            // console.log(attendacneId)
            const _id = attendacneId.toString();

            // const employee = await employeeModal.findOneAndUpdate(
            //     { "attendance._id": attendacneId },
            //     {
            //         "$set":
            //             { 'attendance.$.outTime': req.body.outTime }
            //     }, { "attendance.$": 1 , new: true },

            // )
            return res.status(500).send({
                status: "failure",
                msg: "Attendance already marked",
                data: [lastAttendancedata]
            });



        }
        if (attendacne && !attendacne.outTime && attendacne.inTime) {
            const employee = await employeeModal.findOneAndUpdate(
                { employeeCode: req.params.id },
                {
                    $push: {
                        attendance: {
                            outTime: req.body.outTime
                        }
                    }
                },
                { new: true, "attendance": 1 })

            return res.status(200).send({
                status: "success",
                msg: "Employee Attendance Marked",
                data: [employee]
            });
        }
        else  {
            
            return res.status(500).send({
                status: "failure",
                msg: "inTime is Empty",
                data: []
            });
           
        }
    } catch (err) {
        // console.log(err)
        return res.status(500).send({
            status: "failure",
            msg: (err.message || "Internal Server Error"),
            data: []
        });
    }
});




// get employee by array of employee id
router.get("/byarray", async (req, res) => {
    try {

        // console.log("thisisreq.body", req.body)
        
        const stringObj = req.body.employeeList

        const obj = JSON.parse(stringObj)

        const arry = removeDuplicates(obj)        

        const dataArray = []
        
        await Promise.all(arry.map(async (item) => {
            const exist = await employeeModal.findOne({
                employeeCode: item,
                isActive:true
            },{
                _id: 0,
                attendance: 1,
                employeeName: 1,
                employeeCode: 1
            });
            

            if (exist) {
                dataArray.push(exist)
            }
        }));

        // console.log(dataArray.length)

        if (dataArray.length > 0) {
            return res.status(200).send({
                status: "success",
                msg: "All Employee List",
                data: dataArray
            })
        }
        else {
            return res.status(500).send({
                status: "failure",
                msg: ("Employee List is Empty"),
                data: []
            })
 
        }
        


    }
    catch (err) {
        return res.status(500).send({
            status: "failure",
            msg: (err.message || "Internal Server Error"),
            data: []
        })

    }
});



router.patch("/arry/in",   async (req, res) => {
        // console.log("working")
        try {
            const todayDate = getDate()

            // console.log(todayDate)
            // console.log(req.body)

            const stringObj = req.body.employeeList

            // console.log(stringObj)

//             const obj = JSON.parse(stringObj
//             console.log("this is ", obj)
// )
            
            const arry = removeDuplicates(stringObj)
            // console.log("this is arry djnf", arry)

            const dataArray = []


            await Promise.all(arry.map(async (item) => {
                // console.log(item)
                const lastAttendancedata = await employeeModal
                    .findOne({ employeeCode: item },
                        { attendance: { $elemMatch: { date: todayDate } } },
                        { "attendance.$": 1 });
                
                // console.log(lastAttendancedata)        
                

                
                const [attendacne] = lastAttendancedata?.attendance

                // console.log(attendacne)


                if (attendacne) {

                    const attendacneId = attendacne?._id

                    // console.log(attendacneId)
                    const _id = attendacneId.toString();

                    // const employee = await employeeModal.findOneAndUpdate(
                    //     { "attendance._id": attendacneId },
                    //     {
                    //         "$set":
                    //             { 'attendance.$.outTime': req.body.outTime }
                    //     }, { "attendance.$": 1 , new: true },

                    // )
                    // return res.status(500).send({
                    //     status: "failure",
                    //     msg: "Attendance already marked",
                    //     data: [lastAttendancedata]
                    // });
                    
                    return 
                }
                else {
                    // console.log("this is eles condition ")

                    const employee = await employeeModal
                        .findOneAndUpdate(
                        { employeeCode: item },
                        {
                            $push: {
                                attendance: {
                                    date: todayDate,
                                    inTime: req.body.inTime,
                                    siteCode: req.body.siteCode,
                                    siteCost: req.body.siteCost
                                }}
                        },
                        {
                            "fields": { "_id": 0,  "attendance": 1, },
                            "new": true
                        })
                        
                    
                    
                    if (employee) {
                        dataArray.push(employee)
                    }

                    // return res.status(200).send({
                    //     status: "success",
                    //     msg: "Employee Attendance Marked",
                    //     data: [employee]
                    // });
                }                
            }));

            if (dataArray && dataArray?.length >= 1) {
                return res.status(200).send({
                   status: "success",
                   msg: "Employee Attendance Marked",
                    data: dataArray
                })
                
            }
            else {
                return res.status(500).send({
                    status: "failure",
                    msg: "Attendance already marked",
                      data: []
                })
            }
                
            

        } catch (err) {
            // console.log(err)
            return res.status(500).send({
                status: "failure",
                msg: (err.message || "Internal Server Error"),
                data: []
            });
        }
    });









// get alll employee attendance by date

router.get("/date", async (req, res) => {
    // console.log(req.body.monthandyear)
    // {
    //     employeeCode: req.params.employeeid
    // }
    try {
        const employee = await employeeModal.find(
            { "attendance.date":  req.body.date },)
            .select({ attendance: 1, employeeCode: 1, employeeName:1   })
            .then((list) => {
                    console.log("this is length", list)
                    if (list.length <= 0) {
                        return res.status(500).send({
                            status: "failure",
                            msg: ("attendance list is Empty"),
                            data: []
                        })
                    }
                    else {
                        return res.status(200).send({
                            status: "success",
                            msg: "attendance list",
                            data: list
                        })
                    };

                })
                .catch((err) => {

                    return res.status(500).send({
                        status: "failure",
                        msg: (err.message || "Internal Server Error"),
                        data: []
                    })

                });

     

    }
    catch (err) {
        // console.log
        return res.status(500).send({
            status: "failure",
            msg: (err.message || "Internal Server Error"),
            data: []
        })

    }
});


//get single employee attendance by date and employe id
router.get("/date/:id", async (req, res) => {
   
    try {
 

        const employee = await employeeModal.find(
            {
                "employeeCode": req.params.id,
                "attendance.date": req.body.date
            })
            .select({ attendance: 1, employeeCode: 1, employeeName: 1, })
            .then((list) => {
                if (!list.length) {
                    return res.status(500).send({
                        status: "failure",
                        msg: ("attendance list is Empty"),
                        data: []
                    })
                }
                else {
                    return res.status(200).send({
                        status: "success",
                        msg: "attendance list",
                        data: list
                    })
                };

            })
            .catch((err) => {

                return res.status(500).send({
                    status: "failure",
                    msg: (err.message || "Internal Server Error"),
                    data: []
                })

            });



    }
    catch (err) {
        // console.log
        return res.status(500).send({
            status: "failure",
            msg: (err.message || "Internal Server Error"),
            data: []
        })

    }
});



//get all employee by month and year
router.get("/month", async (req, res) => {
   
    try {
        const [value] = Object.values(req.body)

        // console.log(req.params.id)

     

        const employee = await employeeModal.find(
            {
                "attendance.date": { "$regex": value, "$options": "i" }

            })

            .select({ attendance: 1, employeeCode: 1, employeeName: 1, })
            .then((list) => {
                if (!list.length) {
                    return res.status(500).send({
                        status: "failure",
                        msg: ("attendance list is Empty"),
                        data: []
                    })
                }
                else {
                    return res.status(200).send({
                        status: "success",
                        msg: "attendance list",
                        data: list
                    })
                };

            })
            .catch((err) => {

                return res.status(500).send({
                    status: "failure",
                    msg: (err.message || "Internal Server Error"),
                    data: []
                })

            });



    }
    catch (err) {
        // console.log
        return res.status(500).send({
            status: "failure",
            msg: (err.message || "Internal Server Error"),
            data: []
        })

    }
});


//get single employee by month 
router.get("/month/:id", async (req, res) => {
   try {
        
       const [value] = Object.values(req.body)

    

        const employee = await employeeModal.find(
            {
                "employeeCode": req.params.id,
                "attendance.date": { "$regex": value, "$options": "i" }

            })

            .select({ attendance: 1, employeeCode: 1, employeeName: 1, })
            .then((list) => {
                if (!list.length) {
                    return res.status(500).send({
                        status: "failure",
                        msg: ("attendance list is Empty"),
                        data: []
                    })
                }
                else {
                    return res.status(200).send({
                        status: "success",
                        msg: "attendance list",
                        data: list
                    })
                };

            })
            .catch((err) => {

                return res.status(500).send({
                    status: "failure",
                    msg: (err.message || "Internal Server Error"),
                    data: []
                })

            });



    }
    catch (err) {
        // console.log
        return res.status(500).send({
            status: "failure",
            msg: (err.message || "Internal Server Error"),
            data: []
        })

    }
});


// //get all employee by month and year
// router.get("/year", async (req, res) => {
//     // console.log(req.body.monthandyear)
//     // {
//     //     employeeCode: req.params.employeeid
//     // }
//     try {


//         const employee = await employeeModal.find(
//             {
//                 "attendance.date": { "$regex": req.body.year, "$options": "i" }

//             })

//             .select({ attendance: 1, employeeCode: 1, employeeName: 1, })
//             .then((list) => {
//                 if (!list.length) {
//                     return res.status(500).send({
//                         status: "failure",
//                         msg: ("attendance list is Empty"),
//                         data: []
//                     })
//                 }
//                 else {
//                     return res.status(200).send({
//                         status: "success",
//                         msg: "attendance list",
//                         data: list
//                     })
//                 };

//             })
//             .catch((err) => {

//                 return res.status(500).send({
//                     status: "failure",
//                     msg: (err.message || "Internal Server Error"),
//                     data: []
//                 })

//             });



//     }
//     catch (err) {
//         // console.log
//         return res.status(500).send({
//             status: "failure",
//             msg: (err.message || "Internal Server Error"),
//             data: []
//         })

//     }
// });


// //get single employee by month
// router.get("/year/:id", async (req, res) => {
//     // console.log(req.body.monthandyear)
//     // {
//     //     employeeCode: req.params.employeeid
//     // }
//     try {


//         const employee = await employeeModal.find(
//             {
//                 "employeeCode": req.params.id,
//                 "attendance.date": { "$regex": req.body.year, "$options": "i" }

//             })

//             .select({ attendance: 1, employeeCode: 1, employeeName: 1, })
//             .then((list) => {
//                 if (!list.length) {
//                     return res.status(500).send({
//                         status: "failure",
//                         msg: ("attendance list is Empty"),
//                         data: []
//                     })
//                 }
//                 else {
//                     return res.status(200).send({
//                         status: "success",
//                         msg: "attendance list",
//                         data: list
//                     })
//                 };

//             })
//             .catch((err) => {

//                 return res.status(500).send({
//                     status: "failure",
//                     msg: (err.message || "Internal Server Error"),
//                     data: []
//                 })

//             });



//     }
//     catch (err) {
//         // console.log
//         return res.status(500).send({
//             status: "failure",
//             msg: (err.message || "Internal Server Error"),
//             data: []
//         })

//     }
// });



//get all employee by compnay code
router.get("/companycode", async (req, res) => {
    try {

        // console.log(req.body.companyCode)


        if (!req.body.companyCode || !req.body.siteCode) {

            return res.status(500).send({
                status: "failure",
                msg: ("Company Code or Site Code  is Invalid"),
                data: []
            })

        }


        const company_id = await companyModal.findOne({
            "companyCode": req.body.companyCode
            })
            .select({ _id: 1})
        
        // console.log(company_id)

        if (!company_id) {
            return res.status(500).send({
                status: "failure",
                msg: ("Company Code is Invalid"),
                data: []
            })
        }

        const com_id = company_id?._id
        const C_Id = com_id.toString()

        const SiteChker = await SiteModal.findOne({
            "siteCode": req.body.siteCode  
        });

        if (!SiteChker) {
            return res.status(500).send({
                status: "failure",
                msg: ("Site Code is Invalid"),
                data: []
            })
        }

        const employee = await employeeModal.find({
                $and: [
                { 'companyDetails': C_Id },
                { 'siteCode': req.body.siteCode }
            ]
            })
            .select({  employeeCode: 1, employeeName: 1, siteCode:1 })
            .then((list) => {
                if (list.length <= 0) {
                    
                    return res.status(500).send({
                        status: "failure",
                        msg: ("Employee list is Empty"),
                        data: []
                    })
                }
                else {

                    return res.status(200).send({
                        status: "success",
                        msg: "Employee list",
                        data: list
                    })
                };

            })
            .catch((err) => {

                return res.status(500).send({
                    status: "failure",
                    msg: (err.message || "Internal Server Error"),
                    data: []
                })

            });



    }
    catch (err) {
        // console.log
        return res.status(500).send({
            status: "failure",
            msg: (err.message || "Internal Server Error"),
            data: []
        })

    }
});





router.get("/companycode/date/:id", async (req, res) => {
    try {

        // console.log(req.body)
        // console.log(Object.values(req.body))
        const [value] = Object.values(req.body)

        // console.log(req.params.id)

        const company_id = await companyModal.findOne({
            "companycode": req.params.id
        }).select({ _id: 1 });

        // console.log(company_id)

        
        
        const com_id = company_id._id
        const C_Id = com_id.toString()


        const employee = await employeeModal.find({
                "companyDetails": C_Id,
                "attendance.date": { "$regex": value, "$options": "i" }
            })
            .select({ attendance: 1, employeeCode: 1, employeeName: 1, })
            .then((list) => {
                if (list.length <= 0) {
                    return res.status(500).send({
                        status: "failure",
                        msg: ("attendance list is Empty"),
                        data: []
                    })
                }
                else {
                    return res.status(200).send({
                        status: "success",
                        msg: "attendance list",
                        data: list
                    })
                };

            })
            .catch((err) => {

                return res.status(500).send({
                    status: "failure",
                    msg: (err.message || "Internal Server Error"),
                    data: []
                })

            });

    }
    catch (err) {
        // console.log
        return res.status(500).send({
            status: "failure",
            msg: (err.message || "Internal Server Error"),
            data: []
        })

    }
});






module.exports = router;

// function for get date 
function getDate() {

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    let todayDate = dd + '-' + mm + '-' + yyyy;
    return todayDate

}


// function for remove duplicate key
function removeDuplicates(arr) {
    return arr.filter((item, index) => arr.indexOf(item) === index);
}

// body("inTime")
//     .trim()
//     .not()
//     .isEmpty()
//     .bail()
//     .withMessage("please provide inTime"),
//     body("siteCode")
//         .trim()
//         .not()
//         .isEmpty()
//         .bail()
//         .withMessage("please provide your siteCode "),
    // body("siteCost")
    //     .not()
    //     .isEmpty()
    //     .bail()
    //     .withMessage("please provide Your siteCost"),