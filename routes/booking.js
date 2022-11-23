const express = require("express");
const {
  getBookingsAdmin,
  getBookingAdmin,
  getCompletedBookings,
  getConfirmedBookings,
  getCancelledBookings,
  getPendingBookings,
} = require("../controllers/booking");

const { auth } = require("../middleware/auth");
const { isAdmin } = require("../middleware/isAdmin");
const router = express.Router();

//*************************************ADMIN******************************************************************************************//

router.get("/bookings", auth, isAdmin, getBookingsAdmin);
router.get("/booking/:bookingId", auth, isAdmin, getBookingAdmin);
router.get("/bookings/completed", auth, isAdmin, getCompletedBookings);
router.get("/bookings/cancelled", auth, isAdmin, getCancelledBookings);
router.get("/bookings/confirmed", auth, isAdmin, getConfirmedBookings);
router.get("/bookings/pending", auth, isAdmin, getPendingBookings);

module.exports = router;
