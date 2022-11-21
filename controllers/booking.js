const Booking = require("../models/booking");
const Cart = require("../models/cart");
const Joi = require("joi");
const { Vendor } = require("../models/vendor");
const mongoose = require("mongoose");

// **************************************ADMIN*****************************************************************************//
// @desc see AllBooking
// @route GET admin/bookings
// @acess Private ADMIN
exports.getBookingsAdmin = async (req, res) => {
  try {
    let matchQuery = {
      $match: {},
    };
    console.log("bookings");
    let data = await Booking.aggregate([
      {
        $facet: {
          totalData: [
            matchQuery,
            { $project: { __v: 0 } },
            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userData",
              },
            },
            {
              $lookup: {
                from: "services",
                localField: "service",
                foreignField: "_id",
                as: "serviceData",
              },
            },
          ],
          totalCount: [matchQuery, { $count: "count" }],
        },
      },
    ]);

    let result = data[0].totalData;
    let count = data[0].totalCount;

    if (result.length === 0) {
      return res.status(200).send({ success: false, message: "No Data Found" });
    }

    return res.status(200).send({
      success: true,
      message: "Bookings Fetched Successfully",
      result,
      count,
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: e.message,
    });
  }
};

// @desc see booking using bookingId
// @route GET /admin/booking/:bookingId
// @acess Private ADMIN
exports.getBookingAdmin = async (req, res) => {
  try {
    const { params } = req;
    const { error } = Joi.object()
      .keys({
        bookingId: Joi.string().required(),
      })
      .required()
      .validate(params);
    if (error) {
      return res
        .status(400)
        .send({ success: false, error: error.details[0].message });
    }
    let matchQuery = {
      $match: { _id: mongoose.Types.ObjectId(params.bookingId) },
    };

    let data = await Booking.aggregate([
      {
        $facet: {
          totalData: [
            matchQuery,
            { $project: { __v: 0 } },
            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userData",
              },
            },
            {
              $lookup: {
                from: "services",
                localField: "service",
                foreignField: "_id",
                as: "serviceData",
              },
            },
          ],
          totalCount: [matchQuery, { $count: "count" }],
        },
      },
    ]);

    let result = data[0].totalData;
    let count = data[0].totalCount;

    if (result.length === 0) {
      return res.status(200).send({ success: false, message: "No Data Found" });
    }
    result = result[0];

    return res.status(200).send({
      success: true,
      message: "Booking Fetched Successfully",
      result,
      count,
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: e.message,
    });
  }
};

//@desc get nearby Vendors using bookingId For Users To Provide them services
//@route GET/admin/nearbyVendors
//@access Private
exports.nearbyVendors = async (req, res) => {
  try {
    const { body } = req;
    const { error } = Joi.object()
      .keys({ bookingId: Joi.string().required() })
      .validate(body);
    if (error) {
      return res
        .status(400)
        .send({ success: false, message: error.details[0].message });
    }
    let matchQuery = {
      $match: { _id: mongoose.Types.ObjectId(body.bookingId) },
    };

    let data = await Booking.aggregate([
      {
        $facet: {
          totalData: [
            matchQuery,
            { $project: { __v: 0 } },
            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userData",
              },
            },
            {
              $lookup: {
                from: "services",
                localField: "service",
                foreignField: "_id",
                as: "serviceData",
              },
            },
          ],
          totalCount: [matchQuery, { $count: "count" }],
        },
      },
    ]);

    let result = data[0].totalData;
    let count = data[0].totalCount;

    if (result.length === 0) {
      return res.status(200).send({ success: false, message: "No Data Found" });
    }
    result = result[0];
    console.log(result.userData[0].location.coordinates[0]);
    if (!result.userData[0].location.coordinates) {
      return res
        .status(400)
        .send({ success: false, message: "Please provide user's coordinates" });
    }
    let geoQuery = {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [
            result.userData[0].location.coordinates[0],
            result.userData[0].location.coordinates[1],
          ],
        },
        distanceField: "distance",
        query: {
          $and: [
            { services: { $in: [result.serviceId] } },
            { transferStatus: "unblock" },
          ],
        },
        maxDistance: 70000000,
        spherical: true,
      },
    };

    let vendors = await Vendor.aggregate([geoQuery, { $project: { _id: 1 } }]);

    let totalVendors = await Vendor.aggregate([
      geoQuery,
      { $group: { _id: null, count: { $sum: 1 } } },
      { $project: { _id: 0 } },
    ]);

    if (!vendors) {
      return res.status(400).send({
        success: false,
        message: "Something went wrong",
      });
    }
    if (vendors.length === 0) {
      return res.status(200).send({
        success: true,
        message: "No Nearest Vendors Found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Nearest Vendors Fetched successfully",
      vendors,
      totalVendors,
    });
  } catch (e) {
    return res.status(500).send({ success: false, message: e.message });
  }
};

