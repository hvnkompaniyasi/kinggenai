// =============================================
// KING GEN AI — Premium Landing Page + ANIMATSIYALAR
// Framer Motion bilan jonli effektlar
// =============================================

"use client"; // Animatsiyalar va tema ishlashi uchun

import { useEffect, useState } from "react";
import { motion } from "framer-motion"; // Animatsiyalar kutubxonasi
import { Button } from "@/components/ui/button";
import {
  Wand2,             // AI Inpainting ikonkasi
  Eraser,            // Fonni o'chirish
  Crop,              // Kesish
  RefreshCw,         // Format almashtirish
  RotateCw,          // Burish
  SlidersHorizontal, // Yorqinlik/kontrast
  Sun,               // Oq rejim ikonkasi
  Moon,              // Qora rejim ikonkasi
  ArrowRight,        // Strelka
  ImagePlus,         // 1-qadam ikonkasi
  Brush,             // 2-qadam ikonkasi
  Download,          // 3-qadam ikonkasi
} from "lucide-react";

// ----- Xususiyatlar (Bento kartochkalari) -----
const features = [
  { icon: Wand2, title: "AI Inpainting", text: "Paint over anything and describe what you want — AI redraws it perfectly." },
  { icon: Eraser, title: "Background Removal", text: "One click to get a clean, transparent PNG." },
  { icon: Crop, title: "Crop & Resize", text: "Drag to crop or type exact pixel sizes." },
  { icon: RefreshCw, title: "Format Converter", text: "PNG, JPG, WEBP — convert instantly." },
  { icon: RotateCw, title: "Rotate & Flip", text: "Turn or mirror your image in one tap." },
  { icon: SlidersHorizontal, title: "Light & Contrast", text: "Simple sliders to make your photo pop." },
];

// ----- 1-2-3 qadamlar -----
const steps = [
  { icon: ImagePlus, title: "Upload", text: "Drop your photo or tap the button." },
  { icon: Brush, title: "Brush & Type", text: "Mark the area and tell AI what you want." },
  { icon: Download, title: "Download", text: "Save your magic result in seconds." },
];

