// =============================================
// ADJUST — professional rang sozlamalari (CapCut/Premiere uslubida)
// 9 ta slayder + LIVE preview + native range (100% ishonchli)
// =============================================
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sun, Contrast, Droplets, Palette, Thermometer, Film, Moon, Wind, Repeat,
  Download, Loader2, RotateCcw, Check,
} from "lucide-react";
import { toast } from "sonner";
import { downloadImage } from "@/lib/download-image";

// Barcha sozlama qiymatlari
type AdjustState = {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  temperature: number;
  sepia: number;
  grayscale: number;
  blur: number;
  invert: number;
};

// Standart (boshlang'ich) qiymatlar
const DEFAULTS: AdjustState = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  hue: 0,
  temperature: 100,
  sepia: 0,
  grayscale: 0,
  blur: 0,
  invert: 0,
};

// Slayderlar ro'yxati (CapCut uslubida)
const SLIDERS: {
  key: keyof AdjustState;
  label: string;
  icon: any;
  min: number;
  max: number;
  unit: string;
  accent: string;
}[] = [
  { key: "brightness", label: "Brightness", icon: Sun, min: 0, max: 200, unit: "%", accent: "accent-amber-400" },
  { key: "contrast", label: "Contrast", icon: Contrast, min: 0, max: 200, unit: "%", accent: "accent-purple-500" },
  { key: "saturation", label: "Saturation", icon: Droplets, min: 0, max: 200, unit: "%", accent: "accent-pink-500" },
  { key: "hue", label: "Hue", icon: Palette, min: 0, max: 360, unit: "°", accent: "accent-cyan-400" },
  { key: "temperature", label: "Temperature", icon: Thermometer, min: 0, max: 200, unit: "%", accent: "accent-orange-500" },
  { key: "sepia", label: "Vintage", icon: Film, min: 0, max: 100, unit: "%", accent: "accent-yellow-600" },
  { key: "grayscale", label: "B&W", icon: Moon, min: 0, max: 100, unit: "%", accent: "accent-zinc-400" },
  { key: "blur", label: "Blur", icon: Wind, min: 0, max: 10, unit: "px", accent: "accent-sky-400" },
  { key: "invert", label: "Negative", icon: Repeat, min: 0, max: 100, unit: "%", accent: "accent-red-500" },
];

// Xavfsiz qiymat (NaN dan himoya, oralig'ida ushlaydi)
function safe(v: number, def: number, max: number): number {
  return Number.isFinite(v) ? Math.min(max, Math.max(0, v)) : def;
}

export function AdjustTool({
  imageUrl,
  onImageChange,
}: {
  imageUrl: string;
  onImageChange: (url: string) => void;
}) {
  const [v, setV] = useState<AdjustState>(DEFAULTS);
  const [busy, setBusy] = useState(false);

  // Bitta qiymatni yangilash
  function set(key: keyof AdjustState, value: number, max: number, def: number) {
    setV((prev) => ({ ...prev, [key]: safe(value, def, max) }));
  }

  // CSS filtr (live preview + canvas uchun)
  const filter = [
    `brightness(${v.brightness}%)`,
    `contrast(${v.contrast}%)`,
    `saturate(${v.saturation}%)`,
    v.hue ? `hue-rotate(${v.hue}deg)` : "",
    v.sepia ? `sepia(${v.sepia}%)` : "",
    v.grayscale ? `grayscale(${v.grayscale}%)` : "",
    v.blur ? `blur(${v.blur}px)` : "",
    v.invert ? `invert(${v.invert}%)` : "",
  ].filter(Boolean).join(" ");

  // Temperatura (issiq/sovuq) kuchi
  const tempAlpha = (Math.abs(v.temperature - 100) / 100) * 0.35;

  // Natijani rasmga "pishirish"
  async function apply() {
    setBusy(true);
    try {
      const img = new Image();
      img.src = imageUrl;
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.filter = filter;
      ctx.drawImage(img, 0, 0);
      // Temperatura effekti (overlay qatlam)
      ctx.filter = "none";
      if (v.temperature !== 100) {
        ctx.globalCompositeOperation = "overlay";
        ctx.fillStyle =
          v.temperature > 100
            ? `rgba(255, 147, 41, ${tempAlpha})` // issiq (sariq)
            : `rgba(41, 147, 255, ${tempAlpha})`; // sovuq (ko'k)
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = "source-over";
      }
      onImageChange(canvas.toDataURL("image/png"));
      setV(DEFAULTS);
      toast.success("Adjustments applied!");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
    setBusy(false);
  }

  return (
    // md: dan yuqori — yonma-yon, telefonda — pastma-past
    <div className="grid gap-6 md:grid-cols-[1fr_300px]">
      {/* ===== LIVE PREVIEW ===== */}
      <div className="rounded-2xl border border-zinc-200 p-4 dark:border-white/10">
        <div className="relative mx-auto inline-block">
          <img
            src={imageUrl}
            alt="Preview"
            style={{ filter }}
            className="mx-auto max-h-[65vh] rounded-xl object-contain"
          />
          {/* Temperatura jonli qatlami */}
          {v.temperature !== 100 && (
            <div
              className="pointer-events-none absolute inset-0 rounded-xl"
              style={{
                backgroundColor:
                  v.temperature > 100
                    ? `rgba(255,147,41,${tempAlpha})`
                    : `rgba(41,147,255,${tempAlpha})`,
                mixBlendMode: "overlay",
              }}
            />
          )}
        </div>
      </div>

      {/* ===== SLAYDERLAR PANELI ===== */}
      <div className="flex h-fit flex-col gap-5 rounded-2xl border border-zinc-200 p-5 dark:border-white/10">
        <div className="flex max-h-[55vh] flex-col gap-4 overflow-y-auto pr-1">
          {SLIDERS.map((s) => {
            const Icon = s.icon;
            const val = v[s.key];
            return (
              <div key={s.key} className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-purple-500 dark:text-cyan-300" />
                    {s.label}
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {val}
                    {s.unit}
                  </span>
                </div>
                {/* Native range — har doim ishlaydi */}
                <input
                  type="range"
                  min={s.min}
                  max={s.max}
                  step={1}
                  value={val}
                  onChange={(e) => set(s.key, Number(e.target.value), s.max, DEFAULTS[s.key])}
                  className={`w-full cursor-pointer ${s.accent}`}
                />
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={apply} disabled={busy} className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:opacity-90">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            Apply
          </Button>
          <Button variant="outline" onClick={() => setV(DEFAULTS)} className="dark:border-white/15 dark:bg-transparent dark:text-zinc-200">
            <RotateCcw className="h-4 w-4" /> Reset
          </Button>
          <Button variant="outline" onClick={() => downloadImage(imageUrl, "king-gen-ai.png")} className="dark:border-white/15 dark:bg-transparent dark:text-zinc-200">
            <Download className="h-4 w-4" /> Download
          </Button>
        </div>
      </div>
    </div>
  );
}