const path = require("path");
const multer = require("multer");
const req = require("express/lib/request");

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, "../my-pdf"));
    },
    filename: function (req, file, callback) {
        const uniquePrefix = Date.now();
        callback(null, uniquePrefix + "-" + file.originalname);
    },
});

const fileFilter = (req, file, callback) => {
    // The function should call `callback` with a boolean
    // to indicate if the file should be accepted

    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        // To accept the file pass `true`, like so:
        callback(null, true);
    } else {
        // To reject this file pass `false`, like so:
        callback(new Error("Incorrect mime type"), false);
    }
};

const options = {
    storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
};

// 1kb = 1024 bytes
// 1mb = 1024 kb

const uploadsPDF = multer(options);

module.exports = uploadsPDF;
