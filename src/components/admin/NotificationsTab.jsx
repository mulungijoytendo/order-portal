import React from "react";
import { timeAgo } from "../../utils.js";

export default function NotificationsTab({ notifications }) {
  return (
    <div>
      <h3 style={{ marginTop: 0, fontSize: 15 }}>Admin notifications</h3>
      <div className="card" style={{ padding: 6 }}>
        {notifications.length === 0 && (
          <div className="empty-state">
            <div className="glyph">🔔</div>Nothing yet — new orders and stock alerts will show up here.
          </div>
        )}
        {notifications.map((n) => (
          <div key={n.id} className={"notif-item " + (!n.read ? "unread" : "")} style={{ borderBottom: "1px solid var(--color-line)" }}>
            <div className="dot" />
            <div>
              <div>{n.type === "low_stock" ? "⚠️ " : "🧾 "}{n.message}</div>
              <div className="notif-time">{timeAgo(n.timestamp)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
