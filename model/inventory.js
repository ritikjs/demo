const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        isActive: {
            type: Boolean,
            default: true
        },
        productName: {
            type: String, required: true,
            unique: true, index: true
        },
        productId: {
            type: String, required: true,
            unique: true, index: true
        },
        SKU : { type: String },
        productDescription : { type: String },
        rate : { type: String },
        barCode: { type: String },
        mrp: { type: String },
        opening: { type: String },
        in: { type: String },
        out: { type: String },
        closing: { type: String },
        companyCode:{type:String}
        
        


        // purchase: [{
        //     date: { type: Number },
        //     orderNo: { type: Number },
        //     vendorName: { type: Number },
        //     quantity: { type: Number },
        //     rate: { type: Number },
        //     total: { type: Number }
        // }],
        // recieveOrder: [{
        //     date: { type: Number },
        //     orderNo: { type: Number },
        //     vendorName: { type: Number },
        //     quantityOrder: { type: Number },
        //     quantityReceived: { type: Number },
        //     rate: { type: Number },
        //     total: { type: Number },
        //     remark: { type: String }
        // }],
        // stock: []

    },
    {
        versionKey: false,
        timestamps: true,
    }
);

const InventryModal = mongoose.model("inventory", productSchema);


module.exports = InventryModal;


