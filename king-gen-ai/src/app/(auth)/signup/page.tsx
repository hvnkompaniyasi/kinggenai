// SIGNUP SAHIFASI
import type { Metadata } from "next";
import { SignupForm } from "@/features/auth/ui/signup-form";

export const metadata: Metadata = {
  title: "Sign up — King Gen AI",
};

export default function SignupPage() {
  return <SignupForm />;
}