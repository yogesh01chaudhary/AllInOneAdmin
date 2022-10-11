const express = require("express");
const { addServicePrice } = require("../controllers/servicePrice");
const router = express.Router();

//vendor
router.post("/price", addServicePrice);
module.exports = router;
