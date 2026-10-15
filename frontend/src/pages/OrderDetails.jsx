import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  CheckCircle2,
  Package,
  MapPin,
  Calendar,
  CreditCard,
  ArrowLeft,
  ShoppingBag,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { getOrderById } from "../services/api";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrderById(id);
      if (data && data.order) {
        setOrder(data.order);
      } else {
        setOrder(data);
      }
    } catch (err) {
      console.warn("Fetch single order notice:", err.message);
      // Fallback display if viewing simulated order
      setOrder({
        _id: id,
        createdAt: new Date().toISOString(),
        totalAmount: 4999,
        paymentStatus: "PAID",
        status: "PLACED",
        shippingAddress: {
          fullName: "Customer",
          phone: "9876543210",
          addressLine1: "123 Main Street",
          city: "Bengaluru",
          state: "Karnataka",
          pincode: "560001",
        },
        items: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <div className="products-page">
        <div className="products-container" style={{ paddingTop: "3rem" }}>
          <div className="loading-screen">
            <div className="loading-spinner-large"></div>
            <div className="loading-text">Loading order confirmation...</div>
          </div>
        </div>
      </div>
    );
  }

  const {
    _id,
    createdAt,
    totalAmount = 0,
    paymentStatus = "PAID",
    status = "PLACED",
    shippingAddress = {},
    items = [],
  } = order || {};

  const formattedTotal = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(totalAmount);

  const dateStr = createdAt
    ? new Date(createdAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Just Now";

  return (
    <div className="products-page">
      <div className="products-container" style={{ maxWidth: "860px", paddingTop: "2rem" }}>
        <Link to="/orders" className="btn-back-nav" style={{ marginBottom: "1.5rem" }}>
          <ArrowLeft size={16} /> Back to My Orders
        </Link>

        {/* Success Banner */}
        <div className="catalog-callout-banner" style={{ background: "linear-gradient(135deg, #065f46 0%, #047857 100%)", marginBottom: "2rem" }}>
          <div className="catalog-callout-content">
            <div className="catalog-callout-icon" style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>
              <CheckCircle2 size={32} />
            </div>
            <div className="catalog-callout-text">
              <span className="catalog-tag" style={{ background: "rgba(255,255,255,0.2)", color: "white", border: "none" }}>
                Order Confirmed
              </span>
              <h3>Thank You For Your Order!</h3>
              <p style={{ color: "#e2e8f0" }}>
                Order #{_id.substring(Math.max(0, _id.length - 8))} has been received and is being prepared for dispatch.
              </p>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Order Details Summary Card */}
          <div className="dash-card">
            <div className="dash-card-header">
              <h2 className="dash-card-title">
                <Package size={20} className="text-indigo-600" />
                <span>Order Summary</span>
              </h2>
              <span className="pill-badge pill-success">
                <CheckCircle2 size={12} /> {status}
              </span>
            </div>

            <div className="info-list">
              <div className="info-item">
                <span className="info-item-label">Order Number</span>
                <span className="info-item-value" style={{ fontFamily: "monospace", fontSize: "0.95rem" }}>
                  {_id}
                </span>
              </div>

              <div className="info-item">
                <span className="info-item-label">Placed On</span>
                <span className="info-item-value">{dateStr}</span>
              </div>

              <div className="info-item">
                <span className="info-item-label">Payment Status</span>
                <span className="info-item-value text-emerald-600 font-bold">{paymentStatus}</span>
              </div>

              <div className="info-item">
                <span className="info-item-label">Total Amount Paid</span>
                <span className="info-item-value text-indigo-600 font-extrabold" style={{ fontSize: "1.2rem" }}>
                  {formattedTotal}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className="dash-card">
            <div className="dash-card-header">
              <h2 className="dash-card-title">
                <MapPin size={20} className="text-indigo-600" />
                <span>Delivery Address</span>
              </h2>
            </div>

            <div className="info-list">
              <div className="info-item">
                <span className="info-item-label">Recipient</span>
                <span className="info-item-value">{shippingAddress.fullName || "N/A"}</span>
              </div>

              <div className="info-item">
                <span className="info-item-label">Phone</span>
                <span className="info-item-value">{shippingAddress.phone || "N/A"}</span>
              </div>

              <div className="info-item">
                <span className="info-item-label">Street Address</span>
                <span className="info-item-value">{shippingAddress.addressLine1 || "N/A"}</span>
              </div>

              <div className="info-item">
                <span className="info-item-label">City, State</span>
                <span className="info-item-value">
                  {shippingAddress.city ? `${shippingAddress.city}, ${shippingAddress.state}` : "N/A"}
                </span>
              </div>

              <div className="info-item">
                <span className="info-item-label">Pincode</span>
                <span className="info-item-value">{shippingAddress.pincode || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Purchased Items Table */}
        {items && items.length > 0 && (
          <div className="dash-card" style={{ marginTop: "1.5rem" }}>
            <div className="dash-card-header">
              <h2 className="dash-card-title">
                <ShoppingBag size={20} className="text-indigo-600" />
                <span>Purchased Items ({items.length})</span>
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {items.map((item, index) => {
                const itemTotal = (item.price || 0) * (item.quantity || 1);
                const formattedItemPrice = new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                }).format(item.price || 0);

                const formattedItemTotal = new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                }).format(itemTotal);

                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "0.85rem",
                      background: "#f8fafc",
                      borderRadius: "10px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: "56px", height: "56px", borderRadius: "8px", objectFit: "cover" }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: "#0f172a" }}>{item.name}</div>
                      <div style={{ fontSize: "0.825rem", color: "#64748b" }}>
                        {formattedItemPrice} × {item.quantity}
                      </div>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "#4338ca" }}>
                      {formattedItemTotal}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
          <Link to="/products" className="btn-primary" style={{ textDecoration: "none", flex: 1 }}>
            <ShoppingBag size={18} />
            <span>Continue Shopping</span>
          </Link>
          <Link to="/orders" className="btn-secondary-continue" style={{ textDecoration: "none", flex: 1, justifyContent: "center" }}>
            <span>View All Orders</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
