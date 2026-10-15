import React from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Tag,
} from "lucide-react";
import { useShop } from "../context/ShopContext";

export default function Wishlist() {
  const { wishlistItems, toggleWishlist, addToCart, wishlistInitialLoading, wishlistLoading } = useShop();

  // Loading state: Show polite loading spinner while fetching from database
  if (wishlistInitialLoading || wishlistLoading) {
    return (
      <div className="products-page">
        <div className="products-container" style={{ paddingTop: "4rem" }}>
          <div className="loading-screen">
            <div className="loading-spinner-large"></div>
            <div className="loading-text" style={{ marginTop: "1rem", color: "#64748b", fontWeight: 500 }}>
              Fetching your wishlist items...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Task 7: Empty Wishlist State (only shown after fetch completes with 0 items)
  if (wishlistItems.length === 0) {
    return (
      <div className="products-page">
        <div className="products-container" style={{ paddingTop: "3rem" }}>
          <div className="empty-state-container">
            <div className="empty-icon-wrap" style={{ background: "#fef2f2", color: "#ef4444" }}>
              <Heart size={40} fill="#ef4444" />
            </div>
            <h2 className="empty-title">Your Wishlist is Empty</h2>
            <p className="empty-description">
              Save products you love by clicking the heart icon on any product card, and find them here anytime.
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

  return (
    <div className="products-page">
      {/* Header */}
      <div className="products-hero" style={{ padding: "2rem 1.5rem" }}>
        <div className="products-hero-content">
          <span className="products-hero-badge" style={{ color: "#e11d48", borderColor: "#fecdd3" }}>
            <Heart size={14} fill="#e11d48" /> My Saved Wishlist
          </span>
          <h1 className="products-hero-title">Your Saved Favourites</h1>
          <p className="products-hero-subtitle">
            You have <strong>{wishlistItems.length}</strong> {wishlistItems.length === 1 ? "item" : "items"} in your wishlist.
          </p>
        </div>
      </div>

      <div className="products-container">
        <div className="products-grid">
          {wishlistItems.map((product) => {
            const { _id, name, price, category, image, stock } = product;

            const formattedPrice = new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            }).format(price || 0);

            return (
              <div key={_id} className="product-card">
                <div className="product-card-image-wrap">
                  <img
                    src={image}
                    alt={name}
                    className="product-card-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=60";
                    }}
                  />
                  <span className="product-category-tag">
                    <Tag size={12} />
                    <span>{category}</span>
                  </span>

                  <button
                    className="wishlist-heart-btn active"
                    onClick={() => toggleWishlist(product)}
                    title="Remove from Wishlist"
                  >
                    <Trash2 size={16} color="#ef4444" />
                  </button>
                </div>

                <div className="product-card-body">
                  <h3 className="product-card-title">{name}</h3>

                  <div className="product-card-meta">
                    <div className="product-card-price">{formattedPrice}</div>
                    <div className="product-card-stock">
                      {stock > 0 ? (
                        <span className="stock-badge in-stock">{stock} in stock</span>
                      ) : (
                        <span className="stock-badge out-of-stock">Out of stock</span>
                      )}
                    </div>
                  </div>

                  <div className="product-card-actions">
                    <button
                      onClick={() => addToCart(product, 1)}
                      disabled={stock <= 0}
                      className="btn-add-cart-card"
                    >
                      <ShoppingCart size={16} />
                      <span>Add to Cart</span>
                    </button>

                    <Link to={`/products/${_id}`} className="btn-view-details">
                      <span>View</span>
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
