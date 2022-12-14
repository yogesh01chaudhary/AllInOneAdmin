const Booking = require("../models/booking");
const Joi = require("joi");
const { Vendor } = require("../models/vendor");
const mongoose = require("mongoose");
const { sendMail, createPassword } = require("../helpers/sendPassword");
const bcrypt = require("bcrypt");
const axios = require("axios");
const TransferCount = require("../models/transferCount");
const NearByVendors = require("../models/nearByVendors");

// ********************************getVendorsWhoFilledTheForm******************************************************************************** //
exports.getVendors = async (req, res) => {
  try {
    const limitValue = +req.query.limit || 6;
    const skipValue = +req.query.skip || 0;
    const data = await Vendor.aggregate([
      {
        $facet: {
          totalData: [
            { $match: {} },
            { $project: { password: 0 } },
            { $skip: skipValue },
            { $limit: limitValue },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);
    let count = data[0].totalCount[0];
    let vendors = data[0].totalData;

    if (!vendors) {
      return res
        .status(200)
        .send({ success: true, message: "No vendors found" });
    }
    return res
      .status(200)
      .send({ success: true, message: "Vendors found", vendors, count });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

// *******************************acceptRequest/rejectRequest******************************************************************************** //
exports.acceptRequest = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { body } = req;
    let data = await Vendor.findById(body.id);
    if (!data) {
      return res.status(400).send({
        success: false,
        message: "No vendor found to provide request",
      });
    }
    let vendor = await Vendor.findByIdAndUpdate(
      body.id,
      {
        requestStatus: "accepted",
        $addToSet: { services: { $each: data.requestedService } },
        requestedService: [],
      },
      { new: true, session }
    );
    // if (!vendor) {
    //   return res.status(400).send({
    //     success: false,
    //     message: "No vendor found to provide request",
    //   });
    // }
    let generatedPassword = await createPassword(8, true, true);

    let hashedPassword = await bcrypt.hash(generatedPassword, 10);
    vendor = await Vendor.findByIdAndUpdate(
      body.id,
      { password: hashedPassword },
      { new: true, session }
    );
    console.log(hashedPassword, generatedPassword);
    if (!vendor.firstName && !vendor.email) {
      await session.abortTransaction();
      await session.endSession();
      return res
        .status(400)
        .send({ success: false, message: "EmailID Not Provided" });
    }
    const mailResponse = await sendMail(
      vendor.firstName,
      vendor.email,
      generatedPassword
    );
    let [a, ...p] = mailResponse.split(",");
    // p = p.join(",");
    p = JSON.parse(p.join(","));
    await session.commitTransaction();
    await session.endSession();
    res.status(200).send({
      success: true,
      message: "User Request Accepted",
      mailResponse: `${a} ${p.envelope.to}`,
      vendor,
    });
  } catch (e) {
    await session.abortTransaction();
    await session.endSession();
    return res.status(500).send({ success: false, error: e.message });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const { body } = req;
    let vendor = await Vendor.findByIdAndUpdate(
      body.id,
      { requestStatus: "rejected" },
      { new: true }
    );
    if (!vendor) {
      return res.status(400).send({
        success: false,
        message: "No vendor found to provide request",
      });
    }

    // let password=createPassword(6,false,false)
    const mailResponse = await sendMail(vendor.firstName, vendor.email);
    let [a, ...p] = mailResponse.split(",");
    p = JSON.parse(p.join(","));
    res.status(200).send({
      success: true,
      message: "User request rejected",
      mailResponse: `${a} ${p.envelope.to}`,
      vendor,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.message });
  }
};

// ********************************getVendors-pending/accepted/rejected******************************************************************************** //
exports.getPending = async (req, res) => {
  try {
    // const limitValue = req.query.limit || 2;
    // const skipValue = req.query.skip || 0;
    // const result = await Vendor.find({ requestStatus: "pending" })
    //   .limit(limitValue)
    //   .skip(skipValue);
    console.log(req.query);
    const limitValue = req.query.limit || 6;
    const skipValue = req.query.skip || 0;
    const data = await Vendor.aggregate([
      {
        $facet: {
          totalData: [
            { $match: { requestStatus: "pending" } },
            { $skip: +skipValue },
            { $limit: +limitValue },
          ],
          totalCount: [
            { $match: { requestStatus: "pending" } },
            { $count: "count" },
          ],
        },
      },
    ]);
    console.log(data);

    let count = data[0].totalCount;
    let result = data[0].totalData;
    if (result.length == 0) {
      return res.status(200).send({
        success: true,
        message: "No users with pending status",
        result,
      });
    }
    res.status(200).send({
      success: true,
      message: "users with pending request",
      result,
      count,
      //   data,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

exports.getRejected = async (req, res) => {
  try {
    // const limitValue = req.query.limit || 2;
    // const skipValue = req.query.skip || 0;
    // const result = await Vendor.find({ requestStatus: "rejected" })
    //   .limit(limitValue)
    //   .skip(skipValue);
    const limitValue = +req.query.limit || 6;
    const skipValue = +req.query.skip || 0;
    const data = await Vendor.aggregate([
      {
        $facet: {
          totalData: [
            { $match: { requestStatus: "rejected" } },
            { $skip: skipValue },
            { $limit: limitValue },
          ],
          totalCount: [
            { $match: { requestStatus: "rejected" } },
            { $count: "count" },
          ],
        },
      },
    ]);
    let count = data[0].totalCount[0];
    let result = data[0].totalData;
    if (result.length == 0) {
      return res.status(200).send({
        success: true,
        message: "No users with rejected status",
        result,
      });
    }
    res.status(200).send({
      success: true,
      message: "users with rejected request",
      result,
      count,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

exports.getAccepted = async (req, res) => {
  try {
    // const limitValue = req.query.limit || 2;
    // const skipValue = req.query.skip || 0;
    // const result = await Vendor.find({ requestStatus: "accepted" })
    //   .limit(limitValue)
    //   .skip(skipValue);
    const limitValue = +req.query.limit || 6;
    const skipValue = +req.query.skip || 0;
    const data = await Vendor.aggregate([
      {
        $facet: {
          totalData: [
            { $match: { requestStatus: "accepted" } },
            { $skip: skipValue },
            { $limit: limitValue },
          ],
          totalCount: [
            { $match: { requestStatus: "accepted" } },
            { $count: "count" },
          ],
        },
      },
    ]);
    let count = data[0].totalCount[0];
    let result = data[0].totalData;
    if (result.length == 0) {
      return res.status(200).send({
        success: true,
        message: "No users with accepted status",
        result,
      });
    }
    res.status(200).send({
      success: true,
      message: "users with accepted request",
      result,
      count,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

// ********************************getVendorsWhoRequestedForService******************************************************************************** //
//@desc get Vendors Who Have Requested For Service
//@route GET /api/v1/admin/vendorsRequestedService
//@access Private
exports.getVendorsRequestedService = async (req, res) => {
  try {
    const limitValue = +req.query.limit || 6;
    const skipValue = +req.query.skip || 0;

    const data = await Vendor.aggregate([
      {
        $facet: {
          totalData: [
            {
              $match: { "requestedService.0": { $exists: true } },
            },
            {
              $project: {
                requestedService: 1,
                firstName: 1,
                lastName: 1,
                services: 1,
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
              $match: { "requestedService.0": { $exists: true } },
            },
            { $count: "count" },
          ],
        },
      },
    ]);
    let count = data[0].totalCount[0];
    let vendor = data[0].totalData;
    if (!vendor) {
      return res
        .status(400)
        .send({ success: false, message: "Something went wrong" });
    }
    if (vendor.length === 0) {
      return res.status(400).send({
        success: true,
        message: "No Vendors Requested For Service",
        vendor,
        count,
      });
    }
    return res.status(200).send({
      succes: true,
      message: "Vendors Requested For Service Fetched Successfully",
      vendor,
      count,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.message });
  }
};

// ********************************grantServiceTovendors***************************************************************************** //
//@desc grant services to vendors who has requested for services
//@route PUT /api/v1/admin/grantServicesToVendor/:id
//@access Private
exports.grantServicesToVendor = async (req, res) => {
  try {
    const { body, params } = req;
    const { error } = Joi.object()
      .keys({
        id: Joi.string().required(),
      })
      .required()
      .validate(params);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    let vendor = await Vendor.findById(
      { _id: req.params.id },
      { requestedService: 1 }
    );
    if (!vendor) {
      return res
        .status(400)
        .send({ success: false, message: "No Vendor Found" });
    }

    vendor = await Vendor.updateOne(
      { _id: vendor._id },
      {
        $addToSet: { services: { $each: vendor.requestedService } },
        requestedService: [],
      },
      { new: true }
    );

    return res.status(200).send({
      succes: true,
      message: "Services Provided Successfully",
      vendor,
    });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.message });
  }
};

// ********************************nearByVendorsForUser/storeInNearbyCollectionWithBookingId******************************************************************************* //
//@desc get nearby Vendors using bookingId For Users To Provide them services
//@route GET/admin/nearbyVendors
//@access Private
exports.nearbyVendors = async (req, res) => {
  try {
    const { params } = req;
    const { error } = Joi.object()
      .keys({ bookingId: Joi.string().required() })
      .validate(params);
    if (error) {
      return res
        .status(400)
        .send({ success: false, message: error.details[0].message });
    }
    let matchQuery = {
      $match: {
        $and: [
          { _id: mongoose.Types.ObjectId(params.bookingId) },
          { bookingStatus: "Pending" },
        ],
      },
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
        },
      },
    ]);

    let result = data[0].totalData;

    if (result.length === 0) {
      return res
        .status(200)
        .send({ success: false, message: "Booking Not Found" });
    }

    result = result[0];
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
        key: "location",
        query: {
          $and: [
            { services: { $in: [mongoose.Types.ObjectId(result.service)] } },
            { requestStatus: "accepted" },
            {
              transferredBookings: {
                $nin: [mongoose.Types.ObjectId(params.bookingId)],
              },
            },
            // {
            //   timeSlot: {
            //     $all: [
            //       {
            //         $elemMatch: {
            //           $and: [
            //             { start: { $eq: result.timeSlot.start } },
            //             { end: { $eq: result.timeSlot.end } },
            //             {
            //               $or: [
            //                 { bookingDate: { $eq: undefined } },
            //                 {
            //                   bookingDate: { $eq: result.timeSlot.bookingDate },
            //                 },
            //               ],
            //             },
            //             { booked: false },
            //           ],
            //         },
            //       },
            //     ],
            //   },
            // },
          ],
        },
        maxDistance: 7000000,
        spherical: true,
      },
    };

    let vendors = await Vendor.aggregate([
      geoQuery,
      { $project: { ___v: 0, _id: 1 } },
    ]);

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
        message: "No Nearest Vendors Found, Internal Team Will Handle",
      });
    }
    let mainVendors = {};
    const getVendors = async (vendorId) => {
      let vendor = await Vendor.findById({ _id: vendorId });
      if (!vendor) {
        return;
      }
      // console.log(vendor.transferCount, mainVendors, mainVendors[vendorId]);
      if (mainVendors[vendorId] && vendor.transferCount) {
        let vendorCount = await TransferCount.findOne({
          _id: vendor.transferCount,
          vendor: vendorId,
        });
        // console.log("vendorCount", vendorCount);
        if (vendorCount && vendorCount.count == 3) {
          // console.log("before", mainVendors);
          delete mainVendors[vendorId];
          // console.log("after", mainVendors);
        }
      }

      // console.log("onLeave", vendor.onLeave, mainVendors[vendorId]);
      // console.log(result.timeSlot.bookingDate,vendorId)
      if (mainVendors[vendorId] && vendor.onLeave.length > 0) {
        let vendorOnLeave = await Vendor.find({
          _id: vendorId,
          onLeave: {
            $all: [
              {
                $elemMatch: {
                  $and: [
                    { start: { $lte: result.timeSlot.bookingDate } },
                    { end: { $gte: result.timeSlot.bookingDate } },
                    { status: { $eq: "Approved" } },
                    // { reason: { $type: "string" } },
                  ],
                },
              },
            ],
          },
        });
        // console.log("vendorOnLeave", vendorOnLeave);
        if (vendorOnLeave.length > 0) {
          delete mainVendors[vendorId];
          // console.log("mainVendorsLeave", mainVendors);
        }
      }

      // console.log("emergencyLeave", vendor.emergencyLeave);
      if (mainVendors[vendorId] && vendor.emergencyLeave.length > 0) {
        let vendorEmergencyLeave = await Vendor.find({
          _id: vendorId,
          emergencyLeave: {
            $all: [
              {
                $elemMatch: {
                  $and: [
                    { date: { $eq: result.timeSlot.bookingDate } },
                    { status: { $eq: "Approved" } },
                  ],
                },
              },
            ],
          },
        });
        // console.log("vendorEmergencyLeave", vendorEmergencyLeave);
        if (vendorEmergencyLeave.length > 0) {
          delete mainVendors[vendorId];
          // console.log(mainVendors);
        }
      }

      // console.log("timeSlot", vendor.timeSlot, mainVendors[vendorId]);
      if (mainVendors[vendorId] && vendor.timeSlot.length > 0) {
        let vendorTimeSlot = await Vendor.find({
          _id: vendorId,
          timeSlot: {
            $all: [
              {
                $elemMatch: {
                  $and: [
                    { start: { $eq: result.timeSlot.start } },
                    { end: { $eq: result.timeSlot.end } },
                    {
                      bookingDate: { $eq: result.timeSlot.bookingDate },
                    },
                    { booked: true },
                  ],
                },
              },
            ],
          },
        });
        console.log("vendorTimeSlot", vendorTimeSlot);
        if (vendorTimeSlot.length > 0) {
          delete mainVendors[vendorId];
          // console.log("mainVendors TimeSlot", mainVendors);
        }
      }
    };

    for (i = 0; i < vendors.length; i++) {
      // console.log(vendors[i]._id);
      key = vendors[i]._id;
      value = vendors[i];
      mainVendors[key] = value;
      await getVendors(vendors[i]._id);
    }
    let vendorKeys = [];
    for (let key in mainVendors) {
      vendorKeys.push({ vendor: new mongoose.Types.ObjectId(key) });
    }
    let nearByVendors = await NearByVendors.findByIdAndUpdate(
      {
        _id: params.bookingId,
      },
      { vendors: vendorKeys },

      { new: true, upsert: true }
    );
    if (!nearByVendors) {
      return res.status(500).send({
        success: false,
        message: "Something went wrong in saving nearByVendors",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Nearest Vendors Fetched successfully",
      // vendors,
      // totalVendors,
      nearByVendors,
      mainVendors: Object.values(mainVendors),
      count: Object.keys(mainVendors).length,
    });
  } catch (e) {
    return res.status(500).send({ success: false, message: e.message });
  }
};

// ********************************sendNotificationToNearbyVendors***************************************************************************** //
// new API TO SEND PUSH NOTIFICATION TO ALL FETCHED VENDORS BOOKNGID WILL BE PASSED TO VENDRS
// vendors will accept and transfer the request
exports.sendNotification = async (req, res) => {
  const { body } = req;
  const { error } = Joi.object()
    .keys({
      deviceToken: Joi.array().items(Joi.string().required()),
      message: Joi.string().required(),
      bookingId: Joi.string().required(),
      title: Joi.string().required(),
    })
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
        // totalCount: [matchQuery, { $count: "count" }],
      },
    },
  ]);

  let result = data[0].totalData;

  if (result.length === 0) {
    return res.status(200).send({ success: false, message: "No Data Found" });
  }

  result = result[0];

  let package;
  if (
    result.item.packageId.toString() ===
    result.serviceData[0].silver._id.toString()
  ) {
    package = result.serviceData[0].silver;
  }
  if (
    result.item.packageId.toString() ===
    result.serviceData[0].gold._id.toString()
  ) {
    package = result.serviceData[0].gold;
  }
  if (
    result.item.packageId.toString() ===
    result.serviceData[0].platinum._id.toString()
  ) {
    package = result.serviceData[0].platinum;
  }
  var dob = new Date(
    result.userData[0].dateOfBirth.split("/").reverse().join("/")
  );
  var year = dob.getFullYear();
  var month = dob.getMonth();
  var day = dob.getDate();
  var today = new Date();
  var age = today.getFullYear() - year;

  if (
    today.getMonth() < month ||
    (today.getMonth() == month && today.getDate() < day)
  ) {
    age--;
  }

  result = {
    // _id: result._id,
    // packageName: package.description,
    // bookingDate: result.timeSlot.bookingDate,
    // time: `${result.timeSlot.start} - ${result.timeSlot.end}`,
    // userName: `${result.userData[0].firstName} ${result.userData[0].lastName}`,
    // address: `${result.userData[0].city}, ${result.userData[0].pincode}`,
    // location: result.userData[0].location.coordinates,

    bookingId: result._id,
    packageName: package.description,
    bookingDate: result.timeSlot.bookingDate,
    time: `${result.timeSlot.start} - ${result.timeSlot.end}`,
    userName: `${result.userData[0].firstName} ${result.userData[0].lastName}`,
    email: result.userData[0].email,
    age,
    mobile: result.userData[0].phone,
    gender: result.userData[0].gender,
    bookingStatus: result.bookingStatus,
    address: `${result.userData[0].city}, ${result.userData[0].pincode}`,
    location: result.userData[0].location.coordinates,
    userId: result.userId,
    service: result.service,
    packageId: package._id,
    amountToBePaid: result.total,
    payby: result.payby,
    paid: result.paid,
    paymentStatus: result.paymentStatus,
  };
  let registration_ids = body.deviceToken;
  let notification = {
    body: { result, message: body.message },
    title: body.title,
  };
  let serverKey = `key=${process.env.SERVER_KEY}`;
  let api = `${process.env.GOOGLE_FIREBASE_API}`;
  try {
    let result = await axios.post(
      api,
      { registration_ids, notification },
      {
        headers: {
          Authorization: serverKey,
        },
      }
    );
    let failed = {};
    let passed = {};
    if (result.data.failure) {
      result.data.results.map((item, index) => {
        if (item.error) {
          failed[index] = "";
        }
      });
      for (let i = 0; i < body.deviceToken.length; i++) {
        if (i in failed) {
          failed[i] = body.deviceToken[i];
        } else {
          passed[i] = body.deviceToken[i];
        }
      }
      return res.status(400).send({
        success: false,
        message: "Notification Sent Successfully Except These",
        failed,
        passed,
      });
    }
    return res
      .status(200)
      .send({ success: true, message: "Notification sent successfully" });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.message });
  }
};

// ********************************getNearByVendorsFoundedForBookingFromNearbyCoolection******************************************************************************* //
// @desc see  all booking of an user using userId
// @route  GET/admin/bookingNearbyVendors
// @acess Private
exports.getBookingNearbyVendors = async (req, res) => {
  try {
    const { bookingId } = req.params;

    let matchQuery = {
      $match: { _id: mongoose.Types.ObjectId(bookingId) },
    };

    let data = await NearByVendors.aggregate([
      {
        $facet: {
          totalData: [
            matchQuery,
            { $project: { __v: 0 } },
            // {
            //   $lookup: {
            //     from: "users",
            //     localField: "userId",
            //     foreignField: "_id",
            //     as: "userData",
            //   },
            // },
            // {
            //   $lookup: {
            //     from: "services",
            //     localField: "service",
            //     foreignField: "_id",
            //     as: "serviceData",
            //   },
            // },
            {
              $lookup: {
                from: "vendors",
                localField: "vendors.vendor",
                foreignField: "_id",
                as: "vendorData",
              },
            },
          ],
          totalCount: [matchQuery, { $count: "count" }],
        },
      },
    ]);

    let newResult = await NearByVendors.findById(bookingId).populate(
      "vendors.vendor"
    );

    let resultData = data[0].totalData;
    let count = data[0].totalCount;

    return res.status(200).send({
      success: true,
      message: "Bookings Fetched Successfully",
      // resultData,
      // count,
      newResult,
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: e.message,
    });
  }
};

// *******************************EXTRA*****************NOT_IN_USE******************************************************** //
//EXTRA
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

//EXTRA
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

// ********************************getVendorsAppliedForLeave******************************************************************************** //
exports.getVendorsAppliedForLeave = async (req, res) => {
  try {
    console.log(req.query);
    const limitValue = +req.query.limit || 6;
    const skipValue = +req.query.skip || 0;
    const data = await Vendor.aggregate([
      {
        $facet: {
          totalData: [
            { $match: {} },
            {
              $project: {
                // password: 0,
                firstName: 1,
                lastName: 1,
                email: 1,
                emergencyLeave: 1,
                emergencyLeave: 1,
              },
            },
            { $skip: skipValue },
            { $limit: limitValue },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);
    let count = data[0].totalCount[0];
    let vendors = data[0].totalData;

    if (!vendors) {
      return res
        .status(200)
        .send({ success: true, message: "No vendors found" });
    }
    return res
      .status(200)
      .send({ success: true, message: "Vendors found", vendors, count });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

// ********************************approve/disapproveLeave******************************************************************************* //
exports.leaveApproved = async (req, res) => {
  try {
    const { body } = req;
    console.log(body);
    const { error } = Joi.object()
      .keys({
        vendorId: Joi.string().required(),
        date: Joi.string().required(),
      })
      .required()
      .validate(body);
    if (error) {
      return res
        .status(400)
        .send({ success: false, message: error.details[0].message });
    }
    let vendor = await Vendor.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(body.vendorId),
        emergencyLeave: {
          $all: [{ $elemMatch: { date: body.date, status: "Applied" } }],
        },
      },
      {
        $set: {
          "emergencyLeave.$": {
            status: "Approved",
            date: body.date,
            _id: null,
          },
        },
      },
      { new: true }
    );

    if (!vendor) {
      return res
        .status(404)
        .send({ success: false, message: "No Match Found" });
    }
    return res.status(200).send({
      success: true,
      message: "Vendor saved successfully with leaves",
      vendor,
    });
  } catch (e) {
    return res.status(500).send({ success: false, message: e.message });
  }
};

exports.leaveDisapproved = async (req, res) => {
  try {
    const { body } = req;
    console.log(body);
    const { error } = Joi.object()
      .keys({
        vendorId: Joi.string().required(),
        date: Joi.string().required(),
      })
      .required()
      .validate(body);
    if (error) {
      return res
        .status(400)
        .send({ success: false, message: error.details[0].message });
    }
    let vendor = await Vendor.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(body.vendorId),
        onLeave: {
          $all: [{ $elemMatch: { date: body.date, status: "Applied" } }],
        },
      },
      {
        $set: {
          "onLeave.$": {
            status: "Disapproved",
            date: body.date,
            _id: null,
          },
        },
      },
      { new: true }
    );

    if (!vendor) {
      return res
        .status(404)
        .send({ success: false, message: "No Match Found" });
    }
    return res.status(200).send({
      success: true,
      message: "Vendor saved successfully with leaves",
      vendor,
    });
  } catch (e) {
    return res.status(500).send({ success: false, message: e.message });
  }
};

// ********************************approve/disapproveEmergencyLeave******************************************************************************** //
exports.emergencyLeaveApproved = async (req, res) => {
  try {
    const { body } = req;
    console.log(body);
    const { error } = Joi.object()
      .keys({
        vendorId: Joi.string().required(),
        date: Joi.string().required(),
      })
      .required()
      .validate(body);
    if (error) {
      return res
        .status(400)
        .send({ success: false, message: error.details[0].message });
    }
    let vendor = await Vendor.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(body.vendorId),
        emergencyLeave: {
          $all: [{ $elemMatch: { date: body.date, status: "Applied" } }],
        },
      },
      {
        $set: {
          "emergencyLeave.$": {
            status: "Approved",
            date: body.date,
            _id: null,
          },
        },
      },
      { new: true }
    );

    if (!vendor) {
      return res
        .status(404)
        .send({ success: false, message: "No Match Found" });
    }
    return res.status(200).send({
      success: true,
      message: "Vendor saved successfully with leaves",
      vendor,
    });
  } catch (e) {
    return res.status(500).send({ success: false, message: e.message });
  }
};

exports.emergencyLeaveDisapproved = async (req, res) => {
  try {
    const { body } = req;
    console.log(body);
    const { error } = Joi.object()
      .keys({
        vendorId: Joi.string().required(),
        date: Joi.string().required(),
      })
      .required()
      .validate(body);
    if (error) {
      return res
        .status(400)
        .send({ success: false, message: error.details[0].message });
    }
    let vendor = await Vendor.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(body.vendorId),
        emergencyLeave: {
          $all: [{ $elemMatch: { date: body.date, status: "Applied" } }],
        },
      },
      {
        $set: {
          "emergencyLeave.$": {
            status: "Disapproved",
            date: body.date,
            _id: null,
          },
        },
      },
      { new: true }
    );

    if (!vendor) {
      return res
        .status(404)
        .send({ success: false, message: "No Match Found" });
    }
    return res.status(200).send({
      success: true,
      message: "Vendor saved successfully with leaves",
      vendor,
    });
  } catch (e) {
    return res.status(500).send({ success: false, message: e.message });
  }
};

