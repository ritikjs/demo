const mongoose = require("mongoose")



const employeeSchema = new mongoose.Schema(
  {
    isActive: {
      type: Boolean,
      default: true
    },
    enrollementNo: { type: String },
    enrollementFee: { type: Number },
    PFNo: { type: String },
    ESICNo: { type: String },
    currency: { type: String },
    amount: { type: Number },
    uniformType: { type: String },
    uniformCotain: {},
    uniformCharges: { type: Number },
    interviewData: { type: String },
    postAppliedFor: { type: String },
    sateOfJoining: { type: String },
    signatureOfApplicant: { type: String }, //photo
    employeeName: { type: String },
    employeeCode: {
      type: String,
      required: true,
      unique: true, index: true
    },
    passportPhoto: { type: String }, // photo
    designation: { type: String },
    dateOfBirth: { type: String },
    gender: { type: String },
    religion: { type: String },
    caste: { type: String },
    languageKnow: { type: String },
    fatherName: { type: String },
    fatherAge: { type: String },
    husbandName: { type: String },
    husbandAge: { type: String },
    motherName: {
      name: { type: String },
      age: { type: Number },
    },
    mobileNo: { type: Number },
    email: { type: String },
    nationality: { type: String },
    currentAddress: { type: String },
    permanetAddress: { type: String },
    maritalStatus: { type: String },
    // telephoneNo: { type: Number },
    partnerName: {
      name: { type: String },
      age: { type: Number },
    },
    children: { type: Array },
    numberOfEarningMemberInFamily: { type: Number },
  
    twoIdentificationMark: {
      a: { type: String },
      b: { type: String },
    },

    aadharCard: { type: String },
    panCard: { type: String },
  
    leftThumb: { type: String },
    rightThumb: { type: String },
    

    physicalMeasurement: {
      height: { type: String },
      weight: { type: Number },
      // chest: {
      //   normal: { type: String },
      //   expansion: { type: String },
      // },
    },

    educationalDetails: {
      highestQualification: { type: String },
      upload: { type: String },
      board: { type: String },
      institution: { type: String },
      yearOfPassing: { type: String },
      percentage: { type: String },
      achievements: {
        1: { type: String },
        2: { type: String }
      }
    },

    exServicemenAndParaMilitaryFroces: {},
    previousEmployments: {type: Array},
    references: { type: Array }, 
    otherDetails: {},
    bankAccountDetails: {
      bankName: { type: String },
      branch: { type: String },
      branchCode: { type: Number },
      accountNo: { type: Number },
      MICR: { type: Number },
      IFSECode: { type: Number },
      nomineeDetails: { type: String },
    },
    place: { type: String },
    date: { type: String },
    signature: { type: String },
    companyDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "companydetail",
    },
    // siteDetails: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "sitedetail",
    // },
    siteCode: { type: String },
    issueUniform: [{
      Products: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "inventory",
      }
    }],
    returnUniform: [{
      Products: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "inventory",
      },
      Remark: {
        type: String
      }
    }],
    attendance: [{
        date: { type: String }, 
        inTime: { type: String },
        outTime: { type: String },
        siteCode: { type: String },
        siteCost: { type: String }
      }]

  },
  {
    versionKey: false,
     timestamps: true,
  }
  );
  
  const employeeModal = mongoose.model("employeedetail", employeeSchema);

module.exports = employeeModal








// courtCase: {
    //   YesOrNo: { type: Boolean, default: false },
    //   details: { type: String },
    // },
    // convictedByCourt: { type: Boolean, default: false },
    // historySheetor: { type: Boolean, default: false },
    // contagiousDisease: {
    //   YesOrNo: { type: Boolean, default: false },
    //   details: { type: String },
    // },
    // appliedEarlier: {
    //   YesOrNo: { type: Boolean, default: false },
    //   details: { type: String },
    // },
    // nominated: { type: String },





  // {
  //   isActive: {
  //     type: Boolean,
  //     default: true
  //   },
  //   employeeName: { type: String },
  //   employeeCode: { type: String, required: true, unique: true, index: true },
  //   selectDesignation: { type: String },
  //   experience: { type: String },
  //   gender: { type: String },
  //   dateOfJoining: { type: String },
  //   dateOfBirth: { type: String },
  //   mobile: { type: String },
  //   address: { type: String },
  //   nationality: { type: String },
  //   password: { type: String },
  //   employeeStandardWorkingHour: { type: String },
  //   companyDetails: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "companydetail",
  //     required: true
  //   },
  //   siteDetails: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "sitedetail",
  //     required: true
  //   },
  //   issueUniform: [{
  //     Products: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "inventory",
  //     }
  //   }],
  //   returnUniform: [{
  //     Products: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "inventory",
  //     },
  //     Remark: {
  //       type: String
  //     }
  //   }]

  // },
  // {
  //   versionKey: false,
  //   timestamps: true,
  // }

// fingersAndThumbImpression: {
//   leftHand: {
//     little: { type: String },
//     ring: { type: String },
//     middle: { type: String },
//     fore: { type: String },
//     thumb: { type: String },
//   },
//   rightHand: {
//     thumb: { type: String },
//     fore: { type: String },
//     middle: { type: String },
//     ring: { type: String },
//     little: { type: String },
//   },
// },