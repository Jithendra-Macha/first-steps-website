import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Shield, Zap, XCircle, Headphones } from "lucide-react";
import HouryChatPanel from "@/components/chatbot/HouryChatPanel";
import logoCoh from "@/assets/logo-coh.jpeg";

const TRUST_BADGES = [
  { icon: Shield, label: "Secure Payments" },
  { icon: Zap, label: "Instant Confirmation" },
  { icon: XCircle, label: "Free Cancellation" },
  { icon: Headphones, label: "24/7 Support" },
];

const TESTIMONIAL = {
  text: "Booked a room near JFK in under 2 minutes. The AI found exactly what I needed for my layover!",
  author: "Sarah M.",
  location: "Brooklyn, NY",
};

export default function ChatPage() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-screen" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
      {/* Left branding panel — hidden on mobile */}
      <div
        className="hidden lg:flex flex-col justify-between w-[35%] p-10"
        style={{ background: "linear-gradient(155deg, #0d1f38, #1a3558 60%, #2a4a7a)" }}
      >
        <div>
          <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => navigate("/")}>
            <img src={logoCoh} alt="CoupleOfHours" className="w-10 h-10 rounded-lg" />
            <span className="text-white font-bold text-lg">CoupleOfHours</span>
          </div>
          <h1 className="text-3xl font-black text-white leading-tight mb-3">
            Book the Moment.<br />
            <span style={{ color: "#E8705A" }}>Pay by the Hour.</span>
          </h1>
          <p className="text-white/60 text-sm leading-relaxed">
            Premium hotel rooms from $10/hr across NYC, Brooklyn, Queens, and New Jersey. 
            Tell Houry what you need — our AI will handle the rest.
          </p>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-2 gap-3 my-8">
          {TRUST_BADGES.map(b => (
            <div key={b.label} className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/10 backdrop-blur-sm">
              <b.icon size={16} color="#E8705A" />
              <span className="text-white/80 text-xs font-semibold">{b.label}</span>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
          <p className="text-white/80 text-sm italic mb-3">"{TESTIMONIAL.text}"</p>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xs">
              {TESTIMONIAL.author[0]}
            </div>
            <div>
              <div className="text-white text-xs font-bold">{TESTIMONIAL.author}</div>
              <div className="text-white/50 text-[10px]">{TESTIMONIAL.location}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right chat panel */}
      <div className="flex-1 flex flex-col bg-background">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-border">
          <button onClick={() => navigate("/")} className="text-sm text-muted-foreground">← Back</button>
          <img src={logoCoh} alt="CoupleOfHours" className="w-7 h-7 rounded-md" />
          <span className="font-bold text-sm text-foreground">CoupleOfHours</span>
        </div>

        <HouryChatPanel
          open={true}
          onClose={() => navigate("/")}
          fullPage={true}
        />
      </div>
    </div>
  );
}
