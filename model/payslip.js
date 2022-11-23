const mongoose = require("mongoose");


const PaySlipSchema = new mongoose.Schema(
    {
        employeeName: { type: String, unique: true },
        employeeCode: { type: String, unique: true },
        paySlipList: {type: Array},
        employeeDetail: {
            type: mongoose.Schema.Types.ObjectId,
           ref: "employeeformdetail",
        }
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

const PaySlipModal = mongoose.model("paysliplist", PaySlipSchema);

module.exports = PaySlipModal;
