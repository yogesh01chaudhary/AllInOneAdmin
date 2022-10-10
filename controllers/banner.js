const Joi = require("joi");
const { Banner } = require("../models/banner");

exports.addBanner = async (req, res) => {
  try {
    const { body } = req;
    const { error } = Joi.object()
      .keys({
        name: Joi.string().required(),
        image: Joi.string(),
      })
      .required()
      .validate(body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    let banner = await Banner.findOne({ name: body.name });
    if (banner) {
      return res
        .status(409)
        .send({
          success: false,
          message: "Banner Already Exists",
          data: banner,
        });
    }

    banner = new Banner({ name: body.name, image: body.image });
    banner
      .save()
      .then((data) => {
        return res
          .status(200)
          .send({ success: true, message: "Banner saved successfully", data });
      })
      .catch((e) => {
        return res.status(500).send({
          success: false,
          message: "Something went wrong",
          error: e.name,
        });
      });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: e.name,
    });
  }
};

exports.getAllBanner = async (req, res) => {
  try {
    let banner = await Banner.find();
    if (!banner) {
      return res.status(500).send({
        success: false,
        message: "Something went wrong",
        data: banner,
      });
    }
    return res.status(200).send({
      sucess: true,
      message: "Banner Fetched Successfully",
      data: banner,
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: e.name,
    });
  }
};

exports.getBanner = async (req, res) => {
  try {
    let banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res
        .status(200)
        .send({ success: true, message: "No Banner Found", data: banner });
    }
    return res.status(200).send({
      sucess: true,
      message: "Banner Fetched Successfully",
      data: banner,
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: e.name,
    });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const { body } = req;
    let banner = await Banner.findByIdAndUpdate(
      { _id: body.id },
      { name: body.name, image: body.image },
      { new: true }
    );
    if (!banner) {
      return res
        .status(500)
        .send({ success: true, message: "No Banner Found", data: banner });
    }

    return res.status(200).send({
      sucess: true,
      message: "Banner Updated Successfully",
      data: banner,
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: e.name,
    });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    let banner = await Banner.findByIdAndDelete({ _id: req.params.id });
    if (!banner) {
      return res
        .status(200)
        .send({ success: true, message: "No Banner Found", data: banner });
    }

    return res.status(200).send({
      sucess: true,
      message: "Banner Deleted Successfully",
      data: banner,
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: e.name,
    });
  }
};

exports.deleteAllBanner = async (req, res) => {
  try {
    let banner = await Banner.deleteMany();
    if (!banner) {
      return res
        .status(500)
        .send({ success: true, message: "Something went wrong", data: banner });
    }
    if (banner.deletedCount === 0) {
      return res.status(200).send({
        success: true,
        message: "No Banner Found For Deletion",
        data: banner,
      });
    }
    return res.status(200).send({
      sucess: true,
      message: "Banner Deleted Successfully",
      data: banner,
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: e.name,
    });
  }
};
