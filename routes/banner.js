const express = require("express");

const {
  addBanner,
  getAllBanner,
  getBanner,
  updateBanner,
  deleteBanner,
  deleteAllBanner,
} = require("../controllers/banner");

const { auth } = require("../middleware/auth");
const { isAdmin } = require("../middleware/isAdmin");

const router = express.Router();

router.post("/banner", auth, isAdmin, addBanner);
router.get("/banner", auth, isAdmin, getAllBanner);
router.get("/banner/:id", auth, isAdmin, getBanner);
router.put("/banner", auth, isAdmin, updateBanner);
router.delete("/banner", auth, isAdmin, deleteBanner);
router.delete("/bannerAll", auth, isAdmin, deleteAllBanner);

module.exports = router;
