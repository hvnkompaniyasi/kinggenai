// =============================================
// EDITOR HOME — barcha instrumentlar markazi
// Adjust (CapCut uslubi) + responsive (md) tuzatishlari
// =============================================
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ImageUploader } from "./image-uploader";
import { RotateFlipTool } from "./tools/rotate-flip-tool";
import { ConvertTool } from "./tools/convert-tool";
import { ResizeTool } from "./tools/resize-tool";
import { AdjustTool } from "./tools/adjust-tool";
import { CropTool } from "./tools/crop-tool";
import {
  Wand2, Eraser, Crop, Ruler, RefreshCw, RotateCw, SlidersHorizontal,
  ArrowLeft, LogOut, Coins, Loader2,
} from "lucide-react";

type ToolId = "inpaint" | "background" | "crop" | "resize" | "convert" | "rotate" | "adjust";

// Barcha instrumentlar ro'yxati
const TOOLS: { id: ToolId; icon: any; title: string; desc: string; tag?: string }[] = [
  { id: "inpaint", icon: Wand2, title: "AI Magic Edit", desc: "Paint & describe — AI redraws it.", tag: "AI" },
  { id: "background", icon: Eraser, title: "Remove Background", desc: "One click → transparent PNG.", tag: "AI" },
  { id: "crop", icon: Crop, title: "Crop", desc: "Keep only the part you need." },
  { id: "resize", icon: Ruler, title: "Resize", desc: "Exact width & height in pixels." },
  { id: "convert", icon: RefreshCw, title: "Convert Format", desc: "PNG, JPG, WEBP, SVG, PDF +." },
  { id: "rotate", icon: RotateCw, title: "Rotate & Flip", desc: "Turn 90° or mirror in one tap." },
  { id: "adjust", icon: SlidersHorizontal, title: "Adjust", desc: "Pro color controls — like CapCut." },
];

export function EditorHome() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [credits, setCredits] = useState<number | null>(null);
  const [tool, setTool] = useState<ToolId | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Login + kreditlar balansini yuklash
  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/login");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("credits")
        .eq("id", data.session.user.id)
        .single();
      if (profile) setCredits(profile.credits);
      setChecking(false);
    }
    load();
  }, [router]);

  // Chiqish tugmasi
  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  const active = TOOLS.find((t) => t.id === tool);

  return (
    <main className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-white">
      {/* ===== HEADER: logo + kreditlar + logout ===== */}
      <header className="sticky top-0 z-40 border-b border-zinc-200/60 bg-white/70 backdrop-blur-xl dark:border-white/5 dark:bg-zinc-950/70">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 overflow-hidden rounded-xl bg-black">
              <img src="/logo.jpg" alt="logo" className="h-full w-full translate-y-[2px] object-cover" />
            </span>
            <span className="text-lg font-bold tracking-tight">
              King Gen{" "}
              <span className="bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">AI</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Kreditlar balansi (MVP story #14) */}
            <span className="flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
              <Coins className="h-4 w-4 text-amber-400" />
              {credits ?? "—"} credits
            </span>
            <button
              onClick={logout}
              aria-label="Log out"
              className="rounded-full border border-zinc-200 bg-white p-2 text-zinc-600 transition hover:bg-zinc-100 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ===== ASOSIY QISM ===== */}
      {!tool ? (
        /* ----- TOOL HUB: "What would you create?" ----- */
        <section className="mx-auto max-w-6xl px-4 py-12">
          <h1 className="text-center text-3xl font-extrabold sm:text-5xl">
            What would you{" "}
            <span className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              create
            </span>{" "}
            today?
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-center text-zinc-600 dark:text-zinc-400">
            Pick a tool — no skills needed.
          </p>

          {/* Instrumentlar gridi */}
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {TOOLS.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => { setTool(t.id); setImageUrl(null); }}
                  className="group relative flex flex-col items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-5 text-left transition hover:-translate-y-1 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 dark:border-white/10 dark:bg-white/5"
                >
                  {t.tag && (
                    <span className="absolute right-3 top-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-2 py-0.5 text-[10px] font-bold text-white">
                      {t.tag}
                    </span>
                  )}
                  <span className="rounded-xl bg-gradient-to-br from-cyan-500/15 to-purple-500/15 p-2.5 text-purple-500 dark:text-cyan-300">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-semibold">{t.title}</span>
                    <span className="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">{t.desc}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      ) : (
        /* ----- TOOL WORKSPACE: tanlangan instrument ish joyi ----- */
        <section className="mx-auto max-w-5xl px-4 py-8">
          <button
            onClick={() => { setTool(null); setImageUrl(null); }}
            className="mb-6 flex items-center gap-2 text-sm text-zinc-500 transition hover:text-zinc-900 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> All tools
          </button>

          <h2 className="mb-6 text-2xl font-bold sm:text-3xl">{active?.title}</h2>

          {!imageUrl ? (
            <ImageUploader onImage={setImageUrl} />
          ) : tool === "adjust" ? (
            /* Adjust — CapCut uslubidagi pro sozlamalar */
            <AdjustTool imageUrl={imageUrl} onImageChange={setImageUrl} />
          ) : tool === "crop" ? (
            /* Crop — o'z sahifasi bilan */
            <CropTool imageUrl={imageUrl} onImageChange={setImageUrl} />
          ) : (
            /* Rotate / Convert / Resize — umumiy ko'rinish (md: yonma-yon) */
            <div className="grid gap-6 md:grid-cols-[1fr_300px]">
              <div className="rounded-2xl border border-zinc-200 p-4 dark:border-white/10">
                <img src={imageUrl} alt="Working" className="mx-auto max-h-[65vh] rounded-xl object-contain" />
              </div>
              <div className="h-fit rounded-2xl border border-zinc-200 p-5 dark:border-white/10">
                {tool === "rotate" && <RotateFlipTool imageUrl={imageUrl} onImageChange={setImageUrl} />}
                {tool === "convert" && <ConvertTool imageUrl={imageUrl} />}
                {tool === "resize" && <ResizeTool imageUrl={imageUrl} onImageChange={setImageUrl} />}
                {(tool === "inpaint" || tool === "background") && (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    🛠️ This AI tool arrives in the next update — stay tuned!
                  </p>
                )}
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  );
}