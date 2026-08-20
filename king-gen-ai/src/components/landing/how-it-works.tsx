// HOW IT WORKS — 1-2-3 qadamlar
"use client";

import { motion } from "framer-motion";
import { ImagePlus, Brush, Download } from "lucide-react";

const steps = [
  { icon: ImagePlus, title: "Upload", text: "Drop your photo or tap the button." },
  { icon: Brush, title: "Brush & Type", text: "Mark the area and tell AI what you want." },
  { icon: Download, title: "Download", text: "Save your magic result in seconds." },
];

export function HowItWorks() {
  return (
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
  );
}