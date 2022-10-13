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
  //   responsibilities: [ResponsibilitySchema],
  responsibilities: [
    {
      type: String,
    },
  ],
 
});

exports.SubAdmin = model("subAdmin", SubAdminSchema);
