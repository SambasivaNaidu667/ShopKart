const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const protect = require("../middlewares/auth.middleware");

// All cart endpoints are protected
router.post("/:productId", protect, cartController.addToCart);
router.get("/", protect, cartController.getCart);
router.patch("/:productId", protect, cartController.updateQuantity);
router.delete("/:productId", protect, cartController.removeFromCart);

module.exports = router;
