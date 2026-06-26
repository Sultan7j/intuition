"use client";
import { Crown, Trophy, RotateCcw } from "lucide-react";
import { T, STR, APP_BG, teamColor, teamColorB } from "../lib/theme";
import { LangToggle, Confetti, Aurora } from "./shared";

export default function ResultsScreen({ lang, setLang, names, scores, onPlayAgain }) {
  const t = STR[lang];
  const rtl = lang === "ar";
  const win = scores.team1 === scores.team2 ? null : (scores.team1 > scores.team2 ? "team1" : "team2");
  const accent = win ? teamColor[win] : T.gold;
  const accentB = win ? teamColorB[win] : T.goldDeep;

  return (
    <div dir={rtl ? "rtl" : "ltr"} style={shell}>
      <Aurora />
      {win && <Confetti />}
      <div className="in-pop" style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        <div className="timer-urgent" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 104, height: 104, borderRadius: 999, marginBottom: 20,
          background: `linear-gradient(135deg, ${accent}, ${accentB})`, boxShadow: `0 16px 50px ${accent}66, 0 0 50px ${accent}44` }}>
          {win ? <Crown size={52} color="#0B0E26" /> : <Trophy size={48} color="#0B0E26" />}
        </div>
        <div style={{ color: accent, fontWeight: 800, letterSpacing: 2.5, textTransform: "uppercase", fontSize: 13 }}>{win ? t.congrats : ""}</div>
        <h1 className="in-display" style={{ fontSize: 52, fontWeight: 800, margin: "8px 0 4px", color: T.text,
          textShadow: `0 0 40px ${accent}55` }}>{win ? names[win] : t.tie}</h1>
        {win && <div style={{ color: accent, fontWeight: 800, fontSize: 17, marginBottom: 24 }}>{t.winner}</div>}

        <div style={{ color: T.muted, fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5, margin: "14px 0" }}>{t.finalScore}</div>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 32, flexWrap: "wrap" }}>
          {["team1", "team2"].map((k) => (
            <div key={k} style={{ flex: "1 1 180px", maxWidth: 220, padding: 22, borderRadius: 22,
              background: "linear-gradient(180deg, rgba(28,33,80,0.7), rgba(13,16,42,0.85))",
              border: `1.5px solid ${win === k ? teamColor[k] : T.line}`,
              boxShadow: win === k ? `0 0 0 1px ${teamColor[k]}, 0 16px 40px ${teamColor[k]}33` : "0 8px 22px rgba(0,0,0,0.3)",
              opacity: win && win !== k ? 0.7 : 1, transition: "all .3s ease" }}>
              <div style={{ color: T.text, fontWeight: 700, fontSize: 15, marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{names[k]}</div>
              <div className="in-display" style={{ fontSize: 50, fontWeight: 800, color: teamColor[k], lineHeight: 1,
                textShadow: `0 0 28px ${teamColor[k]}55` }}>{scores[k]}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={onPlayAgain} className="in-btn in-display"
            style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "15px 30px", fontSize: 18, fontWeight: 800,
              borderRadius: 16, cursor: "pointer", color: "#0B0E26",
              background: `linear-gradient(90deg, ${T.t1}, ${T.gold}, ${T.t2})`, border: "none", boxShadow: "0 14px 34px rgba(255,213,107,0.35)" }}>
            <RotateCcw size={19} /> {t.playAgain}
          </button>
          <LangToggle lang={lang} setLang={setLang} />
        </div>
      </div>
    </div>
  );
}

const shell = { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "26px 16px",
  position: "relative", background: APP_BG };
