"use client";
import { Flag, RotateCcw, Check } from "lucide-react";
import { T, STR, DIFFS, teamColor, teamColorB, getIcon } from "../lib/theme";
import { cellKey } from "../lib/game";
import { LangToggle } from "./shared";

function TeamPanel({ teamKey, name, score, activeCats, categories, board, used, turn, lang, onOpen }) {
  const t = STR[lang];
  const accent = teamColor[teamKey], accentB = teamColorB[teamKey];
  const isTurn = turn === teamKey;
  return (
    <div style={{ flex: 1, minWidth: 0, borderRadius: 22, padding: 18, background: T.panel,
      border: `1px solid ${isTurn ? accent : T.line}`,
      boxShadow: isTurn ? `0 0 0 1px ${accent}, 0 14px 40px rgba(0,0,0,0.35)` : "0 8px 24px rgba(0,0,0,0.25)",
      opacity: isTurn ? 1 : 0.62, transition: "opacity .25s ease, box-shadow .25s ease, border-color .25s ease" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ color: T.muted, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5 }}>{isTurn ? t.nowPlaying : ""}</div>
          <div className="in-display" style={{ color: T.text, fontWeight: 800, fontSize: 24, lineHeight: 1.1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minWidth: 64, padding: "8px 14px",
          borderRadius: 14, background: `linear-gradient(135deg, ${accent}, ${accentB})`, color: "#0B0E26" }}>
          <span className="in-display" style={{ fontSize: 30, fontWeight: 800, lineHeight: 1 }}>{score}</span>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>{t.score}</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {activeCats.map((cat) => {
          const CatIcon = getIcon(cat.icon);
          return (
            <div key={cat.id} style={{ background: T.panelSoft, borderRadius: 14, padding: 10, border: `1px solid ${T.line}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9, padding: "0 2px" }}>
                <CatIcon size={16} color={accent} />
                <span style={{ color: T.text, fontWeight: 700, fontSize: 14 }}>{lang === "ar" ? cat.name_ar : cat.name_en}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                {DIFFS.map((d) => {
                  const key = cellKey(teamKey, cat.id, d.id);
                  const q = board[key];
                  const isUsed = !!used[key];
                  const disabled = isUsed || !isTurn || !q;
                  return (
                    <button key={d.id} disabled={disabled} onClick={() => onOpen(teamKey, cat.id, d.id)} className="in-card"
                      style={{ padding: "12px 6px", borderRadius: 11, cursor: disabled ? "default" : "pointer", border: "none", textAlign: "center",
                        background: isUsed || !q ? "rgba(255,255,255,0.04)" : `linear-gradient(150deg, ${accent}, ${accentB})`,
                        color: isUsed || !q ? T.muted : "#0B0E26", opacity: isUsed ? 0.45 : (q ? (isTurn ? 1 : 0.85) : 0.3),
                        filter: isUsed ? "grayscale(0.6)" : "none" }}>
                      {isUsed ? <Check size={20} style={{ margin: "2px auto" }} />
                        : <span className="in-display" style={{ fontSize: 24, fontWeight: 800, display: "block", lineHeight: 1 }}>{q ? d.id : "—"}</span>}
                      <span style={{ fontSize: 10, fontWeight: 700, display: "block", marginTop: 2 }}>{isUsed || !q ? "—" : (d.id === 1 ? t.pt : t.pts)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function GameBoard({
  lang, setLang, names, scores, activeCats, categories, board, used, turn, onOpen, onFinish, onReset,
}) {
  const t = STR[lang];
  const rtl = lang === "ar";
  return (
    <div dir={rtl ? "rtl" : "ltr"} style={shell}>
      <div className="in-fade" style={{ width: "100%", maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="in-display" style={{ fontSize: 26, fontWeight: 800,
              background: `linear-gradient(90deg, ${T.t1b}, ${T.t2b})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{t.title}</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "6px 12px", borderRadius: 999,
              background: "rgba(255,255,255,0.05)", border: `1px solid ${T.line}`, color: T.text, fontSize: 13, fontWeight: 700 }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: teamColor[turn], animation: "inglow 1.4s infinite" }} />
              {t.nowPlaying}: {names[turn]}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <LangToggle lang={lang} setLang={setLang} />
            <button onClick={onFinish} className="in-btn" style={{ ...pill, color: "#0B0E26", background: T.gold, border: "none" }}><Flag size={15} /> {t.finish}</button>
            <button onClick={onReset} className="in-btn" style={pill}><RotateCcw size={15} /> {t.reset}</button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 14, alignItems: "stretch", flexWrap: "wrap" }}>
          <TeamPanel teamKey="team1" name={names.team1} score={scores.team1} activeCats={activeCats} categories={categories}
            board={board} used={used} turn={turn} lang={lang} onOpen={onOpen} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto", alignSelf: "center", padding: "0 2px" }}>
            <div className="in-display" style={{ width: 56, height: 56, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, fontWeight: 800, color: T.text, background: T.panel, border: `2px solid ${T.gold}`, boxShadow: "0 0 24px rgba(255,213,107,0.35)" }}>{t.vs}</div>
          </div>
          <TeamPanel teamKey="team2" name={names.team2} score={scores.team2} activeCats={activeCats} categories={categories}
            board={board} used={used} turn={turn} lang={lang} onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

const shell = { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "26px 16px",
  background: `radial-gradient(1100px 600px at 20% -10%, #1B1F4E 0%, transparent 60%), radial-gradient(1000px 600px at 100% 0%, #142a44 0%, transparent 55%), ${T.bg}` };
const pill = { display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 14px", borderRadius: 999, fontWeight: 700, fontSize: 14,
  color: T.text, background: "rgba(255,255,255,0.06)", border: `1px solid ${T.line}`, cursor: "pointer" };
