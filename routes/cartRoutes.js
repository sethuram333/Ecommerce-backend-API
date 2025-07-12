const express = require("express");
const router = express.Router();
const {
  addToCart,
  removeFromCart,
  updateCart,
  viewCart,
} = require("../controllers/cartController");
const auth = require('../middleware/authMiddleware')
//add products to cart
router.post("/addtocart",auth,addToCart);
//remove products from cart
router.delete("/removefromcart/:id",auth,removeFromCart);
//update cart
router.post('/cart',auth,updateCart);
//view cart
router.get("/",auth,viewCart);

module.exports = router;

