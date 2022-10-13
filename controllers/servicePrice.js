const Joi = require("joi");
const { ServicePrice } = require("../models/servicePrice");

exports.addServicePrice = async (req, res) => {
  try {
    const { body } = req;
    console.log(body);
    const { error } = Joi.object()
      .keys({
        vendor: Joi.string().required(),
        service: Joi.string().required(),
        price: Joi.number().required(),
      })
      .required()
      .validate(body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    let servicePrice = await ServicePrice.findOneAndUpdate(
      { vendor: body.vendor, service: body.service },
      body,
      { upsert: true, new: true }
    );

    if (!servicePrice) {
      return res.status(400).send({
        success: false,
        message: "Price Not Added",
        data: servicePrice,
      });
    }
    return res.status(201).send({
      success: true,
      message: "Price Added Successfully",
      data: servicePrice,
    });
  } catch (e) {
    return res
      .status(500)
      .send({ success: false, message: "Something went wrong", error: e.name });
  }
};

exports.getServicePrice = async (req, res) => {
  try {
    const skip = +req.query.skip || 0;
    const limit = +req.query.limit || 2;
    let servicePrice = await ServicePrice.find({}, { __v: 0 })
      .skip(skip)
      .limit(limit);
    if (!servicePrice) {
      return res.status(400).send({
        success: false,
        message: "Price Data Not Exists",
        data: servicePrice,
      });
    }
    return res.status(201).send({
      success: true,
      message: "Price Fetched Successfully",
      data: servicePrice,
    });
  } catch (e) {
    return res
      .status(500)
      .send({ success: false, message: "Something went wrong", error: e.name });
  }
};

exports.updateServicePrice = async (req, res) => {
  try {
    const { body } = req;
    const { error } = Joi.object()
      .keys({
        id: Joi.string().required(),
        vendor: Joi.string().required(),
        service: Joi.string().required(),
        price: Joi.number().required(),
      })
      .required()
      .validate(body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    let servicePrice = await ServicePrice.findByIdAndUpdate(body.id, body, {
      new: true,
    });

    if (!servicePrice) {
      return res.status(400).send({
        success: false,
        message: "Price Data Not Exists",
        data: servicePrice,
      });
    }
    return res.status(201).send({
      success: true,
      message: "Price Updated Successfully",
      data: servicePrice,
    });
  } catch (e) {
    return res
      .status(500)
      .send({ success: false, message: "Something went wrong", error: e.name });
  }
};

exports.deleteServicePrice = async (req, res) => {
  try {
    const { body } = req;
    const { error } = Joi.object()
      .keys({
        id: Joi.string().required(),
      })
      .required()
      .validate(body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    let servicePrice = await ServicePrice.findByIdAndDelete(body.id);

    if (!servicePrice) {
      return res.status(400).send({
        success: false,
        message: "Price Data Not Exists",
        data: servicePrice,
      });
    }
    return res.status(201).send({
      success: true,
      message: "Price Deleted Successfully",
      data: servicePrice,
    });
  } catch (e) {
    return res
      .status(500)
      .send({ success: false, message: "Something went wrong", error: e.name });
  }
};
