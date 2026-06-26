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

## Forgot password (6-digit recovery code)

The **Forgot password?** link on the Log In screen runs an OTP-based recovery flow, so the
user never has to click a device-locked link:

1. **Send code** → `supabase.auth.resetPasswordForEmail(email)` emails a recovery code.
2. **Reset** → user enters the 6-digit code + a new password. The app calls
   `supabase.auth.verifyOtp({ email, token, type: "recovery" })` to establish a session,
   then `supabase.auth.updateUser({ password })` to set the new password. They're signed in.

For the digits to appear in the email, edit **Authentication → Email Templates →
"Reset Password"** the same way as Confirm signup — include `{{ .Token }}`:

```html
<h2>Reset your password</h2>
<p>Your recovery code is:</p>
<p style="font-size:28px;font-weight:bold;letter-spacing:6px">{{ .Token }}</p>
<p>Enter this code in the app to set a new password.</p>
```

(If the template still renders only `{{ .ConfirmationURL }}`, recovery still works via the
link's token, but the code won't be shown for the in-app 6-box UI.)

> Reminder on the email mechanic: link-vs-code is controlled entirely by the **email
> template**, not by the API method. Template editing is available even on the default
> email service — custom SMTP is only needed for higher send limits and your own domain.

## Optional: shorten code expiry / length
Under **Authentication → Email** you can adjust OTP expiry. Default 6 digits works out of the box.

## Make yourself an admin (unchanged)
```sql
update public.profiles set is_admin = true where email = 'you@example.com';
```
