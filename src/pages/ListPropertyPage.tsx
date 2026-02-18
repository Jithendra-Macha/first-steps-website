import { useState, useCallback } from "react";
import { useThemeColors, useIsMobile, Btn } from "@/components/coh/SharedComponents";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const A = "#ff4d00";

/* ── Step definitions ── */
const STEPS = [
  { id: "basic", label: "Hotel Info", icon: "🏨" },
  { id: "address", label: "Address", icon: "📍" },
  { id: "account", label: "Create Account", icon: "👤" },
  { id: "rooms", label: "Room Types", icon: "🛏️" },
  { id: "hours", label: "Available Hours", icon: "🕐" },
  { id: "amenities", label: "Amenities", icon: "✨" },
  { id: "policies", label: "Policies", icon: "📋" },
  { id: "photos", label: "Photos", icon: "📸" },
  { id: "review", label: "Review & Submit", icon: "✅" },
];

const DEFAULT_HOURS = [
  { label: "8 AM – 12 PM", start: "08:00", end: "12:00" },
  { label: "10 AM – 2 PM", start: "10:00", end: "14:00" },
  { label: "12 PM – 4 PM", start: "12:00", end: "16:00" },
  { label: "2 PM – 6 PM", start: "14:00", end: "18:00" },
  { label: "4 PM – 8 PM", start: "16:00", end: "20:00" },
  { label: "6 PM – 10 PM", start: "18:00", end: "22:00" },
  { label: "8 PM – 12 AM", start: "20:00", end: "00:00" },
  { label: "10 PM – 2 AM", start: "22:00", end: "02:00" },
];

const AMENITY_LIST = [
  { key: "has_wifi", label: "Free Wi-Fi", icon: "📶" },
  { key: "has_parking", label: "Parking", icon: "🅿️" },
  { key: "has_gym", label: "Gym / Fitness Center", icon: "💪" },
  { key: "has_pool", label: "Swimming Pool", icon: "🏊" },
  { key: "has_spa", label: "Spa & Wellness", icon: "🧖" },
  { key: "has_breakfast", label: "Breakfast Included", icon: "🍳" },
  { key: "has_room_service", label: "Room Service", icon: "🛎️" },
  { key: "has_bar", label: "Bar / Lounge", icon: "🍸" },
  { key: "has_restaurant", label: "Restaurant", icon: "🍽️" },
  { key: "has_business_center", label: "Business Center", icon: "💼" },
  { key: "has_laundry", label: "Laundry Service", icon: "👔" },
  { key: "has_concierge", label: "Concierge", icon: "🎩" },
  { key: "has_ev_charging", label: "EV Charging", icon: "⚡" },
  { key: "has_pet_friendly", label: "Pet Friendly", icon: "🐾" },
  { key: "has_accessible", label: "Wheelchair Accessible", icon: "♿" },
];

const SMOKING_OPTIONS = ["non-smoking", "smoking-allowed", "designated-areas"];
const CANCELLATION_OPTIONS = [
  "Free cancellation up to 24 hours before check-in",
  "Free cancellation up to 2 hours before check-in",
  "Non-refundable",
  "50% refund if cancelled 12 hours before",
];

interface RoomType {
  name: string;
  description: string;
  capacity: number;
  hourly_rate: number;
}

interface HourSlot {
  label: string;
  start: string;
  end: string;
}

interface FormData {
  hotel_name: string;
  hotel_description: string;
  hotel_email: string;
  hotel_phone: string;
  contact_person_name: string;
  contact_person_email: string;
  contact_person_phone: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  neighborhood: string;
  room_types: RoomType[];
  available_hours: HourSlot[];
  custom_hours: HourSlot[];
  amenities: Record<string, boolean>;
  additional_amenities: string;
  cancellation_policy: string;
  age_restriction: number;
  check_in_policy: string;
  smoking_policy: string;
  pet_policy: string;
  additional_policies: string;
  photo_urls: string[];
}

const initialForm: FormData = {
  hotel_name: "",
  hotel_description: "",
  hotel_email: "",
  hotel_phone: "",
  contact_person_name: "",
  contact_person_email: "",
  contact_person_phone: "",
  street_address: "",
  city: "",
  state: "New York",
  zip_code: "",
  neighborhood: "",
  room_types: [{ name: "", description: "", capacity: 2, hourly_rate: 0 }],
  available_hours: [],
  custom_hours: [],
  amenities: {},
  additional_amenities: "",
  cancellation_policy: CANCELLATION_OPTIONS[0],
  age_restriction: 18,
  check_in_policy: "",
  smoking_policy: "non-smoking",
  pet_policy: "",
  additional_policies: "",
  photo_urls: [],
};

