"use client";
import { useState, useRef, useEffect } from "react";
import { LogIn, UserPlus, ShieldCheck, Mail, Lock, ArrowLeft, RefreshCw, Link2, Sparkles } from "lucide-react";
import { T, STR, APP_BG } from "../lib/theme";
import { LangToggle, Aurora } from "./shared";

const emailOk = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((e || "").trim());

export default function AuthScreen({ lang, setLang, auth }) {
  const t = STR[lang];
  const rtl = lang === "ar";

  // tab: "login" | "signup" ; step: "form" | "verify"
  const [tab, setTab] = useState("login");
  const [step, setStep] = useState("form");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showPasteLink, setShowPasteLink] = useState(false);
  const [pasteLink, setPasteLink] = useState("");

  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const otpRefs = useRef([]);

  // resend cooldown ticker
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => (c <= 1 ? 0 : c - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const reset = (nextTab) => {
    setTab(nextTab); setStep("form"); setError(""); setInfo("");
    setPassword(""); setConfirm(""); setOtp(["", "", "", "", "", ""]);
    setShowPasteLink(false); setPasteLink("");
  };

  // ── LOGIN / SIGNUP submit ──
  const submitForm = async () => {
    setError(""); setInfo("");
    if (!emailOk(email)) { setError(t.emailInvalid); return; }
    if (password.length < 6) { setError(t.passwordShort); return; }
    if (tab === "signup" && password !== confirm) { setError(t.passwordMismatch); return; }

    setBusy(true);
    try {
      if (tab === "login") {
        const { error: e } = await auth.signIn(email.trim(), password);
        if (e) setError(e.message || t.authError);
        // success → useAuth's onAuthStateChange swaps the screen out.
      } else {
        const { error: e, needsVerification } = await auth.signUp(email.trim(), password);
        if (e) { setError(e.message || t.authError); }
        else if (needsVerification) { setStep("verify"); setCooldown(45); setInfo(""); }
        // if no verification needed, session is live → screen swaps out.
      }
    } catch {
      setError(t.authError);
    } finally {
      setBusy(false);
    }
  };

  // ── OTP verify ──
  const submitOtp = async (codeArr) => {
    const code = (codeArr || otp).join("");
    if (code.length !== 6) return;
    setBusy(true); setError(""); setInfo("");
    try {
      const { error: e } = await auth.verifyOtp(email.trim(), code);
      if (e) { setError(t.otpInvalid); setOtp(["", "", "", "", "", ""]); otpRefs.current[0]?.focus(); }
      // success → onAuthStateChange swaps the screen out.
    } catch {
      setError(t.otpInvalid);
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    if (cooldown > 0 || busy) return;
    setBusy(true); setError(""); setInfo("");
    try {
      const { error: e } = await auth.resendOtp(email.trim());
      if (e) setError(e.message || t.authError);
      else { setInfo(t.otpResent); setCooldown(45); }
    } finally { setBusy(false); }
  };

  // paste-link fallback: pull token_hash from a confirmation URL or use raw value
  const verifyFromLink = async () => {
    setBusy(true); setError(""); setInfo("");
    try {
      let token = pasteLink.trim();
      try {
        const u = new URL(pasteLink.trim());
        token = u.searchParams.get("token_hash") || u.searchParams.get("token") || token;
      } catch { /* not a URL — treat as raw token_hash */ }
      const { error: e } = await auth.verifyTokenHash(token);
      if (e) setError(t.otpInvalid);
    } catch {
      setError(t.otpInvalid);
    } finally { setBusy(false); }
  };

  // ── OTP box handlers ──
  const onOtpChange = (i, val) => {
    const digits = val.replace(/\D/g, "");
    if (!digits) { setOtp((o) => o.map((d, idx) => (idx === i ? "" : d))); return; }
    if (digits.length > 1) { // paste of full code
      const next = digits.slice(0, 6).split("");
      const filled = ["", "", "", "", "", ""].map((_, idx) => next[idx] || "");
      setOtp(filled);
      otpRefs.current[Math.min(next.length, 5)]?.focus();
      if (next.length >= 6) submitOtp(filled);
      return;
    }
    setOtp((o) => {
      const n = o.map((d, idx) => (idx === i ? digits : d));
      if (i < 5) otpRefs.current[i + 1]?.focus();
      if (n.join("").length === 6) submitOtp(n);
      return n;
    });
  };
  const onOtpKey = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const accent = tab === "login" ? T.gold : T.purple;
  const accentDeep = tab === "login" ? T.goldDeep : T.purpleDeep;

  return (
    <div dir={rtl ? "rtl" : "ltr"} style={{ minHeight: "100vh", position: "relative", display: "flex",
      alignItems: "center", justifyContent: "center", padding: 18, background: APP_BG }}>
      <Aurora />
      <div style={{ position: "absolute", top: 18, insetInlineEnd: 18, zIndex: 2 }}><LangToggle lang={lang} setLang={setLang} /></div>

      <div className="in-pop" style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 440,
        background: "linear-gradient(180deg, rgba(28,33,80,0.85), rgba(13,16,42,0.92))",
        borderRadius: 28, border: `1px solid ${T.line}`,
        boxShadow: `0 40px 90px rgba(0,0,0,0.55), 0 0 60px ${tab === "login" ? T.goldGlow : T.purpleGlow}`,
        backdropFilter: "blur(14px)", overflow: "hidden" }}>

        {/* top accent bar */}
        <div style={{ height: 5, background: `linear-gradient(90deg, ${accent}, ${accentDeep})`,
          boxShadow: `0 0 22px ${tab === "login" ? T.goldGlow : T.purpleGlow}` }} />

        <div style={{ padding: 30 }}>
          {/* brand */}
          <div style={{ textAlign: "center", marginBottom: 22 }}>
            <h1 className="in-display in-gradient-text" style={{ fontSize: 46, fontWeight: 800, margin: 0,
              backgroundImage: `linear-gradient(90deg, ${T.t1b}, ${T.gold}, ${T.purple}, ${T.t2b})` }}>
              {t.title}
            </h1>
            <p style={{ color: T.muted, margin: "2px 0 0", fontSize: 14, fontWeight: 600 }}>{t.sub}</p>
          </div>

          {auth.demo && (
            <div style={{ background: "rgba(255,213,107,0.1)", border: `1px solid ${T.gold}`, color: T.gold,
              borderRadius: 12, padding: "9px 12px", fontSize: 12, fontWeight: 700, marginBottom: 16, textAlign: "center" }}>
              {t.demoBanner}
            </div>
          )}

          {step === "form" ? (
            <>
              {/* segmented Log In / Sign Up switch — the two flows feel distinct */}
              <div style={{ display: "flex", position: "relative", background: "rgba(0,0,0,0.28)",
                borderRadius: 16, padding: 5, marginBottom: 22, border: `1px solid ${T.lineSoft}` }}>
                <span style={{ position: "absolute", top: 5, bottom: 5, width: "calc(50% - 5px)", borderRadius: 12,
                  insetInlineStart: tab === "login" ? 5 : "calc(50%)",
                  background: `linear-gradient(135deg, ${accent}, ${accentDeep})`,
                  boxShadow: `0 6px 18px ${tab === "login" ? T.goldGlow : T.purpleGlow}`,
                  transition: "inset-inline-start .28s cubic-bezier(.4,1.3,.5,1), background .25s ease" }} />
                {[["login", t.tabLogin, LogIn], ["signup", t.tabSignup, UserPlus]].map(([key, label, Icon]) => (
                  <button key={key} onClick={() => reset(key)}
                    style={{ flex: 1, position: "relative", zIndex: 1, padding: "11px 8px", borderRadius: 12, border: "none",
                      background: "transparent", cursor: "pointer", fontWeight: 800, fontSize: 15,
                      fontFamily: "'Changa', sans-serif",
                      color: tab === key ? "#0B0E26" : T.muted, display: "inline-flex", alignItems: "center",
                      justifyContent: "center", gap: 7, transition: "color .25s ease" }}>
                    <Icon size={16} /> {label}
                  </button>
                ))}
              </div>

              {/* heading distinct per flow */}
              <div style={{ marginBottom: 18 }}>
                <h2 className="in-display" style={{ margin: 0, fontSize: 23, fontWeight: 800, color: T.text }}>
                  {tab === "login" ? t.loginTitle : t.signupTitle}
                </h2>
                <p style={{ margin: "4px 0 0", color: T.muted, fontSize: 13.5 }}>
                  {tab === "login" ? t.loginSub : t.signupSub}
                </p>
              </div>

              {/* email */}
              <Field icon={Mail} label={t.email}>
                <input type="email" value={email} dir="ltr" autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={inp} />
              </Field>

              {/* password */}
              <Field icon={Lock} label={t.password} top={14}>
                <input type="password" value={password} dir="ltr"
                  autoComplete={tab === "login" ? "current-password" : "new-password"}
                  onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                  onKeyDown={(e) => { if (e.key === "Enter" && tab === "login") submitForm(); }} style={inp} />
              </Field>

              {/* confirm password — only on Sign Up, so the flows look structurally different */}
              {tab === "signup" && (
                <div className="in-fade">
                  <Field icon={ShieldCheck} label={t.confirmPassword} top={14}>
                    <input type="password" value={confirm} dir="ltr" autoComplete="new-password"
                      onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••"
                      onKeyDown={(e) => { if (e.key === "Enter") submitForm(); }} style={inp} />
                  </Field>
                  <p style={{ color: T.mutedDeep, fontSize: 12, margin: "8px 2px 0", fontWeight: 600 }}>{t.passwordHint}</p>
                </div>
              )}

              {tab === "login" && (
                <div style={{ textAlign: rtl ? "left" : "right", marginTop: 10 }}>
                  <span style={{ color: T.muted, fontSize: 13, fontWeight: 600 }}>{t.forgotPassword}</span>
                </div>
              )}

              <Feedback error={error} info={info} />

              <button onClick={submitForm} disabled={busy} className="in-btn in-display"
                style={{ ...cta, marginTop: 18, background: `linear-gradient(90deg, ${accent}, ${accentDeep})`,
                  boxShadow: `0 12px 30px ${tab === "login" ? T.goldGlow : T.purpleGlow}`, opacity: busy ? 0.7 : 1 }}>
                {tab === "login" ? <LogIn size={18} /> : <Sparkles size={18} />}
                {busy ? "…" : (tab === "login" ? t.signIn : t.signUp)}
              </button>

              {/* cross-flow nudge */}
              <p style={{ textAlign: "center", color: T.muted, fontSize: 13.5, margin: "18px 0 0", fontWeight: 600 }}>
                {tab === "login" ? t.createOne : t.alreadyMember}{" "}
                <button onClick={() => reset(tab === "login" ? "signup" : "login")}
                  style={{ background: "none", border: "none", color: accent, fontWeight: 800, cursor: "pointer", fontSize: 13.5 }}>
                  {tab === "login" ? t.createAccountCta : t.logInCta}
                </button>
              </p>
            </>
          ) : (
            /* ── VERIFY STEP (cross-device OTP) ── */
            <div className="in-fade">
              <button onClick={() => { setStep("form"); setError(""); setInfo(""); }}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none",
                  color: T.muted, fontWeight: 700, fontSize: 13, cursor: "pointer", marginBottom: 14, padding: 0 }}>
                <ArrowLeft size={15} style={{ transform: rtl ? "scaleX(-1)" : "none" }} /> {t.changeEmail}
              </button>

              <div style={{ textAlign: "center", marginBottom: 18 }}>
                <div style={{ display: "inline-flex", width: 64, height: 64, borderRadius: 18, alignItems: "center",
                  justifyContent: "center", margin: "0 auto 14px",
                  background: `linear-gradient(135deg, ${T.purple}, ${T.purpleDeep})`,
                  boxShadow: `0 12px 34px ${T.purpleGlow}` }}>
                  <Mail size={30} color="#0B0E26" />
                </div>
                <h2 className="in-display" style={{ margin: 0, fontSize: 23, fontWeight: 800, color: T.text }}>{t.verifyTitle}</h2>
                <p style={{ margin: "8px 0 0", color: T.muted, fontSize: 13, lineHeight: 1.5 }}>
                  {t.verifySentTo} <strong style={{ color: T.text }} dir="ltr">{email}</strong>
                </p>
                <p style={{ margin: "10px 0 0", color: T.mutedDeep, fontSize: 12.5, lineHeight: 1.55 }}>{t.verifyDeviceNote}</p>
              </div>

              {/* six OTP boxes */}
              <div dir="ltr" style={{ display: "flex", gap: 9, justifyContent: "center", marginBottom: 6 }}>
                {otp.map((d, i) => (
                  <input key={i} ref={(el) => (otpRefs.current[i] = el)} value={d} inputMode="numeric"
                    maxLength={1} onChange={(e) => onOtpChange(i, e.target.value)} onKeyDown={(e) => onOtpKey(i, e)}
                    style={{ width: 46, height: 56, textAlign: "center", fontSize: 24, fontWeight: 800,
                      fontFamily: "'Changa', sans-serif", color: T.text, background: "rgba(0,0,0,0.3)",
                      border: `1.5px solid ${d ? T.purple : T.line}`, borderRadius: 13, outline: "none",
                      boxShadow: d ? `0 0 16px ${T.purpleGlow}` : "none", transition: "all .18s ease" }} />
                ))}
              </div>

              <Feedback error={error} info={info} center />

              <button onClick={() => submitOtp()} disabled={busy || otp.join("").length !== 6} className="in-btn in-display"
                style={{ ...cta, marginTop: 16, background: `linear-gradient(90deg, ${T.purple}, ${T.purpleDeep})`,
                  boxShadow: `0 12px 30px ${T.purpleGlow}`, opacity: (busy || otp.join("").length !== 6) ? 0.6 : 1,
                  cursor: otp.join("").length === 6 ? "pointer" : "not-allowed" }}>
                <ShieldCheck size={18} /> {busy ? t.verifyingSession : t.otpVerify}
              </button>

              {/* resend */}
              <div style={{ textAlign: "center", marginTop: 16 }}>
                <button onClick={resend} disabled={cooldown > 0 || busy}
                  style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "none", border: "none",
                    color: cooldown > 0 ? T.mutedDeep : T.purple, fontWeight: 700, fontSize: 13.5,
                    cursor: cooldown > 0 ? "default" : "pointer" }}>
                  <RefreshCw size={14} /> {cooldown > 0 ? `${t.otpResendIn} ${cooldown}s` : t.otpResend}
                </button>
              </div>

              {/* paste-link fallback */}
              <div style={{ marginTop: 18, paddingTop: 16, borderTop: `1px solid ${T.lineSoft}` }}>
                {!showPasteLink ? (
                  <button onClick={() => setShowPasteLink(true)}
                    style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "none", border: "none",
                      color: T.muted, fontWeight: 700, fontSize: 13, cursor: "pointer", width: "100%", justifyContent: "center" }}>
                    <Link2 size={15} /> {t.pasteLinkAlt}
                  </button>
                ) : (
                  <div className="in-fade">
                    <label style={{ display: "block", color: T.muted, fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>{t.pasteLinkLabel}</label>
                    <input value={pasteLink} dir="ltr" onChange={(e) => setPasteLink(e.target.value)}
                      placeholder="https://…token_hash=…" style={inp} />
                    <button onClick={verifyFromLink} disabled={busy || !pasteLink.trim()} className="in-btn"
                      style={{ ...cta, marginTop: 10, fontSize: 15, padding: 12,
                        background: "rgba(255,255,255,0.06)", border: `1px solid ${T.line}`, color: T.text,
                        opacity: (busy || !pasteLink.trim()) ? 0.6 : 1 }}>
                      <Link2 size={16} /> {t.pasteLinkVerify}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* labelled input wrapper with a leading icon */
function Field({ icon: Icon, label, top = 0, children }) {
  return (
    <div style={{ marginTop: top }}>
      <label style={{ display: "flex", alignItems: "center", gap: 6, color: T.muted, fontSize: 12.5, fontWeight: 700, marginBottom: 7 }}>
        <Icon size={14} /> {label}
      </label>
      {children}
    </div>
  );
}

function Feedback({ error, info, center }) {
  if (!error && !info) return null;
  return (
    <p style={{ color: error ? "#FF9AA6" : T.success, fontSize: 13, fontWeight: 700,
      margin: "14px 0 0", textAlign: center ? "center" : "start", lineHeight: 1.45 }}>
      {error || info}
    </p>
  );
}

const inp = { width: "100%", padding: "13px 15px", fontSize: 16, fontWeight: 600, color: "#EEF0FF",
  background: "rgba(0,0,0,0.28)", borderRadius: 13, border: "1px solid rgba(255,255,255,0.1)", outline: "none" };

const cta = { width: "100%", padding: 14, fontSize: 17, fontWeight: 800, borderRadius: 14, cursor: "pointer",
  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9, color: "#0B0E26", border: "none" };
