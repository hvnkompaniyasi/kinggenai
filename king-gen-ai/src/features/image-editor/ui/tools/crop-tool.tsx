// =============================================
// CROP PRO MAX — to'liq professional kesish studiyasi
// Ratio + Preset + Move + Resize handles + Aniq piksel
// =============================================
"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Crop as CropIcon, Download, Loader2, X, Maximize2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { downloadImage } from "@/lib/download-image";

type Rect = { x: number; y: number; w: number; h: number };
type Corner = "tl" | "tr" | "bl" | "br";
type DragMode = "new" | "move" | "resize" | null;

// Aspect ratio presetlari
const RATIOS: { label: string; value: number | null; hint: string }[] = [
  { label: "Free", value: null, hint: "Free crop" },
  { label: "1:1", value: 1, hint: "Square" },
  { label: "4:3", value: 4 / 3, hint: "Classic" },
  { label: "3:4", value: 3 / 4, hint: "Portrait" },
  { label: "16:9", value: 16 / 9, hint: "Wide" },
  { label: "9:16", value: 9 / 16, hint: "Vertical" },
];

// 🆕 Ijtimoiy tarmoq presetlari (aniq piksel!)
const PRESETS = [
  { label: "IG Post", w: 1080, h: 1080 },
  { label: "Story / Reels", w: 1080, h: 1920 },
  { label: "YouTube", w: 1280, h: 720 },
  { label: "Avatar", w: 500, h: 500 },
];

// ----- Yordamchi funksiyalar -----
function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), Math.max(max, min));
}

function fitRatio(w: number, h: number, ratio: number): [number, number] {
  if (w / Math.max(h, 0.0001) > ratio) w = h * ratio;
  else h = w / ratio;
  return [w, h];
}

function inside(p: { x: number; y: number }, sel: Rect) {
  return p.x > sel.x && p.x < sel.x + sel.w && p.y > sel.y && p.y < sel.y + sel.h;
}

function hitCorner(p: { x: number; y: number }, sel: Rect): Corner | null {
  const pts: [Corner, number, number][] = [
    ["tl", sel.x, sel.y],
    ["tr", sel.x + sel.w, sel.y],
    ["bl", sel.x, sel.y + sel.h],
    ["br", sel.x + sel.w, sel.y + sel.h],
  ];
  for (const [k, cx, cy] of pts) {
    if (Math.hypot(p.x - cx, p.y - cy) < 10) return k;
  }
  return null;
}

function oppositeCorner(c: Corner, sel: Rect) {
  if (c === "tl") return { x: sel.x + sel.w, y: sel.y + sel.h };
  if (c === "br") return { x: sel.x, y: sel.y };
  if (c === "tr") return { x: sel.x, y: sel.y + sel.h };
  return { x: sel.x + sel.w, y: sel.y };
}

// Yangi tanlov qurish (sudrash)
function buildRect(p: { x: number; y: number }, s: { x: number; y: number }, ratio: number | null, b: { width: number; height: number }): Rect {
  let w = Math.abs(p.x - s.x);
  let h = Math.abs(p.y - s.y);
  if (ratio) [w, h] = fitRatio(w, h, ratio);
  const dx = p.x >= s.x ? 1 : -1;
  const dy = p.y >= s.y ? 1 : -1;
  let x = dx === 1 ? s.x : s.x - w;
  let y = dy === 1 ? s.y : s.y - h;
  w = Math.min(w, b.width);
  h = Math.min(h, b.height);
  if (ratio) [w, h] = fitRatio(w, h, ratio);
  x = clamp(x, 0, b.width - w);
  y = clamp(y, 0, b.height - h);
  return { x, y, w, h };
}

// Burchakdan resize qilish
function resizeRect(corner: Corner, a: { x: number; y: number }, p: { x: number; y: number }, ratio: number | null, b: { width: number; height: number }): Rect {
  let x = 0, y = 0, w = 0, h = 0;
  if (corner === "br") { x = a.x; y = a.y; w = p.x - a.x; h = p.y - a.y; }
  if (corner === "tl") { x = p.x; y = p.y; w = a.x - p.x; h = a.y - p.y; }
  if (corner === "tr") { x = a.x; y = p.y; w = p.x - a.x; h = a.y - p.y; }
  if (corner === "bl") { x = p.x; y = a.y; w = a.x - p.x; h = p.y - a.y; }
  if (w < 0) { x += w; w = -w; }
  if (h < 0) { y += h; h = -h; }
  if (ratio) {
    [w, h] = fitRatio(w, h, ratio);
    if (corner === "tl") { x = a.x - w; y = a.y - h; }
    if (corner === "tr") { x = a.x; y = a.y - h; }
    if (corner === "bl") { x = a.x - w; y = a.y; }
    if (corner === "br") { x = a.x; y = a.y; }
  }
  w = Math.min(w, b.width);
  h = Math.min(h, b.height);
  x = clamp(x, 0, b.width - w);
  y = clamp(y, 0, b.height - h);
  return { x, y, w, h };
}

