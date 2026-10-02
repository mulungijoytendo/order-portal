import React, { useState } from "react";
import { CATEGORIES } from "../data.js";
import { UGX } from "../utils.js";

export default function ShopView({ products, addToCart }) {
  const [cat, setCat] = useState("All");
  const [qtys, setQtys] = useState({});

  const filtered = cat === "All" ? products : products.filter((p) => p.category === cat);

  function setQty(id, qty, max) {
    setQtys((q) => ({ ...q, [id]: Math.max(1, Math.min(max, qty)) }));
  }

  return (
    <div>
      <div className="section-head">
        <h2>Livestock &amp; farm produce</h2>
        <span className="muted">{filtered.length} items</span>
      </div>
      <div className="cat-tabs">
        {CATEGORIES.map((c) => (
          <button key={c} className={"cat-tab " + (cat === c ? "active" : "")} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="empty-state"><div className="glyph">🌾</div>Nothing in this category right now.</div>
      )}
      <div className="product-grid">
        {filtered.map((p) => {
          const q = qtys[p.id] || 1;
          const outOfStock = p.stock <= 0;
          const low = !outOfStock && p.stock <= p.lowStockAt;
          return (
            <div className="card product-card" key={p.id}>
              <div className="product-media">{p.emoji}</div>
              <div className="product-body">
                <div className="product-cat">{p.category}</div>
                <div className="product-name">{p.name}</div>
                <div className="muted" style={{ fontSize: 12.5, lineHeight: 1.4 }}>{p.description}</div>
                <div className="product-price">
                  {UGX(p.price)} <span className="product-unit">{p.unit}</span>
                </div>
                {outOfStock && <span className="pill pill-danger">Out of stock</span>}
                {low && <span className="pill pill-warning">Only {p.stock} left</span>}
                {!outOfStock && !low && <span className="pill pill-success">In stock</span>}
                <div className="product-foot">
                  <div className="qty-stepper">
                    <button disabled={outOfStock} onClick={() => setQty(p.id, q - 1, p.stock)}>−</button>
                    <span>{q}</span>
                    <button disabled={outOfStock} onClick={() => setQty(p.id, q + 1, p.stock)}>+</button>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    disabled={outOfStock}
                    onClick={() => { addToCart(p.id, q); setQtys((old) => ({ ...old, [p.id]: 1 })); }}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
