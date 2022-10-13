const express = require("express");
const {
  getUsers,
  getVendors,
  acceptRequest,
  rejectRequest,
  getRejected,
  getAccepted,
  getPending,
} = require("../controllers/admin");
const {
  addSubAdmin,
  getAllSubAdmin,
  getSubAdmin,
  updateSubAdmin,
  deleteSubAdmin,
  deleteAllSubAdmin,
  loginSubAdmin,
} = require("../controllers/subAdmin");

const { auth } = require("../middleware/auth");
const { isAdmin, isSubAdmin } = require("../middleware/isAdmin");

const router = express.Router();

//admin
router.post("/subAdmin", auth, isAdmin, addSubAdmin);
router.get("/subAdminAll", auth, isAdmin, getAllSubAdmin);
router.get("/subAdmin", auth, isAdmin, getSubAdmin);
router.put("/subAdmin", auth, isAdmin, updateSubAdmin);
router.delete("/subAdmin", auth, isAdmin, deleteSubAdmin);
router.delete("/subAdminAll", auth, isAdmin, deleteAllSubAdmin);

//subAdmin
router.post("/subAdmin/login", loginSubAdmin);
router.get("/subAdmin/getUsers", auth, isSubAdmin, getUsers);
router.get("/subAdmin/getVendors", auth, isSubAdmin, getVendors);
router.put("/subAdmin/acceptRequest", auth, isSubAdmin, acceptRequest);
router.put("/subAdmin/rejectRequest", auth, isSubAdmin, rejectRequest);
router.get("/subAdmin/getRejected", auth, isSubAdmin, getRejected);
router.get("/subAdmin/getAccepted", auth, isSubAdmin, getAccepted);
router.get("/subAdmin/getPending", auth, isSubAdmin, getPending);

module.exports = router;