/* ── Reusable styled input ── */
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  const t = useThemeColors();
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: ".78rem", fontWeight: 700, color: t.text, marginBottom: 6 }}>
        {label}{required && <span style={{ color: A }}> *</span>}
      </label>
      {children}
    </div>
  );
}

function StyledInput({ style, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  const t = useThemeColors();
  return (
    <input
      {...props}
      style={{
        width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${t.border}`,
        background: t.bgInput, color: t.text, fontSize: ".88rem", fontFamily: "inherit",
        outline: "none", transition: "border-color .2s", boxSizing: "border-box",
        ...style,
      }}
      onFocus={e => (e.currentTarget.style.borderColor = A)}
      onBlur={e => (e.currentTarget.style.borderColor = t.border)}
    />
  );
}

function StyledTextarea({ style, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const t = useThemeColors();
  return (
    <textarea
      {...props}
      style={{
        width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${t.border}`,
        background: t.bgInput, color: t.text, fontSize: ".88rem", fontFamily: "inherit",
        outline: "none", transition: "border-color .2s", minHeight: 90, resize: "vertical",
        boxSizing: "border-box",
        ...style,
      }}
      onFocus={e => (e.currentTarget.style.borderColor = A)}
      onBlur={e => (e.currentTarget.style.borderColor = t.border)}
    />
  );
}

function StyledSelect({ children, style, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const t = useThemeColors();
  return (
    <select
      {...props}
      style={{
        width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${t.border}`,
        background: t.bgInput, color: t.text, fontSize: ".88rem", fontFamily: "inherit",
        outline: "none", cursor: "pointer", boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </select>
  );
}

/* ── Main Component ── */
export default function ListPropertyPage({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const mob = useIsMobile();
  const t = useThemeColors();
  const { user } = useAuth();
  const { toast } = useToast();

  const upd = useCallback((patch: Partial<FormData>) => setForm(p => ({ ...p, ...patch })), []);

  const addRoom = () => upd({ room_types: [...form.room_types, { name: "", description: "", capacity: 2, hourly_rate: 0 }] });
  const removeRoom = (i: number) => upd({ room_types: form.room_types.filter((_, idx) => idx !== i) });
  const updateRoom = (i: number, patch: Partial<RoomType>) => {
    const rooms = [...form.room_types];
    rooms[i] = { ...rooms[i], ...patch };
    upd({ room_types: rooms });
  };

  const toggleHour = (slot: HourSlot) => {
    const exists = form.available_hours.find(h => h.label === slot.label);
    upd({
      available_hours: exists
        ? form.available_hours.filter(h => h.label !== slot.label)
        : [...form.available_hours, slot],
    });
  };

  const addCustomHour = () => upd({ custom_hours: [...form.custom_hours, { label: "", start: "", end: "" }] });
  const updateCustomHour = (i: number, patch: Partial<HourSlot>) => {
    const hrs = [...form.custom_hours];
    hrs[i] = { ...hrs[i], ...patch };
    if (patch.start || patch.end) {
      const s = patch.start || hrs[i].start;
      const e = patch.end || hrs[i].end;
      if (s && e) hrs[i].label = `${formatTime(s)} – ${formatTime(e)}`;
    }
    upd({ custom_hours: hrs });
  };
  const removeCustomHour = (i: number) => upd({ custom_hours: form.custom_hours.filter((_, idx) => idx !== i) });

  const toggleAmenity = (key: string) => upd({ amenities: { ...form.amenities, [key]: !form.amenities[key] } });

  const addPhotoUrl = () => upd({ photo_urls: [...form.photo_urls, ""] });
  const updatePhotoUrl = (i: number, url: string) => {
    const urls = [...form.photo_urls];
    urls[i] = url;
    upd({ photo_urls: urls });
  };
  const removePhotoUrl = (i: number) => upd({ photo_urls: form.photo_urls.filter((_, idx) => idx !== i) });

  // Get visible steps (hide account step if already logged in)
  const visibleSteps = user ? STEPS.filter(s => s.id !== "account") : STEPS;
  const currentStepDef = visibleSteps[step];
  const realStepIndex = STEPS.findIndex(s => s.id === currentStepDef?.id);

  const canNext = () => {
    const sid = currentStepDef?.id;
    switch (sid) {
      case "basic": return form.hotel_name && form.hotel_email && form.hotel_phone;
      case "address": return form.street_address && form.city && form.state && form.zip_code;
      case "account": return !!user;
      case "rooms": return form.room_types.length > 0 && form.room_types.every(r => r.name && r.hourly_rate > 0);
      case "hours": return (form.available_hours.length + form.custom_hours.length) > 0;
      default: return true;
    }
  };

  const goNext = () => {
    if (!canNext()) return;
    setStep(step + 1);
  };

  const goBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: "Please sign in", description: "You need to be signed in to list your property.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const allHours = [...form.available_hours, ...form.custom_hours.filter(h => h.start && h.end)];
      const amenityBools: Record<string, boolean> = {};
      AMENITY_LIST.forEach(a => { amenityBools[a.key] = !!form.amenities[a.key]; });

      const { error } = await supabase.from("hotel_listings" as any).insert({
        user_id: user.id,
        hotel_name: form.hotel_name,
        hotel_description: form.hotel_description,
        hotel_email: form.hotel_email,
        hotel_phone: form.hotel_phone,
        contact_person_name: form.contact_person_name,
        contact_person_email: form.contact_person_email,
        contact_person_phone: form.contact_person_phone,
        street_address: form.street_address,
        city: form.city,
        state: form.state,
        zip_code: form.zip_code,
        neighborhood: form.neighborhood,
        room_types: form.room_types,
        available_hours: allHours,
        ...amenityBools,
        additional_amenities: form.additional_amenities ? form.additional_amenities.split(",").map(s => s.trim()).filter(Boolean) : [],
        cancellation_policy: form.cancellation_policy,
        age_restriction: form.age_restriction,
        check_in_policy: form.check_in_policy,
        smoking_policy: form.smoking_policy,
        pet_policy: form.pet_policy,
        additional_policies: form.additional_policies,
        photos: form.photo_urls.filter(Boolean),
      } as any);

      if (error) throw error;
      setSubmitted(true);
      toast({ title: "Property submitted!", description: "Your listing is under review. We'll notify you once it's live." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Something went wrong.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ background: t.bgCard, borderRadius: 24, padding: mob ? "2rem" : "3rem", maxWidth: 520, width: "100%", textAlign: "center", border: `1px solid ${t.border}` }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: t.text, marginBottom: ".6rem" }}>Property Submitted!</h2>
          <p style={{ fontSize: ".88rem", color: t.textSecondary, lineHeight: 1.6, marginBottom: "1.5rem" }}>
            Your hotel listing has been submitted for review. Our team will verify your details and make your property live within 24-48 hours.
          </p>
          <Btn onClick={onBack} style={{ padding: "12px 32px", fontSize: ".9rem", borderRadius: 12 }}>Back to Home</Btn>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: t.bg }}>
      {/* Header */}
      <div style={{ background: t.bgCard, borderBottom: `1px solid ${t.border}`, padding: mob ? "0 4%" : "0 5%", height: mob ? 52 : 62, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} style={{ background: t.dark ? "#1e1e1e" : "#f0f0f0", border: "none", width: 36, height: 36, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", color: t.text }}>←</button>
          <div style={{ fontSize: mob ? "1rem" : "1.15rem", fontWeight: 900, letterSpacing: "-.02em", cursor: "pointer", color: t.text }} onClick={onBack}>
            coupleofhours<span style={{ color: A }}>.com</span>
          </div>
        </div>
        <div style={{ fontSize: ".78rem", fontWeight: 600, color: t.textSecondary }}>List Your Property</div>
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: mob ? "1.2rem 4%" : "2rem 1.5rem" }}>
        {/* Progress */}
        <div style={{ display: "flex", gap: 4, marginBottom: mob ? "1.2rem" : "2rem" }}>
          {visibleSteps.map((s, i) => (
            <div key={s.id} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= step ? A : t.border, transition: "background .3s" }} />
          ))}
        </div>

        {/* Step header */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontSize: ".72rem", fontWeight: 800, color: A, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4 }}>
            Step {step + 1} of {visibleSteps.length}
          </div>
          <h1 style={{ fontSize: mob ? "1.3rem" : "1.6rem", fontWeight: 900, color: t.text, letterSpacing: "-.03em" }}>
            {currentStepDef?.icon} {currentStepDef?.label}
          </h1>
        </div>

        {/* Step content */}
        <div style={{ background: t.bgCard, borderRadius: 20, border: `1px solid ${t.border}`, padding: mob ? "1.2rem" : "2rem" }}>
          {realStepIndex === 0 && <BasicInfoStep form={form} upd={upd} />}
          {realStepIndex === 1 && <AddressStep form={form} upd={upd} />}
          {realStepIndex === 2 && <AccountStep />}
          {realStepIndex === 3 && <RoomsStep form={form} addRoom={addRoom} removeRoom={removeRoom} updateRoom={updateRoom} />}
          {realStepIndex === 4 && <HoursStep form={form} toggleHour={toggleHour} addCustomHour={addCustomHour} updateCustomHour={updateCustomHour} removeCustomHour={removeCustomHour} />}
          {realStepIndex === 5 && <AmenitiesStep form={form} toggleAmenity={toggleAmenity} upd={upd} />}
          {realStepIndex === 6 && <PoliciesStep form={form} upd={upd} />}
          {realStepIndex === 7 && <PhotosStep form={form} addPhotoUrl={addPhotoUrl} updatePhotoUrl={updatePhotoUrl} removePhotoUrl={removePhotoUrl} />}
          {realStepIndex === 8 && <ReviewStep form={form} />}
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem", gap: 12 }}>
          <Btn variant="outline" onClick={goBack} disabled={step === 0}
            style={{ padding: "12px 28px", fontSize: ".88rem", borderRadius: 12, opacity: step === 0 ? 0.4 : 1 }}>
            ← Back
          </Btn>
          {step < visibleSteps.length - 1 ? (
            <Btn onClick={goNext} disabled={!canNext()}
              style={{ padding: "12px 28px", fontSize: ".88rem", borderRadius: 12, opacity: canNext() ? 1 : 0.5 }}>
              Next →
            </Btn>
          ) : (
            <Btn onClick={handleSubmit} disabled={submitting}
              style={{ padding: "12px 32px", fontSize: ".88rem", borderRadius: 12 }}>
              {submitting ? "Submitting..." : "Submit Property 🚀"}
            </Btn>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Account Step (inline signup/login) ── */
function AccountStep() {
  const t = useThemeColors();
  const mob = useIsMobile();
  const { user, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    return (
      <div style={{ textAlign: "center", padding: mob ? "1.5rem 0" : "2.5rem 0" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>✅</div>
        <h3 style={{ fontSize: "1.2rem", fontWeight: 900, color: t.text, marginBottom: ".5rem" }}>You're signed in!</h3>
        <p style={{ fontSize: ".86rem", color: t.textSecondary }}>{user.email}</p>
        <p style={{ fontSize: ".82rem", color: t.textSecondary, marginTop: ".6rem" }}>Click <strong>Next</strong> to continue setting up your property.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      if (mode === "signup") {
        if (!firstName.trim() || !lastName.trim()) { setError("Please fill in all fields"); setLoading(false); return; }
        const { error } = await signUp(email, password, firstName, lastName);
        if (error) throw error;
        setSuccess("Account created! Check your email to verify, then sign in below.");
        setMode("login");
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <p style={{ fontSize: ".86rem", color: t.textSecondary, marginBottom: 20, lineHeight: 1.6 }}>
        {mode === "signup"
          ? "Create a property manager account to manage your listing, track bookings, and communicate with guests."
          : "Already have an account? Sign in to continue."}
      </p>

      {error && <div style={{ background: t.dark ? "#3a1515" : "#fee", border: `1px solid ${t.dark ? "#5a2020" : "#fcc"}`, color: t.dark ? "#ff8888" : "#c00", borderRadius: 10, padding: "10px 14px", fontSize: ".78rem", marginBottom: 16 }}>{error}</div>}
      {success && <div style={{ background: t.dark ? "#153a15" : "#efe", border: `1px solid ${t.dark ? "#205a20" : "#cfc"}`, color: t.dark ? "#88ff88" : "#060", borderRadius: 10, padding: "10px 14px", fontSize: ".78rem", marginBottom: 16 }}>{success}</div>}

      <form onSubmit={handleSubmit}>
        {mode === "signup" && (
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 12, marginBottom: 4 }}>
            <Field label="First Name" required>
              <StyledInput value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="John" required />
            </Field>
            <Field label="Last Name" required>
              <StyledInput value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Smith" required />
            </Field>
          </div>
        )}
        <Field label="Email" required>
          <StyledInput type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="manager@hotel.com" required />
        </Field>
        <Field label="Password" required>
          <StyledInput type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
        </Field>
        <Btn type="submit" disabled={loading} style={{ width: "100%", height: 46, fontSize: ".88rem", marginTop: 8, opacity: loading ? .6 : 1 }}>
          {loading ? "Please wait..." : mode === "signup" ? "Create Account" : "Sign In"}
        </Btn>
      </form>

      <div style={{ textAlign: "center", marginTop: 18, fontSize: ".82rem", color: t.textSecondary }}>
        {mode === "signup" ? (
          <>Already have an account? <a onClick={() => { setMode("login"); setError(""); setSuccess(""); }} style={{ color: A, fontWeight: 700, cursor: "pointer" }}>Sign In</a></>
        ) : (
          <>Don't have an account? <a onClick={() => { setMode("signup"); setError(""); setSuccess(""); }} style={{ color: A, fontWeight: 700, cursor: "pointer" }}>Create Account</a></>
        )}
      </div>
    </>
  );
}

/* ── Step Components ── */

function BasicInfoStep({ form, upd }: { form: FormData; upd: (p: Partial<FormData>) => void }) {
  const t = useThemeColors();
  const mob = useIsMobile();
  return (
    <>
      <Field label="Hotel Name" required>
        <StyledInput value={form.hotel_name} onChange={e => upd({ hotel_name: e.target.value })} placeholder="e.g. The Grand Manhattan" />
      </Field>
      <Field label="Hotel Description">
        <StyledTextarea value={form.hotel_description} onChange={e => upd({ hotel_description: e.target.value })} placeholder="Tell guests what makes your property special..." />
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 16 }}>
        <Field label="Hotel Email" required>
          <StyledInput type="email" value={form.hotel_email} onChange={e => upd({ hotel_email: e.target.value })} placeholder="frontdesk@hotel.com" />
        </Field>
        <Field label="Hotel Phone" required>
          <StyledInput type="tel" value={form.hotel_phone} onChange={e => upd({ hotel_phone: e.target.value })} placeholder="+1 (212) 555-0100" />
        </Field>
      </div>
      <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: 18, marginTop: 8 }}>
        <div style={{ fontSize: ".82rem", fontWeight: 800, color: t.text, marginBottom: 14 }}>Contact Person (Manager)</div>
        <Field label="Full Name">
          <StyledInput value={form.contact_person_name} onChange={e => upd({ contact_person_name: e.target.value })} placeholder="John Smith" />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 16 }}>
          <Field label="Email">
            <StyledInput type="email" value={form.contact_person_email} onChange={e => upd({ contact_person_email: e.target.value })} placeholder="manager@hotel.com" />
          </Field>
          <Field label="Phone Number">
            <StyledInput type="tel" value={form.contact_person_phone} onChange={e => upd({ contact_person_phone: e.target.value })} placeholder="+1 (212) 555-0101" />
          </Field>
        </div>
      </div>
    </>
  );
}

function AddressStep({ form, upd }: { form: FormData; upd: (p: Partial<FormData>) => void }) {
  const mob = useIsMobile();
  return (
    <>
      <Field label="Street Address" required>
        <StyledInput value={form.street_address} onChange={e => upd({ street_address: e.target.value })} placeholder="123 Main Street" />
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 16 }}>
        <Field label="City" required>
          <StyledInput value={form.city} onChange={e => upd({ city: e.target.value })} placeholder="New York" />
        </Field>
        <Field label="State" required>
          <StyledSelect value={form.state} onChange={e => upd({ state: e.target.value })}>
            <option>New York</option>
            <option>New Jersey</option>
          </StyledSelect>
        </Field>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 16 }}>
        <Field label="ZIP Code" required>
          <StyledInput value={form.zip_code} onChange={e => upd({ zip_code: e.target.value })} placeholder="10001" />
        </Field>
        <Field label="Neighborhood">
          <StyledInput value={form.neighborhood} onChange={e => upd({ neighborhood: e.target.value })} placeholder="e.g. Midtown, SoHo, Downtown" />
        </Field>
      </div>
    </>
  );
}

function RoomsStep({ form, addRoom, removeRoom, updateRoom }: { form: FormData; addRoom: () => void; removeRoom: (i: number) => void; updateRoom: (i: number, p: Partial<RoomType>) => void }) {
  const t = useThemeColors();
  const mob = useIsMobile();
  return (
    <>
      {form.room_types.map((room, i) => (
        <div key={i} style={{ border: `1.5px solid ${t.border}`, borderRadius: 14, padding: mob ? "1rem" : "1.2rem", marginBottom: 14, position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: ".82rem", fontWeight: 800, color: t.text }}>Room Type {i + 1}</span>
            {form.room_types.length > 1 && (
              <button onClick={() => removeRoom(i)} style={{ background: "none", border: "none", color: "#e53935", cursor: "pointer", fontSize: ".78rem", fontWeight: 700 }}>Remove</button>
            )}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 12 }}>
            <Field label="Room Name" required>
              <StyledInput value={room.name} onChange={e => updateRoom(i, { name: e.target.value })} placeholder="e.g. Deluxe King, Standard Queen" />
            </Field>
            <Field label="Max Guests">
              <StyledInput type="number" min={1} value={room.capacity} onChange={e => updateRoom(i, { capacity: parseInt(e.target.value) || 1 })} />
            </Field>
          </div>
          <Field label="Hourly Rate ($)" required>
            <StyledInput type="number" min={0} step={5} value={room.hourly_rate || ""} onChange={e => updateRoom(i, { hourly_rate: parseFloat(e.target.value) || 0 })} placeholder="45" style={{ maxWidth: 200 }} />
          </Field>
          <Field label="Room Description">
            <StyledTextarea value={room.description} onChange={e => updateRoom(i, { description: e.target.value })} placeholder="Describe this room type..." style={{ minHeight: 60 }} />
          </Field>
        </div>
      ))}
      <button onClick={addRoom} style={{ background: "none", border: `1.5px dashed ${t.border}`, borderRadius: 12, padding: "14px", width: "100%", cursor: "pointer", fontSize: ".84rem", fontWeight: 700, color: A }}>
        + Add Another Room Type
      </button>
    </>
  );
}

function HoursStep({ form, toggleHour, addCustomHour, updateCustomHour, removeCustomHour }: {
  form: FormData; toggleHour: (s: HourSlot) => void;
  addCustomHour: () => void; updateCustomHour: (i: number, p: Partial<HourSlot>) => void; removeCustomHour: (i: number) => void;
}) {
  const t = useThemeColors();
  const mob = useIsMobile();
  return (
    <>
      <p style={{ fontSize: ".82rem", color: t.textSecondary, marginBottom: 16, lineHeight: 1.6 }}>
        Select the time slots your hotel offers for hourly bookings. You can also add custom time slots.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4, 1fr)", gap: 10, marginBottom: 20 }}>
        {DEFAULT_HOURS.map(slot => {
          const active = form.available_hours.some(h => h.label === slot.label);
          return (
            <button key={slot.label} onClick={() => toggleHour(slot)}
              style={{
                padding: "12px", borderRadius: 12, border: `1.5px solid ${active ? A : t.border}`,
                background: active ? (t.dark ? "rgba(255,77,0,.15)" : "rgba(255,77,0,.06)") : "transparent",
                cursor: "pointer", fontSize: ".8rem", fontWeight: active ? 800 : 600,
                color: active ? A : t.text, transition: "all .2s",
              }}>
              🕐 {slot.label}
            </button>
          );
        })}
      </div>

      <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: 16 }}>
        <div style={{ fontSize: ".82rem", fontWeight: 800, color: t.text, marginBottom: 12 }}>Custom Time Slots</div>
        {form.custom_hours.map((h, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
            <StyledInput type="time" value={h.start} onChange={e => updateCustomHour(i, { start: e.target.value })} style={{ flex: 1 }} />
            <span style={{ color: t.textSecondary, fontSize: ".82rem" }}>to</span>
            <StyledInput type="time" value={h.end} onChange={e => updateCustomHour(i, { end: e.target.value })} style={{ flex: 1 }} />
            <button onClick={() => removeCustomHour(i)} style={{ background: "none", border: "none", color: "#e53935", cursor: "pointer", fontSize: "1.1rem" }}>✕</button>
          </div>
        ))}
        <button onClick={addCustomHour} style={{ background: "none", border: `1.5px dashed ${t.border}`, borderRadius: 10, padding: "10px", width: "100%", cursor: "pointer", fontSize: ".82rem", fontWeight: 700, color: A }}>
          + Add Custom Time Slot
        </button>
      </div>
    </>
  );
}

function AmenitiesStep({ form, toggleAmenity, upd }: { form: FormData; toggleAmenity: (k: string) => void; upd: (p: Partial<FormData>) => void }) {
  const t = useThemeColors();
  const mob = useIsMobile();
  return (
    <>
      <p style={{ fontSize: ".82rem", color: t.textSecondary, marginBottom: 16 }}>Select all amenities & facilities available at your property.</p>
      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
        {AMENITY_LIST.map(a => {
          const active = !!form.amenities[a.key];
          return (
            <button key={a.key} onClick={() => toggleAmenity(a.key)}
              style={{
                padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${active ? A : t.border}`,
                background: active ? (t.dark ? "rgba(255,77,0,.15)" : "rgba(255,77,0,.06)") : "transparent",
                cursor: "pointer", fontSize: ".82rem", fontWeight: active ? 800 : 600,
                color: active ? A : t.text, display: "flex", alignItems: "center", gap: 8,
                transition: "all .2s", textAlign: "left",
              }}>
              <span style={{ fontSize: "1.1rem" }}>{a.icon}</span> {a.label}
            </button>
          );
        })}
      </div>
      <Field label="Additional Amenities">
        <StyledTextarea value={form.additional_amenities} onChange={e => upd({ additional_amenities: e.target.value })} placeholder="Comma separated: e.g. Rooftop terrace, Library, Kids play area..." style={{ minHeight: 60 }} />
      </Field>
    </>
  );
}

