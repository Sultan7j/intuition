// Shared design tokens, bilingual copy, difficulty + timer config, icons.
import { Tv, Languages, Sparkles, Gamepad2, Quote, HelpCircle } from "lucide-react";

export const T = {
  bg: "#0B0E26", panel: "#161A3E", panelSoft: "#1C2150",
  line: "rgba(255,255,255,0.09)", text: "#EEF0FF", muted: "#9698C9",
  gold: "#FFD56B", goldDeep: "#F5A524",
  t1: "#FF8A3D", t1b: "#FFB14E",
  t2: "#36D6F2", t2b: "#5B8DEF",
  danger: "#FF5C6C",
};

export const teamColor = { team1: T.t1, team2: T.t2 };
export const teamColorB = { team1: T.t1b, team2: T.t2b };

// difficulty → points + seconds on the clock
export const DIFFS = [
  { id: 1, en: "Easy",   ar: "سهل",   seconds: 30 },
  { id: 2, en: "Medium", ar: "متوسط", seconds: 45 },
  { id: 3, en: "Hard",   ar: "صعب",   seconds: 60 },
];
export const SECONDS_FOR = { 1: 30, 2: 45, 3: 60 };

export const ICONS = { tv: Tv, language: Languages, anime: Sparkles, gaming: Gamepad2, proverbs: Quote, default: HelpCircle };
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
    // setup
    t1name: "Team 1 name", t2name: "Team 2 name", t1ph: "The Falcons", t2ph: "The Lions",
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
    t1name: "اسم الفريق الأول", t2name: "اسم الفريق الثاني", t1ph: "الصقور", t2ph: "الأسود",
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
