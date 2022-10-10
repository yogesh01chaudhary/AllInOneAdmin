const { Schema, model } = require("mongoose");
const ResponsibilitySchema = require("./responsibility");
const SubAdminSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  responsibilities: [ResponsibilitySchema],
});
exports.SubAdmin = model("subAdmin", SubAdminSchema);
