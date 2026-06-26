"use client";
import { Flag, RotateCcw, Check } from "lucide-react";
import { T, STR, DIFFS, APP_BG, teamColor, teamColorB, getIcon } from "../lib/theme";
import { cellKey } from "../lib/game";
import { LangToggle, Aurora } from "./shared";

function TeamPanel({ teamKey, name, score, activeCats, board, used, turn, lang, onOpen }) {
  const t = STR[lang];
  const accent = teamColor[teamKey], accentB = teamColorB[teamKey];
  const isTurn = turn === teamKey;
  return (
    <div style={{ flex: "1 1 320px", minWidth: 0, borderRadius: 24, padding: 18,
      background: "linear-gradient(180deg, rgba(28,33,80,0.7), rgba(13,16,42,0.85))",
      border: `1.5px solid ${isTurn ? accent : T.line}`,
      boxShadow: isTurn ? `0 0 0 1px ${accent}, 0 18px 50px rgba(0,0,0,0.4), 0 0 40px ${accent}33` : "0 10px 28px rgba(0,0,0,0.3)",
      opacity: isTurn ? 1 : 0.6, transform: isTurn ? "translateY(-2px)" : "none",
      transition: "opacity .3s ease, box-shadow .3s ease, border-color .3s ease, transform .3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ height: 14, color: accent, fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5,
            display: "flex", alignItems: "center", gap: 6 }}>
            {isTurn && <><span style={{ width: 7, height: 7, borderRadius: 999, background: accent, animation: "inglow 1.4s infinite" }} />{t.nowPlaying}</>}
          </div>
          <div className="in-display" style={{ color: T.text, fontWeight: 800, fontSize: 25, lineHeight: 1.1,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minWidth: 68, padding: "8px 14px",
          borderRadius: 16, background: `linear-gradient(135deg, ${accent}, ${accentB})`, color: "#0B0E26",
          boxShadow: `0 8px 22px ${accent}44` }}>
          <span className="in-display" style={{ fontSize: 32, fontWeight: 800, lineHeight: 1 }}>{score}</span>
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1 }}>{t.score}</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {activeCats.map((cat) => {
          const CatIcon = getIcon(cat.icon);
          return (
            <div key={cat.id} style={{ background: "rgba(0,0,0,0.22)", borderRadius: 16, padding: 11, border: `1px solid ${T.lineSoft}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, padding: "0 2px" }}>
                <CatIcon size={16} color={accent} />
                <span style={{ color: T.text, fontWeight: 700, fontSize: 14 }}>{lang === "ar" ? cat.name_ar : cat.name_en}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 9 }}>
                {DIFFS.map((d) => {
                  const key = cellKey(teamKey, cat.id, d.id);
                  const q = board[key];
                  const isUsed = !!used[key];
                  const disabled = isUsed || !isTurn || !q;
                  const live = q && !isUsed;
                  return (
                    <button key={d.id} disabled={disabled} onClick={() => onOpen(teamKey, cat.id, d.id)}
                      className={`in-card${live && isTurn ? " in-glow" : ""}${isUsed ? " in-used" : ""}`}
                      style={{ "--glow": `${accent}66`, padding: "14px 6px", borderRadius: 13, border: "none", textAlign: "center",
                        cursor: disabled ? "default" : "pointer",
                        background: live ? `linear-gradient(150deg, ${accent}, ${accentB})` : "rgba(255,255,255,0.04)",
                        color: live ? "#0B0E26" : T.mutedDeep,
                        opacity: isUsed ? 0.4 : (live ? (isTurn ? 1 : 0.85) : 0.35),
                        boxShadow: live && isTurn ? `0 6px 16px ${accent}33` : "none" }}>
                      {isUsed
                        ? <Check size={22} style={{ margin: "2px auto" }} />
                        : <span className="in-display" style={{ fontSize: 26, fontWeight: 800, display: "block", lineHeight: 1 }}>{q ? d.id : "—"}</span>}
                      <span style={{ fontSize: 10, fontWeight: 800, display: "block", marginTop: 3, letterSpacing: .5 }}>
                        {isUsed || !q ? "—" : (d.id === 1 ? t.pt : t.pts)}
                      </span>
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
  lang, setLang, names, scores, activeCats, board, used, turn, onOpen, onFinish, onReset,
}) {
  const t = STR[lang];
  const rtl = lang === "ar";
  return (
    <div dir={rtl ? "rtl" : "ltr"} style={shell}>
      <Aurora />
      <div className="in-fade" style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span className="in-display in-gradient-text" style={{ fontSize: 28, fontWeight: 800,
              backgroundImage: `linear-gradient(90deg, ${T.t1b}, ${T.gold}, ${T.t2b})` }}>{t.title}</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "7px 13px", borderRadius: 999,
              background: "rgba(255,255,255,0.05)", border: `1px solid ${T.line}`, color: T.text, fontSize: 13, fontWeight: 700 }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: teamColor[turn], animation: "inglow 1.4s infinite" }} />
              {t.nowPlaying}: {names[turn]}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <LangToggle lang={lang} setLang={setLang} />
            <button onClick={onFinish} className="in-btn" style={{ ...pill, color: "#0B0E26",
              background: `linear-gradient(135deg, ${T.gold}, ${T.goldDeep})`, border: "none" }}><Flag size={15} /> {t.finish}</button>
            <button onClick={onReset} className="in-btn" style={pill}><RotateCcw size={15} /> {t.reset}</button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, alignItems: "stretch", flexWrap: "wrap", justifyContent: "center" }}>
          <TeamPanel teamKey="team1" name={names.team1} score={scores.team1} activeCats={activeCats}
            board={board} used={used} turn={turn} lang={lang} onOpen={onOpen} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto", alignSelf: "center", padding: "0 2px" }}>
            <div className="in-display" style={{ width: 58, height: 58, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 19, fontWeight: 800, color: T.text, background: "rgba(13,16,42,0.9)", border: `2px solid ${T.gold}`,
              boxShadow: `0 0 28px ${T.goldGlow}` }}>{t.vs}</div>
          </div>
          <TeamPanel teamKey="team2" name={names.team2} score={scores.team2} activeCats={activeCats}
            board={board} used={used} turn={turn} lang={lang} onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

const shell = { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "26px 16px",
  position: "relative", background: APP_BG };
const pill = { display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 14px", borderRadius: 999, fontWeight: 700, fontSize: 14,
  color: T.text, background: "rgba(255,255,255,0.06)", border: `1px solid ${T.line}`, cursor: "pointer" };
