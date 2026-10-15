import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Tag,
  ShieldCheck,
  Truck,
  RotateCcw,
  ChevronRight,
  Zap,
} from "lucide-react";
import { getProductById } from "../services/api";
import { useShop } from "../context/ShopContext";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useShop();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProductById(id);
      if (data && data.product) {
        setProduct(data.product);
      } else {
        setProduct(data);
      }
    } catch (err) {
      console.error("Fetch product details error:", err);
      setError(
        err.response?.data?.message || err.message || "Product not found or unavailable."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <div className="product-details-page">
        <div className="details-container">
          <div className="loading-screen">
            <div className="loading-spinner-large"></div>
            <div className="loading-text">Loading product details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-details-page">
        <div className="details-container">
          <button onClick={() => navigate(-1)} className="btn-back-nav">
            <ArrowLeft size={16} />
            <span>Go Back</span>
          </button>
          <div className="error-state-container">
            <div className="error-icon-wrap">
              <AlertTriangle size={36} />
            </div>
            <h2 className="error-title">Product Not Found</h2>
            <p className="error-description">{error || "The requested product does not exist."}</p>
            <Link to="/products" className="btn-retry">
              <span>Return to Catalog</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { _id, name, price, category, image, stock, description } = product;
  const savedInWishlist = isInWishlist(_id);

  // Format price
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

  // Stock Badge
  let stockAlert;
  if (stock <= 0) {
    stockAlert = (
      <span className="stock-alert stock-danger">
        <XCircle size={16} /> Out of Stock
      </span>
    );
  } else if (stock <= 5) {
    stockAlert = (
      <span className="stock-alert stock-warning">
        <AlertTriangle size={16} /> Only {stock} units left in stock!
      </span>
    );
  } else {
    stockAlert = (
      <span className="stock-alert stock-success">
        <CheckCircle2 size={16} /> In Stock ({stock} available)
      </span>
    );
  }

  const handleAddToCart = async () => {
    if (stock <= 0) return;
    setAdding(true);
    await addToCart(product, 1);
    setTimeout(() => setAdding(false), 500);
  };

  const handleBuyNow = async () => {
    if (stock <= 0) return;
    await addToCart(product, 1);
    navigate("/checkout");
  };

  return (
    <div className="product-details-page">
      <div className="details-container">
        {/* Navigation & Breadcrumbs */}
        <div className="details-nav-bar">
          <button onClick={() => navigate(-1)} className="btn-back-nav">
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          <div className="breadcrumbs">
            <Link to="/products">Products</Link>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <span>{category}</span>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <span className="breadcrumb-current">{name}</span>
          </div>
        </div>

        {/* Product Details Layout */}
        <div className="product-details-card">
          {/* Image Column */}
          <div className="product-details-image-section">
            <div className="large-image-wrapper">
              <img
                src={image}
                alt={name}
                className="product-detail-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=60";
                }}
              />
              <span className="category-floating-badge">
                <Tag size={14} />
                <span>{category}</span>
              </span>
            </div>
          </div>

          {/* Info Column */}
          <div className="product-details-info-section">
            <div>
              <span className="product-badge-tier">Verified Product</span>
              <h1 className="product-detail-title">{name}</h1>

              <div className="product-pricing-box">
                <span className="price-display">{formattedPrice}</span>
                <span className="price-tax-label">Inclusive of all taxes</span>
              </div>

              <div className="stock-status-row">{stockAlert}</div>

              <div className="product-description-block">
                <div className="section-subtitle">Description</div>
                <p className="product-detail-description">
                  {description || "High quality product crafted with precision for ShopKart customers."}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div>
              <div className="product-actions-block">
                <button
                  onClick={handleAddToCart}
                  disabled={stock <= 0 || adding}
                  className="btn-add-to-cart"
                >
                  <ShoppingCart size={18} />
                  <span>{adding ? "Adding to Cart..." : "Add to Cart"}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={stock <= 0}
                  className="btn-secondary-continue"
                  style={{ background: "#4f46e5", color: "white", borderColor: "#4f46e5" }}
                >
                  <Zap size={18} />
                  <span>Buy Now</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`btn-secondary-continue ${savedInWishlist ? "wishlisted" : ""}`}
                  title={savedInWishlist ? "Remove from Wishlist" : "Save to Wishlist"}
                >
                  <Heart
                    size={18}
                    fill={savedInWishlist ? "#ef4444" : "none"}
                    color={savedInWishlist ? "#ef4444" : "currentColor"}
                  />
                  <span>{savedInWishlist ? "Saved" : "Wishlist"}</span>
                </button>
              </div>

              {/* Perks Row */}
              <div className="product-perks-row">
                <div className="perk-mini">
                  <Truck size={18} />
                  <div>
                    <div className="perk-mini-title">Fast Delivery</div>
                    <div className="perk-mini-sub">Dispatched in 24 hrs</div>
                  </div>
                </div>
                <div className="perk-mini">
                  <ShieldCheck size={18} />
                  <div>
                    <div className="perk-mini-title">ShopKart Warranty</div>
                    <div className="perk-mini-sub">1 Year guarantee</div>
                  </div>
                </div>
                <div className="perk-mini">
                  <RotateCcw size={18} />
                  <div>
                    <div className="perk-mini-title">Easy Returns</div>
                    <div className="perk-mini-sub">7-Day return policy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
