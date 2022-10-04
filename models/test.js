const { Schema, model, default: mongoose } = require("mongoose");
const testSchema = new Schema({
  name: { type: String },
  //   test: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Test",
  //   },
  vendor: [{ type: mongoose.Schema.Types.ObjectId, ref: "vendor" }],
});
const Test = model("test", testSchema);

module.exports = Test;
