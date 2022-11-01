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
  addSubAdmin,
  getAllSubAdmin,
  getSubAdmin,
  updateSubAdmin,
  deleteSubAdmin,
  deleteAllSubAdmin,
  getVendorsServiceRequest,
  grantServicesToVendorById,
  sendRequestToVendors,
  getVendorsService,
} = require("../controllers/admin");

const { auth } = require("../middleware/auth");
const { isAdmin, isSubAdmin } = require("../middleware/isAdmin");

// router.post("/signUpAdmin", signUpAdmin);
router.post("/loginAdmin", loginAdmin);
router.get("/getUsers", auth, isAdmin, getUsers);

//*************************************vendors************************************************************************************* */
router.get("/getVendors", auth, isAdmin, getVendors);
router.put("/acceptRequest", auth, isAdmin, acceptRequest);
router.put("/rejectRequest", auth, isAdmin, rejectRequest);
router.get("/getRejected", auth, isAdmin, getRejected);
router.get("/getAccepted", auth, isAdmin, getAccepted);
router.get("/getPending", auth, isAdmin, getPending);
router.get(
  "/getVendorsServiceRequest",
  auth,
  isAdmin,
  getVendorsServiceRequest
);
router.get(
  "/vendorsService/:serviceId",
  auth,
  isAdmin,
  getVendorsService
);
router.put("/grantServicesToVendor", auth, isAdmin, grantServicesToVendorById);

//***************************************subAdmin******************************************************************************** */
router.post("/subAdmin", auth, isAdmin, addSubAdmin);
router.get("/subAdminAll", auth, isAdmin, getAllSubAdmin);
router.get("/subAdmin", auth, isAdmin, getSubAdmin);
router.put("/subAdmin", auth, isAdmin, updateSubAdmin);
router.delete("/subAdmin", auth, isAdmin, deleteSubAdmin);
router.delete("/subAdminAll", auth, isAdmin, deleteAllSubAdmin);

router.post("/sendRequestToVendors",sendRequestToVendors)

module.exports = router;
