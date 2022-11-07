const { Schema, model } = require("mongoose");

const SubCategorySchema = new Schema(
  {
    name: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    subCategory2: [
      {
        type: Schema.Types.ObjectId,
        ref: "subCategory2",
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

exports.SubCategory = model("subCategory", SubCategorySchema);
