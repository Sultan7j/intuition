"use client";
import { ShieldCheck, LogOut } from "lucide-react";
import { T, STR, getIcon } from "../lib/theme";
import { LangToggle } from "./shared";

const teamColor = { team1: T.t1, team2: T.t2 };

export default function SetupScreen({
  lang, setLang, categories, loading, n1, setN1, n2, setN2,
  active, toggleCat, onStart, isAdmin, onAdmin, onSignOut, notice,
}) {
  const t = STR[lang];
  const rtl = lang === "ar";

  return (
    <div dir={rtl ? "rtl" : "ltr"} style={shell}>
      <div style={{ position: "absolute", top: 18, insetInlineEnd: 18, display: "flex", gap: 8 }}>
        <LangToggle lang={lang} setLang={setLang} />
        <button onClick={onSignOut} className="in-btn" style={ghostBtn} title={t.signOut}>
          <LogOut size={16} /> {t.signOut}
        </button>
      </div>

      <div className="in-fade" style={{ width: "100%", maxWidth: 720, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h1 className="in-display" style={{ fontSize: 64, lineHeight: 1, fontWeight: 800, margin: "8px 0 6px",
            background: `linear-gradient(90deg, ${T.t1b}, ${T.gold}, ${T.t2b})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
            {t.title}
          </h1>
          <p style={{ color: T.muted, fontSize: 16, margin: 0 }}>{t.sub}</p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 26 }}>
          {[["team1", t.t1name, t.t1ph, n1, setN1], ["team2", t.t2name, t.t2ph, n2, setN2]].map(
            ([k, label, ph, val, set]) => (
              <div key={k} style={{ flex: "1 1 220px" }}>
                <label style={{ display: "block", color: T.muted, fontSize: 13, fontWeight: 700, marginBottom: 7 }}>{label}</label>
                <input value={val} onChange={(e) => set(e.target.value)} placeholder={ph} dir={rtl ? "rtl" : "ltr"}
                  style={{ width: "100%", padding: "13px 15px", fontSize: 16, fontWeight: 600, color: T.text,
                    background: T.panel, borderRadius: 14, border: `1px solid ${T.line}`, outline: "none",
                    borderTop: `2px solid ${teamColor[k]}` }} />
              </div>
            )
          )}
        </div>

        <div style={{ color: T.text, fontWeight: 700, fontSize: 15, marginBottom: 12 }}>{t.pickCats}</div>
        {loading ? (
          <p style={{ color: T.muted }}>{t.loading}</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12, marginBottom: 20 }}>
            {categories.map((c) => {
              const Icon = getIcon(c.icon); const on = active.includes(c.id);
              return (
                <button key={c.id} onClick={() => toggleCat(c.id)} className="in-btn"
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "18px 10px",
                    borderRadius: 16, cursor: "pointer", fontWeight: 700, fontSize: 15, color: on ? "#0B0E26" : T.text,
                    background: on ? `linear-gradient(135deg, ${T.gold}, ${T.goldDeep})` : T.panel,
                    border: `1px solid ${on ? "transparent" : T.line}`,
                    boxShadow: on ? "0 8px 24px rgba(245,165,36,0.35)" : "none" }}>
                  <Icon size={26} /> {lang === "ar" ? c.name_ar : c.name_en}
                </button>
              );
            })}
          </div>
        )}

        {notice && <p style={{ color: T.gold, textAlign: "center", marginBottom: 14, fontSize: 14, fontWeight: 600 }}>{notice}</p>}

        <button onClick={onStart} disabled={active.length === 0} className="in-btn in-display"
          style={{ width: "100%", padding: "16px", fontSize: 20, fontWeight: 800, borderRadius: 16,
            cursor: active.length ? "pointer" : "not-allowed", color: "#0B0E26",
            background: active.length ? `linear-gradient(90deg, ${T.t1}, ${T.gold}, ${T.t2})` : "rgba(255,255,255,0.08)",
            border: "none", opacity: active.length ? 1 : 0.6 }}>
          {t.start}
        </button>
        {active.length === 0 && <p style={{ color: T.muted, textAlign: "center", marginTop: 12, fontSize: 14 }}>{t.needCat}</p>}

        {isAdmin && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
            <button onClick={onAdmin} className="in-btn" style={{ ...ghostBtn, color: T.gold, borderColor: T.gold }}>
              <ShieldCheck size={16} /> {t.adminDash}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const shell = { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "26px 16px", position: "relative",
  background: `radial-gradient(1100px 600px at 20% -10%, #1B1F4E 0%, transparent 60%), radial-gradient(1000px 600px at 100% 0%, #142a44 0%, transparent 55%), ${T.bg}` };
const ghostBtn = { display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 14px", borderRadius: 999, fontSize: 14, fontWeight: 700,
  color: T.text, background: "rgba(255,255,255,0.06)", border: `1px solid ${T.line}`, cursor: "pointer" };
