import React, { createContext, useContext, useState, useEffect } from "react";
import * as api from "../services/api";

const ShopContext = createContext();

export const ShopProvider = ({ children, user, authChecked }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartInitialLoading, setCartInitialLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistInitialLoading, setWishlistInitialLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Auto-dismiss toast
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch Cart and Wishlist when user is authenticated
  const refreshCart = async () => {
    if (!user) {
      setCartItems([]);
      setCartInitialLoading(false);
      return;
    }
    setCartLoading(true);
    try {
      const data = await api.getCart();
      if (data && data.cart) {
        setCartItems(data.cart);
      }
    } catch (err) {
      console.warn("Cart API notice:", err.message);
    } finally {
      setCartLoading(false);
      setCartInitialLoading(false);
    }
  };

  const refreshWishlist = async () => {
    if (!user) {
      setWishlistItems([]);
      setWishlistInitialLoading(false);
      return;
    }
    setWishlistLoading(true);
    try {
      const data = await api.getWishlist();
      if (data && data.wishlist) {
        setWishlistItems(data.wishlist);
      }
    } catch (err) {
      console.warn("Wishlist API notice:", err.message);
    } finally {
      setWishlistLoading(false);
      setWishlistInitialLoading(false);
    }
  };

  useEffect(() => {
    if (authChecked) {
      if (user) {
        refreshCart();
        refreshWishlist();
      } else {
        setCartItems([]);
        setWishlistItems([]);
        setCartInitialLoading(false);
        setWishlistInitialLoading(false);
      }
    }
  }, [user, authChecked]);

  // Add to Cart
  const handleAddToCart = async (product, quantity = 1) => {
    // Optimistic UI update
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product._id === product._id || item.product === product._id
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [...prev, { product, quantity }];
    });

    showToast(`Added "${product.name}" to cart! 🛒`, "success");

    // Sync with API
    if (user) {
      try {
        const res = await api.addToCart(product._id, quantity);
        if (res && res.cart) {
          setCartItems(res.cart);
        }
      } catch (err) {
        console.warn("API add to cart error, retaining local state:", err.message);
      }
    }
  };

  // Update Cart Quantity
  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems((prev) =>
      prev.map((item) => {
        const id = item.product._id || item.product;
        return id === productId ? { ...item, quantity: newQuantity } : item;
      })
    );

    if (user) {
      try {
        const res = await api.updateCartQuantity(productId, newQuantity);
        if (res && res.cart) {
          setCartItems(res.cart);
        }
      } catch (err) {
        console.warn("API update cart error:", err.message);
      }
    }
  };

  // Remove from Cart
  const handleRemoveFromCart = async (productId) => {
    const target = cartItems.find(
      (item) => (item.product._id || item.product) === productId
    );
    const name = target?.product?.name || "Item";

    setCartItems((prev) =>
      prev.filter((item) => (item.product._id || item.product) !== productId)
    );

    showToast(`Removed "${name}" from cart.`, "info");

    if (user) {
      try {
        const res = await api.removeFromCart(productId);
        if (res && res.cart) {
          setCartItems(res.cart);
        }
      } catch (err) {
        console.warn("API remove cart error:", err.message);
      }
    }
  };

  // Clear Cart
  const handleClearCart = async () => {
    setCartItems([]);
  };

  // Wishlist Helpers
  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => {
      const id = typeof item === "string" ? item : item._id;
      return id === productId;
    });
  };

  const handleToggleWishlist = async (product) => {
    const isSaved = isInWishlist(product._id);

    if (isSaved) {
      setWishlistItems((prev) =>
        prev.filter((item) => {
          const id = typeof item === "string" ? item : item._id;
          return id !== product._id;
        })
      );
      showToast(`Removed "${product.name}" from Wishlist.`, "info");

      if (user) {
        try {
          await api.removeFromWishlist(product._id);
        } catch (err) {
          console.warn("API wishlist remove error:", err.message);
        }
      }
    } else {
      setWishlistItems((prev) => [...prev, product]);
      showToast(`Added "${product.name}" to Wishlist! ❤️`, "success");

      if (user) {
        try {
          await api.addToWishlist(product._id);
        } catch (err) {
          console.warn("API wishlist add error:", err.message);
        }
      }
    }
  };

  // Derived Totals
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  return (
    <ShopContext.Provider
      value={{
        cartItems,
        wishlistItems,
        cartLoading,
        cartInitialLoading,
        wishlistLoading,
        wishlistInitialLoading,
        cartCount,
        wishlistCount,
        subtotal,
        toast,
        showToast,
        addToCart: handleAddToCart,
        updateQuantity: handleUpdateQuantity,
        removeFromCart: handleRemoveFromCart,
        clearCart: handleClearCart,
        toggleWishlist: handleToggleWishlist,
        isInWishlist,
        refreshCart,
        refreshWishlist,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
export default ShopContext;
