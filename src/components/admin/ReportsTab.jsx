import React from "react";
import { CANCELLED } from "../../data.js";
import { statusPillClass } from "../../utils.js";

function BarChart({ data, valueFormatter }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="bar-chart">
      {data.map((d) => (
        <div className="col" key={d.label}>
          <div style={{ fontSize: 11, fontWeight: 600 }}>{valueFormatter ? valueFormatter(d.value) : d.value}</div>
          <div className="bar" style={{ height: Math.max(4, (d.value / max) * 110) + "px" }} />
          <div className="lbl">{d.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function ReportsTab({ orders, products }) {
  const active = orders.filter((o) => o.status !== CANCELLED);

  // sales by category
  const catTotals = {};
  active.forEach((o) => o.items.forEach((i) => {
    const prod = products.find((p) => p.id === i.productId);
    const cat = prod ? prod.category : "Other";
    catTotals[cat] = (catTotals[cat] || 0) + i.price * i.qty;
  }));
  const catData = Object.entries(catTotals).map(([label, value]) => ({ label, value }));

  // orders over last 7 days
  const days = [...Array(7)].map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return d;
  });
  const dayData = days.map((d) => {
    const label = d.toLocaleDateString(undefined, { weekday: "short" });
    const count = orders.filter((o) => new Date(o.createdAt).toDateString() === d.toDateString()).length;
    return { label, value: count };
  });

  // top products
  const qtyByProduct = {};
  active.forEach((o) => o.items.forEach((i) => { qtyByProduct[i.productId] = (qtyByProduct[i.productId] || 0) + i.qty; }));
  const topProducts = Object.entries(qtyByProduct)
    .map(([id, qty]) => ({ product: products.find((p) => p.id === id), qty }))
    .filter((x) => x.product)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  const statusCounts = {};
  orders.forEach((o) => { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1; });

  return (
    <div>
      <h3 style={{ marginTop: 0, fontSize: 15 }}>Reports</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div className="card" style={{ padding: 16 }}>
          <h4 style={{ margin: "0 0 4px", fontSize: 13.5 }}>Revenue by category</h4>
          {catData.length === 0
            ? <div className="muted" style={{ fontSize: 13 }}>No sales yet.</div>
            : <BarChart data={catData} valueFormatter={(v) => (v / 1000).toFixed(0) + "k"} />}
        </div>
        <div className="card" style={{ padding: 16 }}>
          <h4 style={{ margin: "0 0 4px", fontSize: 13.5 }}>Orders — last 7 days</h4>
          <BarChart data={dayData} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card" style={{ padding: 16 }}>
          <h4 style={{ margin: "0 0 8px", fontSize: 13.5 }}>Top-selling products</h4>
          {topProducts.length === 0 && <div className="muted" style={{ fontSize: 13 }}>No sales yet.</div>}
          {topProducts.map((t) => (
            <div key={t.product.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13.5, borderBottom: "1px solid var(--color-line)" }}>
              <span>{t.product.emoji} {t.product.name}</span><span>{t.qty} sold</span>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding: 16 }}>
          <h4 style={{ margin: "0 0 8px", fontSize: 13.5 }}>Orders by status</h4>
          {Object.keys(statusCounts).length === 0 && <div className="muted" style={{ fontSize: 13 }}>No orders yet.</div>}
          {Object.entries(statusCounts).map(([s, c]) => (
            <div key={s} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13.5, borderBottom: "1px solid var(--color-line)" }}>
              <span className={"pill " + statusPillClass(s)}>{s}</span><span>{c}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
