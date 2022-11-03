const { Schema, model } = require("mongoose");

const adminSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
});

exports.Admin = model("admin", adminSchema);
