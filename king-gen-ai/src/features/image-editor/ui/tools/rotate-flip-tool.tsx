// =============================================
// ROTATE & FLIP — burish va ag'darish vositasi
// =============================================
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RotateCw, RotateCcw, FlipHorizontal2, FlipVertical2, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { downloadImage } from "@/lib/download-image";

type Op = "left" | "right" | "flipH" | "flipV";

export function RotateFlipTool({
  imageUrl,
  onImageChange,
}: {
  imageUrl: string;
  onImageChange: (url: string) => void;
}) {
  const [busy, setBusy] = useState<Op | null>(null);

  // Canvas orqali rasmni burish/ag'darish
  async function apply(op: Op) {
    setBusy(op);
    try {
      const img = new Image();
      img.src = imageUrl;
      await img.decode();

      const rotate = op === "left" || op === "right";
      const canvas = document.createElement("canvas");
      canvas.width = rotate ? img.height : img.width;
      canvas.height = rotate ? img.width : img.height;
      const ctx = canvas.getContext("2d")!;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      if (op === "left") ctx.rotate(-Math.PI / 2);
      if (op === "right") ctx.rotate(Math.PI / 2);
      if (op === "flipH") ctx.scale(-1, 1);
      if (op === "flipV") ctx.scale(1, -1);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      onImageChange(canvas.toDataURL("image/png"));
      toast.success("Done!");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
    setBusy(null);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" disabled={!!busy} onClick={() => apply("left")} className="dark:border-white/15 dark:bg-transparent dark:text-zinc-200">
          {busy === "left" ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />} Left 90°
        </Button>
        <Button variant="outline" disabled={!!busy} onClick={() => apply("right")} className="dark:border-white/15 dark:bg-transparent dark:text-zinc-200">
          {busy === "right" ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCw className="h-4 w-4" />} Right 90°
        </Button>
        <Button variant="outline" disabled={!!busy} onClick={() => apply("flipH")} className="dark:border-white/15 dark:bg-transparent dark:text-zinc-200">
          {busy === "flipH" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FlipHorizontal2 className="h-4 w-4" />} Flip H
        </Button>
        <Button variant="outline" disabled={!!busy} onClick={() => apply("flipV")} className="dark:border-white/15 dark:bg-transparent dark:text-zinc-200">
          {busy === "flipV" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FlipVertical2 className="h-4 w-4" />} Flip V
        </Button>
      </div>

      <Button onClick={() => downloadImage(imageUrl, "king-gen-ai.png")} className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:opacity-90">
        <Download className="h-4 w-4" /> Download
      </Button>
    </div>
  );
}