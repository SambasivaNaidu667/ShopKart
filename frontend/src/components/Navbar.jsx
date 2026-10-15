import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  ShoppingCart,
  Heart,
  Package,
  LogIn,
  UserPlus,
  LogOut,
  Home,
  User,
  Loader2,
  Menu,
  X,
} from "lucide-react";
import { logoutCustomer } from "../services/api";
import { useShop } from "../context/ShopContext";

export default function Navbar({ user, onLogoutSuccess }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { cartCount, wishlistCount } = useShop();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutCustomer();
    } catch (err) {
      console.error("Logout request notice:", err.message);
    } finally {
      setIsLoggingOut(false);
      if (onLogoutSuccess) {
        onLogoutSuccess();
      }
      navigate("/login", {
        replace: true,
        state: { message: "You have been logged out successfully." },
      });
    }
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        {/* Brand Logo */}
        <Link to={user ? "/home" : "/products"} className="nav-brand" id="nav-brand-link">
          <div className="brand-icon-wrapper">
            <ShoppingBag size={20} />
          </div>
          <span>
            <span className="brand-name">Shop</span>
            <span className="brand-accent">Kart</span>
          </span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Desktop & Mobile Navigation links */}
        <nav className={`nav-links ${mobileMenuOpen ? "mobile-open" : ""}`}>
          <NavLink
            to="/products"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <ShoppingBag size={17} />
            <span>Products</span>
          </NavLink>

          <NavLink
            to="/wishlist"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="badge-icon-wrapper">
              <Heart size={17} />
              {wishlistCount > 0 && (
                <span className="nav-badge wishlist-badge">{wishlistCount}</span>
              )}
            </div>
            <span>Wishlist</span>
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="badge-icon-wrapper">
              <ShoppingCart size={17} />
              {cartCount > 0 && (
                <span className="nav-badge cart-badge">{cartCount}</span>
              )}
            </div>
            <span>Cart</span>
          </NavLink>

          {user ? (
            <>
              <NavLink
                to="/orders"
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Package size={17} />
                <span>My Orders</span>
              </NavLink>

              <NavLink
                to="/home"
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home size={17} />
                <span>Profile</span>
              </NavLink>

              <div className="nav-user-badge" title={user.email}>
                <div className="nav-avatar-mini">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : <User size={14} />}
                </div>
                <span className="user-name-text">{user.fullName || "Customer"}</span>
              </div>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                disabled={isLoggingOut}
                className="btn-nav-logout"
                title="Logout from ShopKart"
              >
                {isLoggingOut ? (
                  <Loader2 size={16} className="spinner" />
                ) : (
                  <LogOut size={16} />
                )}
                <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <LogIn size={17} />
                <span>Login</span>
              </NavLink>

              <NavLink
                to="/register"
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <UserPlus size={17} />
                <span>Register</span>
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