// =============================================
export function CropTool({
  imageUrl,
  onImageChange,
}: {
  imageUrl: string;
  onImageChange: (url: string) => void;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [sel, setSel] = useState<Rect | null>(null);
  const [ratio, setRatio] = useState<number | null>(null);
  const [preset, setPreset] = useState<{ w: number; h: number } | null>(null);
  const [busy, setBusy] = useState(false);

  // Sudrash holati (ref'lar — tez ishlashi uchun)
  const [mode, setMode] = useState<DragMode>(null);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const anchorRef = useRef<{ x: number; y: number } | null>(null);
  const cornerRef = useRef<Corner | null>(null);
  const moveOffsetRef = useRef<{ x: number; y: number } | null>(null);

  function bounds() {
    return imgRef.current!.getBoundingClientRect();
  }
  function scale() {
    const b = bounds();
    return b.width ? imgRef.current!.naturalWidth / b.width : 1;
  }
  function getPos(e: React.PointerEvent) {
    const r = bounds();
    return {
      x: clamp(e.clientX - r.left, 0, r.width),
      y: clamp(e.clientY - r.top, 0, r.height),
    };
  }

  // ----- Pointer hodisalari -----
  function onDown(e: React.PointerEvent) {
    e.preventDefault();
    const p = getPos(e);
    (e.target as Element).setPointerCapture(e.pointerId);

    if (sel) {
      // 1) Burchakka bosdimi? -> resize
      const corner = hitCorner(p, sel);
      if (corner) {
        setMode("resize");
        cornerRef.current = corner;
        anchorRef.current = oppositeCorner(corner, sel);
        return;
      }
      // 2) Tanlov ichiga bosdimi? -> ko'chirish
      if (inside(p, sel)) {
        setMode("move");
        moveOffsetRef.current = { x: p.x - sel.x, y: p.y - sel.y };
        return;
      }
    }
    // 3) Bo'sh joyga bosdimi? -> yangi tanlov
    setMode("new");
    startRef.current = p;
    setSel({ x: p.x, y: p.y, w: 0, h: 0 });
    setPreset(null);
  }

  function onMove(e: React.PointerEvent) {
    if (!mode) return;
    const b = bounds();
    const p = getPos(e);

    if (mode === "new" && startRef.current) {
      setSel(buildRect(p, startRef.current, ratio, b));
    } else if (mode === "move" && moveOffsetRef.current && sel) {
      setSel({
        x: clamp(p.x - moveOffsetRef.current.x, 0, b.width - sel.w),
        y: clamp(p.y - moveOffsetRef.current.y, 0, b.height - sel.h),
        w: sel.w,
        h: sel.h,
      });
    } else if (mode === "resize" && anchorRef.current && cornerRef.current) {
      setSel(resizeRect(cornerRef.current, anchorRef.current, p, ratio, b));
    }
  }

  function onUp() {
    setMode(null);
    if (sel && (sel.w < 5 || sel.h < 5)) setSel(null);
  }

  // ----- Ratio / Preset -----
  function changeRatio(r: number | null) {
    setRatio(r);
    setPreset(null);
    if (sel && r) {
      const b = bounds();
      let w = sel.w, h = sel.h;
      [w, h] = fitRatio(w, h, r);
      w = Math.min(w, b.width);
      h = Math.min(h, b.height);
      [w, h] = fitRatio(w, h, r);
      const cx = sel.x + sel.w / 2;
      const cy = sel.y + sel.h / 2;
      setSel({
        x: clamp(cx - w / 2, 0, b.width - w),
        y: clamp(cy - h / 2, 0, b.height - h),
        w,
        h,
      });
    }
  }

  // 🆕 Social preset: markazda tanlaydi, aniq pikselda chiqadi
  function applyPreset(pr: { w: number; h: number }) {
    const b = bounds();
    const r = pr.w / pr.h;
    setRatio(r);
    setPreset(pr);
    let w = b.width, h = b.height;
    if (w / h > r) w = h * r;
    else h = w / r;
    setSel({ x: (b.width - w) / 2, y: (b.height - h) / 2, w, h });
  }

  function selectAll() {
    const b = bounds();
    let w = b.width, h = b.height;
    if (ratio) [w, h] = fitRatio(w, h, ratio);
    setSel({ x: (b.width - w) / 2, y: (b.height - h) / 2, w, h });
  }

  // ----- Aniq piksel kiritish -----
  const s = imgRef.current ? scale() : 1;
  const real = sel
    ? { x: Math.round(sel.x * s), y: Math.round(sel.y * s), w: Math.round(sel.w * s), h: Math.round(sel.h * s) }
    : null;

  function setReal(key: "x" | "y" | "w" | "h", val: number) {
    if (!sel) return;
    const b = bounds();
    const sc = scale();
    let { x, y, w, h } = sel;
    if (key === "x") x = clamp(val / sc, 0, b.width - w);
    if (key === "y") y = clamp(val / sc, 0, b.height - h);
    if (key === "w") w = clamp(val / sc, 10, b.width - x);
    if (key === "h") h = clamp(val / sc, 10, b.height - y);
    setSel({ x, y, w, h });
    setPreset(null);
  }

  // ----- Kesish -----
  async function applyCrop() {
    if (!sel || !imgRef.current) {
      toast.error("Please select an area first.");
      return;
    }
    setBusy(true);
    try {
      const img = imgRef.current;
      const sc = scale();
      // Preset tanlangan bo'lsa — AYNAN shu pikselda chiqaramiz
      const outW = preset ? preset.w : Math.max(1, Math.round(sel.w * sc));
      const outH = preset ? preset.h : Math.max(1, Math.round(sel.h * sc));
      const canvas = document.createElement("canvas");
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, sel.x * sc, sel.y * sc, sel.w * sc, sel.h * sc, 0, 0, outW, outH);
      onImageChange(canvas.toDataURL("image/png"));
      setSel(null);
      setPreset(null);
      toast.success(preset ? `Cropped to ${preset.w}×${preset.h}px!` : "Cropped!");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ===== 🆕 SOCIAL PRESETLAR ===== */}
      <div className="flex flex-wrap justify-center gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => applyPreset(p)}
            title={`${p.w}×${p.h}px`}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition ${
              preset?.label === p.label
                ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-purple-500/20"
                : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 dark:border-white/15 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" /> {p.label}
          </button>
        ))}
      </div>

      {/* ===== RATIO TUGMALARI ===== */}
      <div className="flex flex-wrap justify-center gap-2">
        {RATIOS.map((r) => (
          <button
            key={r.label}
            title={r.hint}
            onClick={() => changeRatio(r.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              ratio === r.value && !preset
                ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-purple-500/20"
                : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 dark:border-white/15 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        Drag to select • drag inside to move • pull corners to resize ✂️
      </p>

      {/* ===== RASM + TANLOV QATLAMI ===== */}
      <div className="relative mx-auto inline-block overflow-hidden rounded-xl">
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

        {sel && sel.w > 0 && sel.h > 0 && (
          <div
            className="pointer-events-none absolute rounded-sm border-2 border-purple-500 shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]"
            style={{ left: sel.x, top: sel.y, width: sel.w, height: sel.h }}
          >
            {/* Rule of thirds */}
            <span className="absolute left-1/3 top-0 h-full w-px bg-white/40" />
            <span className="absolute left-2/3 top-0 h-full w-px bg-white/40" />
            <span className="absolute left-0 top-1/3 h-px w-full bg-white/40" />
            <span className="absolute left-0 top-2/3 h-px w-full bg-white/40" />
            {/* 🆕 Burchak dastalari */}
            <span className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-sm border-2 border-white bg-purple-500" />
            <span className="absolute -right-1.5 -top-1.5 h-3 w-3 rounded-sm border-2 border-white bg-purple-500" />
            <span className="absolute -bottom-1.5 -left-1.5 h-3 w-3 rounded-sm border-2 border-white bg-purple-500" />
            <span className="absolute -bottom-1.5 -right-1.5 h-3 w-3 rounded-sm border-2 border-white bg-purple-500" />
          </div>
        )}
      </div>

      {/* ===== 🆕 ANIQ PIKSEL KIRITISH ===== */}
      {real && (
        <div className="mx-auto grid w-fit grid-cols-4 gap-2">
          {(["x", "y", "w", "h"] as const).map((k) => (
            <div key={k} className="flex flex-col gap-1">
              <Label className="text-xs uppercase text-zinc-500 dark:text-zinc-400">{k} (px)</Label>
              <Input
                type="number"
                value={real[k]}
                onChange={(e) => setReal(k, Number(e.target.value))}
                className="h-9 w-20"
              />
            </div>
          ))}
        </div>
      )}

      {/* ===== TUGMALAR ===== */}
      <div className="mx-auto flex flex-wrap justify-center gap-2">
        <Button onClick={applyCrop} disabled={busy || !sel} className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:opacity-90">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CropIcon className="h-4 w-4" />}
          Crop{preset ? ` ${preset.w}×${preset.h}` : ""}
        </Button>
        <Button variant="outline" onClick={selectAll} className="dark:border-white/15 dark:bg-transparent dark:text-zinc-200">
          <Maximize2 className="h-4 w-4" /> Select All
        </Button>
        <Button variant="outline" onClick={() => { setSel(null); setPreset(null); }} className="dark:border-white/15 dark:bg-transparent dark:text-zinc-200">
          <X className="h-4 w-4" /> Clear
        </Button>
        <Button variant="outline" onClick={() => downloadImage(imageUrl, "king-gen-ai.png")} className="dark:border-white/15 dark:bg-transparent dark:text-zinc-200">
          <Download className="h-4 w-4" /> Download
        </Button>
      </div>
    </div>
  );
}