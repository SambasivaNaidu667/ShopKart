import axios from "axios";

/**
 * ShopKart API Service
 * Handles all HTTP requests for Customer Auth, Products, Wishlist, Cart, and Orders.
 * `withCredentials: true` ensures HttpOnly JWT cookies are sent automatically.
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export const authApi = axios.create({
  baseURL: `${API_BASE_URL}/customers`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const productApi = axios.create({
  baseURL: `${API_BASE_URL}/products`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const wishlistApi = axios.create({
  baseURL: `${API_BASE_URL}/wishlist`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const cartApi = axios.create({
  baseURL: `${API_BASE_URL}/cart`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const orderApi = axios.create({
  baseURL: `${API_BASE_URL}/orders`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// ==========================================
// Lab 01 & 02 — Customer Authentication APIs
// ==========================================

export const registerCustomer = async (data) => {
  const response = await authApi.post("/register", data);
  return response.data;
};

export const loginCustomer = async (credentials) => {
  const response = await authApi.post("/login", credentials);
  return response.data;
};

export const getCustomerProfile = async () => {
  const response = await authApi.get("/me");
  return response.data;
};

export const logoutCustomer = async () => {
  const response = await authApi.post("/logout");
  return response.data;
};

export const changePassword = async (passwords) => {
  const response = await authApi.patch("/change-password", passwords);
  return response.data;
};

// ==========================================
// Lab 03 — Product Catalog & Discovery APIs
// ==========================================

export const getProducts = async ({ search, category, sort } = {}) => {
  const params = {};
  if (search && search.trim()) {
    params.search = search.trim();
  }
  if (category && category !== "All" && category !== "All Categories") {
    params.category = category.trim();
  }
  if (sort && sort !== "default") {
    params.sort = sort;
  }

  const response = await productApi.get("", { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await productApi.get(`/${id}`);
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await productApi.post("", productData);
  return response.data;
};

// ==========================================
// Lab 04 — Wishlist APIs
// ==========================================

export const getWishlist = async () => {
  const response = await wishlistApi.get("");
  return response.data;
};

export const addToWishlist = async (productId) => {
  const response = await wishlistApi.post(`/${productId}`);
  return response.data;
};

export const removeFromWishlist = async (productId) => {
  const response = await wishlistApi.delete(`/${productId}`);
  return response.data;
};

// ==========================================
// Lab 05 — Shopping Cart APIs
// ==========================================

export const getCart = async () => {
  const response = await cartApi.get("");
  return response.data;
};

export const addToCart = async (productId, quantity = 1) => {
  const response = await cartApi.post(`/${productId}`, { quantity });
  return response.data;
};

export const updateCartQuantity = async (productId, quantity) => {
  const response = await cartApi.patch(`/${productId}`, { quantity });
  return response.data;
};

export const removeFromCart = async (productId) => {
  const response = await cartApi.delete(`/${productId}`);
  return response.data;
};

// ==========================================
// Lab 06 — Checkout & Orders APIs
// ==========================================

export const createPaymentOrder = async (shippingAddress) => {
  const response = await orderApi.post("/create-payment-order", { shippingAddress });
  return response.data;
};

export const verifyPayment = async (paymentData) => {
  const response = await orderApi.post("/verify-payment", paymentData);
  return response.data;
};

export const getOrders = async () => {
  const response = await orderApi.get("");
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await orderApi.get(`/${id}`);
  return response.data;
};

export default authApi;
