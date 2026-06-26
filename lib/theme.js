// Shared design tokens, bilingual copy, difficulty + timer config, icons.
import {
  Tv, Languages, Sparkles, Gamepad2, Quote, HelpCircle,
  Feather, Clapperboard, Trophy, Landmark, Brain, Music, FlaskConical,
  Globe2, BookOpen, Palette, Atom, Star,
} from "lucide-react";

export const T = {
  // ── immersive midnight / obsidian base ──
  bg: "#0B0E26", obsidian: "#06070F", bgDeep: "#080A1C",
  panel: "#161A3E", panelSoft: "#1C2150", panelGlass: "rgba(28,33,80,0.55)",
  line: "rgba(255,255,255,0.09)", lineSoft: "rgba(255,255,255,0.06)",
  text: "#EEF0FF", muted: "#9698C9", mutedDeep: "#6C6FA6",
  // ── premium gold ──
  gold: "#FFD56B", goldDeep: "#F5A524", goldGlow: "rgba(245,165,36,0.45)",
  // ── premium purple accent ──
  purple: "#A78BFA", purpleDeep: "#7C3AED", purpleGlow: "rgba(124,58,237,0.45)",
  // ── teams ──
  t1: "#FF8A3D", t1b: "#FFB14E",
  t2: "#36D6F2", t2b: "#5B8DEF",
  danger: "#FF5C6C", success: "#46E5A0",
};

export const teamColor = { team1: T.t1, team2: T.t2 };
export const teamColorB = { team1: T.t1b, team2: T.t2b };

// shared immersive page background (midnight blue + obsidian + neon aurora)
export const APP_BG = `radial-gradient(1200px 700px at 12% -12%, rgba(124,58,237,0.22) 0%, transparent 58%), radial-gradient(1100px 650px at 100% 0%, rgba(54,134,242,0.18) 0%, transparent 55%), radial-gradient(900px 600px at 85% 110%, rgba(245,165,36,0.12) 0%, transparent 60%), linear-gradient(180deg, ${T.bgDeep} 0%, ${T.obsidian} 100%)`;

// difficulty → points + seconds on the clock
export const DIFFS = [
  { id: 1, en: "Easy",   ar: "سهل",   seconds: 30 },
  { id: 2, en: "Medium", ar: "متوسط", seconds: 45 },
  { id: 3, en: "Hard",   ar: "صعب",   seconds: 60 },
];
export const SECONDS_FOR = { 1: 30, 2: 45, 3: 60 };

export const ICONS = {
  tv: Tv, language: Languages, anime: Sparkles, gaming: Gamepad2, proverbs: Quote,
  poetry: Feather, cinema: Clapperboard, sports: Trophy, history: Landmark,
  general: Brain, music: Music, science: FlaskConical, geography: Globe2,
  literature: BookOpen, art: Palette, physics: Atom, star: Star,
  default: HelpCircle,
};
export const getIcon = (k) => ICONS[k] || ICONS.default;

