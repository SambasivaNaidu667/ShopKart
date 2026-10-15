# ShopKart — Master Fullstack Engineering Project (Labs 01 – 06)

Welcome to **ShopKart**, a complete end-to-end full-stack e-commerce system built with **Node.js, Express, MongoDB Atlas / Mongoose, React, and Vite**.

This repository satisfies all functional requirements, security constraints, and acceptance criteria across **Engineering Labs 01 through 06**:

1. **Lab 01**: Customer Authentication Service (Backend REST APIs, JWT, HttpOnly Cookies, bcrypt)
2. **Lab 02**: Customer Authentication UI & Protected Dashboard Flow (React, Axios, withCredentials)
3. **Lab 03**: Product Catalog & Discovery (MongoDB schema, search regex, category filter, sorting, details page)
4. **Lab 04**: Wishlist System (MongoDB reference relations, `populate()`, duplicate protection)
5. **Lab 05**: Shopping Cart (Quantity management, stock verification, derived subtotal & count, React Context)
6. **Lab 06**: Checkout & Orders (Shipping validation, Razorpay payment flow, server-side revalidation & snapshotting, HMAC signature verification)

---

## 🏗️ Architecture & Project Structure

Follows standard MVC (Model-View-Controller) architecture on the backend and modular service-component architecture on the frontend:

```text
Shop-Kart/
│
├── backend/
│   ├── config/
│   │   └── razorpay.js               # Razorpay initialization & test fallback
│   ├── controllers/
│   │   ├── customer.controller.js    # Register, login, me, logout, change-password
│   │   ├── product.controller.js     # Create product, dynamic catalog search/filter/sort
│   │   ├── wishlist.controller.js    # Add, get with populate(), remove, toggle
│   │   ├── cart.controller.js        # Add, get with populate(), update qty, remove, stock checks
│   │   └── order.controller.js       # Create payment order, verify signature, get orders, status
│   ├── middlewares/
│   │   └── auth.middleware.js        # HttpOnly JWT cookie verification
│   ├── models/
│   │   ├── customer.model.js         # Customer schema with bcrypt + wishlist & cart arrays
│   │   ├── product.model.js          # Product catalog schema with validations
│   │   └── order.model.js            # Historical order snapshot schema & payment status
│   ├── routes/
│   │   ├── customer.routes.js        # /customers endpoints
│   │   ├── product.routes.js         # /products endpoints
│   │   ├── wishlist.routes.js        # /wishlist endpoints
│   │   ├── cart.routes.js            # /cart endpoints
│   │   └── order.routes.js           # /orders endpoints
│   ├── utils/
│   │   └── generateToken.js          # JWT signing & cookie configuration
│   ├── seed.js                       # 14 realistic sample catalog products
│   ├── index.js                      # Express app entry & route mounting
│   ├── package.json
│   └── .env                          # Configuration (MongoDB, JWT, Razorpay)
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx            # Dynamic badges (cart count, wishlist count) & user state
    │   │   ├── ProductCard.jsx       # Dynamic card with wishlist toggle & add-to-cart
    │   │   └── SearchBar.jsx         # Debounced search, category dropdown, price sorting
    │   ├── context/
    │   │   └── ShopContext.jsx       # Central state management (Cart, Wishlist, Totals, Toast)
    │   ├── pages/
    │   │   ├── Register.jsx          # Customer registration form with live validations
    │   │   ├── Login.jsx             # Authentication with HttpOnly cookie handling
    │   │   ├── Home.jsx              # Protected profile dashboard & password change modal
    │   │   ├── Products.jsx          # Catalog with loading, empty, and error states
    │   │   ├── ProductDetails.jsx    # Individual product view with stock alerts
    │   │   ├── Wishlist.jsx          # User's saved products
    │   │   ├── Cart.jsx              # Cart quantity modifiers & subtotal computation
    │   │   ├── Checkout.jsx          # Shipping address form & Razorpay payment integration
    │   │   ├── Orders.jsx            # Order history listing
    │   │   └── OrderDetails.jsx      # Order confirmation with historical item snapshots
    │   ├── services/
    │   │   └── api.js                # Axios instances with withCredentials: true
    │   ├── App.jsx                   # React Router routing & global providers
    │   ├── index.css                 # Premium custom design system
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas cluster URI or local MongoDB daemon

### 2. Configure Backend `.env`
Inside `Shop-Kart/backend/.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### 3. Start Backend Server
```bash
cd Shop-Kart/backend
npm install
npm run seed     # (Optional: populates database with 14 products)
npm start        # Starts server on http://localhost:5000
```

