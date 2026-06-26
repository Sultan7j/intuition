"use client";
import { useState } from "react";
import { LogIn, UserPlus, ShieldCheck } from "lucide-react";
import { T, STR } from "../lib/theme";
import { LangToggle } from "./shared";
// استيراد العميل مباشرة للتحقق من الكود
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AuthScreen({ lang, setLang, auth }) {
  const supabase = createClientComponentClient();
  const t = STR[lang];
  const rtl = lang === "ar";
  
  // الأوضاع: signin | signup | verify
  const [mode, setMode] = useState("signin"); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(""); // كود الـ OTP الستة أرقام
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // نصوص إضافية للـ OTP تدعم العربي والإنجليزي
  const otpTexts = {
    ar: {
      otpLabel: "أدخل رمز التحقق (6 أرقام)",
      otpBtn: "تأكيد الكود والدخول",
      otpSuccess: "تم إرسال الكود لبريدك الفخم!",
      backToSign: "الرجوع لتسجيل الدخول"
    },
    en: {
      otpLabel: "Enter Verification Code (6 digits)",
      otpBtn: "Verify Code & Log In",
      otpSuccess: "Code sent to your email!",
      backToSign: "Back to Sign In"
    }
  }[lang];

  const submit = async () => {
    setBusy(true); setError("");
    
    try {
      if (mode === "verify") {
        // التحقق من كود الـ OTP
        const { data, error: otpErr } = await supabase.auth.verifyOtp({
          email: email.trim(),
          token: otp.trim(),
          type: "signup"
        });
        
        if (otpErr) {
          setError(otpErr.message);
        } else if (data?.session) {
          // التحديث الفوري لحالة المستخدم بداخل المشروع ليفتح مباشرة
          if (auth.checkUser) await auth.checkUser(); 
          window.location.reload(); 
        }
      } else {
        // تسجيل الدخول أو إرسال كود حساب جديد
        const fn = mode === "signin" ? auth.signIn : auth.signUp;
        const { error: authErr } = await fn(email, password);
        
        if (authErr) {
          setError(authErr.message || t.authError);
        } else if (mode === "signup") {
          // إذا كان إنشاء حساب نجح، حوله مباشرة لصفحة إدخال الـ 6 أرقام
          setMode("verify");
          setError(otpTexts.otpSuccess);
        }
      }
    } catch (err) {
      setError(t.authError);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div dir={rtl ? "rtl" : "ltr"} style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 18,
      background: `radial-gradient(1100px 600px at 20% -10%, #1B1F4E 0%, transparent 60%), radial-gradient(1000px 600px at 100% 0%, #142a44 0%, transparent 55%), ${T.bg}` }}>
      <div style={{ position: "absolute", top: 18, insetInlineEnd: 18 }}><LangToggle lang={lang} setLang={setLang} /></div>

      <div className="in-pop" style={{ width: "100%", maxWidth: 400, background: T.panel, borderRadius: 24,
        border: `1px solid ${T.line}`, borderTop: `4px solid ${T.gold}`, padding: 28, boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
        
        <h1 className="in-display" style={{ textAlign: "center", fontSize: 48, fontWeight: 800, margin: "0 0 4px",
          background: `linear-gradient(90deg, ${T.t1b}, ${T.gold}, ${T.t2b})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
          {t.title}
        </h1>
        <p style={{ textAlign: "center", color: T.muted, margin: "0 0 22px", fontSize: 15 }}>{t.sub}</p>

        {auth.demo && (
          <div style={{ background: "rgba(255,213,107,0.1)", border: `1px solid ${T.gold}`, color: T.gold,
            borderRadius: 12, padding: "9px 12px", fontSize: 12, fontWeight: 700, marginBottom: 16, textAlign: "center" }}>
            {t.demoBanner}
          </div>
        )}

        {mode !== "verify" ? (
          <>
            {/* خانات الإيميل والباسورد العادية */}
            <label style={{ display: "block", color: T.muted, fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{t.email}</label>
            <input type="email" value={email} dir="ltr" onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={inp} />
            
            <label style={{ display: "block", color: T.muted, fontSize: 13, fontWeight: 700, margin: "14px 0 6px" }}>{t.password}</label>
            <input type="password" value={password} dir="ltr" onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
              onKeyDown={(e) => { if (e.key === "Enter") submit(); }} style={inp} />
          </>
        ) : (
          <>
            {/* خانة الـ OTP الجديدة التي تظهر بعد طلب التسجيل */}
            <label style={{ display: "block", color: T.gold, fontSize: 13, fontWeight: 700, marginBottom: 6, textAlign: "center" }}>{otpTexts.otpLabel}</label>
            <input type="text" value={otp} dir="ltr" onChange={(e) => setOtp(e.target.value)} placeholder="123456" maxLength={6}
              onKeyDown={(e) => { if (e.key === "Enter") submit(); }} 
              style={{ ...inp, textAlign: "center", fontSize: 24, letterSpacing: 6, color: T.gold }} />
          </>
        )}

        {error && <p style={{ color: error.includes("تم") || error.includes("sent") ? "#8AFF8A" : "#FF8A8A", fontSize: 13, fontWeight: 700, margin: "12px 0 0", textAlign: "center" }}>{error}</p>}

        <button onClick={submit} disabled={busy} className="in-btn in-display"
          style={{ width: "100%", marginTop: 18, padding: 14, fontSize: 17, fontWeight: 800, borderRadius: 14, cursor: "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9, color: "#0B0E26",
            background: mode === "verify" ? `linear-gradient(90deg, #00A389, #0070F3)` : `linear-gradient(90deg, ${T.gold}, ${T.goldDeep})`, border: "none", opacity: busy ? 0.7 : 1 }}>
          {mode === "signin" ? <LogIn size={18} /> : mode === "signup" ? <UserPlus size={18} /> : <ShieldCheck size={18} />}
          {mode === "signin" ? t.signIn : mode === "signup" ? t.signUp : otpTexts.otpBtn}
        </button>

        <button onClick={() => { 
            if (mode === "verify") { setMode("signup"); } else { setMode(mode === "signin" ? "signup" : "signin"); }
            setError(""); 
          }}
          style={{ width: "100%", marginTop: 12, background: "transparent", border: "none", color: T.muted, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          {mode === "verify" ? otpTexts.backToSign : mode === "signin" ? t.needAccount : t.haveAccount}
        </button>
      </div>
    </div>
  );
}

const inp = { width: "100%", padding: "12px 14px", fontSize: 16, fontWeight: 600, color: "#EEF0FF",
  background: "#1C2150", borderRadius: 12, border: "1px solid rgba(255,255,255,0.09)", outline: "none" };