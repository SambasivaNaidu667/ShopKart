import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Tag,
  Heart,
  ShoppingCart,
  Check,
} from "lucide-react";
import { useShop } from "../context/ShopContext";

export default function ProductCard({ product }) {
  const { _id, name, price, category, image, stock } = product;
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist, cartItems } = useShop();

  const [adding, setAdding] = useState(false);

  const savedInWishlist = isInWishlist(_id);
  const cartEntry = cartItems.find(
    (item) => (item.product._id || item.product) === _id
  );
  const inCartQty = cartEntry ? cartEntry.quantity : 0;

  // Determine stock badge display
  let stockBadge;
  if (stock <= 0) {
    stockBadge = (
      <span className="stock-badge out-of-stock">
        <XCircle size={13} />
        <span>Out of Stock</span>
      </span>
    );
  } else if (stock <= 5) {
    stockBadge = (
      <span className="stock-badge low-stock">
        <AlertTriangle size={13} />
        <span>Only {stock} left!</span>
      </span>
    );
  } else {
    stockBadge = (
      <span className="stock-badge in-stock">
        <CheckCircle2 size={13} />
        <span>{stock} in stock</span>
      </span>
    );
  }

  // Format price in INR
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (stock <= 0) return;
    setAdding(true);
    await addToCart(product, 1);
    setTimeout(() => setAdding(false), 500);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="product-card" id={`product-card-${_id}`}>
      {/* Product Image & Category Overlay */}
      <div className="product-card-image-wrap">
        <img
          src={image}
          alt={name}
          className="product-card-image"
          loading="lazy"
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

        {/* Wishlist Heart Button */}
        <button
          className={`wishlist-heart-btn ${savedInWishlist ? "active" : ""}`}
          onClick={handleWishlistToggle}
          title={savedInWishlist ? "Remove from Wishlist" : "Save to Wishlist"}
          aria-label="Toggle Wishlist"
        >
          <Heart size={18} fill={savedInWishlist ? "#ef4444" : "none"} color={savedInWishlist ? "#ef4444" : "#64748b"} />
        </button>
      </div>

      {/* Card Body */}
      <div className="product-card-body">
        <h3 className="product-card-title" title={name}>
          {name}
        </h3>

        <div className="product-card-meta">
          <div className="product-card-price" id={`product-price-${_id}`}>
            {formattedPrice}
          </div>
          <div className="product-card-stock" id={`product-stock-${_id}`}>
            {stockBadge}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="product-card-actions">
          <button
            onClick={handleAddToCart}
            disabled={stock <= 0 || adding}
            className={`btn-add-cart-card ${inCartQty > 0 ? "added" : ""}`}
          >
            {adding ? (
              <span>Adding...</span>
            ) : inCartQty > 0 ? (
              <>
                <Check size={16} />
                <span>In Cart ({inCartQty})</span>
              </>
            ) : (
              <>
                <ShoppingCart size={16} />
                <span>Add to Cart</span>
              </>
            )}
          </button>

          <Link
            to={`/products/${_id}`}
            className="btn-view-details"
            id={`btn-view-details-${_id}`}
          >
            <span>View</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
