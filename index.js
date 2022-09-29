const express = require("express");
const app = express();
const router = require("./routes/admin");
const refreshRouter = require("./routes/refreshToken");
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use("/api/v1/admin", router);
app.use("/api/v1/admin", refreshRouter);

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
