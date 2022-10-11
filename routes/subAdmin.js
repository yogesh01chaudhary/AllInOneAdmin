const express = require("express");
const {
  addSubAdmin,
  getAllSubAdmin,
  getSubAdmin,
  updateSubAdmin,
  deleteSubAdmin,
  deleteAllSubAdmin,
} = require("../controllers/subAdmin");
const { auth } = require("../middleware/auth");
const { isAdmin } = require("../middleware/isAdmin");
const router = express.Router();

router.post("/subAdmin", auth, isAdmin, addSubAdmin);
router.get("/subAdminAll", auth, isAdmin, getAllSubAdmin);
router.get("/subAdmin", auth, isAdmin, getSubAdmin);
router.put("/subAdmin", auth, isAdmin, updateSubAdmin);
router.delete("/subAdmin", auth, isAdmin, deleteSubAdmin);
router.delete("/subAdminAll", auth, isAdmin, deleteAllSubAdmin);

module.exports = router;