// new API TO SEND PUSH NOTIFICATION TO ALL FETCHED VENDORS BOOKNGID WILL BE PASSED TO VENDRS vendors will accept and transfer the request
exports.sendNotification = async (req, res) => {
  const { body } = req;
  let deviceToken = body.deviceToken;
  let registration_ids = [deviceToken];
  let notification = {
    text: body.text,
    title: body.title,
  };
  let serverKey = `key=AAAAejUYQ9g:APA91bFxMDmzSGGZlJxOOYL8RlqRR3l06HmDMcycUPH5lsIi0yqUXLWNQPmKLAkQELGpWuu0pwT1wAwhpTTVJMq-xtJHzd7Vg_zNUx9WVB7XIqas043HZ5mhPFN_eQ-FF-Qbvly2Z27f`;
  let api = "https://fcm.googleapis.com/fcm/send";
  try {
    await axios.post(
      api,
      { registration_ids, notification },
      {
        headers: {
          Authorization: serverKey,
        },
      }
    );
    return res
      .status(200)
      .send({ success: true, message: "Notification sent successfully" });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.message });
  }
};

//@desc get Vendors Providing That Service
//@route GET/api/v1/admin/vendorsForUser
//@access Private TEST PURPOSE
exports.getVendorsForUser = async (req, res) => {
  try {
    const limitValue = +req.query.limit || 6;
    const skipValue = +req.query.skip || 0;
    const { body } = req;
    let arr = [];
    for (serviceId of body.services) {
      arr.push(mongoose.Types.ObjectId(serviceId));
    }
    console.log(arr);
    const { error } = Joi.object()
      .keys({
        services: Joi.array().items(Joi.string().required()),
      })
      .required()
      .validate(body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    const data = await Vendor.aggregate([
      {
        $facet: {
          totalData: [
            {
              $match: {
                location: {
                  $geoWithin: {
                    $centerSphere: [
                      [-73.93414657, 40.82302903],
                      50000000 / 3963.2,
                    ],
                  },
                },
                services: {
                  $all: arr,
                },
                transferStatus: "unblock",
              },
            },
            {
              $project: {
                bankDetails: 0,
                verification: 0,
                password: 0,
                requestedService: 0,
                location: 0,
              },
            },
            { $skip: skipValue },
            { $limit: limitValue },
            {
              $lookup: {
                from: "services",
                localField: "services",
                foreignField: "_id",
                as: "output",
              },
            },
          ],

          totalCount: [
            {
              $match: {
                location: {
                  $geoWithin: {
                    $centerSphere: [
                      [-73.93414657, 40.82302903],
                      5000000 / 3963.2,
                    ],
                  },
                },
                services: {
                  $all: arr,
                },
                transferStatus: "unblock",
              },
            },
            { $count: "count" },
          ],
        },
      },
    ]);
    let count = data[0].totalCount;
    let vendor = data[0].totalData;
    if (!vendor) {
      return res
        .status(400)
        .send({ success: false, message: "Something went wrong" });
    }
    if (vendor.length === 0) {
      return res.status(400).send({
        success: true,
        message: "No Vendors Providing This Service",
        vendor,
        count,
      });
    }
    return res.status(200).send({
      succes: true,
      message: "Vendors For Service Fetched Successfully",
      vendor,
      count,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.message });
  }
};

//@desc get nearby Vendors For Users
//@route GET/vendor/getVendorLocation
//@access Private
// ONLY_FOR_TEST_PURPOSE
exports.getVendorLocation = async (req, res) => {
  try {
    let vendors = await Vendor.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [77.87571443846723, 28.2059068] },
          distanceField: "dist.calculated",
          query: { services: { $in: ["6344fab789347ca0288556d0"] } },
          maxDistance: 2000,
          spherical: true,
        },
      },
    ]);
    return res.status(200).send({
      success: true,
      message: "Nearest Vendors Fetched Succeessfully",
      data: vendors,
    });
  } catch (e) {
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
      error: e.message,
    });
  }
};

