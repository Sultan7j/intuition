// ════════════════════════════════════════════════════════════
//  DATA LAYER — the single place the front-end talks to the back-end.
//  If Supabase is configured, it hits the real database.
//  If not (demo mode), it uses in-memory mock data so the app still runs.
// ════════════════════════════════════════════════════════════
import { supabase, hasSupabase } from "./supabaseClient";
import { MOCK_CATEGORIES, MOCK_QUESTIONS } from "./mockData";

// ---- demo-mode in-memory stores (reset on refresh) ----
let demoCats = [...MOCK_CATEGORIES];
let demoQuestions = [...MOCK_QUESTIONS];
let demoPlayed = new Set();
let demoSeq = 1000;

// ── READ: categories ─────────────────────────────────────────
export async function fetchCategories() {
  if (!hasSupabase) return [...demoCats].sort((a, b) => a.sort_order - b.sort_order);
  const { data, error } = await supabase.from("categories").select("*").order("sort_order");
  if (error) throw error;
  return data;
}

// ── READ: only questions this user has NEVER played ──────────
export async function fetchUnseenQuestions(userId, categoryIds) {
  if (categoryIds.length === 0) return [];
  if (!hasSupabase) {
    return demoQuestions.filter(
      (q) => categoryIds.includes(q.category_id) && q.is_published && !demoPlayed.has(q.id)
    );
  }
  const { data: played, error: e1 } = await supabase
    .from("played_questions").select("question_id").eq("user_id", userId);
  if (e1) throw e1;
  const seen = new Set((played || []).map((r) => r.question_id));

  const { data, error } = await supabase
    .from("questions").select("*")
    .eq("is_published", true)
    .in("category_id", categoryIds);
  if (error) throw error;
  return data.filter((q) => !seen.has(q.id));
}

// ── WRITE: mark a question as played (so it never repeats) ───
export async function recordPlayed(userId, questionId) {
  if (!questionId) return;
  if (!hasSupabase) { demoPlayed.add(questionId); return; }
  await supabase.from("played_questions")
    .upsert({ user_id: userId, question_id: questionId }, { onConflict: "user_id,question_id" });
}

// ════════════════════════════════════════════════════════════
//  ADMIN CRUD — only succeeds for admins (enforced by RLS in DB)
// ════════════════════════════════════════════════════════════
export async function createCategory(payload) {
  if (!hasSupabase) {
    const cat = { id: `c${++demoSeq}`, sort_order: demoCats.length + 1, icon: "default", ...payload };
    demoCats.push(cat); return cat;
  }
  const { data, error } = await supabase.from("categories").insert(payload).select().single();
  if (error) throw error; return data;
}

export async function updateCategory(id, patch) {
  if (!hasSupabase) { demoCats = demoCats.map((c) => (c.id === id ? { ...c, ...patch } : c)); return; }
  const { error } = await supabase.from("categories").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteCategory(id) {
  if (!hasSupabase) {
    demoCats = demoCats.filter((c) => c.id !== id);
    demoQuestions = demoQuestions.filter((q) => q.category_id !== id);
    return;
  }
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchQuestionsByCategory(categoryId) {
  if (!hasSupabase) return demoQuestions.filter((q) => q.category_id === categoryId);
  const { data, error } = await supabase
    .from("questions").select("*").eq("category_id", categoryId).order("difficulty");
  if (error) throw error; return data;
}

export async function createQuestion(payload) {
  if (!hasSupabase) {
    const row = { id: `q${++demoSeq}`, is_published: true, ...payload };
    demoQuestions.push(row); return row;
  }
  const { data, error } = await supabase.from("questions").insert(payload).select().single();
  if (error) throw error; return data;
}

export async function updateQuestion(id, patch) {
  if (!hasSupabase) { demoQuestions = demoQuestions.map((q) => (q.id === id ? { ...q, ...patch } : q)); return; }
  const { error } = await supabase.from("questions").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteQuestion(id) {
  if (!hasSupabase) { demoQuestions = demoQuestions.filter((q) => q.id !== id); return; }
  const { error } = await supabase.from("questions").delete().eq("id", id);
  if (error) throw error;
}