export default function Home() {
  // Tema holati: true = qora, false = oq
  const [dark, setDark] = useState(true);

  // <html> tegiga "dark" klassini qo'shamiz/olib tashlaymiz
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="min-h-screen bg-white text-zinc-900 transition-colors dark:bg-zinc-950 dark:text-white">

      {/* ================= NAVBAR (tepadan tushib keladi) ================= */}
      <motion.header
        initial={{ y: -60, opacity: 0 }} // Boshida tepada yashirin
        animate={{ y: 0, opacity: 1 }}   // Pastga tushib ko'rinadi
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 border-b border-zinc-200/60 bg-white/70 backdrop-blur-xl dark:border-white/5 dark:bg-zinc-950/70"
      >
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          {/* Logo + nom */}
          <a href="#" className="flex items-center gap-2.5">
            {/* Logo ramkasi: rasm markazlashtirilgan */}
            <span className="flex h-9 w-9 overflow-hidden rounded-xl bg-black">
              <img
                src="/logo.jpg"
                alt="King Gen AI logo"
                className="h-full w-full translate-y-[2px] object-cover"
              />
            </span>
            <span className="text-lg font-bold tracking-tight">
              King Gen{" "}
              <span className="bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">AI</span>
            </span>
          </a>

          {/* Havolalar (katta ekranlarda) */}
          <div className="hidden items-center gap-8 text-sm font-medium text-zinc-600 md:flex dark:text-zinc-300">
            <a href="#features" className="hover:text-zinc-900 dark:hover:text-white">Features</a>
            <a href="#how" className="hover:text-zinc-900 dark:hover:text-white">How it works</a>
          </div>

          {/* O'ng tomon: tema tugmasi + CTA */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDark(!dark)}
              aria-label="Toggle light/dark mode"
              className="rounded-full border border-zinc-200 bg-white p-2 text-zinc-600 transition hover:bg-zinc-100 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Button size="sm" className="rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:opacity-90">
              Start Editing
            </Button>
          </div>
        </nav>
      </motion.header>

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden px-4 pb-24 pt-20 sm:pt-28">
        {/* Neon aurora — sekin "nafas oladi" */}
        <motion.div
          animate={{ y: [0, -14, 0], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -top-32 left-0 right-0 mx-auto h-[480px] w-[720px] rounded-full bg-gradient-to-r from-cyan-400/40 via-purple-500/40 to-pink-400/40 blur-3xl dark:from-cyan-400/20 dark:via-purple-500/20 dark:to-pink-400/20"
        />

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Katta sarlavha — pastdan ko'tarilib chiqadi */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl font-extrabold tracking-tight sm:text-7xl"
          >
            Edit Images Like{" "}
            <span className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Magic
            </span>
          </motion.h1>

          {/* Tavsif — biroz kechikib chiqadi */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400"
          >
            Remove anything, change backgrounds, and transform photos with one
            brush stroke. No skills needed.
          </motion.p>

          {/* Tugmalar — eng oxiri chiqadi */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            {/* Asosiy tugma: ustiga borganda kattalashadi, bosilganda qisqaradi */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" className="h-14 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-8 text-base text-white shadow-lg shadow-purple-500/30 hover:opacity-90">
                Start Editing <ArrowRight className="h-5 w-5" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" variant="outline" className="h-14 rounded-full border-zinc-300 bg-transparent px-8 text-base dark:border-white/15 dark:bg-transparent dark:text-zinc-200">
                See How It Works
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= XUSUSIYATLAR (scroll'da paydo bo'ladi) ================= */}
      <section id="features" className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }} // Ekranga kirganda bir marta chiqadi
            transition={{ duration: 0.6 }}
            className="text-center text-3xl font-bold sm:text-5xl"
          >
            Everything You Need,{" "}
            <span className="bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
              Nothing You Don&apos;t
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-4 max-w-xl text-center text-zinc-600 dark:text-zinc-400"
          >
            A full editing studio in your browser — powered by AI.
          </motion.p>

          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                // Har karta navbat bilan (i * 0.08) ko'tarilib chiqadi
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{ y: -6 }} // Ustiga borganda ko'tariladi
                  className="group rounded-2xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-xl hover:shadow-purple-500/10 dark:border-white/10 dark:bg-white/5 dark:hover:shadow-purple-500/10"
                >
                  <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-cyan-500/15 to-purple-500/15 p-3 text-purple-500 dark:from-cyan-500/20 dark:to-purple-500/20 dark:text-cyan-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{f.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= 1-2-3 QADAMLAR ================= */}
      <section id="how" className="px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center text-3xl font-bold sm:text-5xl"
          >
            How It Works
          </motion.h2>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="rounded-2xl border border-zinc-200 bg-white p-6 text-center dark:border-white/10 dark:bg-white/5"
                >
                  {/* Raqam doirasi */}
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 text-lg font-bold text-white">
                    {i + 1}
                  </span>
                  <Icon className="mx-auto mt-4 h-7 w-7 text-purple-500 dark:text-cyan-300" />
                  <h3 className="mt-3 font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{s.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= CTA (kattalashib chiqadi) ================= */}
      <section className="px-4 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500 via-purple-600 to-pink-600 px-6 py-16 text-center text-white shadow-2xl shadow-purple-500/30"
        >
          {/* Bezak doiralar */}
          <span className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
          <span className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-white/10" />

          <h2 className="text-3xl font-extrabold sm:text-5xl">Ready to Create Magic?</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Join thousands of creators editing photos with AI. Free forever, no
            credit card required.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-8 inline-block">
            <Button size="lg" className="h-14 rounded-full bg-white px-10 text-base text-purple-700 hover:bg-zinc-100">
              Start Editing Now <ArrowRight className="h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-zinc-200 px-4 py-10 dark:border-white/5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            {/* Footer logosi markazlashtirilgan */}
            <span className="flex h-7 w-7 overflow-hidden rounded-lg bg-black">
              <img src="/logo.jpg" alt="logo" className="h-full w-full translate-y-[1.5px] object-cover" />
            </span>
            <span className="text-sm font-semibold">King Gen AI</span>
          </div>
          <p className="text-sm text-zinc-500">© 2026 King Gen AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}