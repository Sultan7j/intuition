-- ════════════════════════════════════════════════════════════
--  بديهة / Intuition — Supabase schema
--  Run this whole file in: Supabase Dashboard → SQL Editor → New query
-- ════════════════════════════════════════════════════════════

create extension if not exists "pgcrypto";

-- ── Tables ───────────────────────────────────────────────────
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text,
  display_name text,
  is_admin     boolean default false,
  created_at   timestamptz default now()
);

create table if not exists public.categories (
  id         uuid primary key default gen_random_uuid(),
  name_en    text not null,
  name_ar    text not null,
  icon       text default 'default',
  sort_order int  default 0,
  created_at timestamptz default now()
);

create table if not exists public.questions (
  id           uuid primary key default gen_random_uuid(),
  category_id  uuid references public.categories(id) on delete cascade,
  difficulty   int  not null check (difficulty between 1 and 3),
  question_en  text,
  answer_en    text,
  question_ar  text,
  answer_ar    text,
  is_published boolean default true,
  created_at   timestamptz default now()
);

-- one row per (user, question) they've already played → prevents repeats
create table if not exists public.played_questions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade,
  question_id uuid references public.questions(id) on delete cascade,
  played_at   timestamptz default now(),
  unique (user_id, question_id)
);

-- ── Admin helper ─────────────────────────────────────────────
create or replace function public.is_admin()
returns boolean language sql security definer stable as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

-- ── Auto-create a profile row when someone signs up ──────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Row Level Security ───────────────────────────────────────
alter table public.profiles         enable row level security;
alter table public.categories       enable row level security;
alter table public.questions        enable row level security;
alter table public.played_questions enable row level security;

-- profiles: a user can read & update only their own row
drop policy if exists "profiles self read"   on public.profiles;
drop policy if exists "profiles self update" on public.profiles;
create policy "profiles self read"   on public.profiles for select using (auth.uid() = id);
create policy "profiles self update" on public.profiles for update using (auth.uid() = id);

-- categories: any signed-in user can read; only admins can change
drop policy if exists "cat read"        on public.categories;
drop policy if exists "cat admin write" on public.categories;
create policy "cat read"        on public.categories for select using (auth.role() = 'authenticated');
create policy "cat admin write" on public.categories for all
  using (public.is_admin()) with check (public.is_admin());

-- questions: any signed-in user can read; only admins can change
drop policy if exists "q read"        on public.questions;
drop policy if exists "q admin write" on public.questions;
create policy "q read"        on public.questions for select using (auth.role() = 'authenticated');
create policy "q admin write" on public.questions for all
  using (public.is_admin()) with check (public.is_admin());

-- played_questions: a user only ever touches their own history
drop policy if exists "played self" on public.played_questions;
create policy "played self" on public.played_questions for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ════════════════════════════════════════════════════════════
--  SEED DATA (starter Question Bank — admins can add more later)
-- ════════════════════════════════════════════════════════════
insert into public.categories (name_en, name_ar, icon, sort_order) values
  ('General Knowledge', 'معلومات عامة', 'general',  1),
  ('TV Shows',          'مسلسلات',     'tv',       2),
  ('Cinema',            'سينما',       'cinema',   3),
  ('Sports',            'رياضة',       'sports',   4),
  ('History',           'تاريخ',       'history',  5),
  ('Poetry',            'شعر',         'poetry',   6),
  ('Language',          'لغة',         'language', 7),
  ('Anime',             'أنميات',      'anime',    8),
  ('Gaming',            'ألعاب',       'gaming',   9),
  ('Proverbs',          'أمثال',       'proverbs', 10)
on conflict do nothing;