function PoliciesStep({ form, upd }: { form: FormData; upd: (p: Partial<FormData>) => void }) {
  const t = useThemeColors();
  const mob = useIsMobile();
  return (
    <>
      <Field label="Cancellation Policy" required>
        <StyledSelect value={form.cancellation_policy} onChange={e => upd({ cancellation_policy: e.target.value })}>
          {CANCELLATION_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
        </StyledSelect>
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 16 }}>
        <Field label="Minimum Age Requirement">
          <StyledInput type="number" min={0} value={form.age_restriction} onChange={e => upd({ age_restriction: parseInt(e.target.value) || 18 })} />
        </Field>
        <Field label="Smoking Policy">
          <StyledSelect value={form.smoking_policy} onChange={e => upd({ smoking_policy: e.target.value })}>
            {SMOKING_OPTIONS.map(o => <option key={o} value={o}>{o.replace(/-/g, " ").replace(/^\w/, c => c.toUpperCase())}</option>)}
          </StyledSelect>
        </Field>
      </div>
      <Field label="Check-in Policy">
        <StyledTextarea value={form.check_in_policy} onChange={e => upd({ check_in_policy: e.target.value })} placeholder="e.g. Valid government-issued ID required at check-in. Early check-in subject to availability." style={{ minHeight: 60 }} />
      </Field>
      <Field label="Pet Policy">
        <StyledTextarea value={form.pet_policy} onChange={e => upd({ pet_policy: e.target.value })} placeholder="e.g. Small dogs allowed with $25 pet fee. No cats. Service animals welcome." style={{ minHeight: 60 }} />
      </Field>
      <Field label="Additional Policies">
        <StyledTextarea value={form.additional_policies} onChange={e => upd({ additional_policies: e.target.value })} placeholder="Any other policies guests should know about..." style={{ minHeight: 60 }} />
      </Field>
    </>
  );
}

