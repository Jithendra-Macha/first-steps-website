import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Btn, useIsMobile } from "@/components/coh/SharedComponents";

const A = "#ff4d00";
const NAVY = "#0d1f38";
const SEC = "#888";
const BRD = "#e8e8e8";

export default function ProfilePage({ onBack }: { onBack: () => void }) {
  const { user, updatePassword, signOut } = useAuth();
  const mob = useIsMobile();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tab, setTab] = useState<"profile" | "password">("profile");

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("first_name, last_name").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => {
        if (data) { setFirstName(data.first_name || ""); setLastName(data.last_name || ""); }
      });
  }, [user]);

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 14px", borderRadius: 10,
    border: `1.5px solid ${BRD}`, fontSize: ".85rem", fontFamily: "inherit",
    outline: "none", boxSizing: "border-box",
  };

  const handleProfileSave = async () => {
    setLoading(true); setError(""); setSuccess("");
    const { error: err } = await supabase.from("profiles").update({ first_name: firstName, last_name: lastName }).eq("user_id", user!.id);
    if (err) setError(err.message); else setSuccess("Profile updated!");
    setLoading(false);
  };

  const handlePasswordChange = async () => {
    setError(""); setSuccess("");
    if (newPassword.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (newPassword !== confirmPassword) { setError("Passwords don't match"); return; }
    setLoading(true);
    const { error: err } = await updatePassword(newPassword);
    if (err) setError(err.message); else { setSuccess("Password updated!"); setNewPassword(""); setConfirmPassword(""); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f8" }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${NAVY}, #1a3a60)`, padding: mob ? "20px 4%" : "32px 5%", color: "#fff" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <button onClick={onBack} style={{ background: "rgba(255,255,255,.15)", border: "none", color: "#fff", padding: "8px 16px", borderRadius: 10, cursor: "pointer", fontSize: ".78rem", fontWeight: 600, marginBottom: 16 }}>← Back</button>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: A, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", fontWeight: 900, color: "#fff" }}>
              {(firstName[0] || user?.email?.[0] || "U").toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: "1.2rem", fontWeight: 900 }}>{firstName || "User"} {lastName}</div>
              <div style={{ fontSize: ".76rem", opacity: .7 }}>{user?.email}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: mob ? "20px 4%" : "32px 5%" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, marginBottom: 24, borderBottom: `2px solid ${BRD}` }}>
          {(["profile", "password"] as const).map(t => (
            <button key={t} onClick={() => { setTab(t); setError(""); setSuccess(""); }} style={{
              background: "none", border: "none", padding: "12px 24px", fontSize: ".82rem", fontWeight: 700,
              color: tab === t ? A : SEC, borderBottom: tab === t ? `3px solid ${A}` : "3px solid transparent",
              cursor: "pointer", textTransform: "capitalize", marginBottom: -2,
            }}>{t === "profile" ? "Personal Info" : "Change Password"}</button>
          ))}
        </div>

        {error && <div style={{ background: "#fee", border: "1px solid #fcc", color: "#c00", borderRadius: 10, padding: "10px 14px", fontSize: ".78rem", marginBottom: 16 }}>{error}</div>}
        {success && <div style={{ background: "#efe", border: "1px solid #cfc", color: "#060", borderRadius: 10, padding: "10px 14px", fontSize: ".78rem", marginBottom: 16 }}>{success}</div>}

        {tab === "profile" ? (
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, border: `1px solid ${BRD}` }}>
            <div style={{ display: "flex", gap: 16, marginBottom: 18, flexDirection: mob ? "column" : "row" }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: ".72rem", fontWeight: 700, color: NAVY, marginBottom: 6, display: "block" }}>First Name</label>
                <input value={firstName} onChange={e => setFirstName(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: ".72rem", fontWeight: 700, color: NAVY, marginBottom: 6, display: "block" }}>Last Name</label>
                <input value={lastName} onChange={e => setLastName(e.target.value)} style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: ".72rem", fontWeight: 700, color: NAVY, marginBottom: 6, display: "block" }}>Email</label>
              <input value={user?.email || ""} disabled style={{ ...inputStyle, background: "#f5f5f5", color: SEC }} />
            </div>
            <Btn onClick={handleProfileSave} disabled={loading} style={{ height: 42, padding: "0 32px", fontSize: ".82rem" }}>
              {loading ? "Saving..." : "Save Changes"}
            </Btn>
          </div>
        ) : (
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, border: `1px solid ${BRD}` }}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: ".72rem", fontWeight: 700, color: NAVY, marginBottom: 6, display: "block" }}>New Password</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" style={inputStyle} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: ".72rem", fontWeight: 700, color: NAVY, marginBottom: 6, display: "block" }}>Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" style={inputStyle} />
            </div>
            <Btn onClick={handlePasswordChange} disabled={loading} style={{ height: 42, padding: "0 32px", fontSize: ".82rem" }}>
              {loading ? "Updating..." : "Update Password"}
            </Btn>
          </div>
        )}

        <div style={{ marginTop: 32, textAlign: "center" }}>
          <button onClick={signOut} style={{ background: "none", border: "none", color: "#e53935", fontSize: ".82rem", fontWeight: 600, cursor: "pointer" }}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