// ********************************getLoggedIn/LoggedOutVendors******************************************************************************** //
exports.getLoggedInVendors = async (req, res) => {
  try {
    const limitValue = +req.query.limit || 6;
    const skipValue = +req.query.skip || 0;
    const data = await Vendor.aggregate([
      {
        $facet: {
          totalData: [
            { $match: { onDutyStatus: true } },
            {
              $project: {
                // password: 0,
                firstName: 1,
                lastName: 1,
                email: 1,
                onDuty: 1,
                onDutyStatus: 1,
              },
            },
            { $skip: skipValue },
            { $limit: limitValue },
          ],
          totalCount: [{ $match: { onDutyStatus: true } }, { $count: "count" }],
        },
      },
    ]);
    let count = data[0].totalCount[0];
    let vendors = data[0].totalData;

    if (!vendors) {
      return res
        .status(200)
        .send({ success: true, message: "No vendors found" });
    }
    return res
      .status(200)
      .send({ success: true, message: "Vendors found", vendors, count });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

exports.getLoggedOutVendors = async (req, res) => {
  try {
    const limitValue = +req.query.limit || 6;
    const skipValue = +req.query.skip || 0;
    const data = await Vendor.aggregate([
      {
        $facet: {
          totalData: [
            { $match: { onDutyStatus: false } },
            {
              $project: {
                // password: 0,
                firstName: 1,
                lastName: 1,
                email: 1,
                onDuty: 1,
                onDutyStatus: 1,
              },
            },
            { $skip: skipValue },
            { $limit: limitValue },
          ],
          totalCount: [
            { $match: { onDutyStatus: false } },
            { $count: "count" },
          ],
        },
      },
    ]);
    let count = data[0].totalCount[0];
    let vendors = data[0].totalData;

    if (!vendors) {
      return res
        .status(200)
        .send({ success: true, message: "No vendors found" });
    }
    return res
      .status(200)
      .send({ success: true, message: "Vendors found", vendors, count });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

// ********************************checkTimingOfAVendor******************************************************************************** //
exports.checkTimingOfVendor = async (req, res) => {
  try {
    const limitValue = +req.query.limit || 6;
    const skipValue = +req.query.skip || 0;
    console.log(req.body);
    const data = await Vendor.aggregate([
      {
        $facet: {
          totalData: [
            {
              $match: {
                _id: mongoose.Types.ObjectId(req.body.vendorId),
              },
            },
            {
              $project: {
                // password: 0,
                firstName: 1,
                lastName: 1,
                email: 1,
                onDutyStatus: 1,
                onDuty: 1,
              },
            },
            { $skip: skipValue },
            { $limit: limitValue },
          ],
          totalCount: [
            {
              $match: {
                _id: mongoose.Types.ObjectId(req.body.vendorId),
              },
            },
            { $count: "count" },
          ],
        },
      },
    ]);
    let count = data[0].totalCount[0];
    let vendors = data[0].totalData;
    console.log(vendors);
    if (!vendors) {
      return res
        .status(200)
        .send({ success: true, message: "Something went wrong" });
    }
    return res
      .status(200)
      .send({ success: true, message: "Vendor found", vendors, count });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

// ********************************checkTimingOfVendors******************************************************************************** //
exports.checkTimingOfVendors = async (req, res) => {
  try {
    const limitValue = +req.query.limit || 6;
    const skipValue = +req.query.skip || 0;
    const data = await Vendor.aggregate([
      {
        $facet: {
          totalData: [
            {
              $match: {},
            },
            {
              $project: {
                firstName: 1,
                lastName: 1,
                email: 1,
                onDutyStatus: 1,
                onDuty: 1,
              },
            },
            { $skip: skipValue },
            { $limit: limitValue },
          ],
          totalCount: [
            {
              $match: {},
            },
            { $count: "count" },
          ],
        },
      },
    ]);
    let count = data[0].totalCount[0];
    let vendors = data[0].totalData;

    if (!vendors) {
      return res
        .status(200)
        .send({ success: true, message: "No vendors found" });
    }
    return res
      .status(200)
      .send({ success: true, message: "Vendors found", vendors, count });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};

// ********************************checkOnDutyStatusOfAVendors******************************************************************************** //
exports.checkVendorOnDutyStatus = async (req, res) => {
  try {
    const limitValue = +req.query.limit || 6;
    const skipValue = +req.query.skip || 0;
    const data = await Vendor.aggregate([
      {
        $facet: {
          totalData: [
            { $match: { _id: mongoose.Types.ObjectId(req.body.vendorId) } },
            {
              $project: {
                firstName: 1,
                lastName: 1,
                email: 1,
                onDuty: 1,
                onDutyStatus: 1,
              },
            },
            { $skip: skipValue },
            { $limit: limitValue },
          ],
          totalCount: [
            { $match: { _id: mongoose.Types.ObjectId(req.body.vendorId) } },
            { $count: "count" },
          ],
        },
      },
    ]);
    let count = data[0].totalCount[0];
    let vendors = data[0].totalData;

    if (!vendors) {
      return res
        .status(200)
        .send({ success: true, message: "No vendors found" });
    }
    if (vendors[0].onDutyStatus === false) {
      return res.status(200).send({
        success: true,
        message: "Vendor Is Logged Off",
        vendors,
        count,
      });
    }
    return res
      .status(200)
      .send({ success: true, message: "Vendor Is Logged In", vendors, count });
  } catch (e) {
    return res.status(500).send({ success: false, error: e.name });
  }
};
