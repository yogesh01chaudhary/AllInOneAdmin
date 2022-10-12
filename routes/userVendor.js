const express = require("express");
const { getVendorsService } = require("../controllers/userVendor");
const router = express.Router();

//user
router.get("/vendorsService", getVendorsService);

module.exports = router;
