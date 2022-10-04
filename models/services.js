const { Schema, model } = require("mongoose");
const ServiceSchema = new Schema({
  name: {
    type: String,
  },
  image: {
    type: Buffer,
  },
  description: {
    type: String,
  },
  rating: {
    type: Number,
  },
});
exports.Service = model("service", ServiceSchema);
