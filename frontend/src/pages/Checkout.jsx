import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Lock,
  Loader2,
} from "lucide-react";
import { useShop } from "../context/ShopContext";
import * as api from "../services/api";

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, subtotal, clearCart, showToast, user } = useShop();

  // Redirect unauthenticated users
  if (!user) {
    navigate('/login', { replace: true });
    return null;
  }

  const [shipping, setShipping] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  if (cartItems.length === 0) {
    return (
      <div className="products-page">
        <div className="products-container" style={{ paddingTop: "3rem" }}>
          <div className="empty-state-container">
            <h2 className="empty-title">Your Cart is Empty</h2>
            <p className="empty-description">
              Please add products to your cart before proceeding to checkout.
            </p>
            <Link to="/products" className="btn-empty-reset" style={{ textDecoration: "none" }}>
              <span>Return to Products</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const validate = () => {
    const newErrors = {};
    if (!shipping.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }
    if (!shipping.phone.trim() || !/^\d{10}$/.test(shipping.phone.trim())) {
      newErrors.phone = "Enter a valid 10-digit phone number.";
    }
    if (!shipping.addressLine1.trim()) {
      newErrors.addressLine1 = "Address line is required.";
    }
    if (!shipping.city.trim()) {
      newErrors.city = "City is required.";
    }
    if (!shipping.state.trim()) {
      newErrors.state = "State is required.";
    }
    if (!shipping.pincode.trim() || !/^\d{6}$/.test(shipping.pincode.trim())) {
      newErrors.pincode = "Enter a valid 6-digit pincode.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShipping((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Dynamically load Razorpay SDK
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Show Razorpay Modal state
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [activePaymentOrder, setActivePaymentOrder] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState("card");

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setApiError(null);

    try {
      // Call Backend to create order snapshot & razorpay order in MongoDB
      const paymentData = await api.createPaymentOrder(shipping);
      setActivePaymentOrder(paymentData);

      // Try opening real Razorpay modal if public key is active and order is real
      const loaded = await loadRazorpayScript();
      const isMockOrder = paymentData.razorpayOrderId && paymentData.razorpayOrderId.startsWith("order_mock_");
      if (loaded && window.Razorpay && !paymentData.key.includes("mock") && !isMockOrder) {
        const options = {
          key: paymentData.key,
          amount: paymentData.amount,
          currency: paymentData.currency || "INR",
          name: "ShopKart",
          description: "ShopKart Order Payment",
          order_id: paymentData.razorpayOrderId,
          handler: async function (response) {
            await confirmOrder(paymentData.shopKartOrderId, response);
          },
          prefill: {
            name: shipping.fullName,
            contact: shipping.phone,
          },
          theme: { color: "#4f46e5" },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
        setSubmitting(false);
        return;
      }

      // Open the visual Razorpay Test Mode Payment Modal on screen
      setShowRazorpayModal(true);
      setSubmitting(false);
    } catch (err) {
      setApiError(err.response?.data?.message || err.message || "Failed to initiate payment.");
      setSubmitting(false);
    }
  };

  const confirmOrder = async (shopKartOrderId, rzpResponse = {}) => {
    setSubmitting(true);
    try {
      const verifyRes = await api.verifyPayment({
        shopKartOrderId,
        razorpay_order_id: rzpResponse.razorpay_order_id || activePaymentOrder?.razorpayOrderId || "order_test_rzp",
        razorpay_payment_id: rzpResponse.razorpay_payment_id || "pay_" + Math.random().toString(36).substring(2, 10),
        razorpay_signature: rzpResponse.razorpay_signature || "valid_test_signature",
      });

      setShowRazorpayModal(false);
      await clearCart();
      showToast("Payment Successful! Order Confirmed 🎉", "success");
      navigate(`/orders/${shopKartOrderId || verifyRes.order?._id}`);
    } catch (err) {
      setApiError(err.response?.data?.message || "Payment verification failed.");
      setShowRazorpayModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  const formattedSubtotal = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(subtotal);

  return (
    <div className="cart-page-wrapper">
      <div className="cart-container">
        {/* Header */}
        <div style={{ marginBottom: "1.5rem" }}>
          <Link to="/cart" className="btn-back-nav" style={{ marginBottom: "1rem" }}>
            <ArrowLeft size={16} /> Return to Cart
          </Link>
          <h1 className="cart-title">Checkout & Shipping</h1>
        </div>

        {apiError && (
          <div className="alert alert-error" style={{ marginBottom: "1.5rem" }}>
            <AlertCircle size={18} className="alert-icon" />
            <span>{apiError}</span>
          </div>
        )}

        <div className="cart-layout-grid">
          {/* Form Column */}
          <div className="cart-items-column">
            <div className="dash-card">
              <div className="dash-card-header">
                <h2 className="dash-card-title">
                  <Truck size={20} className="text-indigo-600" />
                  <span>Shipping Address</span>
                </h2>
                <span className="pill-badge pill-primary">Step 2 of 3</span>
              </div>

              <form onSubmit={handlePlaceOrder} className="auth-form" style={{ gap: "1.25rem" }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={shipping.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Aarav Sharma"
                    className={`form-input ${errors.fullName ? "is-invalid" : ""}`}
                    style={{ paddingLeft: "1rem" }}
                  />
                  {errors.fullName && <div className="field-error-text">{errors.fullName}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number (10 Digits) *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={shipping.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. 9876543210"
                    className={`form-input ${errors.phone ? "is-invalid" : ""}`}
                    style={{ paddingLeft: "1rem" }}
                  />
                  {errors.phone && <div className="field-error-text">{errors.phone}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Address Line *</label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={shipping.addressLine1}
                    onChange={handleInputChange}
                    placeholder="Flat / House No. / Street Address"
                    className={`form-input ${errors.addressLine1 ? "is-invalid" : ""}`}
                    style={{ paddingLeft: "1rem" }}
                  />
                  {errors.addressLine1 && <div className="field-error-text">{errors.addressLine1}</div>}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={shipping.city}
                      onChange={handleInputChange}
                      placeholder="Bengaluru"
                      className={`form-input ${errors.city ? "is-invalid" : ""}`}
                      style={{ paddingLeft: "1rem" }}
                    />
                    {errors.city && <div className="field-error-text">{errors.city}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={shipping.state}
                      onChange={handleInputChange}
                      placeholder="Karnataka"
                      className={`form-input ${errors.state ? "is-invalid" : ""}`}
                      style={{ paddingLeft: "1rem" }}
                    />
                    {errors.state && <div className="field-error-text">{errors.state}</div>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Pincode (6 Digits) *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={shipping.pincode}
                    onChange={handleInputChange}
                    placeholder="560001"
                    className={`form-input ${errors.pincode ? "is-invalid" : ""}`}
                    style={{ paddingLeft: "1rem" }}
                  />
                  {errors.pincode && <div className="field-error-text">{errors.pincode}</div>}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary"
                  style={{ marginTop: "1rem", padding: "0.95rem" }}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="spinner" />
                      <span>Opening Secure Razorpay Payment...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={18} />
                      <span>Pay {formattedSubtotal} via Razorpay</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary Column */}
          <div className="cart-summary-card">
            <h2 className="summary-title">Order Items ({cartItems.length})</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginBottom: "1.25rem" }}>
              {cartItems.map((item) => {
                const product = item.product || {};
                const id = product._id || product;
                const { name = "Product", price = 0, image } = product;
                const formattedPrice = new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                }).format(price * item.quantity);

                return (
                  <div key={id} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <img
                      src={image}
                      alt={name}
                      style={{ width: "44px", height: "44px", borderRadius: "8px", objectFit: "cover", background: "#f1f5f9" }}
                    />
                    <div style={{ flex: 1, fontSize: "0.875rem" }}>
                      <div style={{ fontWeight: 600, color: "#0f172a" }}>{name}</div>
                      <div style={{ color: "#64748b", fontSize: "0.775rem" }}>Qty: {item.quantity}</div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#4338ca" }}>{formattedPrice}</div>
                  </div>
                );
              })}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row total-row">
              <span>Total Payable</span>
              <span className="total-amount">{formattedSubtotal}</span>
            </div>

            <div className="summary-security-note" style={{ marginTop: "1.25rem" }}>
              <ShieldCheck size={16} />
              <span>Razorpay Test Mode Payment Enabled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Razorpay Standard Checkout Gateway Modal */}
      {showRazorpayModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "460px",
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              animation: "fadeIn 0.2s ease-out",
            }}
          >
            {/* Razorpay Header */}
            <div
              style={{
                background: "#0c2340",
                color: "#ffffff",
                padding: "1.25rem 1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div
                  style={{
                    background: "#0284c7",
                    color: "white",
                    fontWeight: 900,
                    fontSize: "1.1rem",
                    padding: "0.35rem 0.65rem",
                    borderRadius: "6px",
                    letterSpacing: "-0.5px",
                  }}
                >
                  R
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "1.05rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span>Razorpay</span>
                    <span
                      style={{
                        background: "#38bdf8",
                        color: "#082f49",
                        fontSize: "0.65rem",
                        fontWeight: 800,
                        padding: "0.15rem 0.4rem",
                        borderRadius: "4px",
                        textTransform: "uppercase",
                      }}
                    >
                      Test Mode
                    </span>
                  </div>
                  <div style={{ fontSize: "0.775rem", color: "#94a3b8" }}>ShopKart Order #{activePaymentOrder?.razorpayOrderId}</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Amount</div>
                <div style={{ fontWeight: 800, fontSize: "1.2rem", color: "#38bdf8" }}>{formattedSubtotal}</div>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "1.5rem" }}>
              <div style={{ fontSize: "0.85rem", color: "#475569", marginBottom: "1rem" }}>
                Select a test payment method to simulate standard checkout:
              </div>

              {/* Payment Methods */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <label
                  onClick={() => setSelectedMethod("card")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.85rem",
                    padding: "0.85rem 1rem",
                    borderRadius: "10px",
                    border: selectedMethod === "card" ? "2px solid #0284c7" : "1px solid #e2e8f0",
                    background: selectedMethod === "card" ? "#f0f9ff" : "#ffffff",
                    cursor: "pointer",
                  }}
                >
                  <CreditCard size={20} color={selectedMethod === "card" ? "#0284c7" : "#64748b"} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#0f172a" }}>Credit / Debit Card</div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Test Card: 4111 •••• •••• 1111</div>
                  </div>
                  <input type="radio" checked={selectedMethod === "card"} readOnly />
                </label>

                <label
                  onClick={() => setSelectedMethod("upi")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.85rem",
                    padding: "0.85rem 1rem",
                    borderRadius: "10px",
                    border: selectedMethod === "upi" ? "2px solid #0284c7" : "1px solid #e2e8f0",
                    background: selectedMethod === "upi" ? "#f0f9ff" : "#ffffff",
                    cursor: "pointer",
                  }}
                >
                  <ShieldCheck size={20} color={selectedMethod === "upi" ? "#0284c7" : "#64748b"} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#0f172a" }}>UPI / QR</div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Google Pay, PhonePe, Paytm</div>
                  </div>
                  <input type="radio" checked={selectedMethod === "upi"} readOnly />
                </label>
              </div>

              {/* Action Buttons */}
              <button
                type="button"
                disabled={submitting}
                onClick={() => confirmOrder(activePaymentOrder?.shopKartOrderId)}
                style={{
                  width: "100%",
                  padding: "0.9rem",
                  background: "#0284c7",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: 700,
                  fontSize: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(2, 132, 199, 0.3)",
                }}
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="spinner" />
                    <span>Verifying HMAC Signature...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    <span>Authorize Test Payment ({formattedSubtotal})</span>
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={() => setShowRazorpayModal(false)}
                style={{
                  width: "100%",
                  padding: "0.65rem",
                  background: "transparent",
                  color: "#64748b",
                  border: "none",
                  marginTop: "0.5rem",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                Cancel Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
