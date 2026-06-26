# بديهة / Intuition — Full-Stack Trivia

A bilingual (Arabic RTL / English LTR) two-team trivia game built with **Next.js**, **Tailwind CSS**, and **Supabase** (database + auth).

It runs in two modes:

- **Demo mode** (default): no setup needed. Uses built-in mock questions so you can play immediately.
- **Live mode**: add your Supabase keys and the app saves accounts, the question bank, and each player's history.

---

## 1. Run it locally (works right away, no database needed)

You need [Node.js](https://nodejs.org) installed (LTS version).

```bash
cd intuition
npm install
npm run dev
```

Open **http://localhost:3000**. Sign in with any email/password (demo mode accepts anything) and play.

---

## 2. Connect the real backend (Supabase)

This unlocks real sign-up, a shared question bank, and "no repeated questions" across sessions.

1. Create a free project at **supabase.com**.
2. In the dashboard, open **SQL Editor → New query**, paste the entire contents of **`supabase/schema.sql`**, and run it. This creates the tables, security rules, and starter questions.
3. In **Settings → API**, copy your **Project URL** and **anon public key**.
4. In the project folder, copy `.env.local.example` to `.env.local` and paste them in:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
   ```

5. Restart `npm run dev`. The app now uses your database automatically.

### Make yourself an admin
Sign up in the app first, then run this in the Supabase SQL Editor (use your email):

```sql
update public.profiles set is_admin = true where email = 'you@example.com';
```

Now the **Admin dashboard** button appears on the setup screen.

---

## 3. Publish it online (free)

1. Push this folder to a **GitHub** repo.
2. Import the repo at **vercel.com**.
3. In Vercel's project settings, add the same two environment variables from your `.env.local`.
4. Deploy. Every future `git push` updates the live site automatically.

---

## How the pieces fit together

```
app/
  page.jsx            ← orchestrator: auth gate + which screen to show + game state
  layout.jsx          ← root HTML shell
  globals.css         ← fonts, animations (timer pulse, confetti)

lib/
  supabaseClient.js   ← connects to Supabase (or flags demo mode)
  api.js              ← THE data layer: read categories, fetch UNSEEN questions,
                        record played history, admin create/update/delete
  useAuth.js          ← sign in / up / out, reads admin status
  useCountdown.js     ← the question timer (pause / resume / expire)
  game.js             ← builds the two-team board from the question pool
  theme.js            ← colors, bilingual text, difficulty→points→seconds
  mockData.js         ← demo-mode questions

components/
  AuthScreen.jsx      ← sign in / sign up
  SetupScreen.jsx     ← team names + live category selection
  GameBoard.jsx       ← split-screen arena, scores, difficulty grid, turns
  QuestionModal.jsx   ← question + countdown timer + reveal + scoring
  ResultsScreen.jsx   ← winner + confetti
  AdminDashboard.jsx  ← manage the question bank (admins only)

supabase/
  schema.sql          ← run this once in Supabase to build the backend
```

### Key features
- **Timer** tied to difficulty (Easy 30s / Medium 45s / Hard 60s), with pause, resume, a red pulsing warning at ≤5s, and a "Time's Up!" lockout that disables Reveal and highlights "No one answered."
- **No repeats:** every question a logged-in player resolves is written to `played_questions`; new games only pull questions they've never seen.
- **Admin-only question bank:** row-level security in the database blocks non-admins from editing — not just hidden in the UI.
- **Bilingual** Arabic/English with full RTL/LTR, and the team-name input focus bug fixed (each screen is its own component, so inputs never lose focus).
