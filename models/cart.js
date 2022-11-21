const User = require("./user");
const { Schema, model } = require("mongoose");
const { Service } = require("./services");
const CartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  service: {
    type: Schema.Types.ObjectId,
    ref: Service,
  },

  item: {
    packageId: {
      type: Schema.Types.ObjectId,
      ref: "service",
      required: true,
    },
    description: {
      type: String,
    },
    rating: {
      type: Number,
      default: 5,
    },
    price: {
      type: Number,
    },
  },
});
module.exports = model("cart", CartSchema);
