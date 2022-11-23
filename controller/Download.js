
const express = require("express");
const router = express.Router();
const employeeModal = require("../model/employee");
const { body, validationResult } = require("express-validator");
require('dotenv').config();
const companyModal = require("../model/company");
const PDFDocument = require('pdfkit');
const SiteModal = require("../model/siteModal");




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

                // console.log(x)
                return x

            }
            catch (err) {
                res.status(400).send(err)
            }
        }));

        const doc = new PDFDocument();
        // var json = { list: ['Test', 'Array'], success: true }

        doc.fontSize(15)
            .fillColor('blue')
            .text(JSON.stringify(data, null, 2), 100, 100)

        doc.pipe(res);


        doc.end();


        // return res.send(data).status(200)

    }

    catch (err) {
        res.send(err).status(500)
    }
});





module.exports = router;