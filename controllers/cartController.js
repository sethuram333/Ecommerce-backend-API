const Cart = require("../models/cart");
const Product = require("../models/product");
const User = require("../models/user");
//add to cart
const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "product not found",
      });
    }
    // check that quantity avalilable in product stock
    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available`,
      });
    }
    //  check cart is exist
    const existCart = await Cart.findOne({
      user: userId,
      productItem: productId,
    });
    if (existCart) {
      return res.status(400).json({
        message: "item has already in cart",
      });
    }
    const createCart = await Cart.create({
      user: userId,
      productItem: productId,
      quantity,
      totalAmount: quantity * product.price,
    });
    if (createCart) {
      return res.status(201).json({
        success: true,
        message: "Cart Added!",
        data: createCart,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
//remove from cart
const removeFromCart = async (req, res) => {
  try {
    const removeCart = await Cart.findByIdAndDelete(req.params.id);
    if (removeCart) {
      return res.status(201).json({
        success: true,
        message: "cart removed",
        data: removeCart,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//view cart
const viewCart = async (req, res) => {
  try {
    // 1. Get all cart items
    const allItems = await Cart.find()
      .populate('user', 'name')
      .populate('productItem', 'name price');

    // 2. If no items, return empty
    if (allItems.length === 0) {
      return res.json({
        success: true,
        message: "No items found",
        userCarts: []
      });
    }

    // 3. Prepare final array
    const allUserCarts = [];

    // 4. Process each item one by one
    for (let i = 0; i < allItems.length; i++) {
      const item = allItems[i];
      const userId = item.user._id.toString();
      
      // Check if we already have this user in our array
      let userCart = allUserCarts.find(cart => cart.userId === userId);
      
      // If not, create new user cart
      if (!userCart) {
        userCart = {
          userId: userId,
          userName: item.user.name,
          items: [],
          grandTotal: 0
        };
        allUserCarts.push(userCart);
      }
      
      // Calculate item total
      const itemTotal = item.quantity * item.productItem.price;
      
      // Add to user's cart
      userCart.items.push({
        productName: item.productItem.name,
        quantity: item.quantity,
        price: item.productItem.price,
        itemTotal: itemTotal
      });
      
      // Add to user's total
      userCart.grandTotal += itemTotal;
    }

    
    res.status(200).json({
      success: true,
      message: "list User carts",
      userCarts: allUserCarts
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error getting carts"
    });
  }
};
//update quantity
const updateCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    if (!userId || !productId || quantity === undefined || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid input",
      });
    }
    // Check user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // Check product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check stock availability with qiven quantity
    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available`,
      });
    }
    // Check if cart item already exists
    let cartItem = await Cart.findOne({
      user: userId,
      productItem: productId,
    });

    if (cartItem) {
      // Update existing cart item
      cartItem.quantity = quantity;
      cartItem.totalAmount = quantity * product.price;
      await cartItem.save();

      return res.status(200).json({
        success: true,
        message: "Cart updated successfully",
        data: cartItem,
      });
    } else {
      // Create new cart item
      const newCartItem = await Cart.create({
        user: userId,
        productItem: productId,
        quantity,
        totalAmount: quantity * product.price,
      });

      return res.status(201).json({
        success: true,
        message: "Item added to cart",
        data: newCartItem,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
module.exports = {
  addToCart,
  removeFromCart,
  viewCart,
  updateCart,
};
