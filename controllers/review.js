const { Vendor } = require("../models/vendor");
const Joi = require("Joi");
exports.getAllReviews = async (req, res) => {
  try {
    const { user } = req;
    let vendor = await Vendor.find(
      {},
      {
        "reviews.rating": 1,
        "reviews.name": 1,
        "reviews.comment": 1,
        "reviews.user": 1,
        rating: 1,
        reviewNumber: 1,
      }
    );
    if (!vendor) {
      return res
        .status(404)
        .send({ success: false, message: "Something went wrong" });
    }
    if (vendor.length == 0) {
      return res.status(404).send({ success: false, message: "No Data Found" });
    }
    return res.status(200).send({
      success: true,
      vendor,
      //   reviews: vendor[0].reviews,
      //   rating: vendor[0].rating,
      //   totalReviews: vendor[0].reviewNumber,
      //   vendorId: vendor[0]._id,
    });
  } catch (e) {
    return res.status(500).send({ success: false, message: e.message });
  }
};

exports.getReviewsByVendor = async (req, res) => {
  try {
    const { body } = req;
    const { error } = Joi.object()
      .keys({
        vendorId: Joi.string().required(),
      })
      .required()
      .validate(body);
    if (error) {
      return res
        .status(400)
        .send({ success: false, message: error.details[0].message });
    }
    let vendor = await Vendor.findById(
      { _id: body.vendorId },
      {
        "reviews.rating": 1,
        "reviews.name": 1,
        "reviews.comment": 1,
        "reviews.user": 1,
        rating: 1,
        reviewNumber: 1,
      }
    );
    if (!vendor) {
      return res
        .status(404)
        .send({ success: false, message: "Vendor Doesn't Exists" });
    }
    return res.status(200).send({
      success: true,
      vendor,
      //   reviews: vendor.reviews,
      //   rating: vendor.rating,
      //   totalReviews: vendor.reviewNumber,
    });
  } catch (e) {
    return res.status(500).send({ success: false, message: e.message });
  }
};

exports.getReviewsByUser = async (req, res) => {
  try {
    const { body } = req;
    const { error } = Joi.object()
      .keys({
        userId: Joi.string().required(),
      })
      .required()
      .validate(body);
    if (error) {
      return res
        .status(400)
        .send({ success: false, message: error.details[0].message });
    }
    let vendor = await Vendor.find(
      { "reviews.user": { $eq: body.userId } },
      {
        "reviews.rating": 1,
        "reviews.name": 1,
        "reviews.comment": 1,
        "reviews.user": 1,
        rating: 1,
        reviewNumber: 1,
      }
    );
    if (!vendor) {
      return res
        .status(404)
        .send({ success: false, message: "Something went wrong" });
    }
    if (vendor.length == 0) {
      return res.status(404).send({ success: false, message: "No Data Found" });
    }

    const userReviews = vendor.map((item) => {
      console.log(item._id);
      const result = item.reviews.filter(
        (review) => review.user.toString() === body.userId
      );
      result.push({ _id: item._id });
      return result;
    });
    return res.status(200).send({
      success: true,
      vendor,
      userReviews,
      //   reviews: vendor.reviews,
      //   rating: vendor.rating,
      //   totalReviews: vendor.reviewNumber,
    });
  } catch (e) {
    return res.status(500).send({ success: false, message: e.message });
  }
};
