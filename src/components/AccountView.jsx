import React, { useState } from "react";

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <form onSubmit={(e) => { e.preventDefault(); onLogin({ email, password }); }}>
      <div className="field">
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="field">
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <button className="btn btn-primary btn-block">Sign in</button>
    </form>
  );
}

function RegisterForm({ onRegister }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <form onSubmit={(e) => { e.preventDefault(); onRegister({ name, phone, email, password }); }}>
      <div className="field">
        <label>Full name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="field">
        <label>Phone number</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} required />
      </div>
      <div className="field">
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="field">
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
      </div>
      <button className="btn btn-primary btn-block">Create account</button>
    </form>
  );
}

export default function AccountView({ currentUser, onLogin, onRegister, onLogout, setView }) {
  const [mode, setMode] = useState("login");

  if (currentUser) {
    return (
      <div style={{ maxWidth: 420 }}>
        <div className="section-head"><h2>My account</h2></div>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontWeight: 600, fontSize: 16 }}>{currentUser.name}</div>
          <div className="muted" style={{ fontSize: 13.5, marginTop: 2 }}>{currentUser.email}</div>
          <div className="muted" style={{ fontSize: 13.5 }}>{currentUser.phone}</div>
          <span className="pill pill-neutral" style={{ marginTop: 10 }}>
            {currentUser.role === "admin" ? "Administrator" : "Customer"}
          </span>
          <hr className="divider" />
          {currentUser.role !== "admin" && (
            <button className="btn btn-ghost btn-block" style={{ marginBottom: 8 }} onClick={() => setView("orders")}>
              View my orders
            </button>
          )}
          {currentUser.role === "admin" && (
            <button className="btn btn-ghost btn-block" style={{ marginBottom: 8 }} onClick={() => setView("admin")}>
              Go to admin dashboard
            </button>
          )}
          <button className="btn btn-danger-ghost btn-block" onClick={onLogout}>Log out</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 420 }}>
      <div className="section-head"><h2>{mode === "login" ? "Sign in" : "Create an account"}</h2></div>
      <div className="demo-note">Demo admin login — email: admin@demaquacsfarm.ug · password: admin123</div>
      <div className="auth-toggle">
        <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Sign in</button>
        <button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>Register</button>
      </div>
      <div className="card" style={{ padding: 20 }}>
        {mode === "login" ? <LoginForm onLogin={onLogin} /> : <RegisterForm onRegister={onRegister} />}
      </div>
    </div>
  );
}
