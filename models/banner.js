const { Schema, model } = require("mongoose");

const BannerSchema = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
  },
  { timestamps: true }
);

const Banner = model("banner", BannerSchema);

module.exports = { Banner };
