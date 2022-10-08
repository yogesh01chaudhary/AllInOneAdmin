const express = require("express");
const app = express();
const morgan = require("morgan");
const router = require("./routes/admin");
const refreshRouter = require("./routes/refreshToken");
const categoryRouter = require("./routes/category");
const bannerRouter=require("./routes/banner")
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use("/api/v1/admin", router);
app.use("/api/v1/admin", refreshRouter);
app.use("/api/v1/admin", categoryRouter);
app.use("/api/v1/admin", bannerRouter);

require("dotenv/config");
const { connect } = require("./connection/dbConnection");
// console.log(process.env.PORT)
connect();
const PORT = process.env.PORT;

app.get("/", (req, res) => {
  console.log({ success: true, message: "All In One Admin Page" });
  res.status(200).send({ success: true, message: "All In One Admin Page" });
});

app.listen(PORT, () => {
  console.log(`Server is listenig on http://localhost:${PORT}`);
});
