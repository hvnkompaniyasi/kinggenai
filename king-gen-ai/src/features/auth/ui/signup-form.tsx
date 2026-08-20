// =============================================
// SIGNUP FORM — ro'yxatdan o'tish
// Ro'yxatdan o'tgach /editor ga o'tadi
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
import { Loader2, UserPlus } from "lucide-react";

export function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Ro'yxatdan o'tish funksiyasi
  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    // Sessiya bor — darhol kirgan
    if (data.session) {
      toast.success("Account created! 🎉");
      router.push("/editor"); // 🆕 Editorga o'tamiz
      router.refresh();
      return;
    }

    // Email tasdiqlash yoqilgan — xatni tekshirishni aytamiz
    toast.info("Check your email to confirm your account.");
    setLoading(false);
  }

  return (
    <form onSubmit={handleSignup} className="flex flex-col gap-4">
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
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
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
          <UserPlus className="h-4 w-4" />
        )}
        Sign Up
      </Button>

      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-purple-500 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}