// HERO — katta sarlavha va asosiy tugmalar
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-20 sm:pt-28">
      {/* Neon aurora — sekin "nafas oladi" */}
      <motion.div
        animate={{ y: [0, -14, 0], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -top-32 left-0 right-0 mx-auto h-[480px] w-[720px] rounded-full bg-gradient-to-r from-cyan-400/40 via-purple-500/40 to-pink-400/40 blur-3xl dark:from-cyan-400/20 dark:via-purple-500/20 dark:to-pink-400/20"
      />

      <div className="relative mx-auto max-w-4xl text-center">
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

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400"
        >
          Remove anything, change backgrounds, and transform photos with one
          brush stroke. No skills needed.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
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
  );
}