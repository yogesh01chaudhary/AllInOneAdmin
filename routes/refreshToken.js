const express = require("express");
const router=express.Router()
const { refreshToken } = require("../controllers/refreshToken");

router.post("/refreshtoken", refreshToken);

module.exports = router;
