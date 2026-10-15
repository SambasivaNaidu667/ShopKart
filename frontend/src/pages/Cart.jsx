import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { useShop } from "../context/ShopContext";

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, subtotal, cartCount, cartInitialLoading, cartLoading } = useShop();

  // Loading state: Show polite loading spinner while fetching cart from database
  if (cartInitialLoading || cartLoading) {
    return (
      <div className="products-page">
        <div className="products-container" style={{ paddingTop: "4rem" }}>
          <div className="loading-screen">
            <div className="loading-spinner-large"></div>
            <div className="loading-text" style={{ marginTop: "1rem", color: "#64748b", fontWeight: 500 }}>
              Fetching your cart items...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="products-page">
        <div className="products-container" style={{ paddingTop: "3rem" }}>
          <div className="empty-state-container">
            <div className="empty-icon-wrap" style={{ background: "#eef2ff", color: "#4f46e5" }}>
              <ShoppingCart size={40} />
            </div>
            <h2 className="empty-title">Your Cart is Empty</h2>
            <p className="empty-description">
              Looks like you haven't added any products to your cart yet. Explore our product catalog and start shopping!
            </p>
            <Link to="/products" className="btn-empty-reset" style={{ textDecoration: "none" }}>
              <ShoppingBag size={18} />
              <span>Browse Products</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formattedSubtotal = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(subtotal);

  return (
    <div className="cart-page-wrapper">
      <div className="cart-container">
        {/* Header */}
        <div className="cart-header">
          <div>
            <span className="products-hero-badge" style={{ marginBottom: "0.4rem" }}>
              <ShoppingCart size={14} /> ShopKart Cart
            </span>
            <h1 className="cart-title">Shopping Cart</h1>
          </div>
          <div className="cart-count-pill">
            <strong>{cartCount}</strong> {cartCount === 1 ? "item" : "items"}
          </div>
        </div>

        {/* Layout Grid */}
        <div className="cart-layout-grid">
          {/* Items Column */}
          <div className="cart-items-column">
            {cartItems.map((item) => {
              const product = item.product || {};
              const id = product._id || product;
              const { name = "Product", price = 0, category = "General", image, stock = 99 } = product;

              const itemTotal = price * item.quantity;
              const formattedPrice = new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              }).format(price);

              const formattedItemTotal = new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              }).format(itemTotal);

              return (
                <div key={id} className="cart-item-card">
                  {/* Thumbnail */}
                  <img
                    src={image}
                    alt={name}
                    className="cart-item-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=60";
                    }}
                  />

                  {/* Product Details */}
                  <div className="cart-item-details">
                    <Link to={`/products/${id}`} className="cart-item-title">
                      {name}
                    </Link>
                    <div className="cart-item-category">{category}</div>
                    <div className="cart-item-price-unit">{formattedPrice} each</div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="cart-qty-controls">
                    <button
                      onClick={() => updateQuantity(id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="btn-qty"
                      title="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="qty-display">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(id, item.quantity + 1)}
                      disabled={item.quantity >= stock}
                      className="btn-qty"
                      title="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="cart-item-total">{formattedItemTotal}</div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(id)}
                    className="btn-remove-item"
                    title="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Order Summary Sidebar */}
          <div className="cart-summary-card">
            <h2 className="summary-title">Order Summary</h2>

            <div className="summary-row">
              <span>Total Units</span>
              <span>{cartCount}</span>
            </div>

            <div className="summary-row">
              <span>Delivery Fee</span>
              <span className="text-emerald-600 font-semibold">FREE</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row total-row">
              <span>Subtotal</span>
              <span className="total-amount">{formattedSubtotal}</span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="btn-checkout-primary"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>

            <div className="summary-security-note">
              <ShieldCheck size={16} />
              <span>100% Encrypted & Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
