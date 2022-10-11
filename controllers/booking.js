const { Booking } = require("../models/booking");
const Joi = require("joi");
exports.addBooking = async (req, res) => {
  try {
    console.log(req.body);
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
