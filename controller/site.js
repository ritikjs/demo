const express = require("express");
const companyModal = require("../model/company");
const router = express.Router();
const SiteModal = require("../model/siteModal");
// const authorization = require("../middlewares/authorization");
require("dotenv").config();


// get all site //
router.get("", async (req, res) => {
  try {
    const site = await SiteModal
      .find(
        { isActive: true },
        {  companyDetails: 0,
          _id : 0
        })
      .then((site) => {
        if (site.length <= 0) {
          return res.status(500).send({
            status: "failure",
            msg: "site list is Empty",
            data: []
          })
        }
        
        else {
          return res.status(200).send({
            status: "success",
            msg: "site list",
            data: site
          })
        }
      })
      .catch((err) => {
        return res.status(500).send({
          status: "failure",
          msg: (err.message || err || "Internal Server Error"),
          data: []
        })
      });

  } catch (err) {
    return res.status(500).send({
      status: "failure",
      msg: (err.message || "Internal Server Error"),
      data: []
    })
  }
});


// get all site of company by giving company code
router.get("/company/:id",   async (req, res) => {
  try {

    if (!req.params.id) {
      return res.status(500).send({
        status: "failure",
        msg: "Please Provide companyCode",
        data: []
      })
    }

    const AllSite = await SiteModal.find(
      {
        isActive: true,
        companyCode: req.params.id 
      },
      {
        _id: 0,
        companyDetails: 0
      }
    ).lean()
        .then((list) => {
          if (list.length <= 0) {
            
            return res.status(500).send({
              status: "failure",
              msg: ("Invaild Companycode  or site list is empty"),
              data: []
            })
          }
          else {

            // console.log("list is emty" , list)

            return res.status(200).send({
              status: "success",
              msg: "Site List",
              data: list
            })
          }
        })
        .catch((err) => {

        return res.status(500).send({
          status: "failure",
          msg: (err.message || "Internal Server Error"),
          data: []
        })

        });

  } catch (err) {

    return res.status(500).send({
      status: "failure",
      msg: (err.message || "Internal Server Error"),
      data: []
    })

  }
});



// add new site 
router.post("",   async (req, res) => {
  try {
    // console.log(req.body.companyCode)

    if (!req.body.companyCode) {
      return res.status(500).send({
        status: "failure",
        msg: "Please Provide companyCode",
        data: []
      })
    }


    const compnayId = await companyModal.findOne({
      companyCode: req.body.companyCode},{_id:1}).lean();

    if (!compnayId) {
      return res.status(500).send({
        status: "failure",
        msg: "Company Code is Invalid",
        data: []
      })
    }



    const companyId = compnayId?._id?.toString();

    const SiteList = await SiteModal.find({
      companyDetails: companyId
    }).lean();
  

    let sitlistLength = SiteList.length + 1
    let str = "" + sitlistLength
    let pad = "000"
    let ans = pad.substring(0, pad.length - str.length) + str
    let siteCode = `SITE${ans}`

    // console.log(companyId)
    const site = await SiteModal.create({
      ...req.body,
      siteCode: siteCode,
      companyDetails : companyId,
      companyCode: req.body.companyCode
    });


    if (!site) {
      return res.status(500).send({
        status: "failure",
        msg: ("new site not credted"),
        data: []
      })
    }
    // console.log(branch)
    return res.status(200).send({
      status : "success",
      msg : "new site created successfully",
      data : [site]
    })

  } catch (err) {
    // console.log(err)
    return res.status(500).send({
      status: "failure",
      msg: (err.message || "Internal Server Error"),
      data: []
    })
  }
});



// get single side by giving sidecode
router.get("/:id",   async (req, res) => {
  try {

    if (!req.params.id) {
      return res.status(500).send({
        status: "failure",
        msg: "Please Provide siteCode",
        data: []
      })
    }


    const branch = await SiteModal
      .findOne({
        $and: [
        { "isActive" : true},
          { 'siteCode': req.params.id }
        ]
      })
  
      .then((list) => {
        if (!list) {
          return res.status(500).send({
            status: "failure",
            msg: ("Invaild Site Code"),
            data: []
          })
        }
        else {
          return res.status(200).send({
            status: "success",
            msg: "Site details",
            data: [list]
          })
        }
      })
      .catch((err) => {
        // console.log("this is err",err)
        return res.status(500).send({
          status: "failure",
          msg: (err.message || "Internal Server Error"),
          data: []
        })

      });
  } catch (err) {
    return res.status(500).send({
      status: "failure",
      msg: (err.message || "Internal Server Error"),
      data: []
    })

  }
});




//// for update site data ////////////////
router.patch("/:id", async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(500).send({
        status: "failure",
        msg: "Please Provide siteCode",
        data: []
      })
    }

    const site = await SiteModal.findOneAndUpdate(
      {
        isActive: true,
        siteCode: req.params.id
      },
      req.body,
      { new: true }
    );

    if (!site) {
      return res.status(500).send({
        status: "failure",
        msg: ("SiteCode is Invalid"),
        data: []
      });
    }

    return res.status(200).send({
      status: "success",
      msg: "Site updated successfully",
      data: [site]
    })
  }
  catch (err) {
    // console.log(err)
    return res.status(500).send({
      status: "failure",
      msg: (err.message || "Internal Server Error"),
      data: []
    })
  }
});




//// delete by id/////
router.delete("/:id",   async (req, res) => {
  try {

    if (!req.params.id) {
      return res.status(500).send({
        status: "failure",
        msg: "Please Provide siteCode",
        data: []
      })
    }
    const site = await SiteModal.findOneAndUpdate(
      { siteCode: req.params.id },
      { isActive: false },
      { new: true, }

    );

    if (!site) {
      return res.status(500).send({
        status: "failure",
        msg: ("SiteCode is Invalid"),
        data: []
      });
    }

    return res.status(200).send({
      status: "success",
      msg: "Site deleted successfully",
      data: [site]
    });
  } catch (err) {
    
    return res.status(500).send({
      status: "failure",
      msg: (err.message || "Internal Server Error"),
      data: []
    });

  }
});






module.exports = router;
