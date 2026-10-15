const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const protect = require("../middlewares/auth.middleware");

// All order endpoints are protected
router.post("/create-payment-order", protect, orderController.createPaymentOrder);
router.post("/verify-payment", protect, orderController.verifyPayment);
router.get("/", protect, orderController.getOrders);
router.get("/:id", protect, orderController.getOrderById);

// Bonus: Order status progression endpoint
router.patch("/:id/status", protect, orderController.updateOrderStatus);

module.exports = router;
