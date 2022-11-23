const mongoose = require("mongoose");


const vendorSchema = new mongoose.Schema(
    {
        isActive: {
            type: Boolean,
            default: true
        },
        vendorImage:{ type: String },
        vendorName: { type: String },
        vendorNumber: { type: String },
        vendorEmail: { type: String },
        vendorState: {type: String},
        vendorPincode: { type: Number },
        vendorAddress: { type: String }
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

const VendorModal = mongoose.model("vendordetail", vendorSchema);

module.exports = VendorModal;
