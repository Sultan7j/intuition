import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// When env vars are missing, the whole app falls back to DEMO MODE (mock data).
export const hasSupabase = Boolean(url && anon);

export const supabase = hasSupabase ? createClient(url, anon) : null;
