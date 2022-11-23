const express = require("express");
const router = express.Router();

const {
  loginAdmin,
  getUsers,
  addSubAdmin,
  getAllSubAdmin,
  getSubAdmin,
  updateSubAdmin,
  deleteSubAdmin,
  deleteAllSubAdmin,
  updateImageUrl,
  s3Url1,
  deleteImageUrl,
} = require("../controllers/admin");

const { auth } = require("../middleware/auth");
const { isAdmin, isSubAdmin } = require("../middleware/isAdmin");

//*************************************admin************************************************************************************* */
// router.post("/signUpAdmin", signUpAdmin);
router.post("/loginAdmin", loginAdmin);
router.get("/s3Url1", auth, isAdmin, s3Url1);
router.put("/imageUrl", auth, isAdmin, updateImageUrl);
router.delete("/imageUrl", auth, isAdmin, deleteImageUrl);

//*************************************users************************************************************************************* */
router.get("/getUsers", auth, isAdmin, getUsers);

//***************************************subAdmin******************************************************************************** */
router.post("/subAdmin", auth, isAdmin, addSubAdmin);
router.get("/subAdminAll", auth, isAdmin, getAllSubAdmin);
router.get("/subAdmin", auth, isAdmin, getSubAdmin);
router.put("/subAdmin", auth, isAdmin, updateSubAdmin);
router.delete("/subAdmin", auth, isAdmin, deleteSubAdmin);
router.delete("/subAdminAll", auth, isAdmin, deleteAllSubAdmin);


module.exports = router;
