const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SubAdmin } = require("../models/subAdmin");
const { Vendor } = require("../models/vendor");
const User = require("../models/user");

exports.loginSubAdmin = async (req, res) => {
  try {
    let { userId, password } = req.body;
    if (!(userId && password)) {
      return res
        .status(400)
        .send({ success: false, message: "Please fill all the details" });
    }

    let subAdmin = await SubAdmin.findOne({ userId });

    if (!subAdmin) {
      return res.status(400).send({
        success: false,
        message: "Invalid credentials,UserId Incorrect",
      });
    }
    const isPasswordMatched = await bcrypt.compare(password, subAdmin.password);

    if (!isPasswordMatched) {
      return res.status(400).send({
        success: false,
        message: "Invalid credentials,Pasword Incorrect",
      });
    }

    let token = jwt.sign({ id: subAdmin._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.jwtExpiration,
    });

    return res.status(200).send({
      success: true,
      message: "subAdmin logged in Successsfully!",
      token,
      responsibility: subAdmin.responsibilities,
    });
  } catch (e) {
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
      error: e.message,
    });
  }
};

exports.responsibilitiesAllowed = async (req, res) => {
  console.log(req.user.responsibilities);
  return res.status(200).send({
    success: true,
    message: "Permissions received",
    responsibilities: req.user.responsibilities,
  });
};

exports.getUsers = async (req, res) => {
  try {
    const { responsibilities, id } = req.user;

    if (!responsibilities.includes("Users")) {
      return res
        .status(401)
        .send({ success: false, message: "Not Authorised" });
    }

    const limitValue = +req.query.limit || 6;
    const skipValue = +req.query.skip || 0;
    const data = await User.aggregate([
      {
        $facet: {
          totalData: [
            { $match: {} },
            { $skip: skipValue },
            { $limit: limitValue },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);
    let count = data[0].totalCount[0].count;
    let users = data[0].totalData;
    if (!users) {
      return res.status(200).send({
        success: true,
        message: "No users in collection",
        users,
        count,
      });
    }
    res.status(200).send({
      success: true,
      message: "Users fetched successfully",
      users,
      count,
    });
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
    const { responsibilities, id } = req.user;

    if (!responsibilities.includes("Vendors")) {
      return res
        .status(401)
        .send({ success: false, message: "Not Authorised" });
    }
    const limitValue = +req.query.limit || 6;
    const skipValue = +req.query.skip || 0;
    const data = await Vendor.aggregate([
      {
        $facet: {
          totalData: [
            { $match: {} },
            { $skip: skipValue },
            { $limit: limitValue },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);
    let count = data[0].totalCount[0].count;
    let vendors = data[0].totalData;

    if (!vendors) {
      return res
        .status(200)
        .send({ success: true, message: "No vendors found" });
    }
    return res
      .status(200)
      .send({ success: true, message: "Vendors found", vendors, count });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const { responsibilities, id } = req.user;

    if (!responsibilities.includes("Vendors")) {
      return res
        .status(401)
        .send({ success: false, message: "Not Authorised" });
    }
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
    const { responsibilities, id } = req.user;

    if (!responsibilities.includes("Vendors")) {
      return res
        .status(401)
        .send({ success: false, message: "Not Authorised" });
    }
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
    const { responsibilities, id } = req.user;

    if (!responsibilities.includes("Vendors")) {
      return res
        .status(401)
        .send({ success: false, message: "Not Authorised" });
    }
    console.log(req.query);
    const limitValue = req.query.limit || 6;
    const skipValue = req.query.skip || 0;
    const data = await Vendor.aggregate([
      {
        $facet: {
          totalData: [
            { $match: { requestStatus: "pending" } },
            { $skip: +skipValue },
            { $limit: +limitValue },
          ],
          totalCount: [
            { $match: { requestStatus: "pending" } },
            { $count: "count" },
          ],
        },
      },
    ]);
    console.log(data);

    let count = data[0].totalCount;
    let result = data[0].totalData;
    if (result.length == 0) {
      return res.status(200).send({
        success: true,
        message: "No users with pending status",
        result,
      });
    }
    res.status(200).send({
      success: true,
      message: "users with pending request",
      result,
      count,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

exports.getRejected = async (req, res) => {
  try {
    const { responsibilities, id } = req.user;

    if (!responsibilities.includes("Vendors")) {
      return res
        .status(401)
        .send({ success: false, message: "Not Authorised" });
    }
    const limitValue = +req.query.limit || 6;
    const skipValue = +req.query.skip || 0;
    const data = await Vendor.aggregate([
      {
        $facet: {
          totalData: [
            { $match: { requestStatus: "rejected" } },
            { $skip: skipValue },
            { $limit: limitValue },
          ],
          totalCount: [
            { $match: { requestStatus: "rejected" } },
            { $count: "count" },
          ],
        },
      },
    ]);
    let count = data[0].totalCount[0];
    let result = data[0].totalData;
    if (result.length == 0) {
      return res.status(200).send({
        success: true,
        message: "No users with rejected status",
        result,
      });
    }
    res.status(200).send({
      success: true,
      message: "users with rejected request",
      result,
      count,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

exports.getAccepted = async (req, res) => {
  try {
    const { responsibilities, id } = req.user;

    if (!responsibilities.includes("Vendors")) {
      return res
        .status(401)
        .send({ success: false, message: "Not Authorised" });
    }

    const limitValue = +req.query.limit || 6;
    const skipValue = +req.query.skip || 0;
    const data = await Vendor.aggregate([
      {
        $facet: {
          totalData: [
            { $match: { requestStatus: "accepted" } },
            { $skip: skipValue },
            { $limit: limitValue },
          ],
          totalCount: [
            { $match: { requestStatus: "accepted" } },
            { $count: "count" },
          ],
        },
      },
    ]);
    let count = data[0].totalCount[0];
    let result = data[0].totalData;
    if (result.length == 0) {
      return res.status(200).send({
        success: true,
        message: "No users with accepted status",
        result,
      });
    }
    res.status(200).send({
      success: true,
      message: "users with accepted request",
      result,
      count,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};
