const express = require("express");
const router = express.Router();
require("dotenv").config();
const Bucketupload = require("../middlewares/ImageUpload");
const aws = require('aws-sdk');



// s3 deatils
const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    Bucket: process.env.AWS_BUCKET_NAME
});




// router.get("", async (req, res) => {
//     try {
//         const example = await ExampleModal
//             .find().lean()
//             .then((user) => {
//                 if (user.length > 0) {

//                     return res.status(200).send({
//                         status: "success",
//                         msg: "example List",
//                         data: [user]
//                     })
//                 }
//                 else {
//                     return res.status(500).send({
//                         status: "failure",
//                         msg: ("example list is Empty"),
//                         data: []
//                     })
//                 }

//             })
//             .catch((err) => {
//                 return res.status(500).send({
//                     status: "failure",
//                     msg: (err.message || "Internal Server Error"),
//                     data: []
//                 })
//             });

//     } catch (err) {
//         return res.status(500).send({
//             status: "failure",
//             msg: (err.message || "Internal Server Error"),
//             data: []
//         })
//     }
// });



router.post("", Bucketupload("images").single("image"),
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


module.exports = router;