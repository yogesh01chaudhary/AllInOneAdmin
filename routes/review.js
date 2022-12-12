const express = require("express");
const { getAllReviews, getReviewsByVendor, getReviewsByUser } = require("../controllers/review");
const { auth } = require("../middleware/auth");
const { isAdmin } = require("../middleware/isAdmin");
const router = express.Router();

router.get("/allReviews", auth, isAdmin, getAllReviews);
router.get("/reviewsByVendor", auth, isAdmin, getReviewsByVendor);
router.get("/reviewsByUser", auth, isAdmin, getReviewsByUser);

module.exports = router;
