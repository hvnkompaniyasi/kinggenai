// =============================================
// Rasmni yuklab olish (download) yordamchisi
// =============================================
export function downloadImage(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}