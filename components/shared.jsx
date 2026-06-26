"use client";
import { useMemo } from "react";
import { Globe } from "lucide-react";
import { T } from "../lib/theme";

export function LangToggle({ lang, setLang }) {
  return (
    <button
      onClick={() => setLang(lang === "en" ? "ar" : "en")}
      className="in-btn"
      style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 14px", borderRadius: 999,
        fontWeight: 700, fontSize: 14, color: T.text, background: "rgba(255,255,255,0.06)",
        border: `1px solid ${T.line}`, cursor: "pointer" }}>
      <Globe size={16} /> {lang === "en" ? "العربية" : "English"}
    </button>
  );
}

export function Confetti() {
  const colors = [T.gold, T.t1, T.t2, T.t1b, T.t2b, "#ffffff"];
  const pieces = useMemo(
    () => Array.from({ length: 110 }, (_, i) => ({
      left: Math.random() * 100, delay: Math.random() * 0.8, dur: 2.4 + Math.random() * 2.6,
      color: colors[i % colors.length], w: 6 + Math.random() * 8, rot: Math.random() * 360,
    })), []
  );
  return (
    <div className="cfetti" style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 70 }}>
      {pieces.map((p, i) => (
        <span key={i} style={{ position: "absolute", top: "-30px", left: p.left + "%", width: p.w, height: p.w * 0.55,
          background: p.color, transform: `rotate(${p.rot}deg)`, borderRadius: 2,
          animation: `cfall ${p.dur}s linear ${p.delay}s infinite` }} />
      ))}
    </div>
  );
}
