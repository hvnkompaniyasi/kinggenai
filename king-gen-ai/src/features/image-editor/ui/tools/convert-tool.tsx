// =============================================
// CONVERT FORMAT — PNG / JPG / WEBP ga aylantirish
// =============================================
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { downloadImage } from "@/lib/download-image";

const FORMATS = [
  { type: "image/png", ext: "png", label: "PNG" },
  { type: "image/jpeg", ext: "jpg", label: "JPG" },
  { type: "image/webp", ext: "webp", label: "WEBP" },
] as const;

export function ConvertTool({ imageUrl }: { imageUrl: string }) {
  const [busy, setBusy] = useState<string | null>(null);

  // Rasmni tanlangan formatga o'girib yuklab beradi
  async function convert(f: (typeof FORMATS)[number]) {
    setBusy(f.ext);
    try {
      const img = new Image();
      img.src = imageUrl;
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      // JPG shaffoflikni saqlamaydi — oq fon qo'shamiz
      if (f.type === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      downloadImage(canvas.toDataURL(f.type, 0.92), `king-gen-ai.${f.ext}`);
      toast.success(`Converted to ${f.label}!`);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
    setBusy(null);
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">Choose a format to download:</p>
      {FORMATS.map((f) => (
        <Button key={f.ext} variant="outline" disabled={!!busy} onClick={() => convert(f)} className="dark:border-white/15 dark:bg-transparent dark:text-zinc-200">
          {busy === f.ext ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {f.label}
        </Button>
      ))}
    </div>
  );
}