const { Schema } = require("mongoose");

const ResponsibilitySchema = new Schema({
  responsibility1: {
    type: Boolean,
    default: false,
  },
  responsibility2: {
    type: Boolean,
    default: false,
  },
  responsibility3: {
    type: Boolean,
    default: false,
  },
  responsibility4: {
    type: Boolean,
    default: false,
  },
});

module.exports = ResponsibilitySchema;
