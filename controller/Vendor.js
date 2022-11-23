const express = require("express");
const router = express.Router();
const VendorModal = require("../model/vendorList");

require("dotenv").config();
const Bucketupload = require("../middlewares/ImageUpload");

const aws = require('aws-sdk');


// s3 deatils
const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    Bucket: process.env.AWS_BUCKET_NAME
});




router.get("",  async (req, res) => {
    try {
        const Vendor = await VendorModal
            .find().lean()
            .then((user) => {
                if (user.length >0) {
                    
                    return res.status(200).send({
                        status: "success",
                        msg: "Vendor List",
                        data: [user]
                    })
                }
                else {
                    return res.status(500).send({
                        status: "failure",
                        msg: ("Vendor list is Empty"),
                        data: []
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



// for get all Vendor by company id //

function throwObjWithStacktrace(code) {
    const someError = { statusCode: code }
    Error.captureStackTrace(someError)
    throw someError;
}


router.post("/image", Bucketupload("venderimage").single("image"),
    async (req, res) => {
        try {

            if (!req.file.location) {
                return res.status(500).send({
                    status: "failure",
                    msg: ("Image not uploaded"),
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

            return res.status(500).send({
                status: "failure",
                msg: (err.message || "Internal Server Error"),
                data: []
            })
        }
    });



router.post("",  async (req, res) => {
        try { 
        
        const Vendor = await VendorModal.create({
            ...req.body,
        });
            
            if (!Vendor) {
                return res.status(500).send({
                    status: "failure",
                    msg: ("new vendor not created something went wrong"),
                    data: []
                })
            }
            else {
                return res.status(200).send({
                    status: "success",
                    msg: "new vendor created successfully",
                    data: [Vendor]
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


router.get("/:id",  async (req, res) => {
    try {
        const Vendor = await VendorModal
            .findOne({ _id: req.params.id })
            .then((user) => {
                if (!user) {
                    return res.status(500).send({
                        status: "failure",
                        msg: ("vendor list is Empty"),
                        data: []
                    })
                }

                else {
                    return res.status(200).send({
                        status: "success",
                        msg: "new vendor created successfully",
                        data: [Vendor]
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




//// for update Vendor data ////////////////

router.patch("/:id",
    async (req, res) => {
    try {
    

    //     const { awsKey } = await VendorModal.findById(req.params.id)

      
    //     if (awsKey) {
    //         s3.deleteObjects(
    //             {
    //                 Bucket: process.env.AWS_BUCKET_NAME,
    //                 Delete: {
    //                     Objects: [{ Key: awsKey }],
    //                     Quiet: false,
    //                 },
    //             },
    //             function (err, data) {
    //                 if (err) {
    //                     console.log(err)
    //                     return res.status(500).send(err);
    //                 };
    //             }
    //         );
    // }



        const Vendor = await VendorModal.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
        },
            { new: true, }
        );

        return res.status(200).send({
            status: "success",
            msg: "vendor updated successfully",
            data: [Vendor]
        })
    } catch (err) {
        return res.status(500).send({
            status: "failure",
            msg: (err.message || "Internal Server Error"),
            data: []
        })
    }
});


//// delete by id/////

router.delete("/:id",  async (req, res) => {
    try {

        // const { awsKey } = await VendorModal.findById(req.params.id)
        
        // if (awsKey.length < 1) {
          
        //     return    res.status(204).json("Vendor not found");
        //     }
        

        // // console.log(AwsKey)

       

        // s3.deleteObjects(
        //     {
        //         Bucket: process.env.AWS_BUCKET_NAME,
        //         Delete: {
        //             Objects: [{ Key: awsKey }],
        //             Quiet: false,
        //         },
        //     },
        //     function (err, data) {
        //         if (err) {
        //             console.log(err)
        //             return res.status(500).send(err);
        //         };
        //     }
        // );

        
        const Vendor = await VendorModal.findOneAndUpdate(
            {
                _id: req.params.id,
                isActive:false
            }
        );
        if (Vendor) {
            return res.status(200).send({
                status: "success",
                msg: "vendor deleted successfully",
                data: [Vendor]
            })
                
        }
        else {
            return res.status(500).send({
                status: "failure",
                msg: ("vendor not deleted"),
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
