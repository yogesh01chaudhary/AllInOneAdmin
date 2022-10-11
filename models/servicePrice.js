const { Schema, model } = require("mongoose");
const ServicePriceSchema = new Schema({
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
  price: {
    type: Number,
    required: true,
  },
});
exports.ServicePrice = model("servicePrice", ServicePriceSchema);
