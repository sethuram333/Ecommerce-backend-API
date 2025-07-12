const express = require("express");
const router = express.Router();

const {
  addProduct,
  updateProduct,
  removeProduct,
  viewAllProduct,
  viewSingleProduct,
} = require("../controllers/productController");
const auth = require("../middleware/authMiddleware");
//add product || post
router.post("/add", auth, addProduct);
//update product || put
router.put("/update/:id", auth, updateProduct);
//delete product || delete
router.delete("/remove/:id", auth, removeProduct);
//get all products || get
router.get("/", auth, viewAllProduct);
//get single product || get
router.get("/:id", auth, viewSingleProduct);

module.exports = router;
