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
});

exports.Admin = model("admin", adminSchema);