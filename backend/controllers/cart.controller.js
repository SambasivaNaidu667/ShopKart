const mongoose = require("mongoose");
const Customer = require("../models/customer.model");
const Product = require("../models/product.model");


exports.addToCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity = 1 } = req.body;

    const numQuantity = Number(quantity);
    if (isNaN(numQuantity) || numQuantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a valid number and at least 1",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // Verify product exists and check stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const customer = await Customer.findById(req.user._id);
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Customer not found",
      });
    }

    const existingItemIndex = customer.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    let newQuantity = numQuantity;
    if (existingItemIndex > -1) {
      newQuantity = customer.cart[existingItemIndex].quantity + numQuantity;
    }

    // Validate stock limits
    if (newQuantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Requested quantity (${newQuantity}) exceeds available stock (${product.stock})`,
      });
    }

    if (existingItemIndex > -1) {
      customer.cart[existingItemIndex].quantity = newQuantity;
    } else {
      customer.cart.push({
        product: product._id,
        quantity: numQuantity,
      });
    }

    await customer.save();

    // Populate and return updated cart
    const updatedCustomer = await Customer.findById(req.user._id).populate({
      path: "cart.product",
      select: "_id name price image stock category",
    });

    return res.status(200).json({
      success: true,
      message: "Cart updated",
      cart: updatedCustomer.cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to add product to cart",
    });
  }
};

// GET /cart - Get Current User's Cart with Populated Product (Task 3)
exports.getCart = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user._id).populate({
      path: "cart.product",
      select: "_id name price image stock category",
    });

    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Filter out items whose referenced products were removed
    const validCart = (customer.cart || []).filter((item) => item.product !== null);

    return res.status(200).json({
      success: true,
      cart: validCart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch cart",
    });
  }
};

// PATCH /cart/:productId - Update Product Quantity (Task 4)
exports.updateQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || quantity === null) {
      return res.status(400).json({
        success: false,
        message: "Quantity is required",
      });
    }

    const numQuantity = Number(quantity);
    if (isNaN(numQuantity) || numQuantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a number and at least 1",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (numQuantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Quantity (${numQuantity}) cannot exceed product stock (${product.stock})`,
      });
    }

    const customer = await Customer.findById(req.user._id);
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Customer not found",
      });
    }

    const itemIndex = customer.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not in cart",
      });
    }

    customer.cart[itemIndex].quantity = numQuantity;
    await customer.save();

    const updatedCustomer = await Customer.findById(req.user._id).populate({
      path: "cart.product",
      select: "_id name price image stock category",
    });

    return res.status(200).json({
      success: true,
      message: "Cart updated",
      cart: updatedCustomer.cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update quantity",
    });
  }
};

// DELETE /cart/:productId - Remove Product from Cart (Task 5)
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const customer = await Customer.findById(req.user._id);
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Customer not found",
      });
    }

    const itemIndex = customer.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not in cart",
      });
    }

    customer.cart.splice(itemIndex, 1);
    await customer.save();

    const updatedCustomer = await Customer.findById(req.user._id).populate({
      path: "cart.product",
      select: "_id name price image stock category",
    });

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart: updatedCustomer.cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to remove product from cart",
    });
  }
};
