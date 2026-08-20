// LOGIN SAHIFASI
import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/ui/login-form";

export const metadata: Metadata = {
  title: "Log in — King Gen AI",
};

export default function LoginPage() {
  return <LoginForm />;
}