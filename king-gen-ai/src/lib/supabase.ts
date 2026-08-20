// =============================================
// Supabase klienti — bazaga ulanish
// Kalitlar .env.local dan o'qiladi (hardcode YO'Q!)
// =============================================
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Kalitlar yo'q bo'lsa — aniq xatolik ko'rsatamiz
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase kalitlari topilmadi! .env.local faylini tekshiring.");
}

// Baza bilan ishlaydigan asosiy obyekt
export const supabase = createClient(supabaseUrl, supabaseAnonKey);