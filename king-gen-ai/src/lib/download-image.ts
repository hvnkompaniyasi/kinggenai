// =============================================
// DOWNLOAD + SAVE — yuklab olish VA loyihalarga saqlash
// Har bir Download = qurilmaga fayl + "My Projects" ga nusxa
// =============================================
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export async function downloadImage(url: string, filename: string) {
  // 1) Qurilmaga yuklab olish
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  // 2) Loyihalarga saqlash (faqat login bo'lganda)
  try {
    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user.id;
    if (!userId) return; // login yo'q — faqat yuklab olamiz

    const blob = await (await fetch(url)).blob();
    const ext = filename.split(".").pop() || "png";
    const path = `${userId}/${Date.now()}-${filename}`; // RLS: papka = user id

    const { error: upErr } = await supabase.storage
      .from("images")
      .upload(path, blob, { contentType: blob.type || "image/png" });
    if (upErr) throw upErr;

    const { data: pub } = supabase.storage.from("images").getPublicUrl(path);

    await supabase.from("images").insert({
      user_id: userId,
      name: filename,
      url: pub.publicUrl,
      size: blob.size,
      format: ext,
    });

    toast.success("Saved to your projects! 📁");
  } catch (err) {
    // Saqlash muvaffaqiyatsiz bo'lsa ham yuklab olish ishlayveradi
    console.error("Save to projects failed:", err);
  }
}