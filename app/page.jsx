"use client";
import { useState, useEffect, useCallback } from "react";
import { STR } from "../lib/theme";
import { useAuth } from "../lib/useAuth";
import { fetchCategories, fetchUnseenQuestions, recordPlayed } from "../lib/api";
import { buildBoard, cellKey, countPlayableCells } from "../lib/game";

import AuthScreen from "../components/AuthScreen";
import SetupScreen from "../components/SetupScreen";
import GameBoard from "../components/GameBoard";
import QuestionModal from "../components/QuestionModal";
import ResultsScreen from "../components/ResultsScreen";
import AdminDashboard from "../components/AdminDashboard";

export default function Page() {
  const auth = useAuth();
  const [lang, setLang] = useState("en");
  const [view, setView] = useState("setup"); // setup | game | over | admin

  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [n1, setN1] = useState("");
  const [n2, setN2] = useState("");
  const [active, setActive] = useState([]);
  const [notice, setNotice] = useState("");

  const [board, setBoard] = useState({});
  const [used, setUsed] = useState({});
  const [scores, setScores] = useState({ team1: 0, team2: 0 });
  const [turn, setTurn] = useState("team1");
  const [modalSlot, setModalSlot] = useState(null);

  const t = STR[lang];
  const names = { team1: n1.trim() || t.t1ph, team2: n2.trim() || t.t2ph };
  const activeCats = categories.filter((c) => active.includes(c.id));

  // load categories once signed in
  useEffect(() => {
    if (!auth.user) return;
    setLoadingCats(true);
    fetchCategories()
      .then((data) => { setCategories(data); setActive((a) => (a.length ? a : data.slice(0, 3).map((c) => c.id))); })
      .catch(() => setCategories([]))
      .finally(() => setLoadingCats(false));
  }, [auth.user]);

  const toggleCat = (id) => setActive((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));

  const onStart = useCallback(async () => {
    setNotice("");
    const ids = active;
    const pool = await fetchUnseenQuestions(auth.user.id, ids);
    if (pool.length === 0) { setNotice(t.noUnseen); return; }
    const newBoard = buildBoard(activeCats, pool);
    if (countPlayableCells(newBoard) === 0) { setNotice(t.noUnseen); return; }
    setBoard(newBoard); setUsed({}); setScores({ team1: 0, team2: 0 }); setTurn("team1"); setView("game");
  }, [active, activeCats, auth.user, t.noUnseen]);

  const onOpen = (teamKey, catId, diff) => {
    const key = cellKey(teamKey, catId, diff);
    const question = board[key];
    if (!question) return;
    setModalSlot({ key, teamKey, catId, difficulty: diff, question });
  };

  const onResolve = (awardKey) => {
    const { key, difficulty, question } = modalSlot;
    if (awardKey) setScores((s) => ({ ...s, [awardKey]: s[awardKey] + difficulty }));
    const nextUsed = { ...used, [key]: true };
    setUsed(nextUsed);
    setTurn((tn) => (tn === "team1" ? "team2" : "team1"));
    setModalSlot(null);
    // persist: this user has now seen this question → never repeats
    if (question?.id) recordPlayed(auth.user.id, question.id);
    if (Object.keys(nextUsed).length >= countPlayableCells(board)) setView("over");
  };

  const onFinish = () => { setModalSlot(null); setView("over"); };
  const onReset = () => { setView("setup"); setModalSlot(null); };
  const onPlayAgain = () => { setView("setup"); setBoard({}); setUsed({}); setScores({ team1: 0, team2: 0 }); setTurn("team1"); };

  // ── render ──
  if (auth.loading) {
    return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0B0E26", color: "#9698C9" }}>{t.loading}</div>;
  }
  if (!auth.user) return <AuthScreen lang={lang} setLang={setLang} auth={auth} />;

  if (view === "admin") {
    return <AdminDashboard lang={lang} setLang={setLang} onBack={() => setView("setup")} notAdmin={!auth.isAdmin} />;
  }
  if (view === "over") {
    return <ResultsScreen lang={lang} setLang={setLang} names={names} scores={scores} onPlayAgain={onPlayAgain} />;
  }
  if (view === "game") {
    return (
      <>
        <GameBoard lang={lang} setLang={setLang} names={names} scores={scores} activeCats={activeCats}
          categories={categories} board={board} used={used} turn={turn} onOpen={onOpen} onFinish={onFinish} onReset={onReset} />
        {modalSlot && (
          <QuestionModal key={modalSlot.key} slot={modalSlot} lang={lang} names={names}
            category={categories.find((c) => c.id === modalSlot.catId)} onResolve={onResolve} onClose={() => setModalSlot(null)} />
        )}
      </>
    );
  }
  return (
    <SetupScreen lang={lang} setLang={setLang} categories={categories} loading={loadingCats}
      n1={n1} setN1={setN1} n2={n2} setN2={setN2} active={active} toggleCat={toggleCat}
      onStart={onStart} isAdmin={auth.isAdmin} onAdmin={() => setView("admin")} onSignOut={auth.signOut} notice={notice} />
  );
}
