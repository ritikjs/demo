const mongoose = require("mongoose");


const  SiteSchema = new mongoose.Schema(
  {
    isActive: {
      type: Boolean,
      default: true
    },
    siteName: {
      type: String, required: true
    },
    siteCode: { type: String, required: true},
    siteAddress: { type: String },
    siteLiveSince: { type: Number },
    sitelocation: {
      lat: { type: String, },
      lng: { type: String },
    },
    companyDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "companydetail",
      required: true
    },
    companyCode: { type: String },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const  SiteModal = mongoose.model("sitedetail",  SiteSchema);

module.exports = SiteModal ;
  