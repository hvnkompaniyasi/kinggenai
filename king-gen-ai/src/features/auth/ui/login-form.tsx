// =============================================
// LOGIN FORM — email + parol bilan kirish
// =============================================
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, LogIn } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Kirish funksiyasi
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Supabase orqali tekshiramiz
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message); // Aniq xatolik xabari (ingliz tilida)
      setLoading(false);
      return;
    }

    toast.success("Welcome back! 👑");
    router.push("/"); // Bosh sahifaga qaytamiz
    router.refresh();
  }

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="mt-2 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:opacity-90"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LogIn className="h-4 w-4" />
        )}
        Log In
      </Button>

      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-purple-500 hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}