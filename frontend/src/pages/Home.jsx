import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Calendar,
  LogOut,
  ShoppingBag,
  Heart,
  Package,
  ShieldCheck,
  Truck,
  CreditCard,
  Clock,
  Key,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { logoutCustomer, changePassword } from "../services/api";

export default function Home({ user, setUser, onLogoutSuccess }) {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Change Password Form State
  const [passForm, setPassForm] = useState({ oldPassword: "", newPassword: "" });
  const [passLoading, setPassLoading] = useState(false);
  const [passError, setPassError] = useState(null);
  const [passSuccess, setPassSuccess] = useState(null);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutCustomer();
    } catch (err) {
      console.error("Logout notice:", err);
    } finally {
      setIsLoggingOut(false);
      if (onLogoutSuccess) onLogoutSuccess();
      navigate("/login", { replace: true });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassLoading(true);
    setPassError(null);
    setPassSuccess(null);
    try {
      await changePassword(passForm);
      setPassSuccess("Password updated successfully!");
      setPassForm({ oldPassword: "", newPassword: "" });
      setTimeout(() => setShowPasswordModal(false), 2000);
    } catch (err) {
      setPassError(err.response?.data?.message || err.message || "Failed to change password.");
    } finally {
      setPassLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="home-page">
        <div className="home-hero">
          <div className="hero-content">
            <div>
              <span className="hero-welcome-badge">
                <Sparkles size={14} /> Welcome to ShopKart
              </span>
              <h1 className="hero-title">Discover Exclusive Deals & Products</h1>
              <p className="hero-subtitle">
                Join thousands of happy shoppers. Log in to manage your account, track orders, and save your favourite items.
              </p>
            </div>
            <div className="hero-actions">
              <Link to="/login" className="btn-primary" style={{ textDecoration: "none", display: "inline-flex" }}>
                Sign In
              </Link>
              <Link to="/register" className="btn-secondary-continue" style={{ textDecoration: "none" }}>
                Create Account
              </Link>
            </div>
          </div>
        </div>

        <div className="perks-grid">
          <div className="perk-card">
            <div className="perk-icon-wrap"><Truck size={22} /></div>
            <div>
              <div className="perk-title">Free Express Shipping</div>
              <div className="perk-desc">On all orders above ₹499</div>
            </div>
          </div>
          <div className="perk-card">
            <div className="perk-icon-wrap"><ShieldCheck size={22} /></div>
            <div>
              <div className="perk-title">100% Secure Checkout</div>
              <div className="perk-desc">Encrypted Razorpay payments</div>
            </div>
          </div>
          <div className="perk-card">
            <div className="perk-icon-wrap"><CreditCard size={22} /></div>
            <div>
              <div className="perk-title">Instant Refunds</div>
              <div className="perk-desc">No hassle returns within 7 days</div>
            </div>
          </div>
          <div className="perk-card">
            <div className="perk-icon-wrap"><Clock size={22} /></div>
            <div>
              <div className="perk-title">24/7 Customer Support</div>
              <div className="perk-desc">We are here to assist you anytime</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Formatted registration date
  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Verified Customer";

  return (
    <div className="home-page">
      {/* Hero Welcome Banner */}
      <div className="home-hero">
        <div className="hero-content">
          <div className="hero-user-info">
            <div className="hero-avatar">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : <User size={32} />}
            </div>
            <div>
              <span className="hero-welcome-badge">
                <Sparkles size={14} /> Account Dashboard
              </span>
              <h1 className="hero-title">Welcome back, {user.fullName}!</h1>
              <p className="hero-subtitle">
                Access your ShopKart customer profile, saved wishlist, and active orders below.
              </p>
            </div>
          </div>
          <div className="hero-actions">
            <Link to="/products" className="btn-browse-catalog">
              <ShoppingBag size={18} />
              <span>Browse Products</span>
            </Link>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="btn-hero-logout"
            >
              <LogOut size={16} />
              <span>{isLoggingOut ? "Logging out..." : "Sign Out"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="dashboard-grid">
        {/* Customer Profile Details Card */}
        <div className="dash-card">
          <div className="dash-card-header">
            <h2 className="dash-card-title">
              <User size={20} className="text-indigo-600" />
              <span>Profile Information</span>
            </h2>
            <span className="pill-badge pill-success">
              <CheckCircle2 size={12} /> Active Session
            </span>
          </div>

          <div className="info-list">
            <div className="info-item">
              <div className="info-item-label">
                <User size={15} />
                <span>Full Name</span>
              </div>
              <div className="info-item-value">{user.fullName || "N/A"}</div>
            </div>

            <div className="info-item">
              <div className="info-item-label">
                <Mail size={15} />
                <span>Email Address</span>
              </div>
              <div className="info-item-value">{user.email || "N/A"}</div>
            </div>

            <div className="info-item">
              <div className="info-item-label">
                <Phone size={15} />
                <span>Phone Number</span>
              </div>
              <div className="info-item-value">{user.phone || "N/A"}</div>
            </div>

            <div className="info-item">
              <div className="info-item-label">
                <Calendar size={15} />
                <span>Member Since</span>
              </div>
              <div className="info-item-value">{joinedDate}</div>
            </div>
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="btn-secondary-continue"
              style={{ width: "100%", justifyContent: "center" }}
            >
              <Key size={16} />
              <span>Change Password</span>
            </button>
          </div>
        </div>

        {/* Quick Access Card */}
        <div className="dash-card">
          <div className="dash-card-header">
            <h2 className="dash-card-title">
              <ShoppingBag size={20} className="text-indigo-600" />
              <span>Quick Actions</span>
            </h2>
            <span className="pill-badge pill-primary">ShopKart Portal</span>
          </div>

          <div className="info-list" style={{ gap: "0.85rem" }}>
            <Link to="/products" className="btn-secondary-continue" style={{ textDecoration: "none", justifyContent: "flex-start" }}>
              <ShoppingBag size={18} className="text-indigo-600" />
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 600 }}>Explore Product Catalog</div>
                <div style={{ fontSize: "0.775rem", color: "#64748b" }}>Search, filter & find deals</div>
              </div>
            </Link>

            <Link to="/wishlist" className="btn-secondary-continue" style={{ textDecoration: "none", justifyContent: "flex-start" }}>
              <Heart size={18} className="text-rose-500" />
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 600 }}>My Saved Wishlist</div>
                <div style={{ fontSize: "0.775rem", color: "#64748b" }}>View products you saved for later</div>
              </div>
            </Link>

            <Link to="/orders" className="btn-secondary-continue" style={{ textDecoration: "none", justifyContent: "flex-start" }}>
              <Package size={18} className="text-emerald-600" />
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 600 }}>My Order History</div>
                <div style={{ fontSize: "0.775rem", color: "#64748b" }}>Track active and completed purchases</div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* E-Commerce Perks Bar */}
      <div className="perks-grid">
        <div className="perk-card">
          <div className="perk-icon-wrap"><Truck size={22} /></div>
          <div>
            <div className="perk-title">Free Express Shipping</div>
            <div className="perk-desc">On all orders above ₹499</div>
          </div>
        </div>
        <div className="perk-card">
          <div className="perk-icon-wrap"><ShieldCheck size={22} /></div>
          <div>
            <div className="perk-title">100% Secure Checkout</div>
            <div className="perk-desc">Encrypted Razorpay payments</div>
          </div>
        </div>
        <div className="perk-card">
          <div className="perk-icon-wrap"><CreditCard size={22} /></div>
          <div>
            <div className="perk-title">Instant Refunds</div>
            <div className="perk-desc">No hassle returns within 7 days</div>
          </div>
        </div>
        <div className="perk-card">
          <div className="perk-icon-wrap"><Clock size={22} /></div>
          <div>
            <div className="perk-title">24/7 Customer Support</div>
            <div className="perk-desc">We are here to assist you anytime</div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="modal-backdrop">
          <div className="auth-card" style={{ maxWidth: "420px" }}>
            <div className="auth-header">
              <span className="auth-badge"><Key size={14} /> Security</span>
              <h2 className="auth-title">Change Password</h2>
              <p className="auth-subtitle">Enter your old password and choose a new one</p>
            </div>

            {passError && (
              <div className="alert alert-error">
                <AlertCircle size={18} className="alert-icon" />
                <span>{passError}</span>
              </div>
            )}

            {passSuccess && (
              <div className="alert alert-success">
                <CheckCircle2 size={18} className="alert-icon" />
                <span>{passSuccess}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">Old Password</label>
                <input
                  type="password"
                  required
                  value={passForm.oldPassword}
                  onChange={(e) => setPassForm({ ...passForm, oldPassword: e.target.value })}
                  placeholder="••••••••"
                  className="form-input"
                  style={{ paddingLeft: "1rem" }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password (min 6 characters)</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={passForm.newPassword}
                  onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}
                  placeholder="••••••••"
                  className="form-input"
                  style={{ paddingLeft: "1rem" }}
                />
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="btn-secondary-continue"
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passLoading}
                  className="btn-primary"
                  style={{ flex: 1.2, marginTop: 0 }}
                >
                  {passLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
