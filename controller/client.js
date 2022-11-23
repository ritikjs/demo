const express = require("express");
const router = express.Router();
const ClientModal = require("../model/clientList");

require("dotenv").config();
const Bucketupload = require("../middlewares/ImageUpload");

const aws = require('aws-sdk');

// aws details
const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    Bucket: process.env.AWS_BUCKET_NAME
});



router.get("", async (req, res) => {
    try {
        const Client = await ClientModal
            .find()
            .then((user) => {
                if (user.length > 0) {

                    return res.status(200).json(user);
                }
                else {
                    return res.status(204).json("Client not found");
                }


                // console.log("this is user", user);

            })



            .catch((err) => {
                return res.status(500).send(err);
            });

    } catch (err) {
        return res.status(500).send(err);
    }
});



// for get all Client by company id //

function throwObjWithStacktrace(code) {
    const someError = { statusCode: code }
    Error.captureStackTrace(someError)
    throw someError;
}


router.post("", Bucketupload("clientimage").single("clientImage"),
    async (req, res) => {
        try {

            const Client = await ClientModal.create({
                ...req.body,
                clientImage: req.file.location,
                awsKey: req.file.key
            });

            // console.log(err)

            return res.send(Client).status(200)


        } catch (err) {
            console.log(err)
            return res.status(500).send(err);
        }
    });


router.get("/:id", async (req, res) => {
    try {
        const Client = await ClientModal
            .findOne({ _id: req.params.id })
            .then((user) => {
                res.status(200).json(user);
            })
            .catch((err) => {
                res.status(500).send(err);
            });
    } catch (err) {
        res.status(500).send(err)
    }
});




//// for update Client data ////////////////

router.patch("/:id", Bucketupload("clientimage").single("clientImage"), async (req, res) => {
    try {
        const { awsKey } = await ClientModal.findById(req.params.id)

        if (awsKey.length < 1) {

            return res.status(204).json("Client not found");
        }

        s3.deleteObjects(
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


        const Client = await ClientModal.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                clientImage: req.file.location,
                awsKey: req.file.key
            },
            { new: true, }
        );

        return res.status(201).send(Client);
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
});


//// delete by id/////

router.delete("/:id", async (req, res) => {
    try {

        const { awsKey } = await ClientModal.findById(req.params.id)
        if (awsKey.length < 1) {
            console.log(AwsKey.length)
            return res.status(204).json("Client not found");
        }


        s3.deleteObjects(
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


        const Client = await ClientModal.findByIdAndDelete(req.params.id);

        return res.status(201).send(Client);
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
});


module.exports = router;
