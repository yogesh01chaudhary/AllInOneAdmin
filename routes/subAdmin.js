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
router.get("/subAdmin/:id", getSubAdmin);
router.put("/subAdmin/:id", updateSubAdmin);
router.delete("/subAdmin/:id", deleteSubAdmin);
router.delete("/subAdmin", deleteAllSubAdmin);


module.exports = router;
