// =============================================
// RESIZE — eni/bo'yini pikselda o'zgartirish
// "Keep proportions" — rasm buzilmasligi uchun qulf
// =============================================
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Unlock, Download, Loader2, Ruler } from "lucide-react";
import { toast } from "sonner";
import { downloadImage } from "@/lib/download-image";

const MAX_DIM = 4096; // xavfsizlik chegarasi

export function ResizeTool({
  imageUrl,
  onImageChange,
}: {
  imageUrl: string;
  onImageChange: (url: string) => void;
}) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [ratio, setRatio] = useState(1);
  const [lock, setLock] = useState(true); // proporsiya qulfi
  const [busy, setBusy] = useState(false);

  // Rasm o'zgarganda o'lchamlarni yangilaymiz
  useEffect(() => {
    let alive = true;
    const img = new Image();
    img.src = imageUrl;
    img.decode().then(() => {
      if (!alive) return;
      setWidth(img.width);
      setHeight(img.height);
      setRatio(img.width / img.height);
    });
    return () => {
      alive = false;
    };
  }, [imageUrl]);

  // Eni o'zgarsa — bo'yi avtomatik moslashadi (qulf yoqilgan bo'lsa)
  function changeWidth(v: number) {
    setWidth(v);
    if (lock && v > 0) setHeight(Math.max(1, Math.round(v / ratio)));
  }
  function changeHeight(v: number) {
    setHeight(v);
    if (lock && v > 0) setWidth(Math.max(1, Math.round(v * ratio)));
  }

  // Resize qilish
  async function apply() {
    if (!width || !height || width < 1 || height < 1) {
      toast.error("Please enter valid dimensions.");
      return;
    }
    if (width > MAX_DIM || height > MAX_DIM) {
      toast.error(`Maximum size is ${MAX_DIM}px.`);
      return;
    }
    setBusy(true);
    try {
      const img = new Image();
      img.src = imageUrl;
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingQuality = "high"; // sifatli kichraytirish
      ctx.drawImage(img, 0, 0, width, height);
      onImageChange(canvas.toDataURL("image/png"));
      toast.success(`Resized to ${width}×${height}px!`);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label>Width (px)</Label>
        <Input type="number" min={1} max={MAX_DIM} value={width || ""} onChange={(e) => changeWidth(Number(e.target.value))} />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Height (px)</Label>
        <Input type="number" min={1} max={MAX_DIM} value={height || ""} onChange={(e) => changeHeight(Number(e.target.value))} />
      </div>

      {/* Proporsiya qulfi */}
      <button
        onClick={() => setLock(!lock)}
        className="flex items-center gap-2 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
      >
        {lock ? <Lock className="h-4 w-4 text-purple-500" /> : <Unlock className="h-4 w-4" />}
        Keep proportions
      </button>

      <Button onClick={apply} disabled={busy} className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:opacity-90">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ruler className="h-4 w-4" />}
        Apply Resize
      </Button>
      <Button variant="outline" onClick={() => downloadImage(imageUrl, "king-gen-ai.png")} className="dark:border-white/15 dark:bg-transparent dark:text-zinc-200">
        <Download className="h-4 w-4" /> Download
      </Button>
    </div>
  );
}