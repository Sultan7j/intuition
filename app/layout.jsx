import "./globals.css";

export const metadata = {
  title: "بديهة / Intuition — Trivia",
  description: "A bilingual two-team trivia battle.",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
