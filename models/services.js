const { Schema, model } = require("mongoose");
const { PackageSchema } = require("./packageSchema");

const ServiceSchema = new Schema(
  {
    name: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    description: {
      type: String,
    },
    silver: PackageSchema,
    gold: PackageSchema,
    platinum: PackageSchema,
  },
  {
    timestamps: true,
  }
);

exports.Service = model("service", ServiceSchema);
