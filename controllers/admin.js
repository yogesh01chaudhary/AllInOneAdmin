const { Admin } = require("../models/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { Vendor } = require("../models/vendor");
const { sendMail, createPassword } = require("../helpers/sendPassword");
const { createToken } = require("../helpers/refreshToken");

// exports.signUpAdmin = async (req, res) => {
//   try {
//     let { userId, password } = req.body;

//     if (!(userId && password)) {
//       return res
//         .status(400)
//         .send({ success: false, message: "Please fill all the details" });
//     }
//     let admin = await Admin.findOne({ userId: userId });
//     if (admin) {
//       return res
//         .status(409)
//         .send({ success: false, message: "User already exist" });
//     }
//     let hashedPassword = await bcrypt.hash(password, 10);
//     password = hashedPassword;

//     admin = new Admin({ userId, password });
//     admin = await admin.save();

//     res.status(200).send({
//       success: true,
//       message: "All In One Admin Page SignUp, Admin Signed Up Successfully",
//     });
//   } catch (e) {
//     return res.status(400).send({
//       success: false,
//       message: "Something went wrong",
//       error: e.name,
//     });
//   }
// };

exports.loginAdmin = async (req, res) => {
  try {
    let { userId, password } = req.body;
    if (!(userId && password)) {
      return res
        .status(400)
        .send({ success: false, message: "Please fill all the details" });
    }

    let admin = await Admin.findOne({ userId });

    if (!admin) {
      return res.status(400).send({
        success: false,
        message: "Invalid credentials,Email Incorrect",
      });
    }

    const isPasswordMatched = await bcrypt.compare(password, admin.password);

    if (!isPasswordMatched) {
      return res.status(400).send({
        success: false,
        message: "Invalid credentials,Pasword Incorrect",
      });
    }

    let token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.jwtExpiration,
    });

    // let refreshToken = await createToken(admin);

    return res.status(200).send({
      success: true,
      message: "User logged in Successsfully!",
      token,
      
    });
  } catch (e) {
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
      error: e.name,
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    let users = await User.find();
    console.log(users);
    if (!users) {
      return res
        .status(200)
        .send({ success: true, message: "No users in collection", users });
    }
    res
      .status(200)
      .send({ success: true, message: "Users fetched successfully", users });
  } catch (e) {
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
      error: e.name,
    });
  }
};

exports.getVendors = async (req, res) => {
  try {
    let vendors = await Vendor.find({});
    if (!vendors) {
      return res
        .status(200)
        .send({ success: true, message: "No vendors found" });
    }
    return res
      .status(200)
      .send({ success: true, message: "Vendors found", vendors });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const { body } = req;
    let vendor = await Vendor.findByIdAndUpdate(
      body.id,
      { requestStatus: "accepted" },
      { new: true }
    );
    if (!vendor) {
      return res.status(400).send({
        success: false,
        message: "No vendor found to provide request",
      });
    }
    let password = await createPassword(6, false, false);
    const mailResponse = await sendMail(
      vendor.firstName,
      vendor.email,
      password
    );
    let [a, ...p] = mailResponse.split(",");
    // p = p.join(",");
    p = JSON.parse(p.join(","));
    res.status(200).send({
      success: true,
      message: "User Request Accepted",
      mailResponse: `${a} ${p.envelope.to}`,
      vendor,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};
exports.rejectRequest = async (req, res) => {
  try {
    const { body } = req;
    let vendor = await Vendor.findByIdAndUpdate(
      body.id,
      { requestStatus: "rejected" },
      { new: true }
    );
    if (!vendor) {
      return res.status(400).send({
        success: false,
        message: "No vendor found to provide request",
      });
    }

    // let password=createPassword(6,false,false)
    const mailResponse = await sendMail(vendor.firstName, vendor.email);
    let [a, ...p] = mailResponse.split(",");
    p = JSON.parse(p.join(","));
    res.status(200).send({
      success: true,
      message: "User request rejected",
      mailResponse: `${a} ${p.envelope.to}`,
      vendor,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

exports.getPending = async (req, res) => {
  try {
    const result = await Vendor.find({ requestStatus: "pending" });
    if (result.length == 0) {
      return res.status(200).send({
        success: true,
        message: "No users with pending status",
        result,
      });
    }
    res
      .status(200)
      .send({ success: true, message: "users with pending request", result });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

exports.getRejected = async (req, res) => {
  try {
    const result = await Vendor.find({ requestStatus: "rejected" });
    if (result.length == 0) {
      return res.status(200).send({
        success: true,
        message: "No users with rejected status",
        result,
      });
    }
    res
      .status(200)
      .send({ success: true, message: "users with rejected request", result });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};
exports.getAccepted = async (req, res) => {
  try {
    const result = await Vendor.find({ requestStatus: "accepted" });
    if (result.length == 0) {
      return res.status(200).send({
        success: true,
        message: "No users with accepted status",
        result,
      });
    }
    res
      .status(200)
      .send({ success: true, message: "users with accepted request", result });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};
