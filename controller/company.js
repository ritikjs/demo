const express = require("express");
const router = express.Router();
const companyModal = require("../model/company");
const { body, validationResult } = require("express-validator");
require("dotenv").config();
const authorization = require("../middlewares/authorization");
const Bucketupload = require("../middlewares/ImageUpload");
const s3Image = require("../configs/awsImage");


// error code ///







// for get compnay deails 
router.get("", authorization, async (req, res) => {

  try {
    //  const token = req.cookies.auth_token;
    // console.log("this is company admin")

    const company = await companyModal.find({ isActive : true}).lean();
   
    
    if (company.length >= 1) {
      
      return res.status(200).send({
        status: "success",
        msg: "company list",
        data: company
      })
    }
    else {
      res.status(500)
      return res.status(500).send({
        status: "failure",
        msg: "Company list is Empty",
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


//////////////// for get single compnay data////////////
router.post("/single", authorization, async (req, res) => {
  
  try {
    const company = await companyModal.findOne(
      { companyCode: req.body.companyCode, isActive: true }
    ).lean();

    
    if (company) {

      return res.status(200).send({
        status: "success",
        msg: "Company Data",
        data: company
      })
    }
    else {
      res.status(500)
      return res.status(500).send({
        status: "failure",
        msg: "Company is inActive or not found",
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



/////////// for post company data ////////////
// Bucketupload("companylogos").single("companyLogo"),
router.post("", authorization,
  Bucketupload("companylogos").single("companyLogo"),
  async (req, res) => {
  try {
    const { companyName, companyLogo,
      companyEmail, companyPassword } = req.body
    
    const CompanyData = await companyModal.findOne({ companyName: companyName }).lean();
      
    //  if(companylist)
    if (CompanyData) {
      if (!CompanyData.isActive) {
        return res.status(500).send({
          status: "failure",
          msg: "Company already exists but inactive",
          data: [CompanyData]
        })
      }
      else {
        return res.status(500).send({
          status: "failure",
          msg: "Company already exists",
          data: [CompanyData]
        })
      }
    }

      
      const companylist = await companyModal.find().lean().exec();
    
    // console.log(companylist.length, companylist)
    let companylength = companylist.length+1
    let str = "" + companylength
    let pad = "000"
    let ans = pad.substring(0, pad.length - str.length) + str

    let companyCode = `COM${ans}`
    
   

    // console.log(companyCode)

    const company = await companyModal.create({
      companyName,
      companyLogo,
      companyCode: companyCode,
      companyEmail,
      companyPassword,
      companyLogo: req.file.location,
      awsKey: req.file.key,

    });

    return res.status(201).send(company);
  } catch (err) {
    return res.status(500).send({
      status: "failure",
      msg: (err.message || "Internal Server Error"),
      data: []
    })
  }
});



//// for update compnay data ////////////////

router.patch("/", authorization,
  Bucketupload("companylogos").single("companyLogo"),
  async (req, res) => {
  
    try {

    const { awsKey } = await companyModal.findOne(
      { companyCode: req.body.companyCode }
    )

    // console.log("req.fil", req.file)

    if (!awsKey && req.file || awsKey && !req.file ){
      const company = await companyModal.findOneAndUpdate(
        { companyCode: req.body.companyCode },
        req.body,
        { new: true, }
      );

      return res.status(200).send({
        status: "success",
        msg: "updated company data",
        data: company
      })
    }
    
    else{
      s3Image.deleteObjects(
        {
          Bucket: process.env.AWS_BUCKET_NAME,
          Delete: {
            Objects: [{ Key: awsKey }],
            Quiet: false,
          },
        },
        function (err, data) {
          if (err) {
            // console.log(err)
            return res.status(500).send({
              status: "failure",
              msg: (err.message || "Internal Server Error"),
              data: []
            })
          };
        }
      )
      const company = await companyModal.findOneAndUpdate(
        { companyCode: req.body.companyCode },
        {
          ...req.body,
          companyLogo: req.file.location,
          awsKey: req.file.key
        },
        { new: true, }
      );
     
      return res.status(200).send({
        status: "success",
        msg: "updated aws company data",
        data: company
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


//// delete by company id /////

router.delete("/", authorization,
  async (req, res) => {
    try {
    
      const { awsKey } = await companyModal.findOne(
        { companyCode: req.body.companyCode }
      )

      if (awsKey) {  
        s3Image.deleteObjects(
          {
            Bucket: process.env.AWS_BUCKET_NAME,
            Delete: {
              Objects: [{ Key: awsKey }],
              Quiet: false,
            },
          },
          function (err, data) {
            if (err) {
              console.log(err)
              return res.status(500).send(err);
            };
          }
        );
      }

    const company = await companyModal.findOneAndUpdate(
      { companyCode: req.body.companyCode },
      { isActive: false },
      {new: true}
    );

      return res.status(200).send({
        status: "success",
        msg: "company deleted",
        data: company
      })
    } catch (err) {

      return res.status(500).send({
        status: "failure",
        msg: (err.message || "Internal Server Error"),
        data: []
      })
  }
});



///////////  for single company login  ///////


router.post("/login",
  authorization, async (req, res) => {
  try {
    const { companyEmail, companyPassword } = req.body
    // console.log(email,password)

    // console.log(req.params.id)
    const company = await companyModal
      .findOne({ companyCode: req.body.companyCode })
      .lean()
      .exec();
    
    if (companyEmail != company.companyEmail) {
      return res.status(500).send({
        status: "failure",
        msg: "Company Email is Incorrect",
        data: []
      })
    }
    if (companyPassword != company.companyPassword) {
      return res.status(500).send({
        status: "failure",
        msg: "Company Password is Incorrect",
        data: []
      })
    }
    else {
      return res.status(200).send({
        status: "success",
        msg: "company data",
        data: company
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


// for inactive company //

router.get("/inactive", async (req, res) => {

  try {

    const company = await companyModal.find({ isActive: false }).lean();


    if (company.length >= 1) {

      return res.status(200).send({
        status: "success",
        msg: "inActive company list",
        data: company
      })
    }
    else {
      res.status(500)
      return res.status(500).send({
        status: "failure",
        msg: "inActive Company list is Empty",
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





module.exports = router;
