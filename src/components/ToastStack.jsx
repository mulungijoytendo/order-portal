import React from "react";

export default function ToastStack({ toasts }) {
  return (
    <div className="toast-wrap">
      {toasts.map((t) => (
        <div key={t.id} className={"toast " + (t.kind === "accent" ? "accent" : t.kind === "danger" ? "danger" : "")}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
