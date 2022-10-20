const { Schema, model } = require("mongoose");
const VendorSchema = new Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  DOB: {
    type: String,
  },
  workExperience: {
    type: String,
  },
  gender: {
    type: String,
  },
  mobileNumber: {
    type: String,
    unique: true,
  },
  alternateNumber: {
    type: String,
  },
  emergencyNumber: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  pin: {
    type: Number,
  },
  requestStatus: {
    type: String,
    default: "pending",
  },

  verification: {
    aadharFront: {
      type: String,
    },
    aadharBack: {
      type: String,
    },

    selfie1: {
      type: String,
    },
    selfie2: {
      type: String,
    },
  },
  bankDetails: {
    bankName: {
      type: String,
    },
    accountNumber: {
      type: Number,
    },
    accountHolder: {
      type: String,
    },
    ifscCode: {
      type: String,
    },
    upi: {
      type: String,
    },
  },
  services:[{
    type:Schema.Types.ObjectId,
    ref:'service'
  }],
  requestedService:[{
    type:String
  }]
});
exports.Vendor = model("vendor", VendorSchema);
