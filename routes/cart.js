const express = require("express");
const { getCartsAdmin, getCartAdmin } = require("../controllers/cart");
const { auth } = require("../middleware/auth");
const { isAdmin } = require("../middleware/isAdmin");
const router = express.Router();

router.get("/carts", auth, isAdmin, getCartsAdmin);
router.get("/cart/:id", auth, isAdmin, getCartAdmin);

module.exports = router;