export const STR = {
  en: {
    title: "Intuition", sub: "Q&A Trivia Battle",
    // auth
    signIn: "Sign in", signUp: "Create account", email: "Email", password: "Password",
    needAccount: "Need an account? Sign up", haveAccount: "Have an account? Sign in",
    signOut: "Sign out", authError: "Something went wrong. Check your details and try again.",
    demoBanner: "Demo mode — connect Supabase to save progress.",
    welcome: "Welcome", account: "Account",
    // auth — premium flow
    tabLogin: "Log In", tabSignup: "Sign Up",
    loginTitle: "Welcome back", loginSub: "Log in to continue your battle.",
    signupTitle: "Create your account", signupSub: "Join the arena in seconds.",
    confirmPassword: "Confirm password", passwordHint: "At least 6 characters",
    passwordMismatch: "Passwords don't match.", passwordShort: "Password must be at least 6 characters.",
    emailInvalid: "Enter a valid email address.",
    forgotPassword: "Forgot password?",
    orContinue: "or", createOne: "New here?", createAccountCta: "Create one",
    alreadyMember: "Already a member?", logInCta: "Log in",
    // OTP verification (cross-device)
    verifyTitle: "Verify your email", verifyDeviceNote: "Open your inbox on any device and type the 6-digit code below — no need to click the link on this device.",
    verifySentTo: "We sent a 6-digit code to",
    otpLabel: "Enter the 6-digit code", otpVerify: "Verify & continue",
    otpSendBtn: "Send 6-digit code", otpEmailNote: "We'll email you a 6-digit code — no password needed.",
    otpNoAccount: "No account found for this email. Switch to Sign Up to create one.",
    otpResend: "Resend code", otpResendIn: "Resend in", otpResent: "A fresh code is on its way.",
    otpInvalid: "That code isn't right. Check it and try again.",
    // forgot / reset password
    backToLogin: "Back to log in", forgotTitle: "Reset your password",
    forgotSub: "Enter your email and we'll send a 6-digit recovery code.",
    forgotSend: "Send recovery code", resetSent: "Recovery code sent — check your email.",
    resetTitle: "Set a new password", newPassword: "New password", resetBtn: "Reset password",
    changeEmail: "Wrong email? Go back",
    pasteLinkAlt: "Got a link instead? Paste it here",
    pasteLinkLabel: "Paste the full confirmation link", pasteLinkVerify: "Verify from link",
    verifyingSession: "Verifying…",
    // setup
    t1name: "Team 1 name", t2name: "Team 2 name", t1ph: "The Falcons", t2ph: "The Lions",
    teamsHeading: "Name your teams", catsHeading: "Choose your arenas",
    selectedCount: "selected", clearAll: "Clear", selectAll: "Select all",
    pickCats: "Pick the categories for this round", start: "Start game",
    needCat: "Choose at least one category to begin.", loading: "Loading…",
    adminDash: "Admin dashboard", noUnseen: "You've played everything here! Pick other categories or ask the admin to add more.",
    // game
    score: "Score", reset: "Reset", finish: "Finish game", vs: "VS",
    reveal: "Reveal answer", answer: "Answer", awardTo: "Award to",
    noOne: "No one answered", pt: "pt", pts: "pts", nowPlaying: "Now picking",
    question: "Question", close: "Close", empty: "No question available",
    // timer
    pause: "Pause", resume: "Resume", timesUp: "Time's Up!",
    // results
    winner: "Winner", tie: "It's a tie!", finalScore: "Final score",
    playAgain: "Play again", congrats: "Congratulations",
    // admin
    manager: "Question Manager", admin: "Admin", categories: "Categories",
    addCategory: "Add category", addQuestion: "Add question", publish: "Publish",
    delete: "Delete", back: "Back to game", nameEn: "Name (English)", nameAr: "Name (Arabic)",
    selectCat: "Select or add a category to manage its questions.",
    qEn: "Question (EN)", aEn: "Answer (EN)", qAr: "Question (AR)", aAr: "Answer (AR)",
    difficulty: "Difficulty", saved: "Saved", saving: "Saving…", noQuestions: "No questions yet.",
    notAdmin: "You don't have admin access. Ask an owner to enable it for your account.",
  },
  ar: {
    title: "بديهة", sub: "تحدي الأسئلة والأجوبة",
    signIn: "تسجيل الدخول", signUp: "إنشاء حساب", email: "البريد الإلكتروني", password: "كلمة المرور",
    needAccount: "ما عندك حساب؟ سجّل", haveAccount: "عندك حساب؟ ادخل",
    signOut: "خروج", authError: "صار خطأ. تأكد من بياناتك وحاول مرة ثانية.",
    demoBanner: "وضع تجريبي — اربط Supabase لحفظ تقدّمك.",
    welcome: "أهلاً", account: "الحساب",
    // auth — premium flow
    tabLogin: "تسجيل الدخول", tabSignup: "حساب جديد",
    loginTitle: "أهلاً بعودتك", loginSub: "سجّل الدخول لتكمل التحدي.",
    signupTitle: "أنشئ حسابك", signupSub: "انضم للساحة خلال ثوانٍ.",
    confirmPassword: "تأكيد كلمة المرور", passwordHint: "٦ أحرف على الأقل",
    passwordMismatch: "كلمتا المرور غير متطابقتين.", passwordShort: "كلمة المرور يجب أن تكون ٦ أحرف على الأقل.",
    emailInvalid: "أدخل بريداً إلكترونياً صحيحاً.",
    forgotPassword: "نسيت كلمة المرور؟",
    orContinue: "أو", createOne: "جديد هنا؟", createAccountCta: "أنشئ حساباً",
    alreadyMember: "عضو بالفعل؟", logInCta: "سجّل الدخول",
    // OTP verification (cross-device)
    verifyTitle: "تحقّق من بريدك", verifyDeviceNote: "افتح بريدك على أي جهاز واكتب الرمز المكوّن من ٦ أرقام بالأسفل — لا حاجة للضغط على الرابط من هذا الجهاز.",
    verifySentTo: "أرسلنا رمزاً من ٦ أرقام إلى",
    otpLabel: "أدخل الرمز المكوّن من ٦ أرقام", otpVerify: "تحقّق وتابع",
    otpSendBtn: "أرسل رمز التحقق", otpEmailNote: "سنرسل لك رمزاً من ٦ أرقام — بدون كلمة مرور.",
    otpNoAccount: "لا يوجد حساب بهذا البريد. انتقل إلى \"حساب جديد\" لإنشائه.",
    otpResend: "إعادة إرسال الرمز", otpResendIn: "إعادة الإرسال خلال", otpResent: "رمز جديد في الطريق إليك.",
    otpInvalid: "الرمز غير صحيح. تأكّد منه وحاول مجدداً.",
    // forgot / reset password
    backToLogin: "العودة لتسجيل الدخول", forgotTitle: "إعادة تعيين كلمة المرور",
    forgotSub: "أدخل بريدك وسنرسل لك رمز استرداد من ٦ أرقام.",
    forgotSend: "أرسل رمز الاسترداد", resetSent: "تم إرسال رمز الاسترداد — تحقّق من بريدك.",
    resetTitle: "عيّن كلمة مرور جديدة", newPassword: "كلمة المرور الجديدة", resetBtn: "إعادة تعيين كلمة المرور",
    changeEmail: "البريد خطأ؟ ارجع",
    pasteLinkAlt: "وصلك رابط بدلاً منه؟ الصقه هنا",
    pasteLinkLabel: "الصق رابط التأكيد كاملاً", pasteLinkVerify: "تحقّق عبر الرابط",
    verifyingSession: "جارٍ التحقق…",
    t1name: "اسم الفريق الأول", t2name: "اسم الفريق الثاني", t1ph: "الصقور", t2ph: "الأسود",
    teamsHeading: "سمِّ فريقيك", catsHeading: "اختر ساحاتك",
    selectedCount: "مختارة", clearAll: "مسح", selectAll: "اختيار الكل",
    pickCats: "اختر فئات هذه الجولة", start: "ابدأ اللعبة",
    needCat: "اختر فئة واحدة على الأقل للبدء.", loading: "جاري التحميل…",
    adminDash: "لوحة المسؤول", noUnseen: "خلصت كل الأسئلة هنا! اختر فئات ثانية أو اطلب من المسؤول يضيف المزيد.",
    score: "النتيجة", reset: "إعادة", finish: "إنهاء اللعبة", vs: "ضد",
    reveal: "إظهار الإجابة", answer: "الإجابة", awardTo: "النقاط لـ",
    noOne: "محد جاوب", pt: "نقطة", pts: "نقاط", nowPlaying: "الدور على",
    question: "السؤال", close: "إغلاق", empty: "لا يوجد سؤال متاح",
    pause: "إيقاف مؤقت", resume: "استئناف", timesUp: "انتهى الوقت",
    winner: "الفائز", tie: "تعادل!", finalScore: "النتيجة النهائية",
    playAgain: "العب مرة ثانية", congrats: "مبروك",
    manager: "إدارة الأسئلة", admin: "المسؤول", categories: "الفئات",
    addCategory: "إضافة فئة", addQuestion: "إضافة سؤال", publish: "نشر",
    delete: "حذف", back: "العودة للعبة", nameEn: "الاسم (إنجليزي)", nameAr: "الاسم (عربي)",
    selectCat: "اختر فئة أو أضف واحدة لإدارة أسئلتها.",
    qEn: "السؤال (إنجليزي)", aEn: "الإجابة (إنجليزي)", qAr: "السؤال (عربي)", aAr: "الإجابة (عربي)",
    difficulty: "الصعوبة", saved: "تم الحفظ", saving: "جاري الحفظ…", noQuestions: "لا توجد أسئلة بعد.",
    notAdmin: "ما عندك صلاحية مسؤول. اطلب من المالك يفعّلها لحسابك.",
  },
};
