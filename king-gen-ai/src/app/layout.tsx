// =============================================
// KING GEN AI — Global Layout
// Shrift, metadata va <html> sozlamalari
// =============================================

import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google"; // Zamonaviy, texno shrift
import "./globals.css";

// Shriftni yuklab, --font-sans o'zgaruvchisiga biriktiramiz
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Brauzer tab'ida ko'rinadigan ma'lumotlar
export const metadata: Metadata = {
  title: "King Gen AI — AI-Powered Image Editing",
  description:
    "Remove anything, change backgrounds, and transform photos with one brush stroke. No skills needed.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // dark klassi: sayt qora rejimda ochiladi (tugma bilan almashtiriladi)
    <html lang="en" className={`${spaceGrotesk.variable} dark`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}