// @desc get  All Cart For Admin
// @route GET admin/carts
// @acess Private
exports.getCartsAdmin = async (req, res) => {
  try {
    let matchQuery = {
      $match: {},
    };

    let data = await Cart.aggregate([
      {
        $facet: {
          totalData: [
            matchQuery,
            { $project: { __v: 0 } },
            {
              $lookup: {
                from: "services",
                localField: "service",
                foreignField: "_id",
                as: "serviceData",
              },
            },

            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userData",
              },
            },
          ],
          totalCount: [matchQuery, { $count: "count" }],
        },
      },
    ]);

    let result = data[0].totalData;
    let count = data[0].totalCount;

    if (result.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No Result Found ",
      });
    }

    return res.status(200).send({
      success: true,
      message: "User's Cart Fetched Successfully",
      cart: result,
      count,
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: e.message,
    });
  }
};

// @desc get Cart Of A User For Admin By UserId
// @route  GET admin/cart/:id
// @acess Private
exports.getCartAdmin = async (req, res) => {
  try {
    const { params } = req;
    let matchQuery = {
      $match: { userId: mongoose.Types.ObjectId(params.id) },
    };

    let data = await Cart.aggregate([
      {
        $facet: {
          totalData: [
            matchQuery,
            { $project: { __v: 0 } },
            {
              $lookup: {
                from: "services",
                localField: "service",
                foreignField: "_id",
                as: "serviceData",
              },
            },

            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userData",
              },
            },
          ],
          totalCount: [matchQuery, { $count: "count" }],
        },
      },
    ]);

    let result = data[0].totalData;
    let count = data[0].totalCount;

    if (result.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No Result Found ",
      });
    }

    return res.status(200).send({
      success: true,
      message: "User's Cart Fetched Successfully",
      "User'sCart": result[0],
      count,
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: e.message,
    });
  }
};

