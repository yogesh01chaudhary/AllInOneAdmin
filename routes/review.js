const express = require("express");
const {
  getAllReviews,
  getReviewsByVendor,
  getReviewsByUser,
  getAllServicesReviews,
  getAllSilverReviews,
  getAllGoldReviews,
  getAllPlatinumReviews,
  getReviewsByService,
  getServicesReviewsByUser,
} = require("../controllers/review");
const { auth } = require("../middleware/auth");
const { isAdmin } = require("../middleware/isAdmin");
const router = express.Router();

router.get("/allReviews", auth, isAdmin, getAllReviews);
router.get("/reviewsByVendor", auth, isAdmin, getReviewsByVendor);
router.get("/reviewsByUser", auth, isAdmin, getReviewsByUser);

router.get("/service/allReviews", auth, isAdmin, getAllServicesReviews);
router.get("/service/allSilverReviews", auth, isAdmin, getAllSilverReviews);
router.get("/service/allGoldReviews", auth, isAdmin, getAllGoldReviews);
router.get("/service/allPlatinumReviews", auth, isAdmin, getAllPlatinumReviews);
router.get("/service/reviewsByService", auth, isAdmin, getReviewsByService);
router.get("/service/reviewsByUser", auth, isAdmin, getServicesReviewsByUser);

module.exports = router;
