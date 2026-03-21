export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#11120f] text-stone-400">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="font-semibold text-stone-100 lowercase">ScanTalino.</p>
          <p className="mt-1 text-sm text-stone-400">
            Capture, preprocess, and inspect receipt text in one workspace.
          </p>
        </div>
        <div className="text-sm text-stone-500">Next.js 16 + Google Vision + operator-first UI</div>
      </div>
    </footer>
  );
}
