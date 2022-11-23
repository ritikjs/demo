const express = require("express");
const router = express.Router();
const employeeModal = require("../model/employee");
const companyModal = require("../model/company");
const SiteModal = require("../model/siteModal");
const uploadImageToS3 = require("../middlewares/employeeImg");
const authorization = require("../middlewares/authorization");
const { body, validationResult } = require('express-validator');
// const CompanyIdValid = require("../middlewares/companyId");
require("dotenv").config();
const Bucketupload = require("../middlewares/ImageUpload");
const aws = require('aws-sdk');
const multer = require('multer');


// get employee data
router.get("", async (req, res) => {
  try {
      //{ isActive : true}
        const employee = await employeeModal
          .find({ isActive: true })
          .then((list) => {

            if (list.length<=0) {
              return res.status(500).send({
                status: "failure",
                msg: ("employee list is Empty"),
                data: []
              })
            }
            else {
              return res.status(200).send({
                status: "success",
                msg: "employee list",
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


const upload = Bucketupload("employee").single("image")



router.post("/image", (req, res, next) => {
  upload(req, res, (err) => {

    if (err instanceof multer.MulterError) {      
      return res.status(500).send({
        status: "failure",
        msg: (err || "Internal Image Server Error"),
        data: []
      })
    }
    else if (err) {
      return res.status(500).send({
        status: "failure",
        msg: (err || "Internal Image Server Error"),
        data: []
      })
    }

    
    // Everything went fine.
    next();
  });
}, async (req, res) => {
    try {

      if (!req?.file) {
        return res.status(500).send({
          status: "failure",
          msg: ("Please upload a image "),
          data: []
        })
      }

      else {
        return res.status(200).send({
          status: "success",
          msg: "Image uploaded success",
          data: [{
            image: req?.file?.location
          }]
        })
      }


    } catch (err) {

      console.log("how to show error while" ,    err)


      return res.status(500).send({
        status: "failure",
        msg: (err.message || "Internal Server Error"),
        data: []
      })
    }
  });





router.post("/quick/registration", 
  body("employeeName")
    .trim()
    .not()
    .isEmpty()
    .bail()
    .withMessage("please provide employee name"),
  body("designation")
    .trim()
    .not()
    .isEmpty()
    .bail()
    .withMessage("please provide your designation "),
  body("nationality")
    .not()
    .isEmpty()
    .bail()
    .withMessage("please provide Your Nationality"),
  body("dateOfBirth")
    .not()
    .isEmpty()
    .bail()
    .withMessage("please provide Your Date Of Birth"),
  body("gender")
    .not()
    .isEmpty()
    .bail()
    .withMessage("please provide Your Gender"),
  body("mobileNo")
    .not()
    .isEmpty()
    .bail()
    .withMessage("please provide Your Mobile No")
    .isNumeric().withMessage('Please provide valid mobile number') ,
  body("currentAddress")
    .not()
    .isEmpty()
    .bail()
    .withMessage("please provide Your current Address"),
  
async (req, res) => {
  try {
    const errors = validationResult(req);


    if (!errors.isEmpty()) {
      const err = errors.array() 
      return res.status(500).send({
        status: "failure",
        msg: err[0]?.msg || "something went wrong",
        data: []
      })
    }


    if (!req.body.companyCode  ) {
      return res.status(500).send({
        status: "failure",
        msg: "Please Provide companyCode",
        data: []
      })
    }



    const { companyCode } = req.body;
    
    const  company_id   = await companyModal.findOne({ companyCode }).lean();


    if (!company_id) {
      return res.status(500).send({
        status: "failure",
        msg: "The company code is invalid",
        data: []
      });
    }



    const  COMID = company_id._id
    const companyId = COMID.toString()

    // const sideID = Side_id._id.toString();

    // console.log(_id)

    const employeelist = await employeeModal.find({
      companyDetails: companyId
    }).lean();

    // console.log(employeelist.length)

    let emplyeelength = employeelist.length + 1
    let str = "" + emplyeelength
    let pad = "0000"
    let ans = pad.substring(0, pad.length - str.length) + str

    let emplCode = `${companyCode}EMP${ans}`

    // console.log(emplCode)


    // console.log("companyId", companyId)
    // console.log("sideID", sideID)

    const employee = await employeeModal.create({
      companyDetails: companyId,
      employeeCode: emplCode,
      ...req.body
    });



    return res.status(200).send({
      status: "success",
      msg: "New employee created successfully",
      data: [employee]
    });

    
  } catch (err) {
    // console.log(err)
    return res.status(500).send({
      status: "failure",
      msg: (err.message || "Internal Server Error"),
      data: []
    });
  }
});






// get employee by sitecode
router.get("/sitecode", async (req, res) => {
  try {
    if ( !req.body.siteCode) {
      return res.status(500).send({
        status: "failure",
        msg: "Please Provide siteCode",
        data: []
      })
    }
    
    // console.log(req.body.siteCode)

    const { _id } = await SiteModal.findOne(
      { siteCode: req.body.siteCode },
      { isActive: true },
      { _id: 1 }).lean()
    
    const siteId  = _id.toString()

    // console.log(siteId)

    const employee = await employeeModal
      .find(
        { siteDetails: siteId  },
      )
      // .populate("companyDetails", "companyCode")
      // .populate("siteDetails", "siteCode")
      .then((list) => {

        console.log(list)

        if (list.length <= 0) {
          return res.status(500).send({
            status: "failure",
            msg: ("employee list is Empty"),
            data: []
          })
        }
        else {
          return res.status(200).send({
            status: "success",
            msg: "employee list",
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
    
  }
});



// get single employeee by employee code
// for get request for app


router.get("/single", async (req, res) => {
  try {
    if (!req.body.employeeCode) {
      return res.status(500).send({
        status: "failure",
        msg: "Please Provide employeeCode",
        data: []
      })
    }

    const employeeD = await employeeModal
      .findOne({ employeeCode : req.body.employeeCode })
      // .populate("companyDetails")
      // .populate("unitDetails")
      .then((list) => {
        if (!list) {
          return res.status(500).send({
            status: "failure",
            msg: ("employee list is Empty"),
            data: []
          })
        }
        else {
          return res.status(200).send({
            status: "success",
            msg: "employee list",
            data: [list]
          })
        };

      })
      .catch((err) => {
        return res.status(500).send({
          status: "failure",
          msg: (err.message || "Internal Server Error"),
          data: []
        });
      });

  } catch (err) {
    return res.status(500).send({
      status: "failure",
      msg: (err.message || "Internal Server Error"),
      data: []
    });
  }
});



// for webstie 
router.get("/:id", async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(500).send({
        status: "failure",
        msg: "Please Provide employeeCode",
        data: []
      })
    }

    const employeeD = await employeeModal
      .findOne({ employeeCode: req.params.id })
      // .populate("companyDetails")
      // .populate("siteDetails")
      .then((list) => {
        if (!list) {
          return res.status(500).send({
            status: "failure",
            msg: ("employee list is Empty"),
            data: []
          })
        }
        else {
          return res.status(200).send({
            status: "success",
            msg: "employee list",
            data: [list]
          })
        };

      })
      .catch((err) => {
        return res.status(500).send({
          status: "failure",
          msg: (err.message || "Internal Server Error"),
          data: []
        });
      });

  } catch (err) {
    return res.status(500).send({
      status: "failure",
      msg: (err.message || "Internal Server Error"),
      data: []
    });
  }
});





// patch request for appp 
// only for fill full data
router.post("/fullform",
// uploadImageToS3("employee")
//   .fields([
//     { name: "passportPhoto", maxCount: 1 },
//     { name: "signatureOfApplicant", maxCount: 1 },
//     { name: "aadharCard", maxCount: 1 },
//     { name: "panCard", maxCount: 1 },
//     { name: "leftThumb", maxCount: 1 },
//     { name: "rightThumb", maxCount: 1 },
  //   ]),  
  async (req, res) => {
    try {

      // console.log(req.body.father,
      //   req.body.husband)
  
      
      const { companyCode } = req.body;



      if (!req.body.companyCode) {
        return res.status(500).send({
          status: "failure",
          msg: "Please Provide companyCode ",
          data: []
        })
      }

      

    const company_id = await companyModal.findOne({ companyCode }).lean();

    // const  Side_id  = await SiteModal.findOne({ siteCode }).lean();

    if (!company_id) {
      return res.status(500).send({
        status: "failure",
        msg: "The company code is invalid",
        data: []
      });
    }


    const COMID = company_id._id
    const companyId = COMID.toString()

    // const sideID = Side_id._id.toString();


    // console.log(_id)

    const CheckEmployeeExist = await employeeModal.findOne({
     
      $and: [
        { employeeName: req.body.employeeName, },
        { dateOfBirth: req.body.dateOfBirth },
        { fatherName: req.body.fatherName },
        { husbandName: req.body.husbandName },
      ]
    }).lean();


    if (CheckEmployeeExist) {
      return res.status(200).send({
        status: "failure",
        msg: "Employee alredy exist",
        data: [CheckEmployeeExist]
      });
    }


    const employeelist = await employeeModal.find({
      companyDetails: companyId
    }).lean();

    // console.log(employeelist.length)

    let emplyeelength = employeelist.length + 1
    let str = "" + emplyeelength
    let pad = "0000"
    let ans = pad.substring(0, pad.length - str.length) + str

    let emplCode = `${companyCode}EMP${ans}`

    // console.log(emplCode)


    // console.log("companyId", companyId)
    // console.log("sideID", sideID)


    const employee = await employeeModal.create(
      {
        companyDetails: companyId,
        employeeCode: emplCode,
        ...req.body
        // passportPhoto: req.files?.passportPhoto
        //   ? req.files.passportPhoto[0].location : "",
        // signatureOfApplicant: req.files?.signatureOfApplicant
        //   ? req.files.signatureOfApplicant[0].location : "",
        // aadharCard: req.files?.aadharCard
        //   ? req.files.aadharCard[0].location : "",
        
        // panCard: req.files?.panCard
        //   ? req.files.panCard[0].location : "",
        
        //   leftThumb: req.files?.leftThumb
        //   ? req.files.leftThumb[0].location : "",
          
        //   rightThumb: req.files?.rightThumb
        //     ? req.files.rightThumb[0].location : "",

      }
    );

    if (employee) {
      
      return res.status(200).send({
        status: "success",
        msg: "new employee added Sucessfully",
        data: [employee]
      })
    }
    else {
      return res.status(500).send({
        status: "failure",
        msg: ("employee Code is Incorrect"),
        data: []
      })
    }
  


  } catch (err) {
    return res.status(500).send({
      status: "failure",
      msg: (err.message || "Internal Server Error"),
      data: []
    })

  }
});



// patch request for website
// only for fill full data
router.patch("/fullform/:id",
  // uploadImageToS3("employee")
  //   .fields([
  //     { name: "passportPhoto", maxCount: 1 },
  //     { name: "signatureOfApplicant", maxCount: 1 },
  //     { name: "aadharCard", maxCount: 1 },
  //     { name: "panCard", maxCount: 1 },
  //     { name: "leftThumb", maxCount: 1 },
  //     { name: "rightThumb", maxCount: 1 },
  //   ]),
  async (req, res) => {
    try {
      if (!req.params.id) {
        return res.status(500).send({
          status: "failure",
          msg: "Please Provide employeeCode",
          data: []
        })
      }

      const employee = await employeeModal.findOneAndUpdate(
        { employeeCode : req.params.id},
        {
          ...req.body
          // passportPhoto: req.files?.passportPhoto
          //   ? req.files.passportPhoto[0].location : "",
          // signatureOfApplicant: req.files?.signatureOfApplicant
          //   ? req.files.signatureOfApplicant[0].location : "",
          // aadharCard: req.files?.aadharCard
          //   ? req.files.aadharCard[0].location : "",

          // panCard: req.files?.panCard
          //   ? req.files.panCard[0].location : "",

          // leftThumb: req.files?.leftThumb
          //   ? req.files.leftThumb[0].location : "",

          // rightThumb: req.files?.rightThumb
          //   ? req.files.rightThumb[0].location : "",


        },
        {
          new: true,
        }
      );

      if (employee) {

        return res.status(200).send({
          status: "success",
          msg: "new employee created Sucessfully",
          data: [employee]
        })
      }
      else {
        return res.status(500).send({
          status: "failure",
          msg: ("employee Code is Incorrect"),
          data: []
        })
      }



    } catch (err) {
      return res.status(500).send({
        status: "failure",
        msg: (err.message || "Internal Server Error"),
        data: []
      })

    }
  });



 
//patch request for change in employee data  
router.patch("/:id", 
//uploadImageToS3("employee")
//     .fields([
//       { name: "passportPhoto", maxCount: 1 },
//       { name: "signatureOfApplicant", maxCount: 1 },
//       { name: "aadharCard", maxCount: 1 },
//       { name: "panCard", maxCount: 1 },
//       { name: "leftThumb", maxCount: 1 },
//       { name: "rightThumb", maxCount: 1 },
//     ]),
  async (req, res) => {
    try {
      if (!req.params.id) {
      
        return res.status(500).send({
          status: "failure",
          msg: "Please Provide employeeCode",
          data: []
        })
      
      }

      const employee = await employeeModal.findOneAndUpdate(
        { employeeCode: req.params.id },
        {
          ...req.body,
          // passportPhoto: req.files?.passportPhoto
          //   ? req.files.passportPhoto[0].location : "",
          // signatureOfApplicant: req.files?.signatureOfApplicant
          //   ? req.files.signatureOfApplicant[0].location : "",
          // aadharCard: req.files?.aadharCard
          //   ? req.files.aadharCard[0].location : "",

          // panCard: req.files?.panCard
          //   ? req.files.panCard[0].location : "",

          // leftThumb: req.files?.leftThumb
          //   ? req.files.leftThumb[0].location : "",

          // rightThumb: req.files?.rightThumb
          //   ? req.files.rightThumb[0].location : "",
        },
        {
          new: true,
        }
      );

      if (employee) {

        return res.status(200).send({
          status: "success",
          msg: "Data added Sucessfully",
          data: [employee]
        })
      }
      else {
        return res.status(500).send({
          status: "failure",
          msg: ("employee Code is Incorrect"),
          data: []
        })
      }



    } catch (err) {
      return res.status(500).send({
        status: "failure",
        msg: (err.message || "Internal Server Error"),
        data: []
      })

    }
  });


//// delete by employeeCode/////

router.delete("/:id", async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(500).send({
        status: "failure",
        msg: "Please Provide employeeCode",
        data: []
      })
    }

    const employee = await employeeModal
      .findOneAndUpdate(
        { employeeCode: req.params.id },
        { isActive: false },
        {new:true}
      );

    return res.status(200).send({
      status: "success",
      msg: "Employee delete Sucessfully",
      data: [employee]
    })
 
    
  } catch (err) {
    return res.status(500).send({
      status: "failure",
      msg: (err.message || "Internal Server Error"),
      data: []
    })

  }
});




module.exports = router;




// uploadImageToS3("employee")
//   .fields([
//     { name: "passportPhoto", maxCount: 1 },
//     { name: "aadharCard", maxCount: 1 },
//     { name: "panCard", maxCount: 1 },
//   ]),

// post data


// passportPhoto: req.files?.passportPhoto
//   ? req.files.passportPhoto[0].location : "",

//   aadharCard: req.files?.aadharCard
//     ? req.files.aadharCard[0].location : "",
//     panCard: req.files?.panCard
//       ? req.files.panCard[0].location : "",

