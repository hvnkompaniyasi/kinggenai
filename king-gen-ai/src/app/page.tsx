// =============================================
// KING GEN AI — Bosh sahifa (Landing Page)
// Izohlar o'zbek tilida, sayt matni ingliz tilida (MVP talabi)
// =============================================

"use client"; // Animatsiyalar brauzerda ishlashi uchun kerak

import { motion } from "framer-motion"; // Chiroyli animatsiyalar kutubxonasi
import { Button } from "@/components/ui/button"; // shadcn/ui tayyor tugmasi
import {
  Sparkles,   // Yulduzcha ikonka (badge uchun)
  ImagePlus,  // "Rasm yuklash" ikonkasi
  Brush,      // "Cho'tka" ikonkasi
  Download,   // "Yuklab olish" ikonkasi
  ArrowRight, // Strelka ikonkasi
} from "lucide-react";

// 1-2-3 qadamlar (Bento kartochkalari uchun ro'yxat)
const steps = [
  {
    icon: ImagePlus,
    title: "1. Upload",
    text: "Drop your photo or tap the button.",
  },
  {
    icon: Brush,
    title: "2. Brush & Type",
    text: "Paint the area and tell AI what you want.",
  },
  {
    icon: Download,
    title: "3. Download",
    text: "Get your edited image in seconds.",
  },
];

export default function Home() {
  return (
    // Asosiy oyna: qora fon, markazlashgan kontent
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center gap-12 px-4 py-16">

      {/* ===== SARLAVHA (HERO) QISMI ===== */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}  // Boshida ko'rinmas, pastda
        animate={{ opacity: 1, y: 0 }}   // Sekin paydo bo'ladi
        transition={{ duration: 0.6 }}   // 0.6 soniya davom etadi
        className="flex max-w-3xl flex-col items-center gap-6 text-center"
      >
        {/* Kichik badge (nishoncha) */}
        <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-zinc-300 backdrop-blur">
          <Sparkles className="mr-1 inline h-4 w-4 text-amber-300" />
          AI-Powered Image Editing — 100% Free
        </span>

        {/* Katta sarlavha (gradient matn bilan) */}
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Edit Images Like{" "}
          <span className="bg-gradient-to-r from-amber-200 via-orange-300 to-pink-300 bg-clip-text text-transparent">
            Magic
          </span>
        </h1>

        {/* Qisqacha tavsif */}
        <p className="text-lg text-zinc-400">
          Remove anything, change backgrounds, and transform photos with one
          brush stroke. No skills needed.
        </p>

        {/* Katta "Boshlash" tugmasi */}
        <Button
          size="lg"
          className="h-14 rounded-full bg-white px-8 text-base text-zinc-900 hover:bg-zinc-200"
        >
          Start Editing <ArrowRight className="h-5 w-5" />
        </Button>
      </motion.header>

      {/* ===== 1-2-3 QADAMLAR (BENTO KARTOCHKALAR) ===== */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }} // Sarlavhadan keyin chiqadi
        className="grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3"
      >
        {steps.map((step) => {
          const Icon = step.icon; // Ikonkani o'zgaruvchiga olamiz
          return (
            <div
              key={step.title}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <Icon className="h-8 w-8 text-amber-200" />
              <h3 className="font-semibold">{step.title}</h3>
              <p className="text-sm text-zinc-400">{step.text}</p>
            </div>
          );
        })}
      </motion.section>

      {/* ===== PASTKI QISM (FOOTER) ===== */}
      <footer className="text-sm text-zinc-500">© 2026 King Gen AI</footer>
    </main>
  );
}