const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SubAdmin } = require("../models/subAdmin");

exports.addSubAdmin = async (req, res) => {
  const { body } = req;
  const { error } = Joi.object()
    .keys({
      userId: Joi.string().required(),
      password: Joi.string().required(),
      responsibilities: Joi.array().items(Joi.string()),
    })
    .required()
    .validate(body);

  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  await SubAdmin.findOne({ userId: body.userId })
    .then(async (data) => {
      if (data) {
        return res
          .status(409)
          .send({ success: false, message: "subAdmin already exists", data });
      }

      let hashedPassword = await bcrypt.hash(body.password, 10);
      console.log(hashedPassword);
      let subAdmin = new SubAdmin({
        userId: body.userId,
        password: hashedPassword,
        responsibilities: body.responsibilities,
      });

      subAdmin
        .save()
        .then((data) => {
          if (!data) {
            return res.status(400).send({
              success: false,
              message: "subAdmin not saved successfully",
              data,
            });
          }
          return res.status(200).send({
            success: true,
            message: "SubAdmin saved successfully",
            data,
          });
        })
        .catch((e) => {
          return res.status(500).send({
            success: false,
            mesage: "Something went wrong in 1",
            error: e.name,
          });
        });
    })
    .catch((e) => {
      return res.status(500).send({
        success: false,
        message: "Something went wrong",
        error: e.name,
      });
    });
};

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
    });
  } catch (e) {
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
      error: e.message,
    });
  }
};

exports.getAllSubAdmin = async (req, res) => {
  await SubAdmin.find({}, { __v: 0, password: 0 })
    .then((data) => {
      if (!data) {
        return res
          .status(404)
          .send({ success: false, message: "Something went wrong", data });
      }
      if (data.length == 0) {
        return res.status(200).send({
          success: true,
          message: "SubAdmins fetched successfully, No SubAdmins Found",
          data,
        });
      }

      return res.status(200).send({
        success: true,
        message: "SubAdmins Fetched Successfully",
        data,
      });
    })
    .catch((e) => {
      return res.status(500).send({
        success: false,
        message: "Something went wrong in final catch",
        error: e.name,
      });
    });
};

exports.getSubAdmin = async (req, res) => {
  try {
    const { id } = req.body;
    let subAdmin = await SubAdmin.findById(id, {
      __v: 0,
      password: 0,
    });

    if (!subAdmin) {
      return res.send({
        success: false,
        message: "subAdmin Not Found",
        data: subAdmin,
      });
    }
    return res.status(200).send({
      success: true,
      message: "subAdmin found successfully",
      data: subAdmin,
    });
  } catch (e) {
    return res
      .status(500)
      .send({ success: false, message: "Something went wrong", error: e.name });
  }
};

exports.updateSubAdmin = async (req, res) => {
  const { params, body } = req;
  const { error } = Joi.object()
    .keys({
      id: Joi.string().required(),
      responsibilities: Joi.array().items(Joi.string()),
    })
    .required()
    .validate(body);

  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }

  await SubAdmin.findByIdAndUpdate(
    body.id,
    {
      responsibilities: body.responsibilities,
    },
    { new: true }
  )
    .then((data) => {
      if (!data) {
        return res
          .status(404)
          .send({ success: false, message: "Something went wrong", data });
      }

      return res.status(200).send({
        success: true,
        message: "SubAdmin Updated Successfully",
        data,
      });
    })
    .catch((e) => {
      return res.status(500).send({
        success: false,
        message: "Something went wrong in final catch",
        error: e.name,
      });
    });
};

exports.deleteSubAdmin = async (req, res) => {
  const { body } = req;
  await SubAdmin.findByIdAndDelete(body.id)
    .then((data) => {
      if (!data) {
        return res
          .status(404)
          .send({ success: false, message: "Something went wrong", data });
      }
      return res.status(200).send({
        success: true,
        message: "SubAdmin Deleted Successfully",
        data,
      });
    })
    .catch((e) => {
      return res.status(500).send({
        success: false,
        message: "Something went wrong in final catch",
        error: e.name,
      });
    });
};

exports.deleteAllSubAdmin = async (req, res) => {
  await SubAdmin.deleteMany()
    .then((data) => {
      if (!data) {
        return res
          .status(404)
          .send({ success: false, message: "Something went wrong", data });
      }
      if (data.deletedCount == 0) {
        return res.status(200).send({
          success: true,
          message: "No SubAdmins Found To Delete",
          data,
        });
      }

      return res.status(200).send({
        success: true,
        message: "All SubAdmins Deleted Successfully",
        data,
      });
    })
    .catch((e) => {
      return res.status(500).send({
        success: false,
        message: "Something went wrong in final catch",
        error: e.name,
      });
    });
};
