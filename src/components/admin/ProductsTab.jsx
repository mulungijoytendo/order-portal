import React, { useState } from "react";
import { CATEGORIES } from "../../data.js";

function AddProductModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name: "", category: "Livestock", price: "", unit: "per head",
    stock: "", lowStockAt: 3, emoji: "🐐", description: "",
  });
  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }
  function submit(e) {
    e.preventDefault();
    if (!form.name || !form.price) return;
    onAdd({ ...form, price: Number(form.price), stock: Number(form.stock) || 0, lowStockAt: Number(form.lowStockAt) || 3 });
  }
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3 style={{ margin: 0, fontSize: 17 }}>Add product</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={submit}>
          <div className="field"><label>Name</label><input value={form.name} onChange={(e) => set("name", e.target.value)} required /></div>
          <div className="two-col">
            <div className="field">
              <label>Category</label>
              <select value={form.category} onChange={(e) => set("category", e.target.value)}>
                {CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="field"><label>Emoji icon</label><input value={form.emoji} onChange={(e) => set("emoji", e.target.value)} /></div>
          </div>
          <div className="two-col">
            <div className="field"><label>Price (UGX)</label><input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} required /></div>
            <div className="field"><label>Unit</label><input value={form.unit} onChange={(e) => set("unit", e.target.value)} placeholder="per head / per tray" /></div>
          </div>
          <div className="two-col">
            <div className="field"><label>Starting stock</label><input type="number" value={form.stock} onChange={(e) => set("stock", e.target.value)} /></div>
            <div className="field"><label>Low-stock alert at</label><input type="number" value={form.lowStockAt} onChange={(e) => set("lowStockAt", e.target.value)} /></div>
          </div>
          <div className="field"><label>Description</label><textarea rows="2" value={form.description} onChange={(e) => set("description", e.target.value)} /></div>
          <button className="btn btn-primary btn-block">Add product</button>
        </form>
      </div>
    </div>
  );
}

export default function ProductsTab({ products, addProduct, updateProduct, deleteProduct }) {
  const [showAdd, setShowAdd] = useState(false);
  return (
    <div>
      <div className="section-head">
        <h3 style={{ margin: 0 }}>Products &amp; inventory</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>+ Add product</button>
      </div>
      <div className="card scroll-x">
        <table>
          <thead>
            <tr><th>Product</th><th>Category</th><th>Price (UGX)</th><th>Stock</th><th>Low-stock alert</th><th></th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.emoji} {p.name}</td>
                <td>{p.category}</td>
                <td>
                  <input className="stock-input" style={{ width: 90 }} type="number" value={p.price}
                    onChange={(e) => updateProduct(p.id, { price: Number(e.target.value) })} />
                </td>
                <td><input className="stock-input" type="number" value={p.stock} onChange={(e) => updateProduct(p.id, { stock: Number(e.target.value) })} /></td>
                <td><input className="stock-input" type="number" value={p.lowStockAt} onChange={(e) => updateProduct(p.id, { lowStockAt: Number(e.target.value) })} /></td>
                <td><button className="btn btn-ghost btn-sm" onClick={() => deleteProduct(p.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showAdd && <AddProductModal onClose={() => setShowAdd(false)} onAdd={(p) => { addProduct(p); setShowAdd(false); }} />}
    </div>
  );
}
