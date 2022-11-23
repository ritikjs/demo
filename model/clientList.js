const mongoose = require("mongoose");


const ClientSchema = new mongoose.Schema(
    {
        clientImage: { type: String },
        clientName: { type: String },
        clientNumber: { type: String },
        clientEmail: { type: String },
        clientState: { type: String },
        clientPincode: { type: Number },
        clientAddress: { type: String },
        awsKey: { type: String },

    },
    {
        versionKey: false,
        timestamps: true,
    }
);

const ClientModal = mongoose.model("clientdetail", ClientSchema);

module.exports = ClientModal;
