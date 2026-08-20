// =============================================
// LIGHT & CONTRAST — yorqinlik va kontrast slayderlari
// LIVE PREVIEW: slayder surilganda natija darhol ko'rinadi
// =============================================
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Sun, Contrast, Download, Loader2, RotateCcw, Check } from "lucide-react";
import { toast } from "sonner";
import { downloadImage } from "@/lib/download-image";

export function AdjustTool({
  imageUrl,
  onImageChange,
}: {
  imageUrl: string;
  onImageChange: (url: string) => void;
}) {
  const [brightness, setBrightness] = useState(100); // 0-200%
  const [contrast, setContrast] = useState(100); // 0-200%
  const [busy, setBusy] = useState(false);

  // Jonli preview uchun CSS filtr
  const filter = `brightness(${brightness}%) contrast(${contrast}%)`;

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
      ctx.filter = filter; // canvas filtri
      ctx.drawImage(img, 0, 0);
      onImageChange(canvas.toDataURL("image/png"));
      setBrightness(100);
      setContrast(100);
      toast.success("Adjustments applied!");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
    setBusy(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      {/* Jonli preview */}
      <div className="rounded-2xl border border-zinc-200 p-4 dark:border-white/10">
        <img
          src={imageUrl}
          alt="Preview"
          style={{ filter }} // 🎬 jonli filtr
          className="mx-auto max-h-[65vh] rounded-xl object-contain"
        />
      </div>

      {/* Slayderlar paneli */}
      <div className="flex h-fit flex-col gap-6 rounded-2xl border border-zinc-200 p-5 dark:border-white/10">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm font-medium">
            <span className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-amber-400" /> Brightness
            </span>
            <span className="text-zinc-500 dark:text-zinc-400">{brightness}%</span>
          </div>
          <Slider value={[brightness]} min={0} max={200} step={1} onValueChange={(v) => setBrightness(v[0])} />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm font-medium">
            <span className="flex items-center gap-2">
              <Contrast className="h-4 w-4 text-purple-500" /> Contrast
            </span>
            <span className="text-zinc-500 dark:text-zinc-400">{contrast}%</span>
          </div>
          <Slider value={[contrast]} min={0} max={200} step={1} onValueChange={(v) => setContrast(v[0])} />
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={apply} disabled={busy} className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:opacity-90">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            Apply
          </Button>
          <Button variant="outline" onClick={() => { setBrightness(100); setContrast(100); }} className="dark:border-white/15 dark:bg-transparent dark:text-zinc-200">
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