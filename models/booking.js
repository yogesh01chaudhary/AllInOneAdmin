const { Schema, model } = require("mongoose");

const BookingSchema = new Schema(
  {
    date: {
      type: String,
    },
    timeSlot: {
      start: {
        type: String,
      },
      end: {
        type: String,
      },
    },
    status: { type: String, default: "Pending" },
    bookedBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    vendor: {
      type: Schema.Types.ObjectId,
      ref: "vendor",
      required: true,
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: "service",
      required: true,
    },
    OTP: {
      type: String,
    },
  },
  { timestamps: true }
);

exports.Booking = model("booking", BookingSchema);
