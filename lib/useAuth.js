"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase, hasSupabase } from "./supabaseClient";

// Returns { user, isAdmin, loading, signIn, signUp, signOut, demo }
export function useAuth() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // load the profile row to learn admin status
  const loadProfile = useCallback(async (u) => {
    if (!u) { setIsAdmin(false); return; }
    if (!hasSupabase) { setIsAdmin(true); return; } // demo: let you explore admin
    const { data } = await supabase.from("profiles").select("is_admin").eq("id", u.id).single();
    setIsAdmin(Boolean(data?.is_admin));
  }, []);

  useEffect(() => {
    let active = true;
    async function init() {
      if (!hasSupabase) { setLoading(false); return; }
      const { data } = await supabase.auth.getSession();
      const u = data?.session?.user ?? null;
      if (!active) return;
      setUser(u);
      await loadProfile(u);
      setLoading(false);
    }
    init();
    if (!hasSupabase) return;
    const { data: sub } = supabase.auth.onAuthStateChange(async (_e, session) => {
      const u = session?.user ?? null;
      setUser(u);
      await loadProfile(u);
    });
    return () => { active = false; sub?.subscription?.unsubscribe?.(); };
  }, [loadProfile]);

  const signIn = useCallback(async (email, password) => {
    if (!hasSupabase) {
      const u = { id: "demo-user", email: email || "demo@intuition.app" };
      setUser(u); setIsAdmin(true); return { error: null };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  }, []);

  const signUp = useCallback(async (email, password) => {
    if (!hasSupabase) {
      // demo: pretend a code was sent so the verify UI can be shown
      return { error: null, data: { session: null, user: { email } }, needsVerification: true };
    }
    const { data, error } = await supabase.auth.signUp({ email, password });
    // When email confirmation is ON, Supabase returns no session → user must verify.
    const needsVerification = !error && !data?.session;
    return { error, data, needsVerification };
  }, []);

  // Cross-device 6-digit OTP confirmation. Works regardless of which device
  // opened the email — the code is typed wherever the user signed up.
  const verifyOtp = useCallback(async (email, token) => {
    if (!hasSupabase) {
      const u = { id: "demo-user", email: email || "demo@intuition.app" };
      setUser(u); setIsAdmin(true); return { error: null };
    }
    const { data, error } = await supabase.auth.verifyOtp({
      email: (email || "").trim(), token: (token || "").trim(), type: "signup",
    });
    // onAuthStateChange will pick the session up, but set it eagerly too.
    if (!error && data?.user) { setUser(data.user); await loadProfile(data.user); }
    return { error, data };
  }, [loadProfile]);

  // Re-send the signup confirmation code.
  const resendOtp = useCallback(async (email) => {
    if (!hasSupabase) return { error: null };
    const { error } = await supabase.auth.resend({ type: "signup", email: (email || "").trim() });
    return { error };
  }, []);

  // Fallback: user pastes the confirmation link/token from another device.
  const verifyTokenHash = useCallback(async (tokenHash) => {
    if (!hasSupabase) {
      const u = { id: "demo-user", email: "demo@intuition.app" };
      setUser(u); setIsAdmin(true); return { error: null };
    }
    const { data, error } = await supabase.auth.verifyOtp({ token_hash: (tokenHash || "").trim(), type: "signup" });
    if (!error && data?.user) { setUser(data.user); await loadProfile(data.user); }
    return { error, data };
  }, [loadProfile]);

  const signOut = useCallback(async () => {
    if (hasSupabase) await supabase.auth.signOut();
    setUser(null); setIsAdmin(false);
  }, []);

  return { user, isAdmin, loading, signIn, signUp, verifyOtp, resendOtp, verifyTokenHash, signOut, demo: !hasSupabase };
}
