"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-md backdrop-blur-md transition hover:bg-white/20 print:hidden"
    >
      Download / Print (PDF) 📄
    </button>
  );
}
