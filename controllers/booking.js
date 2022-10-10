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
        price: Joi.number(),
        service: Joi.string(),
        date: Joi.string(),
        status: Joi.string(),
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
          //   data: booking,
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
    let booking = await Booking.find().populate("service");
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
    let booking = await Booking.find({ status: "Pending" }).populate("service");
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
    let booking = await Booking.find({ status: "Accepted" }).populate(
      "service"
    );
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
    let booking = await Booking.find({ status: "Rejected" }).populate(
      "service"
    );
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
    let booking = await Booking.find({ status: "Cancelled" }).populate(
      "service"
    );
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
    let booking = await Booking.find({ status: "Completed" }).populate(
      "service"
    );
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
      })
      .required()
      .validate(params);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    const booking = await Booking.findByIdAndUpdate(
      params.id,
      { status: "Rejected" },
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
      .validate(params);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    const booking = await Booking.findByIdAndUpdate(
      params.id,
      { status: "Accepted" },
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
      .validate(params);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    const booking = await Booking.findByIdAndUpdate(
      params.id,
      { status: "Cancelled" },
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
      .send({ success: true, message: "Booking Cancelled", data: booking });
  } catch (e) {
    return res
      .status(500)
      .send({ success: false, message: "Something went wrong", error: e.name });
  }
};

exports.complete= async (req, res) => {
  try {
    const { params, body } = req;
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
    const booking = await Booking.findByIdAndUpdate(
      params.id,
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
