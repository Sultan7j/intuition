"use client";
import { ShieldCheck, LogOut, Check, Sparkles } from "lucide-react";
import { T, STR, APP_BG, getIcon } from "../lib/theme";
import { LangToggle, Aurora } from "./shared";

const teamColor = { team1: T.t1, team2: T.t2 };

export default function SetupScreen({
  lang, setLang, categories, loading, n1, setN1, n2, setN2,
  active, toggleCat, onStart, isAdmin, onAdmin, onSignOut, notice,
}) {
  const t = STR[lang];
  const rtl = lang === "ar";
  const allOn = categories.length > 0 && active.length === categories.length;
  const toggleAll = () => {
    if (allOn) active.forEach(toggleCat);
    else categories.filter((c) => !active.includes(c.id)).forEach((c) => toggleCat(c.id));
  };

  return (
    <div dir={rtl ? "rtl" : "ltr"} style={shell}>
      <Aurora />
      <div style={{ position: "absolute", top: 18, insetInlineEnd: 18, display: "flex", gap: 8, zIndex: 2 }}>
        <LangToggle lang={lang} setLang={setLang} />
        <button onClick={onSignOut} className="in-btn" style={ghostBtn} title={t.signOut}>
          <LogOut size={16} /> {t.signOut}
        </button>
      </div>

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 860, margin: "0 auto" }}>
        <div className="in-rise" style={{ textAlign: "center", marginBottom: 30 }}>
          <h1 className="in-display in-gradient-text" style={{ fontSize: 66, lineHeight: 1, fontWeight: 800, margin: "8px 0 8px",
            backgroundImage: `linear-gradient(90deg, ${T.t1b}, ${T.gold}, ${T.purple}, ${T.t2b})` }}>
            {t.title}
          </h1>
          <p style={{ color: T.muted, fontSize: 16, margin: 0, fontWeight: 600 }}>{t.sub}</p>
        </div>

        {/* team names */}
        <div className="in-rise-2" style={{ marginBottom: 26 }}>
          <SectionLabel>{t.teamsHeading}</SectionLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            {[["team1", t.t1name, t.t1ph, n1, setN1], ["team2", t.t2name, t.t2ph, n2, setN2]].map(
              ([k, label, ph, val, set]) => (
                <div key={k} style={{ flex: "1 1 240px" }}>
                  <label style={{ display: "block", color: T.muted, fontSize: 13, fontWeight: 700, marginBottom: 7 }}>{label}</label>
                  <input value={val} onChange={(e) => set(e.target.value)} placeholder={ph} dir={rtl ? "rtl" : "ltr"}
                    style={{ width: "100%", padding: "14px 16px", fontSize: 16, fontWeight: 700, color: T.text,
                      background: "rgba(0,0,0,0.28)", borderRadius: 16, border: `1px solid ${T.line}`, outline: "none",
                      borderInlineStart: `3px solid ${teamColor[k]}` }} />
                </div>
              )
            )}
          </div>
        </div>

        {/* categories */}
        <div className="in-rise-3">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
            <SectionLabel noMargin>
              {t.catsHeading}
              {active.length > 0 && (
                <span style={{ marginInlineStart: 10, fontSize: 12, fontWeight: 800, color: "#0B0E26",
                  background: `linear-gradient(135deg, ${T.gold}, ${T.goldDeep})`, padding: "3px 10px", borderRadius: 999 }}>
                  {active.length} {t.selectedCount}
                </span>
              )}
            </SectionLabel>
            {!loading && categories.length > 0 && (
              <button onClick={toggleAll} className="in-btn" style={{ ...ghostBtn, padding: "7px 13px", fontSize: 13 }}>
                {allOn ? t.clearAll : t.selectAll}
              </button>
            )}
          </div>

          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 14 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ height: 118, borderRadius: 18, background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${T.lineSoft}`, animation: "infade 1.2s ease-in-out infinite alternate" }} />
              ))}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 14, marginBottom: 22 }}>
              {categories.map((c) => {
                const Icon = getIcon(c.icon); const on = active.includes(c.id);
                return (
                  <button key={c.id} onClick={() => toggleCat(c.id)} className="in-card in-glow"
                    style={{ "--glow": T.purpleGlow, position: "relative", display: "flex", flexDirection: "column",
                      alignItems: "center", gap: 11, padding: "22px 12px", borderRadius: 18, cursor: "pointer",
                      fontWeight: 800, fontSize: 15, fontFamily: "'Changa', sans-serif",
                      color: on ? "#0B0E26" : T.text, textAlign: "center",
                      background: on ? `linear-gradient(150deg, ${T.gold}, ${T.goldDeep})`
                        : "linear-gradient(180deg, rgba(28,33,80,0.7), rgba(15,18,44,0.85))",
                      border: `1px solid ${on ? "transparent" : T.line}`,
                      boxShadow: on ? `0 14px 34px ${T.goldGlow}` : "0 6px 18px rgba(0,0,0,0.3)" }}>
                    {on && (
                      <span style={{ position: "absolute", top: 9, insetInlineEnd: 9, width: 22, height: 22, borderRadius: 999,
                        background: "#0B0E26", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Check size={14} color={T.gold} strokeWidth={3} />
                      </span>
                    )}
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 50, height: 50,
                      borderRadius: 14, background: on ? "rgba(11,14,38,0.16)" : "rgba(167,139,250,0.14)" }}>
                      <Icon size={26} color={on ? "#0B0E26" : T.purple} />
                    </span>
                    {lang === "ar" ? c.name_ar : c.name_en}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {notice && <p style={{ color: T.gold, textAlign: "center", marginBottom: 14, fontSize: 14, fontWeight: 700 }}>{notice}</p>}

        <button onClick={onStart} disabled={active.length === 0} className="in-btn in-display"
          style={{ width: "100%", padding: "17px", fontSize: 21, fontWeight: 800, borderRadius: 18,
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
            cursor: active.length ? "pointer" : "not-allowed", color: "#0B0E26",
            background: active.length ? `linear-gradient(90deg, ${T.t1}, ${T.gold}, ${T.t2})` : "rgba(255,255,255,0.07)",
            border: "none", opacity: active.length ? 1 : 0.55,
            boxShadow: active.length ? "0 16px 40px rgba(245,165,36,0.35)" : "none" }}>
          <Sparkles size={22} /> {t.start}
        </button>
        {active.length === 0 && <p style={{ color: T.muted, textAlign: "center", marginTop: 12, fontSize: 14 }}>{t.needCat}</p>}

        {isAdmin && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
            <button onClick={onAdmin} className="in-btn" style={{ ...ghostBtn, color: T.gold, borderColor: "rgba(255,213,107,0.4)" }}>
              <ShieldCheck size={16} /> {t.adminDash}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionLabel({ children, noMargin }) {
  return (
    <div className="in-display" style={{ color: T.text, fontWeight: 800, fontSize: 18, marginBottom: noMargin ? 0 : 12,
      display: "flex", alignItems: "center" }}>{children}</div>
  );
}

const shell = { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 16px 40px",
  position: "relative", background: APP_BG };
const ghostBtn = { display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 14px", borderRadius: 999, fontSize: 14, fontWeight: 700,
  color: T.text, background: "rgba(255,255,255,0.06)", border: `1px solid ${T.line}`, cursor: "pointer" };
