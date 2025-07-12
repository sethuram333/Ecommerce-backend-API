const Order = require('../models/order');
const Cart = require('../models/cart');
const Product = require('../models/product');

// 1. Create Direct Order (Buy Now)
const createDirectOrder = async (req, res) => {
  try {
    const { userId, productId, quantity, shippingAddress, paymentMethod = "cash on delivery" } = req.body;

    // Validate input
    if (!userId || !productId || !quantity || !shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Create order
    const order = await Order.create({
      user: userId,
      orders: [{
        product: productId,
        quantity,
        totalAmount: quantity * product.price,
        shippingAddress,
        paymentMethod,
        paymentStatus: "pending"
      }],
      grandTotal: quantity * product.price,
      shippingAddress,
      paymentMethod,
      paymentStatus: "pending"
    });

    res.status(201).json({
      success: true,
      message: "order created successfully",
      order
    });

  } catch (error) {
    console.error("Direct order error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// 2. Create Bulk Order from Cart
const createBulkOrder = async (req, res) => {
  try {
    const { userId, shippingAddress, paymentMethod = "cash on delivery" } = req.body;

    // Validate input
    if (!userId || !shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Get cart items
    const cartItems = await Cart.find({ user: userId }).populate('productItem');
    if (!cartItems.length) {
      return res.status(400).json({
        success: false,
        message: "No items in cart"
      });
    }

    // Process items
    let grandTotal = 0;
    const orderItems = cartItems.map(item => {
      const itemTotal = item.quantity * item.productItem.price;
      grandTotal += itemTotal;
      
      return {
        product: item.productItem._id,
        quantity: item.quantity,
        totalAmount: itemTotal,
        shippingAddress,
        paymentMethod,
        paymentStatus: "pending"
      };
    });

    // Create order
    const order = await Order.create({
      user: userId,
      orders: orderItems,
      grandTotal,
      shippingAddress,
      paymentMethod,
      paymentStatus: "pending"
    });

    // Clear cart
    await Cart.deleteMany({ user: userId });

    res.status(201).json({
      success: true,
      message: "Bulk order created successfully",
      order
    });

  } catch (error) {
    console.error("Bulk order error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// 3. Update Payment Status
const updatePayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentStatus } = req.body;

    // Validate input
    if (!["pending", "completed", "failed", "refunded"].includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status"
      });
    }

    // Update order
    const order = await Order.findByIdAndUpdate(
      orderId,
      { 
        paymentStatus,
        'orders.$[].paymentStatus': paymentStatus 
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment status updated",
      order
    });

  } catch (error) {
    console.error("Payment update error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// 4. List Orders by User
const listOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ user: userId })
      .populate('user', 'name email')
      .populate('orders.product', 'name price');

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });

  } catch (error) {
    console.error("List orders error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = {
  createDirectOrder,
  createBulkOrder,
  updatePayment,
  listOrders
};