import React from "react";
import { UGX } from "../utils.js";

export default function CartView({ cartItems, updateCartQty, removeFromCart, total, onCheckout }) {
  if (cartItems.length === 0) {
    return (
      <div className="empty-state">
        <div className="glyph">🧺</div>Your cart is empty.
        <div style={{ marginTop: 4, fontSize: 13 }}>Add some livestock or produce from the shop to get started.</div>
      </div>
    );
  }
  return (
    <div>
      <div className="section-head"><h2>Your cart</h2></div>
      <div className="card" style={{ padding: "6px 16px" }}>
        {cartItems.map((c) => (
          <div className="cart-row" key={c.productId}>
            <div className="cart-media">{c.product.emoji}</div>
            <div className="cart-info">
              <div className="n">{c.product.name}</div>
              <div className="p">{UGX(c.product.price)} · {c.product.unit}</div>
            </div>
            <div className="qty-stepper">
              <button onClick={() => updateCartQty(c.productId, c.qty - 1)}>−</button>
              <span>{c.qty}</span>
              <button disabled={c.qty >= c.product.stock} onClick={() => updateCartQty(c.productId, c.qty + 1)}>+</button>
            </div>
            <div style={{ minWidth: 90, textAlign: "right", fontWeight: 600, fontSize: 13.5 }}>
              {UGX(c.product.price * c.qty)}
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => removeFromCart(c.productId)} aria-label="Remove">✕</button>
          </div>
        ))}
      </div>
      <div className="card" style={{ padding: 16, marginTop: 16, maxWidth: 360, marginLeft: "auto" }}>
        <div className="cart-summary-row"><span>Subtotal</span><span>{UGX(total)}</span></div>
        <div className="cart-summary-row muted"><span>Delivery</span><span>Arranged after order</span></div>
        <div className="cart-summary-row total"><span>Total</span><span>{UGX(total)}</span></div>
        <button className="btn btn-accent btn-block" style={{ marginTop: 10 }} onClick={onCheckout}>
          Proceed to checkout
        </button>
      </div>
    </div>
  );
}
