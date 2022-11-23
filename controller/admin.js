const express = require("express");
const router = express.Router();
const companyModal = require("../model/company");

require("dotenv").config();
const authorization = require("../middlewares/authorization");




router.post("/create",
    authorization,
    async (req, res) => {
        try {
            const company = await companyModal.findOneAndUpdate(
                {  companyEmail: req.body.companyEmail },
                {
                    $push: {
                        manageAdministrations: {
                            personName: req.body.personName,
                            email: req.body.email,
                            mobile: req.body.mobile,
                            designation: req.body.designation,
                            region: req.body.region,
                            password: req.body.password,
                        }
                    }
                }, {
                new: true,
            });

            if (!company) {
                return res.status(500).send({
                    status: "failure",
                    msg: "Admin not created",
                    data: []
                })
            }


            return res.status(200).send({
                status: "success",
                msg: "New admin create successfully",
                data: [company]
            })

        }
        catch (err) {
            return res.status(500).send({
                status: "failure",
                msg: (err.message || "Internal Server Error"),
                data: []
            })
        }

    });






router.post("/login",
    async (req, res) => {
        try {

            const [companydata] = await companyModal.find(
                { companyEmail: req.body.companyEmail },
                { manageAdministrations: 0 }
            ).lean();


            if (!companydata) {
                return res.status(500).send({
                    status: "failure",
                    msg: "Please Check Your Compnay Email",
                    data: []
                })
            }
            

            const company = await companyModal.aggregate([
                { $match: {  companyEmail: req.body. companyEmail } },
                {
                    $project: {
                        manageAdministrations: {
                            $filter: {
                                input: '$manageAdministrations',
                                as: 'manageAdministrations',
                                cond: {
                                    $and: [
                                        { $eq: ['$$manageAdministrations.email', req.body.email] },
                                        { $eq: ['$$manageAdministrations.password', req.body.password] }
                                    ]
                                }
                            }
                        },
                        _id: 0
                    }
                }
            ])

            // console.log(company)

            if (company.length <= 0) {
                return res.status(500).send({
                    status: "failure",
                    msg: "Please Check Your Compnay Email",
                    data: []
                })
            }
            else if (company[0].manageAdministrations.length <= 0) {
                return res.status(500).send({
                    status: "failure",
                    msg: "Email or Password Invalid",
                    data: []
                })
            }
            else {

            const [adminData] = company[0].manageAdministrations

            const FullCompanyData = {...companydata , ...adminData }


                return res.status(200).send({
                    status: "success",
                    msg: "Login Successful",
                    data: [
                        FullCompanyData
                    ]
                })
            }

        }
        catch (err) {
            // console.log("this is err", err)
            return res.status(500).send({
                status: "failure",
                msg: (err.message || "Internal Server Error"),
                data: []
            })
        }
    })


module.exports = router;