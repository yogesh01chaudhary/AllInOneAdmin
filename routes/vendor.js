const express = require("express");
const {
  getVendors,
  rejectRequest,
  acceptRequest,
  getRejected,
  getAccepted,
  getPending,
  nearbyVendors,
  sendNotification,
  getVendorsForUser,
  getVendorLocation,
  getVendorsRequestedService,
  grantServicesToVendor,
  leaveApproved,
  leaveDisapproved,
  emergencyLeaveApproved,
  emergencyLeaveDisapproved,
  getVendorsAppliedForLeave,
} = require("../controllers/vendor");
const { auth } = require("../middleware/auth");
const { isAdmin } = require("../middleware/isAdmin");
const router = express.Router();

// **********************************basicRoutes**********************************************************************************//
router.get("/getVendors", auth, isAdmin, getVendors);
router.put("/acceptRequest", auth, isAdmin, acceptRequest);
router.put("/rejectRequest", auth, isAdmin, rejectRequest);
router.get("/getRejected", auth, isAdmin, getRejected);
router.get("/getAccepted", auth, isAdmin, getAccepted);
router.get("/getPending", auth, isAdmin, getPending);

// **********************************vendorsRequestedForServiceAdminGrantHimAccess***********************************************************************************//
router.get(
  "/vendorsRequestedService",
  auth,
  isAdmin,
  getVendorsRequestedService
);
router.put("/grantServicesToVendor/:id", auth, isAdmin, grantServicesToVendor);

// **********************************findNearbyVendorsAndSendNotification********************************************************************************//
router.get("/nearbyVendors", auth, isAdmin, nearbyVendors);
router.get("/sendNotification/", auth, isAdmin, sendNotification);

// ************************************findNearbtyVendorsExtra***************************************************************************************//
router.get("/vendorsForUser/", auth, isAdmin, getVendorsForUser);
router.get("/getVendorLocation", auth, isAdmin, getVendorLocation);

// ************************************LEAVE***************************************************************************************//
router.get("/getVendorsAppliedLeave", auth, isAdmin, getVendorsAppliedForLeave);
router.put("/leaveApproved", auth, isAdmin, leaveApproved);
router.put("/leaveDisapproved", auth, isAdmin, leaveDisapproved);
router.put("/emergencyLeaveApproved", auth, isAdmin, emergencyLeaveApproved);
router.put("/emergencyLeaveDisapproved", auth, isAdmin, emergencyLeaveDisapproved);

module.exports = router;
