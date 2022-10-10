const { Schema, model } = require("mongoose");
const BookingSchema = new Schema(
  {
    date: {
      type: String,
    //   default: Date.now(),
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: "service",
    },
    //   service: [ServiceSchema],
    timeSlot: {
      start: {
        type: String,
      },
      end: {
        type: String,
      },
    },
    price: {
      type: Number,
    },
    status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

exports.Booking = model("booking", BookingSchema);
