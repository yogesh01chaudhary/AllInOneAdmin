const express = require("express");
const router = express.Router();

const {
  loginAdmin,
  getUsers,
  getVendors,
  rejectRequest,
  acceptRequest,
  getRejected,
  getAccepted,
  getPending,
} = require("../controllers/admin");

const { auth } = require("../middleware/auth");
const { isAdmin, isSubAdmin } = require("../middleware/isAdmin");

// router.post("/signUpAdmin", signUpAdmin);
router.post("/loginAdmin", loginAdmin);
router.get("/getUsers", auth, isAdmin, getUsers);
router.get("/getVendors", auth, isAdmin, getVendors);
router.put("/acceptRequest", auth, isAdmin, acceptRequest);
router.put("/rejectRequest", auth, isAdmin, rejectRequest);
router.get("/getRejected", auth, isAdmin, getRejected);
router.get("/getAccepted", auth, isAdmin, getAccepted);
router.get("/getPending", auth, isAdmin, getPending);

module.exports = router;
