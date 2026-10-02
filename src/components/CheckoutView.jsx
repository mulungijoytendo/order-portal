import React, { useState } from "react";
import { UGX } from "../utils.js";

export default function CheckoutView({ cartItems, total, currentUser, paymentMethods, onPlaceOrder, onBack }) {
  const [deliveryName, setDeliveryName] = useState(currentUser ? currentUser.name : "");
  const [deliveryPhone, setDeliveryPhone] = useState(currentUser ? currentUser.phone : "");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [processing, setProcessing] = useState(false);

  const valid = deliveryName.trim() && deliveryPhone.trim() && deliveryLocation.trim();

  function submit(e) {
    e.preventDefault();
    if (!valid || processing) return;
    setProcessing(true);
    // Simulates a payment/authorization round-trip. Replace this timeout with a real
    // call to your payment gateway (Flutterwave, MTN MoMo API, Airtel Money API, etc.)
    // made from your backend, then call onPlaceOrder once payment is confirmed.
    setTimeout(() => {
      setProcessing(false);
      onPlaceOrder({ deliveryName, deliveryPhone, deliveryLocation, paymentMethod, notes });
    }, 900);
  }

  return (
    <div>
      <div className="section-head">
        <h2>Checkout</h2>
        <button className="btn btn-ghost btn-sm" onClick={onBack}>← Back to cart</button>
      </div>
      <div className="demo-note">
        This is a demo checkout. Orders are recorded and stock is updated, but no real money moves.
        To accept live payments, wire this form to a payment gateway from a backend service.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 20 }}>
        <form className="card" style={{ padding: 18 }} onSubmit={submit}>
          <h3 style={{ marginTop: 0, fontSize: 16 }}>Delivery details</h3>
          <div className="field">
            <label>Full name</label>
            <input value={deliveryName} onChange={(e) => setDeliveryName(e.target.value)} required />
          </div>
          <div className="field">
            <label>Phone number</label>
            <input value={deliveryPhone} onChange={(e) => setDeliveryPhone(e.target.value)} placeholder="07XX XXX XXX" required />
          </div>
          <div className="field">
            <label>Delivery location</label>
            <input value={deliveryLocation} onChange={(e) => setDeliveryLocation(e.target.value)} placeholder="Area, road, landmark" required />
          </div>
          <div className="field">
            <label>Notes (optional)</label>
            <textarea rows="2" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <h3 style={{ fontSize: 16 }}>Payment method</h3>
          {paymentMethods.map((m) => (
            <label
              key={m.id}
              className="card"
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", marginBottom: 8,
                borderColor: paymentMethod === m.id ? "var(--color-primary)" : "var(--color-line)",
              }}
            >
              <input type="radio" name="pay" checked={paymentMethod === m.id} onChange={() => setPaymentMethod(m.id)} />
              {m.label}
            </label>
          ))}

          <button className="btn btn-accent btn-block" style={{ marginTop: 14 }} disabled={!valid || processing}>
            {processing ? "Processing…" : "Place order — " + UGX(total)}
          </button>
        </form>

        <div className="card" style={{ padding: 18, alignSelf: "flex-start" }}>
          <h3 style={{ marginTop: 0, fontSize: 16 }}>Order summary</h3>
          {cartItems.map((c) => (
            <div key={c.productId} style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, padding: "6px 0" }}>
              <span>{c.qty}× {c.product.name}</span><span>{UGX(c.product.price * c.qty)}</span>
            </div>
          ))}
          <hr className="divider" />
          <div className="cart-summary-row total"><span>Total</span><span>{UGX(total)}</span></div>
        </div>
      </div>
    </div>
  );
}
