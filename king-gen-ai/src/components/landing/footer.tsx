// FOOTER — pastki qism
export function Footer() {
  return (
    <footer className="border-t border-zinc-200 px-4 py-10 dark:border-white/5">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 overflow-hidden rounded-lg bg-black">
            <img src="/logo.jpg" alt="logo" className="h-full w-full translate-y-[1.5px] object-cover" />
          </span>
          <span className="text-sm font-semibold">King Gen AI</span>
        </div>
        <p className="text-sm text-zinc-500">© 2026 King Gen AI. All rights reserved.</p>
      </div>
    </footer>
  );
}