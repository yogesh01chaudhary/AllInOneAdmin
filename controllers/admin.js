const { Admin } = require("../models/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Joi = require("joi");
const { SubAdmin } = require("../models/subAdmin");
const mongoose = require("mongoose");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");

//******************************************************admin************************************************************** */
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
    console.log(process.env.JWT_SECRET, process.env.jwtExpiration);
    let token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.jwtExpiration,
    });

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

//@desc get s3Url
//@route GET api/v1/admin/s3Url1
//@access Private
exports.s3Url1 = async (req, res) => {
  try {
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ID,
      secretAccessKey: process.env.AWS_SECRET,
    });

    console.log(s3, process.env.AWS_BUCKET_NAME);
    const { id } = req.user;
    let admin = await Admin.findById(id);
    if (!admin) {
      return res
        .status(404)
        .send({ success: false, message: "Admin Doesn't Exists" });
    }
    if (!admin.imageUrl) {
      const key = `${id}/${uuidv4()}.jpeg`;
      const url = await s3.getSignedUrlPromise("putObject", {
        Bucket: process.env.AWS_BUCKET_NAME,
        ContentType: "image/jpeg",
        Key: key,
        Expires: 120,
      });
      return res.status(200).send({
        success: true,
        message: "Url generated , imageUrl doesn't exists in DB",
        url,
        key,
      });
    }

    let fileName = admin.imageUrl.split("/");
    fileName =
      fileName[fileName.length - 2] + "/" + fileName[fileName.length - 1];
    const key = `${fileName}`;
    const url = await s3.getSignedUrlPromise("putObject", {
      Bucket: process.env.AWS_BUCKET_NAME,
      ContentType: "image/jpeg",
      Key: key,
      Expires: 60,
    });
    return res
      .status(200)
      .send({ success: true, message: "Url generated", url, key });
  } catch (e) {
    res.status(500).send({ success: false, message: e.message });
  }
};

//@desc Upload imageUrl in DB using  S3
//@route PUT api/v1/admin/imageUrl
//@access Private
exports.updateImageUrl = async (req, res) => {
  try {
    const { user, body } = req;
    Joi.object()
      .keys({
        body: Joi.object().keys({
          imageUrl: Joi.string().required(),
        }),
        user: Joi.object().keys({
          id: Joi.string().required(),
        }),
      })
      .required()
      .validate(req);
    let admin = await Admin.findByIdAndUpdate(
      user.id,
      { imageUrl: body.imageUrl },
      { new: true }
    );
    if (!admin) {
      return res
        .status(404)
        .send({ success: false, message: "Vendor Doesn't Exists" });
    }
    return res
      .status(200)
      .send({ success: true, message: "Image Url Updated", admin });
  } catch (e) {
    res.status(500).send({ success: false, message: e.message });
  }
};

//@desc delete image from s3 Bucket and DB
//@route DELETE api/v1/admin/imageUrl
//@access Private
exports.deleteImageUrl = async (req, res) => {
  try {
    const { id } = req.user;
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ID,
      secretAccessKey: process.env.AWS_SECRET,
    });
    let fileName = req.body.imageUrl.split("/");
    fileName =
      fileName[fileName.length - 2] + "/" + fileName[fileName.length - 1];
    const key = `${fileName}`;
    var params = { Bucket: process.env.AWS_BUCKET_NAME, Key: key };
    let admin = await Admin.findById(id);
    if (!admin) {
      return res
        .status(404)
        .send({ success: false, message: "Admin Doesn't Exists" });
    }
    if (admin.imageUrl !== req.body.imageUrl) {
      return res.status(400).send({
        success: false,
        message:
          "Can't be deleted imageUrl doesn't match with Admin's imageUrl",
      });
    }
    s3.deleteObject(params, async (err) => {
      if (err)
        return res.status(500).send({
          success: false,
          message: "Something went wrong",
          error: err.message,
        });
      let admin = await Admin.findByIdAndUpdate(id, { imageUrl: "" });
      return res
        .status(200)
        .send({ success: true, message: "Successfully Deleted", admin });
    });
  } catch (e) {
    res.status(500).send({ success: false, message: e.message });
  }
};

//******************************************************users************************************************************** */
exports.getUsers = async (req, res) => {
  try {
    // const limitValue = req.query.limit || 2;
    // const skipValue = req.query.skip || 0;
    // let users = await User.find().limit(limitValue).skip(skipValue);
    // console.log(users);
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

//*******************************************subAdmin******************************************************************** */

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


