const express = require("express");
const { addServicePrice, updateServicePrice, deleteServicePrice, getServicePrice } = require("../controllers/servicePrice");
const router = express.Router();

//vendor
router.post("/price", addServicePrice);
router.put("/price", updateServicePrice);
router.delete("/price", deleteServicePrice);
router.get("/price", getServicePrice);
module.exports = router;
