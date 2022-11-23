const express = require("express");
const { getVendors, acceptRequest, rejectRequest, getRejected, getAccepted, getPending } = require("../controllers/vendor");
const {
  loginSubAdmin,
  responsibilitiesAllowed,
} = require("../controllers/subAdmin");

const { auth } = require("../middleware/auth");
const { isSubAdmin } = require("../middleware/isAdmin");
const { getUsers } = require("../controllers/admin");

const router = express.Router();

//subAdmin
router.post("/subAdmin/login", loginSubAdmin);
router.get("/subAdmin/getUsers", auth, isSubAdmin, getUsers);
router.get("/subAdmin/getVendors", auth, isSubAdmin, getVendors);
router.put("/subAdmin/acceptRequest", auth, isSubAdmin, acceptRequest);
router.put("/subAdmin/rejectRequest", auth, isSubAdmin, rejectRequest);
router.get("/subAdmin/getRejected", auth, isSubAdmin, getRejected);
router.get("/subAdmin/getAccepted", auth, isSubAdmin, getAccepted);
router.get("/subAdmin/getPending", auth, isSubAdmin, getPending);
router.get(
  "/subAdmin/responsibilities",
  auth,
  isSubAdmin,
  responsibilitiesAllowed
);

module.exports = router;
