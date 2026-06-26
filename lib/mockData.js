// Used only in DEMO MODE (no Supabase keys). Mirrors supabase/schema.sql seed.
export const MOCK_CATEGORIES = [
  { id: "tv", name_en: "TV Shows", name_ar: "مسلسلات", icon: "tv", sort_order: 1 },
  { id: "language", name_en: "Language", name_ar: "لغة", icon: "language", sort_order: 2 },
  { id: "anime", name_en: "Anime", name_ar: "أنميات", icon: "anime", sort_order: 3 },
  { id: "gaming", name_en: "Gaming", name_ar: "ألعاب", icon: "gaming", sort_order: 4 },
  { id: "proverbs", name_en: "Proverbs", name_ar: "أمثال", icon: "proverbs", sort_order: 5 },
];

let _id = 0;
const q = (category_id, difficulty, qe, ae, qa, aa) => ({
  id: `m${++_id}`, category_id, difficulty,
  question_en: qe, answer_en: ae, question_ar: qa, answer_ar: aa, is_published: true,
});

export const MOCK_QUESTIONS = [
  q("tv",1,"In 'Friends', what is Ross's pet monkey's name?","Marcel","في Friends، ما اسم قرد روس؟","مارسيل"),
  q("tv",1,"What is the coffee shop in 'Friends' called?","Central Perk","ما اسم المقهى في Friends؟","سنترال بيرك"),
  q("tv",2,"Which series is set in Westeros?","Game of Thrones","أي مسلسل في مملكة ويستروس؟","صراع العروش"),
  q("tv",2,"Which city is 'Money Heist' set in?","Madrid","في أي مدينة La Casa de Papel؟","مدريد"),
  q("tv",3,"Walter White's alias in 'Breaking Bad'?","Heisenberg","الاسم المستعار لوالتر وايت؟","هايزنبرغ"),
  q("tv",3,"The alternate dimension in 'Stranger Things'?","The Upside Down","البُعد المقلوب في Stranger Things؟","العالم المقلوب"),
  q("language",1,"Letters in the English alphabet?","26","كم حرفاً في العربية؟","28"),
  q("language",1,"First letter of the Arabic alphabet?","Alif","أول حرف عربي؟","الألف"),
  q("language",2,"A word reading the same both ways?","Palindrome","كلمة تُقرأ من الجهتين؟","متناظرة"),
  q("language",2,"'Algebra' comes from which language?","Arabic","algebra أصلها أي لغة؟","العربية"),
  q("language",3,"Most spoken native language?","Mandarin","أكثر لغة أم؟","الصينية"),
  q("language",3,"A word imitating a sound?","Onomatopoeia","كلمة تحاكي الصوت؟","محاكاة صوتية"),
  q("anime",1,"Main character of 'Naruto'?","Naruto Uzumaki","بطل Naruto؟","ناروتو"),
  q("anime",1,"What creature is Pikachu?","A Pokémon","ما نوع بيكاتشو؟","بوكيمون"),
  q("anime",2,"Balls that grant a wish in 'Dragon Ball'?","Seven","كم كرة تحقق أمنية؟","سبع"),
  q("anime",2,"Luffy's dream in 'One Piece'?","Pirate King","حلم لوفي؟","ملك القراصنة"),
  q("anime",3,"Name a wall in 'Attack on Titan'.","Maria/Rose/Sina","اذكر جداراً في Attack on Titan.","ماريا/روز/سينا"),
  q("anime",3,"Who drops the notebook in 'Death Note'?","Ryuk","من يُسقط المذكرة؟","ريوك"),
  q("gaming",1,"Nintendo's famous plumber?","Mario","سبّاك نينتندو؟","ماريو"),
  q("gaming",1,"The saboteur in 'Among Us'?","The Impostor","المخرّب في Among Us؟","المحتال"),
  q("gaming",2,"Which 'Minecraft' creature explodes?","Creeper","ما المخلوق الذي ينفجر؟","الكريبر"),
  q("gaming",2,"Best-selling video game ever?","Minecraft","اللعبة الأكثر مبيعاً؟","ماين كرافت"),
  q("gaming",3,"Franchise with 'Master Chief'?","Halo","سلسلة ماستر تشيف؟","Halo"),
  q("gaming",3,"The hero's name in 'Zelda'?","Link","اسم بطل Zelda؟","لينك"),
  q("proverbs",1,"'The early bird catches the ___.'","Worm","'في الحركة ___.'","بركة"),
  q("proverbs",1,"'Actions speak louder than ___.'","Words","'الوقت كال___.'","سيف"),
  q("proverbs",2,"Meaning of 'a picture is worth 1000 words'?","Images say a lot","معنى 'يد واحدة لا تصفّق'؟","التعاون ضروري"),
  q("proverbs",2,"Meaning of 'eggs in one basket'?","Don't risk it all","معنى 'الصبر مفتاح الفرج'؟","الصبر يحل المشاكل"),
  q("proverbs",3,"Meaning of 'bite the bullet'?","Endure bravely","معنى 'القرد بعين أمه غزال'؟","نرى من نحب جميلاً"),
  q("proverbs",3,"Meaning of 'the ball is in your court'?","Your turn to act","معنى 'الطيور على أشكالها تقع'؟","المتشابهون يجتمعون"),
];
