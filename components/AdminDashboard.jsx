"use client";
import { useState, useEffect, useCallback } from "react";
import { ShieldCheck, Plus, Trash2, Save, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { T, STR, DIFFS, getIcon } from "../lib/theme";
import { LangToggle } from "./shared";
import {
  fetchCategories, createCategory, updateCategory, deleteCategory,
  fetchQuestionsByCategory, createQuestion, updateQuestion, deleteQuestion,
} from "../lib/api";

export default function AdminDashboard({ lang, setLang, onBack, notAdmin }) {
  const t = STR[lang];
  const rtl = lang === "ar";
  const [cats, setCats] = useState([]);
  const [sel, setSel] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [status, setStatus] = useState("");

  const loadCats = useCallback(async () => {
    const data = await fetchCategories();
    setCats(data);
    setSel((s) => s || data[0]?.id || null);
  }, []);

  useEffect(() => { if (!notAdmin) loadCats(); }, [loadCats, notAdmin]);
  useEffect(() => {
    if (!sel) { setQuestions([]); return; }
    fetchQuestionsByCategory(sel).then(setQuestions).catch(() => setQuestions([]));
  }, [sel]);

  const flash = (msg) => { setStatus(msg); setTimeout(() => setStatus(""), 1500); };
  const selCat = cats.find((c) => c.id === sel) || null;

  const addCat = async () => {
    const c = await createCategory({ name_en: "New Category", name_ar: "فئة جديدة", icon: "default", sort_order: cats.length + 1 });
    await loadCats(); setSel(c.id);
  };
  const saveCatName = async (id, patch) => { await updateCategory(id, patch); setCats((p) => p.map((c) => (c.id === id ? { ...c, ...patch } : c))); flash(t.saved); };
  const removeCat = async (id) => { await deleteCategory(id); const next = cats.filter((c) => c.id !== id); setCats(next); setSel(next[0]?.id || null); };

  const addQ = async () => {
    const row = await createQuestion({ category_id: sel, difficulty: 1, question_en: "", answer_en: "", question_ar: "", answer_ar: "", is_published: true });
    setQuestions((p) => [...p, row]);
  };
  const patchQ = (id, patch) => setQuestions((p) => p.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  const saveQ = async (q) => {
    const { id, ...rest } = q;
    await updateQuestion(id, rest); flash(t.saved);
  };
  const removeQ = async (id) => { await deleteQuestion(id); setQuestions((p) => p.filter((q) => q.id !== id)); };

  if (notAdmin) {
    return (
      <div dir={rtl ? "rtl" : "ltr"} style={shell}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: T.muted, fontSize: 16, marginBottom: 16 }}>{t.notAdmin}</p>
          <button onClick={onBack} className="in-btn" style={pill}><ArrowLeft size={15} /> {t.back}</button>
        </div>
      </div>
    );
  }

  return (
    <div dir={rtl ? "rtl" : "ltr"} style={shell}>
      <div className="in-fade" style={{ width: "100%", maxWidth: 1100, margin: "0 auto" }}>
        {/* header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 11px", borderRadius: 999,
              background: "rgba(255,213,107,0.12)", border: `1px solid ${T.gold}`, color: T.gold, fontSize: 12, fontWeight: 800 }}>
              <ShieldCheck size={14} /> {t.admin}
            </span>
            <h1 className="in-display" style={{ color: T.text, fontSize: 26, fontWeight: 800, margin: 0 }}>{t.manager}</h1>
            {status && <span style={{ color: "#7CE0A0", fontSize: 13, fontWeight: 700 }}>{status}</span>}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <LangToggle lang={lang} setLang={setLang} />
            <button onClick={onBack} className="in-btn" style={{ ...pill, color: "#0B0E26", background: T.gold, border: "none" }}><ArrowLeft size={15} /> {t.back}</button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 14, alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* categories */}
          <div style={{ flex: "1 1 240px", minWidth: 220, background: T.panel, borderRadius: 18, padding: 14, border: `1px solid ${T.line}` }}>
            <div style={{ color: T.text, fontWeight: 800, fontSize: 15, marginBottom: 12 }}>{t.categories}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {cats.map((c) => {
                const Icon = getIcon(c.icon); const on = c.id === sel;
                return (
                  <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <button onClick={() => setSel(c.id)} className="in-btn"
                      style={{ flex: 1, display: "flex", alignItems: "center", gap: 9, padding: "11px 12px", borderRadius: 11, cursor: "pointer",
                        textAlign: rtl ? "right" : "left", fontWeight: 700, fontSize: 14, color: on ? "#0B0E26" : T.text,
                        background: on ? `linear-gradient(135deg, ${T.gold}, ${T.goldDeep})` : T.panelSoft, border: `1px solid ${on ? "transparent" : T.line}` }}>
                      <Icon size={16} /> <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lang === "ar" ? c.name_ar : c.name_en}</span>
                    </button>
                    <button onClick={() => removeCat(c.id)} className="in-btn" aria-label={t.delete}
                      style={{ padding: 9, borderRadius: 10, cursor: "pointer", color: "#FF8A8A", background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.25)" }}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                );
              })}
            </div>
            <button onClick={addCat} className="in-btn" style={{ width: "100%", marginTop: 12, display: "inline-flex", alignItems: "center", justifyContent: "center",
              gap: 7, padding: "11px", borderRadius: 11, cursor: "pointer", fontWeight: 700, fontSize: 14, color: T.text, background: "transparent", border: `1px dashed ${T.line}` }}>
              <Plus size={16} /> {t.addCategory}
            </button>
          </div>

          {/* editor */}
          <div style={{ flex: "2 1 460px", minWidth: 280, background: T.panel, borderRadius: 18, padding: 16, border: `1px solid ${T.line}` }}>
            {!selCat ? (
              <p style={{ color: T.muted, textAlign: "center", padding: "30px 0" }}>{t.selectCat}</p>
            ) : (
              <>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
                  <div style={{ flex: "1 1 180px" }}>
                    <label style={lbl}>{t.nameEn}</label>
                    <input value={selCat.name_en} dir="ltr" onChange={(e) => setCats((p) => p.map((c) => c.id === sel ? { ...c, name_en: e.target.value } : c))}
                      onBlur={(e) => saveCatName(sel, { name_en: e.target.value })} style={field} />
                  </div>
                  <div style={{ flex: "1 1 180px" }}>
                    <label style={lbl}>{t.nameAr}</label>
                    <input value={selCat.name_ar} dir="rtl" onChange={(e) => setCats((p) => p.map((c) => c.id === sel ? { ...c, name_ar: e.target.value } : c))}
                      onBlur={(e) => saveCatName(sel, { name_ar: e.target.value })} style={field} />
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ color: T.text, fontWeight: 800, fontSize: 15 }}>{rtl ? "الأسئلة" : "Questions"}</span>
                  <button onClick={addQ} className="in-btn" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 13px", borderRadius: 10,
                    cursor: "pointer", fontWeight: 700, fontSize: 13, color: "#0B0E26", background: T.gold, border: "none" }}>
                    <Plus size={15} /> {t.addQuestion}
                  </button>
                </div>

                {questions.length === 0 && <p style={{ color: T.muted, fontSize: 14 }}>{t.noQuestions}</p>}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {questions.map((q) => (
                    <div key={q.id} style={{ background: T.panelSoft, borderRadius: 14, padding: 14, border: `1px solid ${T.line}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
                        <select value={q.difficulty} onChange={(e) => patchQ(q.id, { difficulty: Number(e.target.value) })}
                          style={{ ...field, width: "auto", padding: "8px 10px" }}>
                          {DIFFS.map((d) => <option key={d.id} value={d.id}>{d[lang]} · {d.id} {d.id === 1 ? t.pt : t.pts}</option>)}
                        </select>
                        <button onClick={() => patchQ(q.id, { is_published: !q.is_published })} className="in-btn"
                          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 13,
                            color: q.is_published ? "#0B0E26" : T.muted, background: q.is_published ? "#7CE0A0" : "rgba(255,255,255,0.05)", border: `1px solid ${T.line}` }}>
                          {q.is_published ? <Eye size={14} /> : <EyeOff size={14} />} {q.is_published ? t.publish : "—"}
                        </button>
                        <div style={{ flex: 1 }} />
                        <button onClick={() => saveQ(q)} className="in-btn" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 12px",
                          borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 13, color: "#0B0E26", background: T.gold, border: "none" }}>
                          <Save size={14} /> {t.saved.replace("Saved", "Save").replace("تم الحفظ", "حفظ")}
                        </button>
                        <button onClick={() => removeQ(q.id)} className="in-btn" style={{ padding: 8, borderRadius: 10, cursor: "pointer", color: "#FF8A8A",
                          background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.25)" }}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <div style={{ flex: "1 1 220px" }}>
                          <label style={lbl}>{t.qEn}</label>
                          <textarea value={q.question_en || ""} dir="ltr" onChange={(e) => patchQ(q.id, { question_en: e.target.value })} style={area} />
                          <label style={lbl}>{t.aEn}</label>
                          <input value={q.answer_en || ""} dir="ltr" onChange={(e) => patchQ(q.id, { answer_en: e.target.value })} style={field} />
                        </div>
                        <div style={{ flex: "1 1 220px" }}>
                          <label style={lbl}>{t.qAr}</label>
                          <textarea value={q.question_ar || ""} dir="rtl" onChange={(e) => patchQ(q.id, { question_ar: e.target.value })} style={area} />
                          <label style={lbl}>{t.aAr}</label>
                          <input value={q.answer_ar || ""} dir="rtl" onChange={(e) => patchQ(q.id, { answer_ar: e.target.value })} style={field} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const shell = { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "26px 16px",
  background: `radial-gradient(1100px 600px at 20% -10%, #1B1F4E 0%, transparent 60%), radial-gradient(1000px 600px at 100% 0%, #142a44 0%, transparent 55%), ${T.bg}` };
const pill = { display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 14px", borderRadius: 999, fontWeight: 700, fontSize: 14,
  color: T.text, background: "rgba(255,255,255,0.06)", border: `1px solid ${T.line}`, cursor: "pointer" };
const lbl = { display: "block", color: T.muted, fontSize: 12, fontWeight: 700, margin: "8px 0 5px" };
const field = { width: "100%", padding: "10px 12px", fontSize: 14, fontWeight: 600, color: T.text, background: T.bg, borderRadius: 10, border: `1px solid ${T.line}`, outline: "none" };
const area = { width: "100%", minHeight: 50, padding: "10px 12px", fontSize: 14, fontWeight: 500, color: T.text, background: T.bg, borderRadius: 10, border: `1px solid ${T.line}`, outline: "none", resize: "vertical" };
