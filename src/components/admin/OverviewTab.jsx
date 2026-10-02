import React from "react";
import { UGX, statusPillClass } from "../../utils.js";

export default function OverviewTab({ orders, products, revenue, pending, lowStock }) {
  const recent = orders.slice(0, 5);
  return (
    <div>
      <div className="stat-grid">
        <div className="card stat-card"><div className="v">{UGX(revenue)}</div><div className="l">Total revenue</div></div>
        <div className="card stat-card"><div className="v">{orders.length}</div><div className="l">Total orders</div></div>
        <div className="card stat-card"><div className="v">{pending}</div><div className="l">Awaiting confirmation</div></div>
        <div className="card stat-card"><div className="v">{lowStock.length}</div><div className="l">Low / out of stock</div></div>
        <div className="card stat-card"><div className="v">{products.length}</div><div className="l">Products listed</div></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16 }}>
        <div className="card" style={{ padding: 16 }}>
          <h3 style={{ marginTop: 0, fontSize: 15 }}>Recent orders</h3>
          {recent.length === 0 && <div className="muted">No orders yet.</div>}
          {recent.map((o) => (
            <div key={o.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--color-line)", fontSize: 13.5 }}>
              <span>#{o.id}</span><span className={"pill " + statusPillClass(o.status)}>{o.status}</span><span>{UGX(o.total)}</span>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding: 16 }}>
          <h3 style={{ marginTop: 0, fontSize: 15 }}>Stock alerts</h3>
          {lowStock.length === 0 && <div className="muted">All products are well stocked.</div>}
          {lowStock.map((p) => (
            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--color-line)", fontSize: 13.5 }}>
              <span>{p.emoji} {p.name}</span>
              <span className={"pill " + (p.stock <= 0 ? "pill-danger" : "pill-warning")}>
                {p.stock <= 0 ? "Out of stock" : p.stock + " left"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