-- helper to insert a question by category name
do $$
declare c_tv uuid; c_lang uuid; c_anime uuid; c_game uuid; c_prov uuid;
begin
  select id into c_tv    from public.categories where name_en = 'TV Shows' limit 1;
  select id into c_lang  from public.categories where name_en = 'Language' limit 1;
  select id into c_anime from public.categories where name_en = 'Anime'    limit 1;
  select id into c_game  from public.categories where name_en = 'Gaming'   limit 1;
  select id into c_prov  from public.categories where name_en = 'Proverbs' limit 1;

  insert into public.questions (category_id, difficulty, question_en, answer_en, question_ar, answer_ar) values
  -- TV
  (c_tv,1,'In ''Friends'', what is the name of Ross''s pet monkey?','Marcel','في مسلسل Friends، ما اسم قرد روس؟','مارسيل'),
  (c_tv,1,'What is the coffee shop in ''Friends'' called?','Central Perk','ما اسم المقهى في مسلسل Friends؟','سنترال بيرك'),
  (c_tv,2,'Which series is set in the kingdom of Westeros?','Game of Thrones','أي مسلسل تدور أحداثه في مملكة ويستروس؟','صراع العروش'),
  (c_tv,2,'In which city is ''Money Heist'' mainly set?','Madrid','في أي مدينة تدور أحداث La Casa de Papel؟','مدريد'),
  (c_tv,3,'In ''Breaking Bad'', what is Walter White''s alias?','Heisenberg','في Breaking Bad، ما الاسم المستعار لوالتر وايت؟','هايزنبرغ'),
  (c_tv,3,'What is the alternate dimension in ''Stranger Things'' called?','The Upside Down','ما اسم البُعد المقلوب في Stranger Things؟','العالم المقلوب'),
  -- Language
  (c_lang,1,'How many letters are in the English alphabet?','26','كم عدد حروف اللغة العربية؟','28'),
  (c_lang,1,'What is the first letter of the Arabic alphabet?','Alif','ما أول حرف في الأبجدية العربية؟','الألف'),
  (c_lang,2,'A word that reads the same both ways is called?','A palindrome','الكلمة التي تُقرأ نفسها من الجهتين تسمى؟','متناظرة'),
  (c_lang,2,'The word ''algebra'' comes from which language?','Arabic','كلمة algebra أصلها من أي لغة؟','العربية'),
  (c_lang,3,'What is the most spoken native language worldwide?','Mandarin Chinese','ما أكثر لغة أم في العالم؟','الصينية'),
  (c_lang,3,'A word that imitates a sound is called?','Onomatopoeia','الكلمة التي تحاكي الصوت تسمى؟','محاكاة صوتية'),
  -- Anime
  (c_anime,1,'Who is the main character of ''Naruto''?','Naruto Uzumaki','من الشخصية الرئيسية في Naruto؟','ناروتو'),
  (c_anime,1,'What kind of creature is Pikachu?','A Pokémon','ما نوع المخلوق بيكاتشو؟','بوكيمون'),
  (c_anime,2,'In ''Dragon Ball'', how many balls grant a wish?','Seven','في Dragon Ball، كم كرة تحقق أمنية؟','سبع'),
  (c_anime,2,'In ''One Piece'', what is Luffy''s dream?','To be Pirate King','في One Piece، ما حلم لوفي؟','ملك القراصنة'),
  (c_anime,3,'Name one of the three walls in ''Attack on Titan''.','Maria, Rose, or Sina','اذكر أحد الجدران الثلاثة في Attack on Titan.','ماريا أو روز أو سينا'),
  (c_anime,3,'In ''Death Note'', who drops the notebook?','Ryuk','في Death Note، من يُسقط المذكرة؟','ريوك'),
  -- Gaming
  (c_game,1,'Name the famous Nintendo plumber.','Mario','ما اسم سبّاك نينتندو الشهير؟','ماريو'),
  (c_game,1,'In ''Among Us'', what is the saboteur called?','The Impostor','في Among Us، ماذا نسمي المخرّب؟','المحتال'),
  (c_game,2,'In ''Minecraft'', which creature explodes near you?','Creeper','في Minecraft، ما المخلوق الذي ينفجر؟','الكريبر'),
  (c_game,2,'What is the best-selling video game of all time?','Minecraft','ما اللعبة الأكثر مبيعاً؟','ماين كرافت'),
  (c_game,3,'Which franchise stars ''Master Chief''?','Halo','أي سلسلة بطلها ماستر تشيف؟','Halo'),
  (c_game,3,'In ''The Legend of Zelda'', what is the hero''s name?','Link','في Zelda، ما اسم البطل؟','لينك'),
  -- Proverbs
  (c_prov,1,'Complete: ''The early bird catches the ___.''','Worm','أكمل: ''في الحركة ___.''','بركة'),
  (c_prov,1,'Complete: ''Actions speak louder than ___.''','Words','أكمل: ''الوقت كال___.''','سيف'),
  (c_prov,2,'What does ''A picture is worth a thousand words'' mean?','An image conveys a lot','ما معنى ''يد واحدة لا تصفّق''؟','التعاون ضروري'),
  (c_prov,2,'What does ''Don''t put all your eggs in one basket'' mean?','Don''t risk it all at once','ما معنى ''الصبر مفتاح الفرج''؟','الصبر يحل المشاكل'),
  (c_prov,3,'What does ''to bite the bullet'' mean?','Endure something hard bravely','ما معنى ''القرد في عين أمه غزال''؟','كل شخص يرى من يحب جميلاً'),
  (c_prov,3,'What does ''the ball is in your court'' mean?','It''s your turn to act','ما معنى ''الطيور على أشكالها تقع''؟','المتشابهون يجتمعون');
end $$;

-- ── AFTER you sign up in the app, make yourself an admin by running:
--    update public.profiles set is_admin = true where email = 'you@example.com';
