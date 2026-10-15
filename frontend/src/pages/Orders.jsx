import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Calendar,
  CheckCircle2,
  Clock,
  ChevronRight,
  RotateCcw,
  ShoppingBag,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { getOrders } from "../services/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrders();
      if (data && data.orders) {
        setOrders(data.orders);
      } else if (Array.isArray(data)) {
        setOrders(data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.warn("Fetch orders notice:", err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="products-page">
        <div className="products-container" style={{ paddingTop: "3rem" }}>
          <div className="loading-screen">
            <div className="loading-spinner-large"></div>
            <div className="loading-text">Loading your order history...</div>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="products-page">
        <div className="products-container" style={{ paddingTop: "3rem" }}>
          <div className="empty-state-container">
            <div className="empty-icon-wrap" style={{ background: "#ecfdf5", color: "#059669" }}>
              <Package size={40} />
            </div>
            <h2 className="empty-title">No Orders Placed Yet</h2>
            <p className="empty-description">
              When you purchase items on ShopKart, your order history and live delivery tracking will appear here.
            </p>
            <Link to="/products" className="btn-empty-reset" style={{ textDecoration: "none" }}>
              <ShoppingBag size={18} />
              <span>Start Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      {/* Hero Header */}
      <div className="products-hero" style={{ padding: "2rem 1.5rem" }}>
        <div className="products-hero-content">
          <span className="products-hero-badge">
            <Sparkles size={14} /> ShopKart Customer Portal
          </span>
          <h1 className="products-hero-title">My Order History</h1>
          <p className="products-hero-subtitle">
            You have placed <strong>{orders.length}</strong> {orders.length === 1 ? "order" : "orders"} on ShopKart.
          </p>
        </div>
      </div>

      <div className="products-container" style={{ maxWidth: "900px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {orders.map((order) => {
            const { _id, createdAt, totalAmount, status = "PLACED", items = [] } = order;

            const formattedTotal = new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            }).format(totalAmount || 0);

            const dateStr = createdAt
              ? new Date(createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "Recently Placed";

            let statusBadge = (
              <span className="pill-badge pill-success">
                <CheckCircle2 size={12} /> {status}
              </span>
            );
            if (status === "PENDING_PAYMENT" || status === "PENDING") {
              statusBadge = (
                <span className="pill-badge" style={{ background: "#fffbeb", color: "#b45309", borderColor: "#fde68a" }}>
                  <Clock size={12} /> Pending Payment
                </span>
              );
            }

            return (
              <div key={_id} className="dash-card" style={{ padding: "1.5rem" }}>
                <div className="dash-card-header" style={{ marginBottom: "1rem" }}>
                  <div>
                    <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" }}>
                      Order #{_id.substring(Math.max(0, _id.length - 8))}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "0.15rem" }}>
                      <Calendar size={13} />
                      <span>{dateStr}</span>
                    </div>
                  </div>
                  <div>{statusBadge}</div>
                </div>

                {/* Items Preview */}
                {items && items.length > 0 && (
                  <div style={{ display: "flex", gap: "0.85rem", overflowX: "auto", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
                    {items.map((item, idx) => (
                      <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.6rem", background: "#f8fafc", padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0", minWidth: "180px" }}>
                        {item.image && (
                          <img src={item.image} alt={item.name} style={{ width: "36px", height: "36px", borderRadius: "6px", objectFit: "cover" }} />
                        )}
                        <div style={{ fontSize: "0.8rem" }}>
                          <div style={{ fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "120px" }}>{item.name}</div>
                          <div style={{ color: "#64748b" }}>Qty: {item.quantity}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "0.75rem", borderTop: "1px solid #e2e8f0" }}>
                  <div>
                    <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Total Amount: </span>
                    <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#4338ca" }}>{formattedTotal}</span>
                  </div>

                  <Link to={`/orders/${_id}`} className="btn-secondary-continue" style={{ textDecoration: "none", padding: "0.5rem 1rem", fontSize: "0.85rem" }}>
                    <span>Order Details</span>
                    <ChevronRight size={15} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
