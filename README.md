# Demaquacs Research Livestock Farm — Order Portal (React source)

A React ordering system for Demaquacs Research Livestock Farm (Plot 14 Mulwanyamuli Road, Kampala, Uganda), built with Vite + React 18, no UI framework dependency beyond Google Fonts.

## Features included
- Product/livestock catalog with categories, stock levels and low-stock badges
- Customer accounts (register/login) — demo admin: `admin@demaquacsfarm.ug` / `admin123`
- Cart and checkout with a delivery form and payment method selection
- Order status tracking (Pending Confirmation → Confirmed → Preparing → Out for Delivery → Delivered, or Cancelled)
- Admin dashboard: overview stats, product/inventory management, order management, reports (revenue by category, 7-day order volume, top sellers, status breakdown), and a notifications feed
- In-app notifications for customers (order updates) and admin (new orders, low-stock alerts)
- Floating WhatsApp contact button

## Getting started

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  data.js                 Farm info, categories, seed products, seed admin account
  utils.js                UGX formatter, localStorage-backed state hook, toast hook, status helpers
  App.jsx                 Root component: owns all state, renders the active view
  index.css               All styling (CSS custom properties, responsive, light/dark aware)
  main.jsx                Vite/React entry point
  components/
    Header.jsx
    ShopView.jsx
    CartView.jsx
    CheckoutView.jsx
    AccountView.jsx
    OrdersView.jsx
    ToastStack.jsx
    admin/
      AdminView.jsx
      OverviewTab.jsx
      ProductsTab.jsx
      OrdersTab.jsx
      ReportsTab.jsx
      NotificationsTab.jsx
```

## What to change before this goes live

This is a fully working demo, but three things are simulated and need a real backend before real customers and money are involved:

1. **Payments.** `CheckoutView.jsx` fakes a payment with a `setTimeout`. Replace that with a call to a real gateway — Flutterwave, MTN Mobile Money API, or Airtel Money API are the common options in Uganda — from a server you control (never call a payment gateway with secret keys directly from the browser).
2. **Data storage.** All data (products, orders, users, notifications) is kept in the browser's `localStorage` via `usePersistentState` in `utils.js`. That's why it survives page reloads but is invisible across devices/browsers. Swap this for real API calls to a backend + database (Postgres, MongoDB, etc.) so admin and customers share the same data.
3. **Authentication.** Passwords are currently stored in plain text in the browser. Replace `handleLogin`/`handleRegister` in `App.jsx` with calls to a real auth service (e.g. your own backend with hashed passwords, or a provider like Firebase Auth/Auth0/Clerk).

Everything else — the UI, cart logic, order status flow, inventory decrementing, low-stock alerts, and reports — will keep working the same way once it's wired to real endpoints; you're mainly swapping what's inside the functions in `App.jsx`, not changing the component structure.

## Configuration

Update the farm's contact details in `src/data.js`:

```js
export const FARM = {
  name: "Demaquacs Research Livestock Farm",
  address: "Plot 14 Mulwanyamuli Road, Kampala, Uganda",
  phone: "256700000000",     // WhatsApp number in international format, no leading +
  phoneDisplay: "+256 700 000 000",
  email: "orders@demaquacsfarm.ug",
};
```
