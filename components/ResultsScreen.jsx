"use client";
import { Crown, Trophy } from "lucide-react";
import { T, STR, teamColor, teamColorB } from "../lib/theme";
import { LangToggle, Confetti } from "./shared";

export default function ResultsScreen({ lang, setLang, names, scores, onPlayAgain }) {
  const t = STR[lang];
  const rtl = lang === "ar";
  const win = scores.team1 === scores.team2 ? null : (scores.team1 > scores.team2 ? "team1" : "team2");
  const accent = win ? teamColor[win] : T.gold;

  return (
    <div dir={rtl ? "rtl" : "ltr"} style={shell}>
      {win && <Confetti />}
      <div className="in-pop" style={{ width: "100%", maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 92, height: 92, borderRadius: 999, marginBottom: 18,
          background: `linear-gradient(135deg, ${accent}, ${win ? teamColorB[win] : T.goldDeep})`, boxShadow: `0 12px 40px ${accent}55` }}>
          {win ? <Crown size={46} color="#0B0E26" /> : <Trophy size={44} color="#0B0E26" />}
        </div>
        <div style={{ color: T.muted, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", fontSize: 13 }}>{win ? t.congrats : ""}</div>
        <h1 className="in-display" style={{ fontSize: 46, fontWeight: 800, margin: "6px 0 4px", color: T.text }}>{win ? names[win] : t.tie}</h1>
        {win && <div style={{ color: accent, fontWeight: 700, fontSize: 16, marginBottom: 22 }}>{t.winner}</div>}

        <div style={{ color: T.muted, fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, margin: "10px 0" }}>{t.finalScore}</div>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", marginBottom: 28 }}>
          {["team1", "team2"].map((k) => (
            <div key={k} style={{ flex: 1, maxWidth: 200, padding: 18, borderRadius: 18, background: T.panel,
              border: `1px solid ${win === k ? teamColor[k] : T.line}`, boxShadow: win === k ? `0 0 0 1px ${teamColor[k]}` : "none" }}>
              <div style={{ color: T.text, fontWeight: 700, fontSize: 15, marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{names[k]}</div>
              <div className="in-display" style={{ fontSize: 44, fontWeight: 800, color: teamColor[k], lineHeight: 1 }}>{scores[k]}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={onPlayAgain} className="in-btn in-display"
            style={{ padding: "14px 26px", fontSize: 17, fontWeight: 800, borderRadius: 14, cursor: "pointer", color: "#0B0E26",
              background: `linear-gradient(90deg, ${T.t1}, ${T.gold}, ${T.t2})`, border: "none", boxShadow: "0 10px 26px rgba(255,213,107,0.3)" }}>
            {t.playAgain}
          </button>
          <LangToggle lang={lang} setLang={setLang} />
        </div>
      </div>
    </div>
  );
}

const shell = { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "26px 16px", position: "relative",
  background: `radial-gradient(1100px 600px at 20% -10%, #1B1F4E 0%, transparent 60%), radial-gradient(1000px 600px at 100% 0%, #142a44 0%, transparent 55%), ${T.bg}` };