function PhotosStep({ form, addPhotoUrl, updatePhotoUrl, removePhotoUrl }: {
  form: FormData; addPhotoUrl: () => void; updatePhotoUrl: (i: number, url: string) => void; removePhotoUrl: (i: number) => void;
}) {
  const t = useThemeColors();
  return (
    <>
      <p style={{ fontSize: ".82rem", color: t.textSecondary, marginBottom: 16, lineHeight: 1.6 }}>
        Add photo URLs for your property. High-quality photos significantly improve bookings. We recommend at least 5 photos including lobby, rooms, bathroom, and exterior.
      </p>
      {form.photo_urls.map((url, i) => (
        <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
          <StyledInput value={url} onChange={e => updatePhotoUrl(i, e.target.value)} placeholder="https://example.com/photo.jpg" style={{ flex: 1 }} />
          {url && (
            <div style={{ width: 44, height: 44, borderRadius: 8, overflow: "hidden", flexShrink: 0, border: `1px solid ${t.border}` }}>
              <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => (e.currentTarget.style.display = "none")} />
            </div>
          )}
          <button onClick={() => removePhotoUrl(i)} style={{ background: "none", border: "none", color: "#e53935", cursor: "pointer", fontSize: "1.1rem", flexShrink: 0 }}>✕</button>
        </div>
      ))}
      <button onClick={addPhotoUrl} style={{ background: "none", border: `1.5px dashed ${t.border}`, borderRadius: 12, padding: "14px", width: "100%", cursor: "pointer", fontSize: ".84rem", fontWeight: 700, color: A }}>
        + Add Photo URL
      </button>
    </>
  );
}

