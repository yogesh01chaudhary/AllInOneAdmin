const mongoose = require("mongoose");
exports.connect = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((e) => {
      console.log("Database not connected, Something went wrong",e.name);
    });
};
