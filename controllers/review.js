const { Vendor } = require("../models/vendor");
const Joi = require("Joi");
const { Service } = require("../models/services");

//**************************************VENDOR********************************************************************************
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
      result.push({ vendorId: item._id });
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

//**************************************PACKAGES********************************************************************************
exports.getAllServicesReviews = async (req, res) => {
  try {
    let service = await Service.find(
      {},
      {
        "silver.rating": 1,
        "silver.overallRating": 1,
        "silver.reviewNumber": 1,
        "gold.rating": 1,
        "gold.overallRating": 1,
        "gold.reviewNumber": 1,
        "platinum.rating": 1,
        "platinum.overallRating": 1,
        "platinum.reviewNumber": 1,
      }
    );
    if (!service) {
      return res
        .status(404)
        .send({ success: false, message: "Something went wrong" });
    }
    if (service.length == 0) {
      return res.status(404).send({ success: false, message: "No Data Found" });
    }
    return res.status(200).send({
      success: true,
      service,
    });
  } catch (e) {
    return res.status(500).send({ success: false, message: e.message });
  }
};

exports.getAllSilverReviews = async (req, res) => {
  try {
    let service = await Service.find(
      {},
      {
        "silver.rating.name": 1,
        "silver.rating.ratedBy": 1,
        "silver.rating.star": 1,
        "silver.rating.comment": 1,
        "silver.overallRating": 1,
        "silver.reviewNumber": 1,
      }
    );
    if (!service) {
      return res
        .status(404)
        .send({ success: false, message: "Something went wrong" });
    }
    if (service.length == 0) {
      return res.status(404).send({ success: false, message: "No Data Found" });
    }
    return res.status(200).send({
      success: true,
      service,
    });
  } catch (e) {
    return res.status(500).send({ success: false, message: e.message });
  }
};

exports.getAllGoldReviews = async (req, res) => {
  try {
    let service = await Service.find(
      {},
      {
        "gold.rating.name": 1,
        "gold.rating.ratedBy": 1,
        "gold.rating.star": 1,
        "gold.rating.comment": 1,
        "gold.overallRating": 1,
        "gold.reviewNumber": 1,
      }
    );
    if (!service) {
      return res
        .status(404)
        .send({ success: false, message: "Something went wrong" });
    }
    if (service.length == 0) {
      return res.status(404).send({ success: false, message: "No Data Found" });
    }
    return res.status(200).send({
      success: true,
      service,
    });
  } catch (e) {
    return res.status(500).send({ success: false, message: e.message });
  }
};

exports.getAllPlatinumReviews = async (req, res) => {
  try {
    let service = await Service.find(
      {},
      {
        "platinum.rating.name": 1,
        "platinum.rating.ratedBy": 1,
        "platinum.rating.star": 1,
        "platinum.rating.comment": 1,
        "platinum.overallRating": 1,
        "platinum.reviewNumber": 1,
      }
    );
    if (!service) {
      return res
        .status(404)
        .send({ success: false, message: "Something went wrong" });
    }
    if (service.length == 0) {
      return res.status(404).send({ success: false, message: "No Data Found" });
    }
    return res.status(200).send({
      success: true,
      service,
    });
  } catch (e) {
    return res.status(500).send({ success: false, message: e.message });
  }
};

exports.getReviewsByService = async (req, res) => {
  try {
    const { body } = req;
    const { error } = Joi.object()
      .keys({
        serviceId: Joi.string().required(),
        packageId: Joi.string().required(),
      })
      .required()
      .validate(body);
    if (error) {
      return res
        .status(400)
        .send({ success: false, message: error.details[0].message });
    }
    let service = await Vendor.findById({ _id: body.serviceId });
    if (!service) {
      return res
        .status(404)
        .send({ success: false, message: "Service Doesn't Exists" });
    }

    return res.status(200).send({
      success: true,
      service,
      //   reviews: service.reviews,
      //   rating: service.rating,
      //   totalReviews: service.reviewNumber,
    });
  } catch (e) {
    return res.status(500).send({ success: false, message: e.message });
  }
};

exports.getServicesReviewsByUser = async (req, res) => {
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
    let service = await Vendor.find(
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
    if (!service) {
      return res
        .status(404)
        .send({ success: false, message: "Something went wrong" });
    }
    if (service.length == 0) {
      return res.status(404).send({ success: false, message: "No Data Found" });
    }

    const userReviews = service.map((item) => {
      console.log(item._id);
      const result = item.reviews.filter(
        (review) => review.user.toString() === body.userId
      );
      result.push({ vendorId: item._id });
      return result;
    });
    return res.status(200).send({
      success: true,
      service,
      userReviews,
      //   reviews: service.reviews,
      //   rating: service.rating,
      //   totalReviews: service.reviewNumber,
    });
  } catch (e) {
    return res.status(500).send({ success: false, message: e.message });
  }
};
