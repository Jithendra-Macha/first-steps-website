import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Btn } from "@/components/coh/SharedComponents";

const A = "#ff4d00";
const NAVY = "#0d1f38";
const BRD = "#e8e8e8";

export default function ResetPassword() {
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) setIsRecovery(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (password !== confirm) { setError("Passwords don't match"); return; }
    setLoading(true);
    const { error: err } = await updatePassword(password);
    if (err) setError(err.message); else setSuccess(true);
    setLoading(false);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 14px", borderRadius: 10,
    border: `1.5px solid ${BRD}`, fontSize: ".85rem", fontFamily: "inherit",
    outline: "none", boxSizing: "border-box",
  };

  if (!isRecovery) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f8f8" }}>
        <div style={{ textAlign: "center", padding: 40 }}>
          <h2 style={{ color: NAVY }}>Invalid Reset Link</h2>
          <p>This link is invalid or has expired.</p>
          <a href="/" style={{ color: A, fontWeight: 700 }}>Go Home</a>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f8f8" }}>
        <div style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>✅</div>
          <h2 style={{ color: NAVY }}>Password Updated!</h2>
          <p>Your password has been changed successfully.</p>
          <a href="/" style={{ color: A, fontWeight: 700 }}>Go Home</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f8f8", padding: 20 }}>
      <form onSubmit={handleSubmit} style={{ background: "#fff", borderRadius: 20, padding: 32, maxWidth: 400, width: "100%", boxShadow: "0 8px 40px rgba(0,0,0,.1)" }}>
        <h2 style={{ color: NAVY, fontWeight: 900, marginBottom: 8 }}>Set New Password</h2>
        {error && <div style={{ background: "#fee", border: "1px solid #fcc", color: "#c00", borderRadius: 10, padding: "10px 14px", fontSize: ".78rem", marginBottom: 16 }}>{error}</div>}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: ".72rem", fontWeight: 700, color: NAVY, marginBottom: 4, display: "block" }}>New Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} required minLength={6} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: ".72rem", fontWeight: 700, color: NAVY, marginBottom: 4, display: "block" }}>Confirm Password</label>
          <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} style={inputStyle} required />
        </div>
        <Btn type="submit" disabled={loading} style={{ width: "100%", height: 44, fontSize: ".85rem" }}>
          {loading ? "Updating..." : "Update Password"}
        </Btn>
      </form>
    </div>
  );
}
