// Used only in DEMO MODE (no Supabase keys). Mirrors supabase/schema.sql seed.
export const MOCK_CATEGORIES = [
  { id: "general", name_en: "General Knowledge", name_ar: "معلومات عامة", icon: "general", sort_order: 1 },
  { id: "tv", name_en: "TV Shows", name_ar: "مسلسلات", icon: "tv", sort_order: 2 },
  { id: "cinema", name_en: "Cinema", name_ar: "سينما", icon: "cinema", sort_order: 3 },
  { id: "sports", name_en: "Sports", name_ar: "رياضة", icon: "sports", sort_order: 4 },
  { id: "history", name_en: "History", name_ar: "تاريخ", icon: "history", sort_order: 5 },
  { id: "poetry", name_en: "Poetry", name_ar: "شعر", icon: "poetry", sort_order: 6 },
  { id: "language", name_en: "Language", name_ar: "لغة", icon: "language", sort_order: 7 },
  { id: "anime", name_en: "Anime", name_ar: "أنميات", icon: "anime", sort_order: 8 },
  { id: "gaming", name_en: "Gaming", name_ar: "ألعاب", icon: "gaming", sort_order: 9 },
  { id: "proverbs", name_en: "Proverbs", name_ar: "أمثال", icon: "proverbs", sort_order: 10 },
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

  // General Knowledge
  q("general",1,"How many continents are there?","Seven","كم عدد القارات؟","سبع"),
  q("general",1,"What is the largest planet in our solar system?","Jupiter","ما أكبر كوكب في المجموعة الشمسية؟","المشتري"),
  q("general",2,"What gas do plants absorb from the air?","Carbon dioxide","ما الغاز الذي تمتصه النباتات من الهواء؟","ثاني أكسيد الكربون"),
  q("general",2,"What is the chemical symbol for gold?","Au","ما الرمز الكيميائي للذهب؟","Au"),
  q("general",3,"What is the smallest country in the world?","Vatican City","ما أصغر دولة في العالم؟","الفاتيكان"),
  q("general",3,"How many bones are in the adult human body?","206","كم عدد عظام جسم الإنسان البالغ؟","206"),

  // Cinema
  q("cinema",1,"Who directed 'Titanic'?","James Cameron","من أخرج فيلم Titanic؟","جيمس كاميرون"),
  q("cinema",1,"In 'The Lion King', what is the lion cub's name?","Simba","في The Lion King، ما اسم الشبل؟","سيمبا"),
  q("cinema",2,"Which movie features the quote 'I'll be back'?","The Terminator","أي فيلم فيه جملة 'I'll be back'؟","The Terminator"),
  q("cinema",2,"What is the highest-grossing film franchise?","Marvel Cinematic Universe","ما أعلى سلسلة أفلام دخلاً؟","مارفل"),
  q("cinema",3,"Who won Best Actor for 'The Revenant'?","Leonardo DiCaprio","من فاز بأفضل ممثل عن The Revenant؟","ليوناردو دي كابريو"),
  q("cinema",3,"What is the name of the hotel in 'The Shining'?","The Overlook","ما اسم الفندق في The Shining؟","أوفرلوك"),

  // Sports
  q("sports",1,"How many players are on a football (soccer) team on the field?","Eleven","كم لاعباً في فريق كرة القدم بالملعب؟","أحد عشر"),
  q("sports",1,"In which sport would you perform a slam dunk?","Basketball","في أي رياضة تؤدي السلام دانك؟","كرة السلة"),
  q("sports",2,"How often are the Summer Olympics held?","Every four years","كل كم سنة تقام الأولمبياد الصيفية؟","كل أربع سنوات"),
  q("sports",2,"Which country has won the most FIFA World Cups?","Brazil","أي دولة فازت بأكثر كؤوس عالم؟","البرازيل"),
  q("sports",3,"In tennis, what is a score of zero called?","Love","في التنس، ماذا تسمى النتيجة صفر؟","love"),
  q("sports",3,"How long is a marathon (km, approx)?","About 42 km","كم طول الماراثون تقريباً؟","حوالي 42 كم"),

  // History
  q("history",1,"Who was the first President of the United States?","George Washington","من أول رئيس للولايات المتحدة؟","جورج واشنطن"),
  q("history",1,"The Great Pyramids are located in which country?","Egypt","في أي دولة تقع الأهرامات العظيمة؟","مصر"),
  q("history",2,"In which year did World War II end?","1945","في أي عام انتهت الحرب العالمية الثانية؟","1945"),
  q("history",2,"Who was known as the 'Maid of Orléans'?","Joan of Arc","من لُقّبت بعذراء أورليان؟","جان دارك"),
  q("history",3,"Which ancient civilization built Machu Picchu?","The Inca","أي حضارة بنت ماتشو بيتشو؟","الإنكا"),
  q("history",3,"Who wrote the 'Muqaddimah'?","Ibn Khaldun","من كتب 'المقدمة'؟","ابن خلدون"),

  // Poetry
  q("poetry",1,"Who wrote 'Romeo and Juliet'?","William Shakespeare","من كتب 'روميو وجولييت'؟","شكسبير"),
  q("poetry",1,"A poem of 14 lines is called a?","Sonnet","القصيدة المكوّنة من 14 سطراً تسمى؟","سونيتة"),
  q("poetry",2,"Who is known as 'the poet of the Nile'?","Hafez Ibrahim","من يُلقّب بشاعر النيل؟","حافظ إبراهيم"),
  q("poetry",2,"What do we call the repetition of ending sounds in verse?","Rhyme","ماذا نسمي تكرار الأصوات في نهاية البيت؟","القافية"),
  q("poetry",3,"Who wrote the epic 'The Odyssey'?","Homer","من كتب ملحمة 'الأوديسة'؟","هوميروس"),
  q("poetry",3,"Al-Mutanabbi was a famous poet of which era?","The Abbasid era","المتنبي شاعر من أي عصر؟","العصر العباسي"),
];
