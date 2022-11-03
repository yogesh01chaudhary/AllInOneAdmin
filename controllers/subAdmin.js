const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SubAdmin } = require("../models/subAdmin");
const { Vendor } = require("../models/vendor");
const User = require("../models/user");

//@desc loginSubAdmin after going through middlewares auth,isSubAdmin
//@path POST api/v1/admin/subAdmin/login
//@access Private
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


//@desc get responsibilities of subAdmin after authentication
//@path GET api/v1/admin/subAdmin/responsibilities
//@access Private
exports.responsibilitiesAllowed = async (req, res) => {
  console.log(req.user.responsibilities);
  return res.status(200).send({
    success: true,
    message: "Permissions received",
    responsibilities: req.user.responsibilities,
  });
};
