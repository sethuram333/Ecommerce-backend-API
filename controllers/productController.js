const product = require("../models/product");

// add products
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const addedProduct = await product.create({
      name,
      description,
      price,
      category,
      stock,
    });
    if (addedProduct) {
      return res.status(201).json({
        success: true,
        message: "Prdoduct added!",
        data: addedProduct,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "please provide all the fields!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};
// update product
const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (updatedProduct) {
      return res.status(201).json({
        success: true,
        message: "Product updated!",
        data: updatedProduct,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};
// add products
const removeProduct = async (req, res) => {
  try {
    const deletedProduct = await product.findByIdAndDelete(req.params.id);
    if (deletedProduct) {
      return res.status(201).json({
        success: true,
        message: "Product deleted!",
        data: deletedProduct,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "provide valid ID!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};
// add products
const viewAllProduct = async (req, res) => {
  try {
    const products = await product.find()
    if(products){
        return res.status(201).json({
            success:true,
            message:'view all products',
            products:products
        })
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};
// add products
const viewSingleProduct = async (req, res) => {
  try {
    const viewProduct = await product.findById(req.params.id)
    if(viewProduct){
        return res.status(201).json({
            success:true,
            message:'view product',
            product:viewProduct
        })
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

module.exports = {
  addProduct,
  updateProduct,
  removeProduct,
  viewAllProduct,
  viewSingleProduct,
};
