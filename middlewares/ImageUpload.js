require('dotenv').config();
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require("path");


const s3Config = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    Bucket: process.env.AWS_BUCKET_NAME
});



const fileFilter = (req, file, cb) => {
    
    const fileSize = parseInt(req.headers["content-length"])
    
    // console.log(fileSize)
    // console.log(fileSize > 5242880)
    // console.log(fileSize < 5242880)

    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        if (fileSize > 5242880) {
            cb('Please upload image less than 5MB.', false);
        }
        else {
            cb(null, true)
        }
    }
    else {
        cb('Please upload jpeg or png image only.', false);
    }
}



const Bucketupload = function upload(destinationPath) {
    return multer({
        fileFilter: fileFilter,
       
        storage: multerS3({ 
            acl: "public-read",
            s3: s3Config,
            bucket: process.env.AWS_BUCKET_NAME,
            metadata: function (req, file, cb) {
                cb(null, { fieldName: file.fieldname });
            },
            key: function (req, file, cb) {
                cb(null, destinationPath +
                    "/"
                    + new Date().toISOString() + file.originalname);
            },
        }),
    });
};



module.exports = Bucketupload; 




//open in browser to see upload form


//use by upload form

