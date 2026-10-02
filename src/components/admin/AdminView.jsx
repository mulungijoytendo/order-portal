import React, { useState, useEffect } from "react";
import { CANCELLED } from "../../data.js";
import OverviewTab from "./OverviewTab.jsx";
import ProductsTab from "./ProductsTab.jsx";
import OrdersTab from "./OrdersTab.jsx";
import ReportsTab from "./ReportsTab.jsx";
import NotificationsTab from "./NotificationsTab.jsx";

export default function AdminView({
  products, orders, users, notifications,
  addProduct, updateProduct, deleteProduct, updateOrderStatus, markAllRead,
}) {
  const [tab, setTab] = useState("overview");
  useEffect(() => { markAllRead(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const revenue = orders.filter((o) => o.status !== CANCELLED).reduce((s, o) => s + o.total, 0);
  const pending = orders.filter((o) => o.status === "Pending Confirmation").length;
  const lowStock = products.filter((p) => p.stock <= p.lowStockAt);

  const TABS = [
    ["overview", "Overview"],
    ["products", "Products & inventory"],
    ["orders", "Orders"],
    ["reports", "Reports"],
    ["notifications", "Notifications"],
  ];

  return (
    <div>
      <div className="section-head"><h2>Admin dashboard</h2></div>
      <div className="admin-tabs">
        {TABS.map(([id, label]) => (
          <button key={id} className={"admin-tab " + (tab === id ? "active" : "")} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <OverviewTab orders={orders} products={products} revenue={revenue} pending={pending} lowStock={lowStock} />
      )}
      {tab === "products" && (
        <ProductsTab products={products} addProduct={addProduct} updateProduct={updateProduct} deleteProduct={deleteProduct} />
      )}
      {tab === "orders" && (
        <OrdersTab orders={orders} users={users} updateOrderStatus={updateOrderStatus} />
      )}
      {tab === "reports" && <ReportsTab orders={orders} products={products} />}
      {tab === "notifications" && <NotificationsTab notifications={notifications} />}
    </div>
  );
}
