const Joi = require("joi");
const { ServicePrice } = require("../models/servicePrice");
exports.addServicePrice = async (req, res) => {
  try {
    const { body } = req;
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
    let servicePrice = new ServicePrice(body);
    servicePrice = await servicePrice.save();
    if (!servicePrice) {
      return res.status(400).send({
        success: false,
        message: "Price Not Added In DB",
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
