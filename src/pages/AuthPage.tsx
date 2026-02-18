import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Btn } from "@/components/coh/SharedComponents";

const A = "#ff4d00";
const NAVY = "#0d1f38";
const SEC = "#888";
const BRD = "#e8e8e8";

export default function AuthPage({ onClose, initialMode = "login" }: { onClose: () => void; initialMode?: "login" | "signup" | "forgot" }) {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 14px", borderRadius: 10,
    border: `1.5px solid ${BRD}`, fontSize: ".85rem", fontFamily: "inherit",
    outline: "none", background: "#fff", boxSizing: "border-box",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (mode === "login") {
        const { error } = await signIn(email, password);
        if (error) throw error;
        onClose();
      } else if (mode === "signup") {
        if (!firstName.trim() || !lastName.trim()) { setError("Please fill in all fields"); setLoading(false); return; }
        const { error } = await signUp(email, password, firstName, lastName);
        if (error) throw error;
        setSuccess("Check your email to verify your account!");
      } else {
        const { error } = await resetPassword(email);
        if (error) throw error;
        setSuccess("Password reset link sent to your email!");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 600, background: "rgba(0,0,0,.6)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 24, maxWidth: 440, width: "100%", boxShadow: "0 24px 80px rgba(0,0,0,.2)", animation: "modalIn .3s ease-out", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ background: `linear-gradient(135deg, ${NAVY}, #1a3a60)`, padding: "28px 32px", color: "#fff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "1.2rem", fontWeight: 900 }}>
                {mode === "login" ? "Welcome Back" : mode === "signup" ? "Create Account" : "Reset Password"}
              </div>
              <div style={{ fontSize: ".76rem", opacity: .7, marginTop: 4 }}>
                {mode === "login" ? "Sign in to your account" : mode === "signup" ? "Join couple.ofhours today" : "We'll send you a reset link"}
              </div>
            </div>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,.15)", border: "none", color: "#fff", width: 32, height: 32, borderRadius: "50%", cursor: "pointer", fontSize: ".9rem" }}>✕</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "24px 32px 32px" }}>
          {error && <div style={{ background: "#fee", border: "1px solid #fcc", color: "#c00", borderRadius: 10, padding: "10px 14px", fontSize: ".78rem", marginBottom: 16 }}>{error}</div>}
          {success && <div style={{ background: "#efe", border: "1px solid #cfc", color: "#060", borderRadius: 10, padding: "10px 14px", fontSize: ".78rem", marginBottom: 16 }}>{success}</div>}

          {mode === "signup" && (
            <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: ".72rem", fontWeight: 700, color: NAVY, marginBottom: 4, display: "block" }}>First Name</label>
                <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="John" style={inputStyle} required />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: ".72rem", fontWeight: 700, color: NAVY, marginBottom: 4, display: "block" }}>Last Name</label>
                <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Doe" style={inputStyle} required />
              </div>
            </div>
          )}

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: ".72rem", fontWeight: 700, color: NAVY, marginBottom: 4, display: "block" }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={inputStyle} required />
          </div>

          {mode !== "forgot" && (
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: ".72rem", fontWeight: 700, color: NAVY, marginBottom: 4, display: "block" }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={inputStyle} required minLength={6} />
            </div>
          )}

          {mode === "login" && (
            <div style={{ textAlign: "right", marginTop: -12, marginBottom: 16 }}>
              <a onClick={() => { setMode("forgot"); setError(""); setSuccess(""); }} style={{ fontSize: ".72rem", color: A, cursor: "pointer", fontWeight: 600 }}>Forgot password?</a>
            </div>
          )}

          <Btn type="submit" disabled={loading} style={{ width: "100%", height: 44, fontSize: ".85rem", opacity: loading ? .6 : 1 }}>
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
          </Btn>

          <div style={{ textAlign: "center", marginTop: 20, fontSize: ".78rem", color: SEC }}>
            {mode === "login" ? (
              <>Don't have an account? <a onClick={() => { setMode("signup"); setError(""); setSuccess(""); }} style={{ color: A, fontWeight: 700, cursor: "pointer" }}>Sign Up</a></>
            ) : mode === "signup" ? (
              <>Already have an account? <a onClick={() => { setMode("login"); setError(""); setSuccess(""); }} style={{ color: A, fontWeight: 700, cursor: "pointer" }}>Sign In</a></>
            ) : (
              <a onClick={() => { setMode("login"); setError(""); setSuccess(""); }} style={{ color: A, fontWeight: 700, cursor: "pointer" }}>← Back to Sign In</a>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
