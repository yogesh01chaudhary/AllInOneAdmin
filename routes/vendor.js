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
} = require("../controllers/vendor");
const { auth } = require("../middleware/auth");
const { isAdmin } = require("../middleware/isAdmin");
const router = express.Router();

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

router.get("/nearbyVendors", auth, isAdmin, nearbyVendors);
router.get("/sendNotification/", auth, isAdmin, sendNotification);

router.get("/vendorsForUser/", auth, isAdmin, getVendorsForUser);
router.get("/getVendorLocation", auth, isAdmin, getVendorLocation);

module.exports = router;
