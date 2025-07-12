const express = require("express");
const router = express.Router();
const {
  createDirectOrder,
  createBulkOrder,
  updatePayment,
  listOrders,
} = require("../controllers/orderController");

// Create direct order
router.post("/", createDirectOrder);

// Create bulk order from cart
router.post("/bulkorder", createBulkOrder);

// Update payment status
router.patch("/payment/:orderId", updatePayment);

// List user orders
router.get("/:userId", listOrders);

module.exports = router;

