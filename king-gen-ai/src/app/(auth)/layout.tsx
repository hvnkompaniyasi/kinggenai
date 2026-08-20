// AUTH LAYOUT — login/signup sahifalari uchun markazlashgan karta
export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-10 dark:bg-zinc-950">
      <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl shadow-purple-500/5 dark:border-white/10 dark:bg-zinc-900">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="flex h-14 w-14 overflow-hidden rounded-2xl bg-black">
            <img
              src="/logo.jpg"
              alt="King Gen AI logo"
              className="h-full w-full translate-y-[3px] object-cover"
            />
          </span>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            King Gen{" "}
            <span className="bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
              AI
            </span>
          </h1>
        </div>
        {children}
      </div>
    </main>
  );
}