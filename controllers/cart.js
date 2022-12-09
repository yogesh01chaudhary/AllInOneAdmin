const Cart = require("../models/cart");
const mongoose = require("mongoose");
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
