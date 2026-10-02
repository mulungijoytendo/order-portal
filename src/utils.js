import { useState, useEffect, useCallback } from "react";
import { STATUS_FLOW, CANCELLED } from "./data.js";

export const UGX = (n) => "UGX " + Number(n).toLocaleString("en-UG");

export function uid(prefix) {
  return prefix + "_" + Math.random().toString(36).slice(2, 9);
}

export function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return m + "m ago";
  const h = Math.floor(m / 60);
  if (h < 24) return h + "h ago";
  const d = Math.floor(h / 24);
  return d + "d ago";
}

/**
 * Persists state to localStorage. Good enough for a demo / single-device use.
 * For a real multi-user deployment, replace this with calls to your backend/database
 * so data is shared across customers, devices and admins instead of living per-browser.
 */
export function usePersistentState(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch (e) {
      return initial;
    }
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
      /* storage unavailable */
    }
  }, [key, state]);
  return [state, setState];
}

export function useToasts() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((message, kind) => {
    const id = uid("t");
    setToasts((t) => [...t, { id, message, kind: kind || "default" }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);
  return [toasts, push];
}

export function statusIndex(status) {
  if (status === CANCELLED) return -1;
  return STATUS_FLOW.indexOf(status);
}

export function statusPillClass(status) {
  if (status === CANCELLED) return "pill-danger";
  if (status === "Delivered") return "pill-success";
  if (status === "Pending Confirmation") return "pill-neutral";
  return "pill-warning";
}
