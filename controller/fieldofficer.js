const express = require("express");
const companyModal = require("../model/company");
const employeeModal = require("../model/employee");
const router = express.Router();
require("dotenv").config();




router.get("/:id", async (req, res) => {
    try {
        
        
        const company_id = await companyModal.findOne({
            isActive: true,
            companyCode : req.params.id
        }).lean();

        
        if (!company_id) {    
            return res.status(500).send({
                status: "failure",
                msg: "The company code is invalid",
                data: []
            });
        }

        const comCode = company_id._id
        const comId = comCode.toString()
        // console.log(comId)


        const fieldOfficer = await employeeModal.find({
            isActive: true,
            companyDetails: comId,
            designation:"fieldofficer" 
        }).select({
                "employeeName": 1,
                "employeeCode": 1,
                "_id":0
            })    
        .lean(); 

        // console.log(fieldOfficer.length)

        if (fieldOfficer.length <= 0) {
            return res.status(500).send({
                status: "failure",
                msg: "Field Officer List Empty",
                data: []
            });
        }


        return res.status(200).send({
            status: "success",
            msg: "Field Officer List",
            data: fieldOfficer
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