### 4. Start Frontend Client
```bash
cd Shop-Kart/frontend
npm install
npm run dev      # Starts Vite dev server on http://localhost:5173
```

---

## 📡 API Contract Overview

### Customer Authentication (`/customers`)
| Method | Endpoint | Protected | Purpose |
|---|---|:---:|---|
| POST | `/customers/register` | ❌ | Register new customer account |
| POST | `/customers/login` | ❌ | Authenticate & issue HttpOnly JWT cookie |
| GET | `/customers/me` | ✅ | Fetch currently authenticated profile |
| POST | `/customers/logout` | ✅ | Expire & clear authentication cookie |
| PATCH | `/customers/change-password` | ✅ | Verify old password & update to new hash |

### Products (`/products`)
| Method | Endpoint | Protected | Purpose |
|---|---|:---:|---|
| POST | `/products` | ❌ | Add a product to catalog |
| GET | `/products` | ❌ | List products with `?search=`, `?category=`, `?sort=` |
| GET | `/products/:id` | ❌ | Get single product by MongoDB ObjectId |

### Wishlist (`/wishlist`)
| Method | Endpoint | Protected | Purpose |
|---|---|:---:|---|
| POST | `/wishlist/:productId` | ✅ | Add product reference to user's wishlist |
| GET | `/wishlist` | ✅ | Retrieve wishlist populated with product details |
| DELETE | `/wishlist/:productId` | ✅ | Remove product from user's wishlist |
| PATCH | `/wishlist/:productId/toggle`| ✅ | Toggle wishlist presence |

### Shopping Cart (`/cart`)
| Method | Endpoint | Protected | Purpose |
|---|---|:---:|---|
| POST | `/cart/:productId` | ✅ | Add item or increment quantity (validating stock) |
| GET | `/cart` | ✅ | Get user's cart populated with product documents |
| PATCH | `/cart/:productId` | ✅ | Set specific item quantity (validating stock) |
| DELETE | `/cart/:productId` | ✅ | Remove item from user's cart |

### Checkout & Orders (`/orders`)
| Method | Endpoint | Protected | Purpose |
|---|---|:---:|---|
| POST | `/orders/create-payment-order`| ✅ | Validate stock & create Razorpay order |
| POST | `/orders/verify-payment` | ✅ | Verify HMAC SHA256 signature, mark PAID, deduct stock, clear cart |
| GET | `/orders` | ✅ | Fetch authenticated user's order history |
| GET | `/orders/:id` | ✅ | Fetch single order with ownership authorization |
| PATCH | `/orders/:id/status` | ✅ | Progress order status (Bonus) |

---

## 💡 TA Viva Questions Quick Reference

1. **Why use bcrypt over encryption?**  
   Bcrypt is a one-way hashing function with configurable salt rounds and work factor, preventing passwords from ever being decrypted if the database is breached.
2. **Why use `withCredentials: true` and `HttpOnly` cookies?**  
   HttpOnly prevents client-side JavaScript (and XSS attacks) from accessing the JWT token, while `withCredentials: true` ensures the browser automatically includes this cookie on cross-origin requests.
3. **Why store Product ObjectIds instead of copying objects in Wishlist/Cart?**  
   Products remain the single source of truth. If a product's price, title, or images update, references automatically reflect changes without stale duplication.
4. **Why snapshot product details in Orders?**  
   Orders represent a legally binding purchase receipt at a fixed point in time. Future catalog modifications must not alter historic purchase details.
5. **Why revalidate stock and calculate totals strictly on the server during checkout?**  
   Clients can be tampered with (e.g. sending arbitrary totals or bypass browser checks). The server must always enforce authoritative pricing and inventory checks.
