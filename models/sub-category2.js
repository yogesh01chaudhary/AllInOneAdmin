const { Schema, model } = require("mongoose");
const SubCategorySchema2 = new Schema(
  {
    name: {
      type: String,
    },
    image: {
      type: Buffer,
    },
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
exports.SubCategory2 = model("subCategory2", SubCategorySchema2);
