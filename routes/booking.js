const express = require("express");
const {
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
} = require("../controllers/booking");
const router = express.Router();

router.post("/booking", addBooking);
router.get("/booking", getBooking);
router.get("/bookingPending", getPending);
router.get("/bookingAccepted", getAccepted);
router.get("/bookingRejected", getRejected);
router.get("/bookingCancelled", getCancelled);
router.get("/bookingCompleted", getCompleted);
router.put("/accept/:id", accept);
router.put("/reject/:id", reject);
router.put("/cancel/:id", cancel);
router.put("/complete/:id", complete);

module.exports = router;
