// =============================================
// IMAGE UPLOADER — drag & drop yoki tugma orqali
// PNG/JPG/WEBP, max 5MB (MVP talabiga mos)
// =============================================
"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { ImagePlus, Upload } from "lucide-react";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB chegara
const ALLOWED = ["image/png", "image/jpeg", "image/webp"]; // ruxsat etilgan formatlar

export function ImageUploader({ onImage }: { onImage: (url: string) => void }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Faylni tekshirish: format + hajm
  function validate(file: File): boolean {
    if (!ALLOWED.includes(file.type)) {
      toast.error("Only PNG, JPG or WEBP files are allowed.");
      return false;
    }
    if (file.size > MAX_SIZE) {
      toast.error("File is too large. Maximum size is 5MB.");
      return false;
    }
    return true;
  }

  // Fayl qabul qilish
  function handleFile(file: File | undefined) {
    if (!file) return;
    if (!validate(file)) return;
    onImage(URL.createObjectURL(file)); // brauzerda vaqtinchalik manzil
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
      onClick={() => inputRef.current?.click()}
      className={`flex min-h-[320px] cursor-pointer flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed p-8 text-center transition ${
        dragging
          ? "border-purple-500 bg-purple-500/10"
          : "border-zinc-300 bg-zinc-50 hover:border-purple-500/50 hover:bg-purple-500/5 dark:border-white/15 dark:bg-white/5"
      }`}
    >
      {/* Yashirin fayl tanlash inputi */}
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <span className="rounded-2xl bg-gradient-to-br from-cyan-500/15 to-purple-500/15 p-4 text-purple-500 dark:text-cyan-300">
        <ImagePlus className="h-10 w-10" />
      </span>

      <div>
        <p className="text-lg font-semibold">Drag & drop your image here</p>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          or click to browse — PNG, JPG, WEBP (max 5MB)
        </p>
      </div>

      <span className="rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-6 py-2.5 text-sm font-medium text-white">
        <Upload className="mr-2 inline h-4 w-4" />
        Choose Image
      </span>
    </div>
  );
}