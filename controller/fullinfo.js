const express = require("express");
const router = express.Router();
const companyModal = require("../model/company");
const employeeModal = require("../model/employee");
const SiteModal = require("../model/siteModal");
const PDFDocument = require('pdfkit');
// all company ///


/// for employeee data /// 
async function Employdata(id, companyid, item) {

  const employeedeatils = await employeeModal
    .find({
      companyDetail: companyid,
      SiteDetail: id
    }).lean().exec();


  return {
    ...item,
    employeedeatils
  }

};


async function GetSiteDataFunction(companyid) {

  const companydetails = await companyModal
    .findOne({ _id: companyid })
    .lean()
    .exec();


  const sitedetails = await siteModal
    .find({
      CompanyDetail: companyid
    })
    .lean()
    .exec();


  // we are calling employdata function here ///
  let data = await Promise.all(sitedetails.map(async (item) => {
    try {
      let x = await Employdata(item._id, companyid, item)
      return x
    }
    catch (err) {
      res.status(400).send(err)
    }
  }));


  return {
    "company": companydetails,
    "data": data
  }
}



router.get("", async (req, res) => {
  try {

    const companydetails = await companyModal
      .find()
      .lean()
      .exec();

    // we are calling GetSiteDataFunction here..
    let data = await Promise.all(companydetails.map(async (item) => {
      try {
        let x = await GetSiteDataFunction(item._id)
        return x
      }
      catch (err) {
        res.status(400).send(err)
      }
    }));


    res.status(200).send(data)


  }

  catch (err) {
    res.send(err).status(500)
  }
})






router.get("/:companyid", async (req, res) => {
  try {
    // console.log(req.params.companyid);

    const companydetails = await companyModal
      .findOne({ _id: req.params.companyid })
      .lean()
      .exec();


    // console.log("sitedetails")

    const sitedetails = await siteModal
      .find({
        companyDetail: req.params.companyid,
      }).lean().exec();



    const employeedeatils = await employeeModal
      .find({
        companyDetail: req.params.companyid,
      }).lean().exec();


    return res.send({
      "company": companydetails,
      "site": sitedetails,
      "employee": employeedeatils
    }).status(200)

  }

  catch (err) {
    res.send(err).status(500)
  }
})






// download  data from note nodejs






module.exports = router;




// const companydetails = await companyModal
    //   .find()
    //   .lean()
    //   .exec();

    // // we are calling GetSiteDataFunction here..
    // let data = await Promise.all(companydetails.map(async (item) => {
    //   try {
    //     let x = await GetSiteDataFunction(item._id)

    //     console.log(x)

    //     const doc = new PDFDocument();

    //     doc.fontSize(15)
    //       .fillColor('blue')
    //       .text(JSON.stringify(x, null, 2), 100, 100)

    //     doc.pipe(res);

    //     doc.end();
    //   }
    //   catch (err) {
    //     console.log(err)
    //     res.status(400).send(err)
    //   }
    // }));
