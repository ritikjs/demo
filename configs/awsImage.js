const AWS = require('aws-sdk');


const s3Image = new AWS.S3({
    signatureVersion: 'v4',
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    Bucket: process.env.AWS_PDF_BUCKET_NAME,
    region: 'ap-south-1'

});

module.exports = s3Image