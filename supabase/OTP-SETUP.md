# Cross-Device Email Verification (6-digit OTP)

The app now verifies new sign-ups with a **6-digit code** instead of a device-locked
confirmation link. This fixes the free-tier problem where signing up on a PC but opening
the email on a phone breaks the session — the user just types the code on the PC.

The code is already wired in the app (`AuthScreen` → `useAuth.verifyOtp`). You only need to
make Supabase **email the code** instead of (or alongside) a link.

## One-time Supabase Dashboard setup

1. Go to **Authentication → Providers → Email** and make sure:
   - **Confirm email** is **ON** (so a code/link is required).
2. Go to **Authentication → Email Templates → "Confirm signup"**.
3. Replace the template body so it shows the token. Minimal example:

   ```html
   <h2>Confirm your sign-up</h2>
   <p>Your verification code is:</p>
   <p style="font-size:28px;font-weight:bold;letter-spacing:6px">{{ .Token }}</p>
   <p>Enter this code in the app to finish creating your account.</p>
   ```

   The key part is `{{ .Token }}` — that is the 6-digit OTP. (You can keep
   `{{ .ConfirmationURL }}` too if you want to offer the link as a fallback; the app's
   "Paste link" option accepts it.)

4. Save. That's it — no redirect URL juggling required.

## How the app uses it

- **Sign Up** → `supabase.auth.signUp({ email, password })`. With "Confirm email" ON,
  no session is returned, so the UI moves to the **Verify** step.
- **Verify** → `supabase.auth.verifyOtp({ email, token, type: "signup" })`. On success the
  session is created on **this** device immediately and `onAuthStateChange` swaps the user in.
- **Resend** → `supabase.auth.resend({ type: "signup", email })` (45s cooldown in the UI).
- **Paste-link fallback** → if a user only has the link, the app extracts `token_hash` from
  it and calls `verifyOtp({ token_hash, type: "signup" })`.

## Optional: shorten code expiry / length
Under **Authentication → Email** you can adjust OTP expiry. Default 6 digits works out of the box.

## Make yourself an admin (unchanged)
```sql
update public.profiles set is_admin = true where email = 'you@example.com';
```
