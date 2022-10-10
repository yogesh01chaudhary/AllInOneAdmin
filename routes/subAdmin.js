const express = require("express");
const {
  addSubAdmin,
  getAllSubAdmin,
  getSubAdmin,
  updateSubAdmin,
  deleteSubAdmin,
  deleteAllSubAdmin,
} = require("../controllers/subAdmin");
const router = express.Router();

router.post("/subAdmin", addSubAdmin);
router.get("/subAdmin", getAllSubAdmin);
router.get("/subAdmin/:userid", getSubAdmin);
router.put("/subAdmin/:userId", updateSubAdmin);
router.delete("/subAdmin/:userId", deleteSubAdmin);
router.delete("/subAdmin", deleteAllSubAdmin);

module.exports = router;
