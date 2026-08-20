// =============================================
// CROP — rasm ustida sudrab to'rtburchak tanlash va kesish
// =============================================
"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Crop as CropIcon, Download, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { downloadImage } from "@/lib/download-image";

// Tanlov to'rtburchagi (ekran piksellarida)
type Rect = { x: number; y: number; w: number; h: number };

export function CropTool({
  imageUrl,
  onImageChange,
}: {
  imageUrl: string;
  onImageChange: (url: string) => void;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);
  const [sel, setSel] = useState<Rect | null>(null);
  const [busy, setBusy] = useState(false);

  // Bosilgan joyni rasmga nisbatan hisoblash
  function getPos(e: React.PointerEvent) {
    const rect = imgRef.current!.getBoundingClientRect();
    return {
      x: Math.min(Math.max(e.clientX - rect.left, 0), rect.width),
      y: Math.min(Math.max(e.clientY - rect.top, 0), rect.height),
    };
  }

  function onDown(e: React.PointerEvent) {
    e.preventDefault();
    const p = getPos(e);
    setStart(p);
    setSel({ x: p.x, y: p.y, w: 0, h: 0 });
    (e.target as Element).setPointerCapture(e.pointerId);
  }

  function onMove(e: React.PointerEvent) {
    if (!start) return;
    const p = getPos(e);
    setSel({
      x: Math.min(p.x, start.x),
      y: Math.min(p.y, start.y),
      w: Math.abs(p.x - start.x),
      h: Math.abs(p.y - start.y),
    });
  }

  function onUp() {
    setStart(null);
    if (sel && (sel.w < 5 || sel.h < 5)) setSel(null); // juda kichik tanlov = bekor
  }

  // Tanlangan qismini kesib olish
  async function applyCrop() {
    if (!sel || !imgRef.current) {
      toast.error("Please select an area first.");
      return;
    }
    setBusy(true);
    try {
      const img = imgRef.current;
      // Ekran o'lchami -> haqiqiy rasm o'lchami koeffitsienti
      const scale = img.naturalWidth / img.getBoundingClientRect().width;
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(sel.w * scale);
      canvas.height = Math.round(sel.h * scale);
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(
        img,
        sel.x * scale, sel.y * scale, sel.w * scale, sel.h * scale, // manba
        0, 0, canvas.width, canvas.height // natija
      );
      onImageChange(canvas.toDataURL("image/png"));
      setSel(null);
      toast.success("Cropped!");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        Drag on the image to select the area you want to keep ✂️
      </p>

      {/* Rasm + tanlov qatlami */}
      <div className="relative mx-auto inline-block">
        <img
          ref={imgRef}
          src={imageUrl}
          alt="Crop"
          draggable={false}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          className="max-h-[65vh] cursor-crosshair select-none touch-none rounded-xl object-contain"
        />
        {/* Neon tanlov to'rtburchagi */}
        {sel && sel.w > 0 && sel.h > 0 && (
          <div
            className="pointer-events-none absolute rounded-sm border-2 border-purple-500 bg-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
            style={{ left: sel.x, top: sel.y, width: sel.w, height: sel.h }}
          />
        )}
      </div>

      {/* Tugmalar */}
      <div className="mx-auto flex flex-wrap justify-center gap-2">
        <Button onClick={applyCrop} disabled={busy || !sel} className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:opacity-90">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CropIcon className="h-4 w-4" />}
          Crop
        </Button>
        <Button variant="outline" onClick={() => setSel(null)} className="dark:border-white/15 dark:bg-transparent dark:text-zinc-200">
          <X className="h-4 w-4" /> Clear
        </Button>
        <Button variant="outline" onClick={() => downloadImage(imageUrl, "king-gen-ai.png")} className="dark:border-white/15 dark:bg-transparent dark:text-zinc-200">
          <Download className="h-4 w-4" /> Download
        </Button>
      </div>
    </div>
  );
}