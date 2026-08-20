// FEATURES — xususiyatlar (Bento grid)
"use client";

import { motion } from "framer-motion";
import {
  Wand2, Eraser, Crop, RefreshCw, RotateCw, SlidersHorizontal,
} from "lucide-react";

const features = [
  { icon: Wand2, title: "AI Inpainting", text: "Paint over anything and describe what you want — AI redraws it perfectly." },
  { icon: Eraser, title: "Background Removal", text: "One click to get a clean, transparent PNG." },
  { icon: Crop, title: "Crop & Resize", text: "Drag to crop or type exact pixel sizes." },
  { icon: RefreshCw, title: "Format Converter", text: "PNG, JPG, WEBP — convert instantly." },
  { icon: RotateCw, title: "Rotate & Flip", text: "Turn or mirror your image in one tap." },
  { icon: SlidersHorizontal, title: "Light & Contrast", text: "Simple sliders to make your photo pop." },
];

export function Features() {
  return (
    <section id="features" className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
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
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="group rounded-2xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-xl hover:shadow-purple-500/10 dark:border-white/10 dark:bg-white/5"
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
  );
}