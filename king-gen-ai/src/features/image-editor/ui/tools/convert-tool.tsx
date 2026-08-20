// =============================================
// CONVERT FORMAT — PNG / JPG / WEBP / SVG / PDF / BMP / AVIF
// 7 ta format! (user story #8 + kengaytirilgan)
// =============================================
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileImage, FileText, Loader2, PenTool } from "lucide-react";
import { toast } from "sonner";
import { downloadImage } from "@/lib/download-image";
import { jsPDF } from "jspdf";        // PDF uchun
import ImageTracer from "imagetracerjs"; // SVG (vektorizatsiya) uchun

// Barcha formatlar ro'yxati
const FORMATS = [
  { ext: "png", label: "PNG", desc: "Keeps transparency", mime: "image/png", icon: FileImage },
  { ext: "jpg", label: "JPG", desc: "Small size for photos", mime: "image/jpeg", icon: FileImage },
  { ext: "webp", label: "WEBP", desc: "Modern & smallest size", mime: "image/webp", icon: FileImage },
  { ext: "svg", label: "SVG", desc: "Vector — best for logos", mime: "", icon: PenTool },
  { ext: "pdf", label: "PDF", desc: "For documents", mime: "", icon: FileText },
  { ext: "bmp", label: "BMP", desc: "Classic Windows bitmap", mime: "image/bmp", icon: FileImage },
  { ext: "avif", label: "AVIF", desc: "Next-gen (browser dependent)", mime: "image/avif", icon: FileImage },
];

export function ConvertTool({ imageUrl }: { imageUrl: string }) {
  const [busy, setBusy] = useState<string | null>(null);

  // Rasmni yuklab olamiz
  async function loadImage(): Promise<HTMLImageElement> {
    const img = new Image();
    img.src = imageUrl;
    await img.decode();
    return img;
  }

  // ----- RASTER formatlar (PNG/JPG/WEBP/BMP/AVIF) -----
  async function convertRaster(f: (typeof FORMATS)[number]) {
    const img = await loadImage();
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;

    // JPG shaffoflikni saqlamaydi — oq fon qo'shamiz
    if (f.mime === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0);

    // PNG / JPG / WEBP — hamma brauzerda ishlaydi
    if (f.ext === "png" || f.ext === "jpg" || f.ext === "webp") {
      downloadImage(canvas.toDataURL(f.mime, 0.92), `king-gen-ai.${f.ext}`);
      toast.success(`Converted to ${f.label}!`);
      return;
    }

    // BMP / AVIF — brauzer qo'llab-quvvatlashini tekshiramiz
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, f.mime, 0.92));
    if (!blob || blob.type !== f.mime) {
      toast.error(`${f.label} is not supported in this browser.`); // aniq xato xabari
      return;
    }
    const url = URL.createObjectURL(blob);
    downloadImage(url, `king-gen-ai.${f.ext}`);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    toast.success(`Converted to ${f.label}!`);
  }

  // ----- PDF -----
  async function convertPdf() {
    const img = await loadImage();
    const pdf = new jsPDF({
      orientation: img.width > img.height ? "landscape" : "portrait",
      unit: "px",
      format: [img.width, img.height],
    });
    pdf.addImage(img, "PNG", 0, 0, img.width, img.height);
    pdf.save("king-gen-ai.pdf");
    toast.success("Converted to PDF!");
  }

  // ----- SVG (haqiqiy vektorizatsiya) -----
  async function convertSvg() {
    const img = await loadImage();
    // Tez ishlashi uchun rasmni kichraytiramiz (max 800px)
    const scale = Math.min(1, 800 / Math.max(img.width, img.height));
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    const imageData = ctx.getImageData(0, 0, w, h);

    // Spinner ko'rinishi uchun kichik pauza
    await new Promise((r) => setTimeout(r, 50));

    // Raster -> vektor (SVG) aylantirish
    const svgstr = ImageTracer.imagedataToSVG(imageData, {
      numberofcolors: 16,
      pathomit: 8,
      desc: false,
    });
    const blob = new Blob([svgstr], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    downloadImage(url, "king-gen-ai.svg");
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    toast.success("Converted to SVG!");
  }

  // ----- Asosiy funksiya -----
  async function convert(f: (typeof FORMATS)[number]) {
    setBusy(f.ext);
    try {
      if (f.ext === "pdf") await convertPdf();
      else if (f.ext === "svg") await convertSvg();
      else await convertRaster(f);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    }
    setBusy(null);
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium">Choose a format to download:</p>
      <div className="flex flex-col gap-2">
        {FORMATS.map((f) => {
          const Icon = f.icon;
          return (
            <Button
              key={f.ext}
              variant="outline"
              disabled={!!busy}
              onClick={() => convert(f)}
              className="flex h-auto items-center justify-start gap-3 px-4 py-3 text-left dark:border-white/15 dark:bg-transparent dark:text-zinc-200 dark:hover:bg-white/5"
            >
              {busy === f.ext ? (
                <Loader2 className="h-5 w-5 shrink-0 animate-spin" />
              ) : (
                <Icon className="h-5 w-5 shrink-0 text-purple-500 dark:text-cyan-300" />
              )}
              <span className="flex-1">
                <span className="block font-semibold">{f.label}</span>
                <span className="block text-xs text-zinc-500 dark:text-zinc-400">{f.desc}</span>
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}