//will work later
exports.addBooking = async (req, res) => {
  try {
    const { body } = req;
    const { error } = Joi.object()
      .keys({
        timeSlot: Joi.object()
          .keys({
            start: Joi.string().required(),
            end: Joi.string().required(),
          })
          .required(),
        servicePrice: Joi.string().required(),
        date: Joi.string(),
        status: Joi.string(),
        bookedBy: Joi.string().required(),
      })
      .required()
      .validate(body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    let booking = new Booking(body);
    booking
      .save()
      .then((data) => {
        if (!data) {
          return res
            .status(500)
            .send({ success: false, message: "Booking Not Created" });
        }
        return res
          .status(200)
          .send({ success: true, message: "Booking Done", data });
      })
      .catch((e) => {
        return res.status(500).send({
          success: false,
          message: "Something went wrong",
          e: e.name,
        });
      });
  } catch (e) {
    return res
      .status(500)
      .send({ success: false, message: "Something went wrong", error: e.name });
  }
};

exports.getBooking = async (req, res) => {
  try {
    console.log(req.query);
    const limit = +req.query.limit || 4;
    const skip = +req.query.skip || 0;
    let booking = await Booking.find({}, { __v: 0 })
      .populate([
        {
          path: "servicePrice",
          model: "servicePrice",
          select: { __v: 0 },
          populate: [
            {
              path: "service",
              model: "service",
              select: { __v: 0 },
            },
            {
              path: "vendor",
              model: "vendor",
              select: { __v: 0 },
            },
          ],
        },
        { path: "bookedBy", model: "user", select: { __v: 0 } },
      ])
      .sort({ firstName: 1 })
      .skip(skip)
      .limit(limit);

    if (!booking) {
      return res.status(500).send({
        success: false,
        message: "Something went wrong",
        data: booking,
      });
    }
    return res.status(200).send({
      success: true,
      message: "All Boookings fetched Successfully",
      data: booking,
    });
  } catch (e) {
    return res
      .status(500)
      .send({ success: false, message: "Something went wrong", error: e.name });
  }
};

exports.getPending = async (req, res) => {
  try {
    const skip = +req.query.skip || 0;
    const limit = +req.query.limit || 2;
    let booking = await Booking.find({ status: "Pending" }, { __v: 0 })
      .populate([
        {
          path: "servicePrice",
          model: "servicePrice",
          select: { __v: 0 },
          populate: [
            {
              path: "service",
              model: "service",
              select: { __v: 0 },
            },
            {
              path: "vendor",
              model: "vendor",
              select: { __v: 0 },
            },
          ],
        },
        { path: "bookedBy", model: "user", select: { __v: 0 } },
      ])
      .sort({ firstName: 1 })
      .skip(skip)
      .limit(limit);
    if (booking.length === 0) {
      return res.status(200).send({
        success: true,
        message: "No Pending Boookings",
        data: booking,
      });
    }
    if (!booking) {
      return res.status(500).send({
        success: false,
        message: "Something went wrong",
        data: booking,
      });
    }
    return res.status(200).send({
      success: true,
      message: "All Pending Boookings fetched Successfully",
      data: booking,
    });
  } catch (e) {
    return res
      .status(500)
      .send({ success: false, message: "Something went wrong", error: e.name });
  }
};

exports.getAccepted = async (req, res) => {
  try {
    const skip = +req.query.skip || 0;
    const limit = +req.query.limit || 2;
    let booking = await Booking.find({ status: "Accepted" }, { __v: 0 })
      .populate([
        {
          path: "servicePrice",
          model: "servicePrice",
          select: { __v: 0 },
          populate: [
            {
              path: "service",
              model: "service",
              select: { __v: 0 },
            },
            {
              path: "vendor",
              model: "vendor",
              select: { __v: 0 },
            },
          ],
        },
        { path: "bookedBy", model: "user", select: { __v: 0 } },
      ])
      .sort({ firstName: 1 })
      .skip(skip)
      .limit(limit);
    if (booking.length === 0) {
      return res.status(200).send({
        success: true,
        message: "No Accepted Boookings",
        data: booking,
      });
    }
    if (!booking) {
      return res.status(500).send({
        success: false,
        message: "Something went wrong",
        data: booking,
      });
    }
    return res.status(200).send({
      success: true,
      message: "All Accepted Boookings fetched Successfully",
      data: booking,
    });
  } catch (e) {
    return res
      .status(500)
      .send({ success: false, message: "Something went wrong", error: e.name });
  }
};

exports.getRejected = async (req, res) => {
  try {
    const skip = +req.query.skip || 0;
    const limit = +req.query.limit || 2;
    let booking = await Booking.find({ status: "Rejected" }, { __v: 0 })
      .populate([
        {
          path: "servicePrice",
          model: "servicePrice",
          select: { __v: 0 },
          populate: [
            {
              path: "service",
              model: "service",
              select: { __v: 0 },
            },
            {
              path: "vendor",
              model: "vendor",
              select: { __v: 0 },
            },
          ],
        },
        { path: "bookedBy", model: "user", select: { __v: 0 } },
      ])
      .sort({ firstName: 1 })
      .skip(skip)
      .limit(limit);
    if (booking.length === 0) {
      return res.status(200).send({
        success: true,
        message: "No Rejected Boookings",
        data: booking,
      });
    }
    if (!booking) {
      return res.status(500).send({
        success: false,
        message: "Something went wrong",
        data: booking,
      });
    }
    return res.status(200).send({
      success: true,
      message: "All Rejected fetched Successfully",
      data: booking,
    });
  } catch (e) {
    return res
      .status(500)
      .send({ success: false, message: "Something went wrong", error: e.name });
  }
};

exports.getCancelled = async (req, res) => {
  try {
    const skip = +req.query.skip || 0;
    const limit = +req.query.limit || 2;
    let booking = await Booking.find({ status: "Cancelled" }, { __v: 0 })
      .populate([
        {
          path: "servicePrice",
          model: "servicePrice",
          select: { __v: 0 },
          populate: [
            {
              path: "service",
              model: "service",
              select: { __v: 0 },
            },
            {
              path: "vendor",
              model: "vendor",
              select: { __v: 0 },
            },
          ],
        },
        { path: "bookedBy", model: "user", select: { __v: 0 } },
      ])
      .sort({ firstName: 1 })
      .skip(skip)
      .limit(limit);
    if (booking.length === 0) {
      return res.status(200).send({
        success: true,
        message: "No Cancelled Boookings",
        data: booking,
      });
    }
    if (!booking) {
      return res.status(500).send({
        success: false,
        message: "Something went wrong",
        data: booking,
      });
    }
    return res.status(200).send({
      success: true,
      message: "All Cancelled Boookings fetched Successfully",
      data: booking,
    });
  } catch (e) {
    return res
      .status(500)
      .send({ success: false, message: "Something went wrong", error: e.name });
  }
};

exports.getCompleted = async (req, res) => {
  try {
    const skip = +req.query.skip || 0;
    const limit = +req.query.limit || 2;
    let booking = await Booking.find({ status: "complete" }, { __v: 0 })
      .populate([
        {
          path: "servicePrice",
          model: "servicePrice",
          select: { __v: 0 },
          populate: [
            {
              path: "service",
              model: "service",
              select: { __v: 0 },
            },
            {
              path: "vendor",
              model: "vendor",
              select: { __v: 0 },
            },
          ],
        },
        { path: "bookedBy", model: "user", select: { __v: 0 } },
      ])
      .sort({ firstName: 1 })
      .skip(skip)
      .limit(limit);

    if (booking.length === 0) {
      return res.status(200).send({
        success: true,
        message: "No Completed Boookings",
        data: booking,
      });
    }
    if (!booking) {
      return res.status(500).send({
        success: false,
        message: "Something went wrong",
        data: booking,
      });
    }
    return res.status(200).send({
      success: true,
      message: "All Completed Boookings fetched Successfully",
      data: booking,
    });
  } catch (e) {
    return res
      .status(500)
      .send({ success: false, message: "Something went wrong", error: e.name });
  }
};

exports.reject = async (req, res) => {
  try {
    const { params, body } = req;
    const { error } = Joi.object()
      .keys({
        id: Joi.string().required(),
        // timeSlot: Joi.object()
        //   .keys({
        //     start: Joi.string().required(),
        //     end: Joi.string().required(),
        //   })
        //   .required(),
        // servicePrice: Joi.string(),
        // date: Joi.string(),
        // status: Joi.string(),
      })
      .required()
      .validate(body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    const booking = await Booking.findByIdAndUpdate(
      body.id,
      { status: "Rejected" },
      {
        new: true,
      }
    );
    if (!booking) {
      return res
        .staus(400)
        .send({ success: false, message: "No Rejected Booking Found" });
    }
    return res
      .status(200)
      .send({ success: true, message: "Booking Rejected", data: booking });
  } catch (e) {
    return res
      .status(500)
      .send({ success: false, message: "Something went wrong", error: e.name });
  }
};

exports.accept = async (req, res) => {
  try {
    const { params, body } = req;
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
    const booking = await Booking.findByIdAndUpdate(
      body.id,
      { status: "Accepted" },
      {
        new: true,
      }
    );
    if (!booking) {
      return res
        .staus(400)
        .send({ success: false, message: "No Accepted Booking Found" });
    }
    return res
      .status(200)
      .send({ success: true, message: "Booking Accepted", data: booking });
  } catch (e) {
    return res
      .status(500)
      .send({ success: false, message: "Something went wrong", error: e.name });
  }
};

exports.cancel = async (req, res) => {
  try {
    const { params, body } = req;
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
    const booking = await Booking.findByIdAndUpdate(
      body.id,
      { status: "Cancelled" },
      {
        new: true,
      }
    );
    if (!booking) {
      return res
        .staus(400)
        .send({ success: false, message: "No Cancelled Booking Found" });
    }
    return res
      .status(200)
      .send({ success: true, message: "Booking Cancelled", data: booking });
  } catch (e) {
    return res
      .status(500)
      .send({ success: false, message: "Something went wrong", error: e.name });
  }
};

exports.complete = async (req, res) => {
  try {
    const { params, body } = req;
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
    const booking = await Booking.findByIdAndUpdate(
      body.id,
      { status: "complete" },
      {
        new: true,
      }
    );
    if (!booking) {
      return res
        .staus(400)
        .send({ success: false, message: "No Booking Found" });
    }
    return res
      .status(200)
      .send({ success: true, message: "Booking Completed", data: booking });
  } catch (e) {
    return res
      .status(500)
      .send({ success: false, message: "Something went wrong", error: e.name });
  }
};
