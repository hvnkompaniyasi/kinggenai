// =============================================
// KING GEN AI — Bosh sahifa
// Har bir bo'lim o'z faylida (toza struktura)
// =============================================

import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Cta } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 transition-colors dark:bg-zinc-950 dark:text-white">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Cta />
      <Footer />
    </div>
  );
}