function ReviewStep({ form }: { form: FormData }) {
  const t = useThemeColors();
  const mob = useIsMobile();
  const allHours = [...form.available_hours, ...form.custom_hours.filter(h => h.start && h.end)];
  const activeAmenities = AMENITY_LIST.filter(a => form.amenities[a.key]);

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${t.border}` }}>
      <div style={{ fontSize: ".82rem", fontWeight: 800, color: A, marginBottom: 10, textTransform: "uppercase", letterSpacing: ".08em" }}>{title}</div>
      {children}
    </div>
  );

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
      <span style={{ fontSize: ".82rem", color: t.textSecondary }}>{label}</span>
      <span style={{ fontSize: ".82rem", fontWeight: 600, color: t.text, textAlign: "right", maxWidth: "60%" }}>{value || "—"}</span>
    </div>
  );

  return (
    <>
      <p style={{ fontSize: ".88rem", color: t.textSecondary, marginBottom: 20, lineHeight: 1.6 }}>
        Review your property details below. Once submitted, our team will review and make your listing live.
      </p>
      <Section title="Hotel Information">
        <Row label="Hotel Name" value={form.hotel_name} />
        <Row label="Email" value={form.hotel_email} />
        <Row label="Phone" value={form.hotel_phone} />
        {form.contact_person_name && <Row label="Contact Person" value={form.contact_person_name} />}
      </Section>
      <Section title="Address">
        <Row label="Address" value={`${form.street_address}, ${form.city}, ${form.state} ${form.zip_code}`} />
        {form.neighborhood && <Row label="Neighborhood" value={form.neighborhood} />}
      </Section>
      <Section title="Room Types">
        {form.room_types.map((r, i) => (
          <div key={i} style={{ background: t.dark ? "#1e1e1e" : "#f8f8f8", borderRadius: 10, padding: "10px 14px", marginBottom: 8 }}>
            <div style={{ fontWeight: 700, fontSize: ".84rem", color: t.text }}>{r.name}</div>
            <div style={{ fontSize: ".76rem", color: t.textSecondary }}>Up to {r.capacity} guests · ${r.hourly_rate}/hr</div>
          </div>
        ))}
      </Section>
      <Section title="Available Hours">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {allHours.map((h, i) => (
            <span key={i} style={{ background: t.dark ? "#1e1e1e" : "#f0f0f0", padding: "5px 12px", borderRadius: 8, fontSize: ".78rem", fontWeight: 600, color: t.text }}>{h.label}</span>
          ))}
        </div>
      </Section>
      {activeAmenities.length > 0 && (
        <Section title="Amenities">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {activeAmenities.map(a => (
              <span key={a.key} style={{ background: t.dark ? "#1e1e1e" : "#f0f0f0", padding: "5px 12px", borderRadius: 8, fontSize: ".78rem", color: t.text }}>{a.icon} {a.label}</span>
            ))}
          </div>
        </Section>
      )}
      <Section title="Policies">
        <Row label="Cancellation" value={form.cancellation_policy} />
        <Row label="Min Age" value={`${form.age_restriction}+`} />
        <Row label="Smoking" value={form.smoking_policy.replace(/-/g, " ")} />
      </Section>
      {form.photo_urls.filter(Boolean).length > 0 && (
        <Section title="Photos">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {form.photo_urls.filter(Boolean).map((url, i) => (
              <div key={i} style={{ width: 80, height: 60, borderRadius: 8, overflow: "hidden", border: `1px solid ${t.border}` }}>
                <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}

/* ── Helper ── */
function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hr = h % 12 || 12;
  return `${hr}${m ? `:${String(m).padStart(2, "0")}` : ""} ${ampm}`;
}
