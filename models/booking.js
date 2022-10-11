const { Schema, model } = require("mongoose");
const BookingSchema = new Schema(
  {
    date: {
      type: String,
    },
    servicePrice: {
      type: Schema.Types.ObjectId,
      ref: "servicePrice",
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
  },
  { timestamps: true }
);

exports.Booking = model("booking", BookingSchema);
