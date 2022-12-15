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
        "silver._id": 1,
        "silver.rating": 1,
        "silver.overallRating": 1,
        "silver.reviewNumber": 1,
        "gold._id": 1,
        "gold.rating": 1,
        "gold.overallRating": 1,
        "gold.reviewNumber": 1,
        "platinum._id": 1,
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
        "silver._id": 1,
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
        "gold._id": 1,
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
        "platinum._id": 1,
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
    const { serviceId, packageId } = req.body;
    const { error } = Joi.object()
      .keys({
        serviceId: Joi.string().required(),
        packageId: Joi.string().required(),
      })
      .required()
      .validate(req.body);
    if (error) {
      return res
        .status(400)
        .send({ success: false, message: error.details[0].message });
    }
    let service = await Service.findById({ _id: serviceId });
    if (!service) {
      return res
        .status(404)
        .send({ success: false, message: "Service Doesn't Exists" });
    }
    if (service.silver._id.toString() === packageId.toString()) {
      let service = await Service.find(
        {
          $and: [{ _id: serviceId }, { "silver._id": packageId }],
        },
        {
          "silver._id": 1,
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
        return res
          .status(404)
          .send({ success: false, message: "No Data Found" });
      }
      return res.status(400).json({
        success: true,
        message: `Silver packageId  ${packageId} reviews fetched`,
        service,
      });
    }
    if (service.gold._id.toString() === packageId.toString()) {
      let service = await Service.find(
        {
          $and: [{ _id: serviceId }, { "gold._id": packageId }],
        },
        {
          "gold._id": 1,
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
        return res
          .status(404)
          .send({ success: false, message: "No Data Found" });
      }
      return res.status(400).json({
        success: true,
        message: `Gold packageId  ${packageId} reviews fetched`,
        service,
      });
    }
    if (service.platinum._id.toString() === packageId.toString()) {
      let service = await Service.find(
        {
          $and: [{ _id: serviceId }, { "platinum._id": packageId }],
        },
        {
          "platinum._id": 1,
          "platinum.rating.ratedBy": 1,
          "platinum.rating.name": 1,
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
        return res
          .status(404)
          .send({ success: false, message: "No Data Found" });
      }
      return res.status(400).json({
        success: true,
        message: `Platinum packageId ${packageId} reviews fetched`,
        service,
      });
    }
    return res.status(200).send({
      success: false,
      message: "Package Not Found",
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
    let service = await Service.find(
      {
        $or: [
          { "silver.rating.ratedBy": { $eq: body.userId } },
          { "gold.rating.ratedBy": { $eq: body.userId } },
          { "platinum.rating.ratedBy": { $eq: body.userId } },
        ],
      },
      {
        "silver._id": 1,
        "silver.rating": 1,
        "silver.overallRating": 1,
        "silver.reviewNumber": 1,
        "gold._id": 1,
        "gold.rating": 1,
        "gold.overallRating": 1,
        "gold.reviewNumber": 1,
        "platinum._id": 1,
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
    const userSilverReviews = service.map((service) => {
      const result = service.silver.rating.filter(
        (rating) => rating.ratedBy.toString() === body.userId
      );
      return result.concat([
        { packageId: service.silver._id, serviceId: service._id },
      ]);
    });
    const userGoldReviews = service.map((service) => {
      const result = service.gold.rating.filter(
        (rating) => rating.ratedBy.toString() === body.userId
      );
      return result.concat([
        { packageId: service.gold._id, serviceId: service._id },
      ]);
    });
    const userPlatinumReviews = service.map((service) => {
      const result = service.platinum.rating.filter(
        (rating) => rating.ratedBy.toString() === body.userId
      );
      return result.concat([
        { packageId: service.platinum._id, serviceId: service._id },
      ]);
    });

    return res.status(200).send({
      success: true,
      service,
      userSilverReviews,
      userGoldReviews,
      userPlatinumReviews,
    });
  } catch (e) {
    return res.status(500).send({ success: false, message: e.message });
  }
};
