import React, { useState } from "react";
import { STATUS_FLOW, CANCELLED } from "../../data.js";
import { UGX, timeAgo, statusPillClass } from "../../utils.js";

export default function OrdersTab({ orders, users, updateOrderStatus }) {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? orders : orders.filter((o) => o.status === filter);

  function customerFor(o) {
    if (o.guestInfo) return o.guestInfo.name + " (guest)";
    const u = users.find((x) => x.id === o.userId);
    return u ? u.name : "—";
  }

  return (
    <div>
      <div className="section-head">
        <h3 style={{ margin: 0 }}>Order management</h3>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid var(--color-line)" }}>
          <option>All</option>
          {STATUS_FLOW.map((s) => <option key={s}>{s}</option>)}
          <option>{CANCELLED}</option>
        </select>
      </div>
      {filtered.length === 0 && <div className="empty-state"><div className="glyph">📦</div>No orders in this view.</div>}
      <div className="card scroll-x">
        {filtered.length > 0 && (
          <table>
            <thead>
              <tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Update</th></tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id}>
                  <td>#{o.id}<div className="muted" style={{ fontSize: 11 }}>{timeAgo(o.createdAt)}</div></td>
                  <td>{customerFor(o)}<div className="muted" style={{ fontSize: 11 }}>{o.deliveryPhone}</div></td>
                  <td style={{ maxWidth: 220 }}>{o.items.map((i) => i.qty + "× " + i.name).join(", ")}</td>
                  <td>{UGX(o.total)}</td>
                  <td>
                    {o.paymentMethod === "cod" ? "COD" : o.paymentMethod.toUpperCase()}
                    <div className="muted" style={{ fontSize: 11 }}>{o.paymentStatus}</div>
                  </td>
                  <td><span className={"pill " + statusPillClass(o.status)}>{o.status}</span></td>
                  <td>
                    <select value={o.status} onChange={(e) => updateOrderStatus(o.id, e.target.value)} style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid var(--color-line)" }}>
                      {STATUS_FLOW.map((s) => <option key={s} value={s}>{s}</option>)}
                      <option value={CANCELLED}>{CANCELLED}</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
