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
  updateImageUrl,
  s3Url1,
  deleteImageUrl,
  getVendorsRequestedService,
  grantServicesToVendor,
  getVendorsForUser,
  sendNotification,
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

//*************************************vendors************************************************************************************* */
router.get("/getVendors", auth, isAdmin, getVendors);
router.put("/acceptRequest", auth, isAdmin, acceptRequest);
router.put("/rejectRequest", auth, isAdmin, rejectRequest);
router.get("/getRejected", auth, isAdmin, getRejected);
router.get("/getAccepted", auth, isAdmin, getAccepted);
router.get("/getPending", auth, isAdmin, getPending);
router.get(
  "/vendorsRequestedService",
  auth,
  isAdmin,
  getVendorsRequestedService
);
router.put("/grantServicesToVendor/:id", auth, isAdmin, grantServicesToVendor);
router.get("/vendorsForUser/", auth, isAdmin, getVendorsForUser);
router.get("/sendNotification/", auth, isAdmin, sendNotification);

//***************************************subAdmin******************************************************************************** */
router.post("/subAdmin", auth, isAdmin, addSubAdmin);
router.get("/subAdminAll", auth, isAdmin, getAllSubAdmin);
router.get("/subAdmin", auth, isAdmin, getSubAdmin);
router.put("/subAdmin", auth, isAdmin, updateSubAdmin);
router.delete("/subAdmin", auth, isAdmin, deleteSubAdmin);
router.delete("/subAdminAll", auth, isAdmin, deleteAllSubAdmin);

router.post("/sendRequestToVendors", sendRequestToVendors);

module.exports = router;
