const Booking = require("../models/booking");
const Joi = require("joi");
const { Vendor } = require("../models/vendor");
const mongoose = require("mongoose");
const { sendMail, createPassword } = require("../helpers/sendPassword");
const bcrypt = require("bcrypt");
const axios = require("axios");
const TransferCount = require("../models/transferCount");

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

exports.acceptRequest = async (req, res) => {
  try {
    const { body } = req;
    let vendor = await Vendor.findByIdAndUpdate(
      body.id,
      { requestStatus: "accepted" },
      { new: true }
    );
    if (!vendor) {
      return res.status(400).send({
        success: false,
        message: "No vendor found to provide request",
      });
    }
    let generatedPassword = await createPassword(8, true, true);

    let hashedPassword = await bcrypt.hash(generatedPassword, 10);
    vendor = await Vendor.findByIdAndUpdate(
      body.id,
      { password: hashedPassword },
      { new: true }
    );
    console.log(hashedPassword, generatedPassword);

    const mailResponse = await sendMail(
      vendor.firstName,
      vendor.email,
      generatedPassword
    );
    let [a, ...p] = mailResponse.split(",");
    // p = p.join(",");
    p = JSON.parse(p.join(","));
    res.status(200).send({
      success: true,
      message: "User Request Accepted",
      mailResponse: `${a} ${p.envelope.to}`,
      vendor,
    });
  } catch (e) {
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
      console.log(vendor.transferCount, mainVendors, mainVendors[vendorId]);
      if (mainVendors[vendorId] && vendor.transferCount) {
        let vendorCount = await TransferCount.findOne({
          _id: vendor.transferCount,
          vendor: vendorId,
        });
        console.log("vendorCount", vendorCount);
        if (vendorCount && vendorCount.count == 3) {
          console.log("before", mainVendors);
          delete mainVendors[vendorId];
          console.log("after", mainVendors);
        }
      }

      console.log("onLeave", vendor.onLeave, mainVendors[vendorId]);
      if (mainVendors[vendorId] && vendor.onLeave.length > 0) {
        let vendorOnLeave = await Vendor.find({
          _id: vendorId,
          onLeave: {
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
        console.log("vendorOnLeave", vendorOnLeave);
        if (vendorOnLeave.length > 0) {
          delete mainVendors[vendorId];
          console.log("mainVendorsLeave", mainVendors);
        }
      }

      console.log("emergencyLeave", vendor.emergencyLeave);
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
        console.log("vendorEmergencyLeave", vendorEmergencyLeave);
        if (vendorEmergencyLeave.length > 0) {
          delete mainVendors[vendorId];
          console.log(mainVendors);
        }
      }

      console.log("timeSlot", vendor.timeSlot, mainVendors[vendorId]);
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
          console.log("mainVendors TimeSlot", mainVendors);
        }
      }
    };

    for (i = 0; i < vendors.length; i++) {
      console.log(vendors[i]._id);
      key = vendors[i]._id;
      value = vendors[i].deviceToken;
      mainVendors[key] = value;
      await getVendors(vendors[i]._id);
    }
    console.log("mainVendors", mainVendors);
    return res.status(200).send({
      success: true,
      message: "Nearest Vendors Fetched successfully",
      // vendors,
      // totalVendors,
      mainVendors,
    });
  } catch (e) {
    return res.status(500).send({ success: false, message: e.message });
  }
};

// new API TO SEND PUSH NOTIFICATION TO ALL FETCHED VENDORS BOOKNGID WILL BE PASSED TO VENDRS
// vendors will accept and transfer the request
exports.sendNotification = async (req, res) => {
  const { params } = req;
  let deviceToken = body.deviceToken;
  let registration_ids = [deviceToken];
  let notification = {
    text: body.text,
    title: body.title,
  };
  let serverKey = `key=${process.env.SERVER_KEY}`;
  let api = `${process.env.GOOGLE_FIREBASE_API}`;
  console.log(serverKey, api);
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
