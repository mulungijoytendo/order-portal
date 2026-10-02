import React, { useEffect, useRef } from "react";
import { timeAgo } from "../utils.js";

export default function Header({
  view, setView, isAdmin, currentUser, cartCount, unreadCount,
  showNotifPanel, setShowNotifPanel, notifications, markAllRead,
}) {
  const panelRef = useRef(null);
  useEffect(() => {
    function onClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) setShowNotifPanel(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [setShowNotifPanel]);

  return (
    <header className="header">
      <div className="header-inner">
        <a className="brand" href="#" onClick={(e) => { e.preventDefault(); setView("shop"); }}>
          <div className="brand-mark">D</div>
          <div className="brand-text">
            <div className="name">Demaquacs Research Livestock Farm</div>
            <div className="tag">Order Portal · Kampala, Uganda</div>
          </div>
        </a>
        <nav className="nav">
          <button className={"nav-btn " + (view === "shop" ? "active" : "")} onClick={() => setView("shop")}>
            🛒<span className="icon-btn-label">Shop</span>
          </button>
          {currentUser && !isAdmin && (
            <button className={"nav-btn " + (view === "orders" ? "active" : "")} onClick={() => setView("orders")}>
              📦<span className="icon-btn-label">Orders</span>
            </button>
          )}
          {isAdmin && (
            <button className={"nav-btn " + (view === "admin" ? "active" : "")} onClick={() => setView("admin")}>
              🗂<span className="icon-btn-label">Admin</span>
            </button>
          )}
          {currentUser && (
            <div style={{ position: "relative" }} ref={panelRef}>
              <button
                className="nav-btn"
                onClick={() => { setShowNotifPanel((s) => !s); if (!showNotifPanel) markAllRead(); }}
                aria-label="Notifications"
              >
                🔔<span className="icon-btn-label">Alerts</span>
                {unreadCount > 0 && <span className="badge-dot">{unreadCount}</span>}
              </button>
              {showNotifPanel && (
                <div className="notif-panel card">
                  {notifications.length === 0 && (
                    <div className="empty-state" style={{ padding: 24 }}>
                      <div className="glyph">🔔</div>No notifications yet
                    </div>
                  )}
                  {notifications.map((n) => (
                    <div key={n.id} className={"notif-item " + (!n.read ? "unread" : "")}>
                      <div className="dot" />
                      <div>
                        <div>{n.message}</div>
                        <div className="notif-time">{timeAgo(n.timestamp)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <button className={"nav-btn " + (view === "cart" ? "active" : "")} onClick={() => setView("cart")} aria-label="Cart">
            🧺<span className="icon-btn-label">Cart</span>
            {cartCount > 0 && <span className="badge-dot">{cartCount}</span>}
          </button>
          <button className={"nav-btn " + (view === "account" ? "active" : "")} onClick={() => setView("account")}>
            {currentUser ? "👤" : "🔑"}
            <span className="icon-btn-label">{currentUser ? currentUser.name.split(" ")[0] : "Sign in"}</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
