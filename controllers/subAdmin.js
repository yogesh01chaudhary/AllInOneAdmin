const Joi = require("joi");
const { SubAdmin } = require("../models/subAdmin");
exports.addSubAdmin = async (req, res) => {
  const { body } = req;
  const { error } = Joi.object()
    .keys({
      userId: Joi.string().required(),
      password: Joi.string().required(),
      responsibility1: Joi.boolean(),
      responsibility2: Joi.boolean(),
      responsibility3: Joi.boolean(),
      responsibility4: Joi.boolean(),
    })
    .required()
    .validate(body);

  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  await SubAdmin.findOne({ userId: body.userId })
    .then((data) => {
      if (data) {
        return res
          .status(409)
          .send({ success: false, message: "subAdmin already exists", data });
      }
      let subAdmin = new SubAdmin({
        userId: body.userId,
        password: body.password,
        responsibilities: [
          {
            responsibility1: body.responsibility1,
            responsibility2: body.responsibility2,
            responsibility3: body.responsibility3,
            responsibility4: body.responsibility4,
          },
        ],
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
  await SubAdmin.find({})
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
    const { id } = req.params;
    let subAdmin = await SubAdmin.findById(id);
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
      userId: Joi.string().required(),
      password: Joi.string().required(),
      responsibility1: Joi.boolean(),
      responsibility2: Joi.boolean(),
      responsibility3: Joi.boolean(),
      responsibility4: Joi.boolean(),
    })
    .required()
    .validate(body);

  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  await SubAdmin.findByIdAndUpdate(params.id, body, { new: true })
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
  const { params } = req;
  await SubAdmin.findByIdAndDelete(params.id)
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
