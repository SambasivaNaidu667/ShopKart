const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlist.controller");
const protect = require("../middlewares/auth.middleware");

// All wishlist endpoints are protected
router.post("/:productId", protect, wishlistController.addToWishlist);
router.get("/", protect, wishlistController.getWishlist);
router.delete("/:productId", protect, wishlistController.removeFromWishlist);
router.patch("/:productId/toggle", protect, wishlistController.toggleWishlist);

module.exports = router;
