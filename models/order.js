const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID required"],
    },
    orders: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product ID required"],
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          max: 10,
        },
        totalAmount: {
          type: Number,
          required: true,
        },
        shippingAddress: String,
        paymentMethod: String,
        paymentStatus: {
          type: String,
          enum: ["pending", "completed", "failed", "refunded"],
          default: "pending",
        },
      },
    ],
    grandTotal: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["creditcard", "cash on delivery", "paytm", "G-pay", "phone-pay"],
      default: "cash on delivery",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
