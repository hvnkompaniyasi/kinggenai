// =============================================
// KING GEN AI — Global Layout
// Shrift, metadata, Toaster (xabarnomalar)
// =============================================

import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner"; // Chiroyli xabarnomalar
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "King Gen AI — AI-Powered Image Editing",
  description:
    "Remove anything, change backgrounds, and transform photos with one brush stroke. No skills needed.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} dark`}>
      <body className="antialiased">
        {children}
        {/* Xabarnomalar ekranning tepasida chiqadi */}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}