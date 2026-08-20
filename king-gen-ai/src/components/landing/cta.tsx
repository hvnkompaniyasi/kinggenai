// =============================================
// CTA — "Ready to Create Magic?" gradient karta
// "Start Editing Now" tugmasi signup ga olib boradi
// =============================================
"use client";

import Link from "next/link"; // 🆕 Havolalar uchun
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Cta() {
  return (
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

        {/* 🆕 Link ichiga o'ralgan tugma */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-8 inline-block">
          <Link href="/signup">
            <Button size="lg" className="h-14 rounded-full bg-white px-10 text-base text-purple-700 hover:bg-zinc-100">
              Start Editing Now <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}