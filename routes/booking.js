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
const { auth } = require("../middleware/auth");
const { isAdmin } = require("../middleware/isAdmin");
const router = express.Router();

//admin
router.get("/booking",auth,isAdmin, getBooking);
router.get("/bookingPending",auth,isAdmin, getPending);
router.get("/bookingAccepted", auth,isAdmin,getAccepted);
router.get("/bookingRejected",auth,isAdmin, getRejected);
router.get("/bookingCancelled",auth,isAdmin, getCancelled);
router.get("/bookingCompleted",auth,isAdmin, getCompleted);

//vendor
router.put("/accept", accept);
router.put("/reject", reject);
router.put("/complete", complete);

//user
router.post("/booking", addBooking);
router.put("/cancel", cancel);

module.exports = router;
