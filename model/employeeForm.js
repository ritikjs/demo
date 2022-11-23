const mongoose = require("mongoose");

const employeeFormSchema = new mongoose.Schema(
  {
    isActive: {
      type: Boolean,
      default: true
    },
    enrollementFormNo: { type: String },
    enrollementFee: { type: Number },
    PFNo: { type: String },
    ESICNo: { type: String },
    salary: { type: Number },
    uniformType: { type: String },
    uniformCharges: { type: Number },
    passportPhoto: { type: String },
    uniformCotain: {},
    interviewData: { type: String },
    postAppliedFor: { type: String },
    sateOfJoining: { type: Date },
    signatureOfApplicant: { type: String },
    employeeName: { type: String },
    employeeCode: { type: String },
    fathersAndHusbandName: {
      fathers: { type: String },
      husband: { type: String },
      age: { type: Number },
    },
    motherName: {
      name: { type: String },
      age: { type: Number },
    },
    presentAddress: { type: String },
    permanetAddress: { type: String },
    telephoneNo: { type: Number },
    mobileNo: { type: Number },
    email: { type: String },
    dateOfBirth: { type: Date },
    nationality: { type: String },
    maritalStatus: { type: String },
    wifeName: {
      name: { type: String },
      age: { type: Number },
    },
    children: { type: Array },
    numberOfEarningMemberInFamily: { type: Number },
    gender: { type: String },
    religion: { type: String },
    caste: { type: String },
    twoIdentificationMark: {
      a: { type: String },
      b: { type: String },
    },
    physicalMeasurement: {
      height: { type: String },
      weight: { type: Number },
      chest: {
        normal: { type: String },
        expansion: { type: String },
      },
    },
    educationalQualification: [],
    achievements: { type: String },
    languageKnow: { type: String },
    exServicemenAndParaMilitaryFroces: {},
    previousThreeEmployments: {
      present: {},
      previous: {},
      secondLast: {},
    },
    references: {
      first: {},
      second: {},
    },
    otherEmployees: {
      YesOrNo: { type: Boolean, default: false },
      serviceNo: { type: String },
    },
    courtCase: {
      YesOrNo: { type: Boolean, default: false },
      details: { type: String },
    },
    convictedByCourt: { type: Boolean, default: false },
    historySheetor: { type: Boolean, default: false },
    contagiousDisease: {
      YesOrNo: { type: Boolean, default: false },
      details: { type: String },
    },
    appliedEarlier: {
      YesOrNo: { type: Boolean, default: false },
      details: { type: String },
    },
    nominated: { type: String },
    fingersAndThumbImpression: {
      leftHand: {
        little: { type: String },
        ring: { type: String },
        middle: { type: String },
        fore: { type: String },
        thumb: { type: String },
      },
      rightHand: {
        thumb: { type: String },
        fore: { type: String },
        middle: { type: String },
        ring: { type: String },
        little: { type: String },
      },
    },
    bankAccountDetails: {
      bank: { type: String},
      branch: { type: String },
      branchCode: { type: Number },
      accountNo: { type: Number },
      MICR: { type: Number },
      IFSECode: { type: Number },
      nomineeDetails: { type: String },
    },
    companyDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "companydetail",
    },
    siteDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "sitedetail",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const employeeFormModal = mongoose.model("employeeformdetail", employeeFormSchema);

module.exports = employeeFormModal;


// shirt: { type: Boolean, default: false },
// pant: { type: Boolean, default: false },
// belt: { type: Boolean, default: false },
// cap: { type: Boolean, default: false },
// linearAndWhistle: { type: Boolean, default: false },
// shoe: { type: Boolean, default: false },
// batton: { type: Boolean, default: false },
// tie: { type: Boolean, default: false },
// torch: { type: Boolean, default: false },
// jacket: { type: Boolean, default: false },
// ceremonial: { type: Boolean, default: false },
// mobile: { type: Boolean, default: false },