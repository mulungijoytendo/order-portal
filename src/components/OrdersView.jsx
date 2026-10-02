import React from "react";
import { STATUS_FLOW, CANCELLED } from "../data.js";
import { UGX, timeAgo, statusIndex, statusPillClass } from "../utils.js";

function OrderStatusTrack({ status }) {
  const idx = statusIndex(status);
  return (
    <div>
      <div className="status-track">
        {STATUS_FLOW.map((s, i) => (
          <div key={s} className={"status-step " + (status === CANCELLED ? "cancelled" : i <= idx ? "done" : "")} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5 }} className="muted">
        <span>Placed</span><span>Delivered</span>
      </div>
    </div>
  );
}

export default function OrdersView({ orders, currentUser, setView, onCancel }) {
  if (!currentUser) {
    return (
      <div className="empty-state">
        <div className="glyph">🔑</div>Sign in to view your orders.
        <div style={{ marginTop: 10 }}><button className="btn btn-primary" onClick={() => setView("account")}>Sign in</button></div>
      </div>
    );
  }
  if (orders.length === 0) {
    return (
      <div className="empty-state">
        <div className="glyph">📦</div>No orders yet.
        <div style={{ marginTop: 10 }}><button className="btn btn-primary" onClick={() => setView("shop")}>Browse the shop</button></div>
      </div>
    );
  }
  return (
    <div>
      <div className="section-head"><h2>My orders</h2></div>
      {orders.map((o) => (
        <div className="card order-card" key={o.id}>
          <div className="order-head">
            <div>
              <div className="order-id">#{o.id}</div>
              <div className="order-items-mini">{o.items.map((i) => i.qty + "× " + i.name).join(", ")}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <span className={"pill " + statusPillClass(o.status)}>{o.status}</span>
              <div style={{ fontWeight: 700, marginTop: 6 }}>{UGX(o.total)}</div>
            </div>
          </div>
          <OrderStatusTrack status={o.status} />
          <div className="muted" style={{ fontSize: 12.5, marginTop: 8 }}>
            Placed {timeAgo(o.createdAt)} · Payment: {o.paymentMethod === "cod" ? "Cash on delivery" : o.paymentMethod.toUpperCase()} ({o.paymentStatus})
          </div>
          {o.status === "Pending Confirmation" && (
            <button className="btn btn-danger-ghost btn-sm" style={{ marginTop: 10 }} onClick={() => onCancel(o.id)}>
              Cancel order
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
