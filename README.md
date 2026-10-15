# ShopKart

A full‑stack e‑commerce platform built with **Node.js**, **Express**, **MongoDB**, **React**, and **Vite**.

## Features

- User registration, login, and JWT based authentication
- Product catalog with search, filter, and sorting
- Wishlist and shopping cart management
- Checkout flow with Razorpay integration
- Order history and order details pages
- Guarded checkout route – unauthenticated users are redirected to the login page

## Project Structure

```
Shop-Kart/
├─ backend/          # Express API server
│   ├─ index.js
│   └─ ...
├─ frontend/         # Vite + React client
│   ├─ src/
│   │   ├─ pages/
│   │   └─ services/api.js
│   └─ ...
├─ package.json      # Root scripts – `npm run dev` starts both
└─ README.md
```

## Getting Started

1. **Clone the repo** (already done if you are here)
2. **Install dependencies**
   ```bash
   npm install                # root dev dependencies (concurrently)
   cd backend && npm install
   cd ../frontend && npm install
   cd ..                      # back to project root
   ```
3. **Configure environment variables**
   - Copy `backend/.env.example` to `backend/.env` (or edit the existing `.env`).
   - Ensure `MONGODB_URI` points to your MongoDB Atlas cluster.
   - The default port is `5001` (set in `.env`).
4. **Run the application**
   ```bash
   npm run dev   # launches backend and frontend together
   ```
   Open `http://localhost:5173` in your browser.

## Scripts

- `npm run dev` – Starts both backend and frontend concurrently.
- `npm start` – Starts only the backend (`node index.js`).
- `npm run dev --prefix backend` – Starts backend with nodemon (if you have it).
- `npm run dev --prefix frontend` – Starts the Vite dev server.

## License

MIT © 2026 ShopKart
