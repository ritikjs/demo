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

const limitFileSize = { fileSize: 1024 * 1024 * 5 }, // 1Byte -->1024Bytes or 1MB --> 5MB
    filterFileType = (req, file, cb) => {
        const isAllowedFileType =
            file.mimetype == "image/jpeg" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/png";

        if (isAllowedFileType) {
            cb(null, true);
            return;
        }
        // To reject this file pass `false`
        cb(null, false);
    };

var folder = "extra"

function uploadImageToS3(destinationPath) {
  


    const cloudStorage = multerS3({
        acl: "public-read",
        s3: s3Config,
        bucket: process.env.AWS_BUCKET_NAME,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        // key: name of the file
        key: (req, file, cb) => {
            
            if (req.body?.employeeCode) { folder = req.body?.employeeCode }


            cb(null, destinationPath + "/" + folder + "/" + new Date().toISOString() +
                file.originalname);
        },
       
    });

   

    const upload = multer({
        storage: cloudStorage,
        limits: limitFileSize,
        fileFilter: filterFileType,
    });
    return upload;
}




module.exports = uploadImageToS3; 