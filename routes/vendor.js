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
  getLoggedInVendors,
  getLoggedOutVendors,
  checkTimingOfVendors,
  checkTimingOfVendor,
  checkVendorOnDutyStatus,
  getBookingNearbyVendors,
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
router.get("/nearbyVendors/:bookingId", auth, isAdmin, nearbyVendors);
router.put("/sendNotification", auth, isAdmin, sendNotification);

// *********************************getNearByVendorsFoundedForABookingFromnearbyCollection********************************************************************************//
router.get("/bookingNearbyVendors/:bookingId", auth, isAdmin, getBookingNearbyVendors);

// ************************************findNearbtyVendorsExtra*********not_in_use******************************************************************************//
router.get("/vendorsForUser/", auth, isAdmin, getVendorsForUser);
router.get("/getVendorLocation", auth, isAdmin, getVendorLocation);

// ************************************LEAVE***************************************************************************************//
router.get("/getVendorsAppliedLeave", auth, isAdmin, getVendorsAppliedForLeave);
router.put("/leaveApproved", auth, isAdmin, leaveApproved);
router.put("/leaveDisapproved", auth, isAdmin, leaveDisapproved);
router.put("/emergencyLeaveApproved", auth, isAdmin, emergencyLeaveApproved);
router.put("/emergencyLeaveDisapproved", auth, isAdmin, emergencyLeaveDisapproved);

// ************************************onDutyStatus***************************************************************************************//
router.get("/loggedInVendors", auth, isAdmin, getLoggedInVendors);
router.get("/loggedOutVendors", auth, isAdmin, getLoggedOutVendors);
router.get("/timingOfVendors", auth, isAdmin, checkTimingOfVendors);
router.get("/timingOfVendor", auth, isAdmin, checkTimingOfVendor);
router.get("/onDutyStatus", auth, isAdmin, checkVendorOnDutyStatus);


module.exports = router;
