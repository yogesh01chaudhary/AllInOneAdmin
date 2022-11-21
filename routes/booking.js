const express = require("express");
const {
  getBookingsAdmin,
  getBookingAdmin,
  nearbyVendors,
  getVendorLocation,
  getCartAdmin,
  getCartsAdmin,
  addBooking,
  getBooking,
  getPending,
  getAccepted,
  getRejected,
  getCancelled,
  accept,
  reject,
  cancel,
  complete,
  getCompleted,
  sendNotification,
  getVendorsForUser,
} = require("../controllers/booking");

const { auth } = require("../middleware/auth");
const { isAdmin } = require("../middleware/isAdmin");
const router = express.Router();

//*************************************ADMIN******************************************************************************************//

router.get("/bookings", auth, isAdmin, getBookingsAdmin);
router.get("/booking/:bookingId", auth, isAdmin, getBookingAdmin);

router.get("/nearbyVendors", auth, isAdmin, nearbyVendors);
router.get("/sendNotification/", auth, isAdmin, sendNotification);

router.get("/vendorsForUser/", auth, isAdmin, getVendorsForUser);
router.get("/getVendorLocation", auth, isAdmin, getVendorLocation);

router.get("/carts", auth, isAdmin, getCartsAdmin);
router.get("/cart/:id", auth, isAdmin, getCartAdmin);

// will work later
router.get("/booking", auth, isAdmin, getBooking);
router.get("/bookingPending", auth, isAdmin, getPending);
router.get("/bookingAccepted", auth, isAdmin, getAccepted);
router.get("/bookingRejected", auth, isAdmin, getRejected);
router.get("/bookingCancelled", auth, isAdmin, getCancelled);
router.get("/bookingCompleted", auth, isAdmin, getCompleted);

//vendor
router.put("/accept", accept);
router.put("/reject", reject);
router.put("/complete", complete);

//user
router.post("/booking", addBooking);
router.put("/cancel", cancel);

module.exports = router;
