// =============================================
// NAVBAR — logo, havolalar, tema almashtirish, CTA tugma
// "Start Editing" tugmasi signup sahifasiga olib boradi
// =============================================
"use client";

import { useEffect, useState } from "react";
import Link from "next/link"; // 🆕 Havolalar uchun
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export function Navbar() {
  // Tema holati: true = qora, false = oq
  const [dark, setDark] = useState(true);

  // <html> ga "dark" klassini qo'shamiz/olib tashlaymiz
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 border-b border-zinc-200/60 bg-white/70 backdrop-blur-xl dark:border-white/5 dark:bg-zinc-950/70"
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <a href="#" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 overflow-hidden rounded-xl bg-black">
            <img src="/logo.jpg" alt="King Gen AI logo" className="h-full w-full translate-y-[2px] object-cover" />
          </span>
          <span className="text-lg font-bold tracking-tight">
            King Gen{" "}
            <span className="bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">AI</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 text-sm font-medium text-zinc-600 md:flex dark:text-zinc-300">
          <a href="#features" className="hover:text-zinc-900 dark:hover:text-white">Features</a>
          <a href="#how" className="hover:text-zinc-900 dark:hover:text-white">How it works</a>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setDark(!dark)}
            aria-label="Toggle light/dark mode"
            className="rounded-full border border-zinc-200 bg-white p-2 text-zinc-600 transition hover:bg-zinc-100 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* 🆕 Link ichiga o'ralgan tugma */}
          <Link href="/signup">
            <Button size="sm" className="rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:opacity-90">
              Start Editing
            </Button>
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}