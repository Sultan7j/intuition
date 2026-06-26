"use client";
import { useState, useEffect } from "react";
import { X, Eye, Pause, Play, AlarmClockOff } from "lucide-react";
import { T, STR, DIFFS, SECONDS_FOR, teamColor, teamColorB, getIcon } from "../lib/theme";
import { useCountdown } from "../lib/useCountdown";

export default function QuestionModal({ slot, category, lang, names, onResolve, onClose }) {
  const t = STR[lang];
  const rtl = lang === "ar";
  const { teamKey, difficulty, question } = slot;
  const accent = teamColor[teamKey];
  const diffMeta = DIFFS.find((d) => d.id === difficulty);
  const total = SECONDS_FOR[difficulty] || 30;

  const { timeLeft, running, expired, pause, resume, stop } = useCountdown(total);
  const [revealed, setRevealed] = useState(false);
  const CatIcon = getIcon(category?.icon);

  // freeze the clock the moment the answer is revealed
  useEffect(() => { if (revealed) stop(); }, [revealed, stop]);

  const qText = question ? (rtl ? question.question_ar : question.question_en) : t.empty;
  const aText = question ? (rtl ? question.answer_ar : question.answer_en) : "—";

  const urgent = !revealed && !expired && timeLeft <= 5;
  const mmss = `${String(Math.floor(timeLeft / 60)).padStart(2, "0")}:${String(timeLeft % 60).padStart(2, "0")}`;

  // ring geometry
  const R = 34, C = 2 * Math.PI * R;
  const frac = total > 0 ? timeLeft / total : 0;
  const ringColor = expired ? T.danger : urgent ? T.danger : T.gold;

  return (
    <div onClick={() => onResolve(null)} style={overlay}>
      <div onClick={(e) => e.stopPropagation()} dir={rtl ? "rtl" : "ltr"} className="in-pop"
        style={{ width: "100%", maxWidth: 580, background: "linear-gradient(180deg, rgba(28,33,80,0.92), rgba(13,16,42,0.96))",
          borderRadius: 26, border: `1px solid ${T.line}`, borderTop: `4px solid ${accent}`,
          padding: 26, boxShadow: `0 36px 90px rgba(0,0,0,0.6), 0 0 60px ${accent}33`, backdropFilter: "blur(14px)" }}>

        {/* header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "7px 13px", borderRadius: 999,
              background: `linear-gradient(135deg, ${accent}, ${teamColorB[teamKey]})`, color: "#0B0E26", fontWeight: 800,
              boxShadow: `0 6px 16px ${accent}44`, whiteSpace: "nowrap" }}>
              <CatIcon size={15} /> {lang === "ar" ? category?.name_ar : category?.name_en}
            </div>
            <span style={{ color: T.muted, fontSize: 13, fontWeight: 700, whiteSpace: "nowrap" }}>
              {diffMeta?.[lang]} · {difficulty} {difficulty === 1 ? t.pt : t.pts}
            </span>
          </div>
          <button onClick={() => onResolve(null)} className="in-btn" aria-label={t.close}
            style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${T.line}`, color: T.muted, cursor: "pointer",
              padding: 6, borderRadius: 10, display: "flex" }}>
            <X size={20} />
          </button>
        </div>

        {/* timer */}
        <div className={urgent ? "timer-urgent" : ""}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 20 }}>
          <div style={{ position: "relative", width: 88, height: 88 }}>
            <svg width="88" height="88" viewBox="0 0 88 88" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="44" cy="44" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" />
              <circle cx="44" cy="44" r={R} fill="none" stroke={ringColor} strokeWidth="7" strokeLinecap="round"
                strokeDasharray={C} strokeDashoffset={C * (1 - frac)}
                style={{ transition: "stroke-dashoffset 1s linear, stroke .3s ease", filter: `drop-shadow(0 0 6px ${ringColor}88)` }} />
            </svg>
            <div className="in-display" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, fontWeight: 800, color: expired ? T.danger : T.text }}>
              {expired ? "0:00" : mmss}
            </div>
          </div>

          {!expired && !revealed && (
            <button onClick={running ? pause : resume} className="in-btn"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 12, cursor: "pointer",
                fontWeight: 700, fontSize: 14, color: T.text, background: "rgba(255,255,255,0.06)", border: `1px solid ${T.line}` }}>
              {running ? <Pause size={16} /> : <Play size={16} />} {running ? t.pause : t.resume}
            </button>
          )}
          {expired && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: T.danger, fontWeight: 800, fontSize: 16 }}>
              <AlarmClockOff size={18} /> {t.timesUp}
            </span>
          )}
        </div>

        {/* question */}
        <div style={{ color: accent, fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>
          {names[teamKey]} · {t.question}
        </div>
        <p className="in-display" style={{ color: T.text, fontSize: 26, fontWeight: 800, lineHeight: 1.4, margin: "0 0 22px" }}>{qText}</p>

        {/* reveal (only before time-out) */}
        {!revealed && !expired && (
          <button onClick={() => setRevealed(true)} className="in-btn in-display"
            style={{ width: "100%", padding: 15, fontSize: 17, fontWeight: 800, borderRadius: 14, cursor: "pointer",
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9, color: "#0B0E26",
              background: `linear-gradient(90deg, ${T.gold}, ${T.goldDeep})`, border: "none", boxShadow: `0 12px 30px ${T.goldGlow}` }}>
            <Eye size={19} /> {t.reveal}
          </button>
        )}

        {/* answer + actions (shown after reveal OR after time-out) */}
        {(revealed || expired) && (
          <div className="in-fade">
            <div style={{ background: "rgba(70,229,160,0.08)", borderRadius: 16, padding: 18, marginBottom: 20,
              border: `1px solid rgba(70,229,160,0.3)` }}>
              <div style={{ color: T.success, fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>{t.answer}</div>
              <div className="in-display" style={{ color: T.text, fontSize: 24, fontWeight: 800, lineHeight: 1.4 }}>{aText}</div>
            </div>
            <div style={{ color: T.muted, fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>{t.awardTo}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              {["team1", "team2"].map((k) => (
                <button key={k} onClick={() => onResolve(k)} className="in-btn"
                  style={{ padding: "14px 10px", borderRadius: 14, cursor: "pointer", border: "none", fontWeight: 800, fontSize: 15,
                    color: "#0B0E26", background: `linear-gradient(135deg, ${teamColor[k]}, ${teamColorB[k]})`,
                    boxShadow: `0 8px 20px ${teamColor[k]}33`, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {names[k]}  +{difficulty}
                </button>
              ))}
            </div>
            <button onClick={() => onResolve(null)} className={expired ? "in-btn timer-urgent" : "in-btn"}
              style={{ width: "100%", padding: "13px", borderRadius: 14, cursor: "pointer", fontWeight: 800, fontSize: 14,
                color: expired ? "#0B0E26" : T.muted,
                background: expired ? `linear-gradient(135deg, ${T.danger}, #FF8A8A)` : "rgba(255,255,255,0.05)",
                border: expired ? "none" : `1px solid ${T.line}` }}>
              {t.noOne}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const overlay = { position: "fixed", inset: 0, zIndex: 80, display: "flex", alignItems: "center", justifyContent: "center",
  padding: 18, background: "rgba(4,5,13,0.85)", backdropFilter: "blur(8px)" };
