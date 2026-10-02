import React, { useState, useEffect, useCallback } from "react";
import { FARM, CANCELLED, PAYMENT_METHODS } from "./data.js";
import { usePersistentState, useToasts, uid, UGX } from "./utils.js";
import { api } from "./api.js";

import ToastStack from "./components/ToastStack.jsx";
import Header from "./components/Header.jsx";
import ShopView from "./components/ShopView.jsx";
import CartView from "./components/CartView.jsx";
import CheckoutView from "./components/CheckoutView.jsx";
import AccountView from "./components/AccountView.jsx";
import OrdersView from "./components/OrdersView.jsx";
import AdminView from "./components/admin/AdminView.jsx";

export default function App() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [currentUserId, setCurrentUserId] = usePersistentState("dmq_current_user", null);
  const [cart, setCart] = usePersistentState("dmq_cart", []);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [view, setView] = useState("shop");
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [toasts, pushToast] = useToasts();

  const currentUser = users.find((u) => u.id === currentUserId) || null;
  const isAdmin = currentUser && currentUser.role === "admin";

  // Restore session from localStorage on load
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userId = localStorage.getItem('dmq_current_user');
    if (token && userId) {
      setCurrentUserId(userId);
    }
  }, []);

  const addNotification = useCallback((notif) => {
    setNotifications((list) => [{ id: uid("n"), read: false, timestamp: Date.now(), ...notif }, ...list]);
  }, [setNotifications]);

  const loadInitialData = useCallback(async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
      ]);
      console.log('Products loaded:', productsData);
      // Handle paginated response
      const productsArray = productsData.results || productsData;
      setProducts(productsArray);
    } catch (e) {
      console.error('Failed to load products:', e);
      setLoadError(e.message);
      pushToast("Failed to load products: " + e.message, "danger");
    } finally {
      setLoading(false);
    }
  }, [pushToast]);

  const loadUserData = useCallback(async () => {
    if (!currentUserId) return;
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      
      const [userData, ordersData, notificationsData] = await Promise.all([
        api.getCurrentUser(),
        api.getOrders(),
        api.getNotifications(),
      ]);
      setUsers((prev) => {
        const exists = prev.find(u => u.id === userData.id);
        if (exists) return prev;
        return [...prev, userData];
      });
      // Handle paginated responses
      setOrders(ordersData.results || ordersData);
      setNotifications(notificationsData.results || notificationsData);
    } catch (e) {
      // Token might be expired, clear it
      if (e.message?.includes('401') || e.message?.includes('Unauthorized')) {
        api.clearTokens();
        setCurrentUserId(null);
      } else {
        pushToast("Failed to load user data", "danger");
      }
    }
  }, [currentUserId, pushToast]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  /* ---- cart helpers ---- */
  const cartWithProducts = cart
    .map((c) => ({ ...c, product: products.find((p) => p.id === c.productId) }))
    .filter((c) => c.product);
  const cartTotal = cartWithProducts.reduce((sum, c) => sum + c.product.price * c.qty, 0);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  function addToCart(productId, qty) {
    setCart((prev) => {
      const existing = prev.find((c) => c.productId === productId);
      if (existing) {
        return prev.map((c) => (c.productId === productId ? { ...c, qty: c.qty + qty } : c));
      }
      return [...prev, { productId, qty }];
    });
    pushToast("Added to cart", "default");
  }
  function updateCartQty(productId, qty) {
    setCart((prev) =>
      qty <= 0 ? prev.filter((c) => c.productId !== productId) : prev.map((c) => (c.productId === productId ? { ...c, qty } : c))
    );
  }
  function removeFromCart(productId) {
    setCart((prev) => prev.filter((c) => c.productId !== productId));
  }

  /* ---- auth ---- */
  async function handleRegister({ name, phone, email, password }) {
    try {
      const username = email.split('@')[0] + '_' + Date.now().toString(36).slice(-4);
      console.log('Registering with:', { username, name, phone, email });
      const data = await api.register({ username, name, phone, email, password, password_confirm: password });
      api.setTokens(data.access, data.refresh);
      setUsers((u) => [...u, data.user]);
      setCurrentUserId(data.user.id);
      pushToast("Account created — welcome, " + name.split(" ")[0] + "!", "accent");
      setView("shop");
      loadUserData();
      return true;
    } catch (e) {
      console.error('Register error:', e);
      pushToast(e.message || "Registration failed", "danger");
      return false;
    }
  }
  async function handleLogin({ email, password }) {
    try {
      console.log('Logging in with:', { email });
      const data = await api.login(email, password);
      api.setTokens(data.access, data.refresh);
      setUsers((u) => {
        const exists = u.find(x => x.id === data.user.id);
        if (exists) return u;
        return [...u, data.user];
      });
      setCurrentUserId(data.user.id);
      pushToast("Welcome back, " + data.user.name.split(" ")[0], "accent");
      setView(data.user.role === "admin" ? "admin" : "shop");
      loadUserData();
      return true;
    } catch (e) {
      console.error('Login error:', e);
      pushToast(e.message || "Incorrect email or password", "danger");
      return false;
    }
  }
  function handleLogout() {
    api.clearTokens();
    setCurrentUserId(null);
    setView("shop");
  }

  /* ---- checkout ---- */
  async function placeOrder({ deliveryName, deliveryPhone, deliveryLocation, paymentMethod, notes }) {
    if (cartWithProducts.length === 0) return;
    try {
      const order = await api.createOrder(cartWithProducts, { deliveryName, deliveryPhone, deliveryLocation, paymentMethod, notes });
      setOrders((o) => [order, ...o]);
      const productsData = await api.getProducts();
      setProducts(productsData.results || productsData);
      setCart([]);
      pushToast("Order placed! Reference " + order.id, "accent");
      setView("orders");
      loadUserData();
    } catch (e) {
      pushToast(e.message || "Failed to place order", "danger");
    }
  }

  async function updateOrderStatus(orderId, status) {
    try {
      const updated = await api.updateOrderStatus(orderId, status);
      setOrders((list) => list.map((o) => (o.id === orderId ? updated : o)));
      pushToast("Order " + orderId + " updated to " + status, "default");
      loadUserData();
    } catch (e) {
      pushToast(e.message || "Failed to update order", "danger");
    }
  }

  async function cancelOrder(orderId) {
    try {
      await api.cancelOrder(orderId);
      setOrders((list) => list.map((o) => (o.id === orderId ? { ...o, status: CANCELLED } : o)));
      pushToast("Order " + orderId + " cancelled", "default");
      loadUserData();
    } catch (e) {
      pushToast(e.message || "Failed to cancel order", "danger");
    }
  }

  /* ---- product / inventory management ---- */
  async function addProduct(p) {
    try {
      const newProduct = await api.createProduct(p);
      setProducts((list) => [...list, newProduct]);
      pushToast("Product added", "accent");
    } catch (e) {
      pushToast(e.message || "Failed to add product", "danger");
    }
  }
  async function updateProduct(id, patch) {
    try {
      const updated = await api.updateProduct(id, patch);
      setProducts((list) => list.map((p) => (p.id === id ? updated : p)));
      pushToast("Product updated", "accent");
    } catch (e) {
      pushToast(e.message || "Failed to update product", "danger");
    }
  }
  async function deleteProduct(id) {
    try {
      await api.deleteProduct(id);
      setProducts((list) => list.filter((p) => p.id !== id));
      pushToast("Product removed", "default");
    } catch (e) {
      pushToast(e.message || "Failed to remove product", "danger");
    }
  }

  const myNotifications = notifications.filter((n) =>
    currentUser ? (isAdmin ? n.audience === "admin" : n.audience === currentUser.id) : false
  );
  const unreadCount = myNotifications.filter((n) => !n.read).length;
  async function markAllRead() {
    try {
      await api.markAllNotificationsRead();
      const ids = new Set(myNotifications.map((n) => n.id));
      setNotifications((list) => list.map((n) => (ids.has(n.id) ? { ...n, read: true } : n)));
    } catch (e) {
      pushToast("Failed to mark notifications read", "danger");
    }
  }

  const waLink =
    "https://wa.me/" + FARM.phone + "?text=" +
    encodeURIComponent("Hello Demaquacs Research Livestock Farm, I'd like to ask about your livestock/products.");

  if (loading) {
    return (
      <div className="app">
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 18 }}>Loading…</div>
          {loadError && <div style={{ color: 'red', textAlign: 'center', padding: '0 20px' }}>Error: {loadError}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <ToastStack toasts={toasts} />
      <div className="topbar">
        <span>📍 {FARM.address}</span>
        <span>☎ {FARM.phoneDisplay}</span>
      </div>
      <Header
        view={view} setView={setView} isAdmin={isAdmin} currentUser={currentUser}
        cartCount={cartCount} unreadCount={unreadCount}
        showNotifPanel={showNotifPanel} setShowNotifPanel={setShowNotifPanel}
        notifications={myNotifications} markAllRead={markAllRead}
      />

      <div className="container">
        {view === "shop" && <ShopView products={products} addToCart={addToCart} />}
        {view === "cart" && (
          <CartView
            cartItems={cartWithProducts} updateCartQty={updateCartQty} removeFromCart={removeFromCart}
            total={cartTotal} onCheckout={() => setView("checkout")}
          />
        )}
        {view === "checkout" && (
          <CheckoutView
            cartItems={cartWithProducts} total={cartTotal} currentUser={currentUser}
            paymentMethods={PAYMENT_METHODS}
            onPlaceOrder={placeOrder} onBack={() => setView("cart")}
          />
        )}
        {view === "account" && (
          <AccountView
            currentUser={currentUser} onLogin={handleLogin} onRegister={handleRegister}
            onLogout={handleLogout} setView={setView}
          />
        )}
        {view === "orders" && (
          <OrdersView
            orders={orders.filter((o) => currentUser && o.user_id === currentUser.id)}
            currentUser={currentUser} setView={setView} onCancel={cancelOrder}
          />
        )}
        {view === "admin" && isAdmin && (
          <AdminView
            products={products} orders={orders} users={users}
            notifications={notifications.filter((n) => n.audience === "admin")}
            addProduct={addProduct} updateProduct={updateProduct} deleteProduct={deleteProduct}
            updateOrderStatus={updateOrderStatus} markAllRead={markAllRead}
          />
        )}
      </div>

      <a className="wa-float" href={waLink} target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp" title="Chat with us on WhatsApp">
        💬
      </a>

      <footer className="footer">
        <div className="footer-inner">
          <div>
            <h4>{FARM.name}</h4>
            <p>{FARM.address}</p>
          </div>
          <div>
            <h4>Contact</h4>
            <p><a href={waLink} target="_blank" rel="noopener noreferrer">WhatsApp: {FARM.phoneDisplay}</a></p>
            <p><a href={"mailto:" + FARM.email}>{FARM.email}</a></p>
          </div>
          <div>
            <h4>Order portal</h4>
            <p>Connected to demaquacs-backend API.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}