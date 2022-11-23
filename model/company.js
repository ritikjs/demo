const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    isActive: { type: Boolean,
      default: true
      },
    companyName: { type: String, required: true, unique: true, index: true },
    companyLogo: { type: String, required: true },
    companyCode: { type: String, required: true, unique: true, index: true},
    companyEmail: { type: String },
    companyPassword: { type: String },
    awsKey: { type: String },
    manageAdministrations: [
      {
        personName: { type: String },
        email: { type: String },
        mobile: { type: Number },
        designation: { type: String },
        region: { type: String },
        password: { type: String }
      }
    ]







  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const companyModal = mongoose.model("companydetail", companySchema);


module.exports =  companyModal;
  

