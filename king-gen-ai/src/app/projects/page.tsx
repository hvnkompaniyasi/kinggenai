// =============================================
// PROJECTS — foydalanuvchi loyihalari (Canva uslubida)
// Barcha yuklab olingan rasmlar shu yerda
// =============================================
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, Download, Trash2, Loader2, Wand2 } from "lucide-react";

type Project = {
  id: string;
  name: string;
  url: string;
  size: number;
  format: string;
  created_at: string;
};

export default function ProjectsPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);

  // Login tekshiruvi + loyihalarni yuklash
  useEffect(() => {
    async function init() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/login");
        return;
      }
      const { data: rows } = await supabase
        .from("images")
        .select("*")
        .eq("user_id", data.session.user.id)
        .order("created_at", { ascending: false });
      if (rows) setProjects(rows as Project[]);
      setChecking(false);
    }
    init();
  }, [router]);

  // Loyihani o'chirish (storage + baza)
  async function remove(p: Project) {
    const path = p.url.split("/images/")[1];
    if (path) await supabase.storage.from("images").remove([path]);
    const { error } = await supabase.from("images").delete().eq("id", p.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    setProjects((prev) => prev.filter((x) => x.id !== p.id));
    toast.success("Project deleted.");
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-white">
      {/* ===== HEADER ===== */}
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
          <Link href="/editor">
            <Button size="sm" className="rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:opacity-90">
              <Wand2 className="h-4 w-4" /> Open Editor
            </Button>
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-10">
        {/* Sarlavha */}
        <div className="mb-8 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <h1 className="text-2xl font-extrabold sm:text-3xl">My Projects</h1>
          <span className="rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-2.5 py-0.5 text-xs font-bold text-white">
            {projects.length}
          </span>
        </div>

        {projects.length === 0 ? (
          /* ----- BO'SH HOLAT ----- */
          <div className="flex flex-col items-center gap-4 rounded-3xl border-2 border-dashed border-zinc-300 px-6 py-20 text-center dark:border-white/15">
            <span className="rounded-2xl bg-gradient-to-br from-cyan-500/15 to-purple-500/15 p-4 text-purple-500 dark:text-cyan-300">
              <Wand2 className="h-10 w-10" />
            </span>
            <p className="text-lg font-semibold">No projects yet</p>
            <p className="max-w-md text-sm text-zinc-500 dark:text-zinc-400">
              Create your first magic! Every image you download from the editor
              is saved here automatically.
            </p>
            <Link href="/editor">
              <Button className="mt-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:opacity-90">
                <Wand2 className="h-4 w-4" /> Create Project
              </Button>
            </Link>
          </div>
        ) : (
          /* ----- LOYIHALAR GRIDI (Canva uslubida) ----- */
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {projects.map((p) => (
              <div
                key={p.id}
                className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10 dark:border-white/10 dark:bg-white/5"
              >
                <div className="relative aspect-square bg-zinc-100 dark:bg-zinc-900">
                  <img src={p.url} alt={p.name} className="h-full w-full object-contain" />
                  <span className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                    {p.format}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{formatDate(p.created_at)}</p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      download={p.name}
                      aria-label="Download"
                      className="rounded-full p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/10 dark:hover:text-white"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => remove(p)}
                      aria-label="Delete"
                      className="rounded-full p-2 text-zinc-500 transition hover:bg-red-500/10 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}