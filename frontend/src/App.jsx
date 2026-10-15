import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import { getCustomerProfile } from "./services/api";
import { ShopProvider, useShop } from "./context/ShopContext";

// Global Toast Banner Component
function ToastNotification() {
  const { toast } = useShop();
  if (!toast) return null;

  return (
    <div className="cart-feedback-toast">
      <div className="toast-content">
        <span className="toast-icon">✓</span>
        <div>
          <div style={{ fontWeight: 600 }}>{toast.message}</div>
          <div className="toast-subtext">ShopKart Notification</div>
        </div>
      </div>
    </div>
  );
}

function MainApp() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Check on initial load if user has a valid HttpOnly cookie session
  const checkAuth = async () => {
    try {
      const data = await getCustomerProfile();
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setAuthChecked(true);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <ShopProvider user={user} authChecked={authChecked}>
      <Router>
        <div className="app-container">
          {/* Global Navigation Bar */}
          <Navbar user={user} onLogoutSuccess={() => setUser(null)} />

          {/* Toast feedback popup */}
          <ToastNotification />

          {/* Application Page Routing */}
          <main className="main-content">
            <Routes>
              {/* Default Route -> redirects to /products */}
              <Route path="/" element={<Navigate to="/products" replace />} />

              {/* Lab 01 & 02: Register & Login */}
              <Route
                path="/register"
                element={user ? <Navigate to="/home" replace /> : <Register />}
              />
              <Route
                path="/login"
                element={
                  user ? (
                    <Navigate to="/home" replace />
                  ) : (
                    <Login onLoginSuccess={checkAuth} />
                  )
                }
              />
              <Route
                path="/home"
                element={
                  <Home
                    user={user}
                    setUser={setUser}
                    onLogoutSuccess={() => setUser(null)}
                  />
                }
              />

              {/* Lab 03: Products */}
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetails />} />

              {/* Lab 04: Wishlist */}
              <Route path="/wishlist" element={<Wishlist />} />

              {/* Lab 05: Cart */}
              <Route path="/cart" element={<Cart />} />

              {/* Lab 06: Checkout & Orders */}
              <Route path="/checkout" element={user ? <Checkout /> : <Navigate to="/login" replace />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:id" element={<OrderDetails />} />

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/products" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ShopProvider>
  );
}

export default function App() {
  return <MainApp />;
}
