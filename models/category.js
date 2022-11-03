const { Schema, model } = require("mongoose");

const CategorySchema = new Schema(
  {
    name: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    subCategory: [
      {
        type: Schema.Types.ObjectId,
        ref: "subCategory",
      },
    ],
    service: [
      {
        type: Schema.Types.ObjectId,
        ref: "service",
      },
    ],
  },
  {
    timestamps: true,
  }
);

exports.Category = model("category", CategorySchema);
