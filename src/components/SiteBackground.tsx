"use client";

import { useTheme } from "@/context/ThemeContext";

export interface SiteBackgroundProps {
  interactive?: boolean;
  opacity?: number;
  className?: string;
}

export default function SiteBackground({
  className = "",
}: SiteBackgroundProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-0 pointer-events-none transition-colors duration-300 ${
        isDark ? "bg-[#0B0F19]" : "bg-[#F8FAFC]"
      } overflow-hidden ${className}`.trim()}
    >
      {/* Static Minimalist Ambient Top Glow */}
      <div
        className={`absolute -top-36 left-1/2 -translate-x-1/2 w-[850px] h-[400px] rounded-full blur-[140px] pointer-events-none transition-opacity duration-300 ${
          isDark
            ? "bg-gradient-to-b from-orange-500/10 via-slate-700/10 to-transparent opacity-40"
            : "bg-gradient-to-b from-orange-400/10 via-amber-200/20 to-transparent opacity-60"
        }`}
      />

      {/* Subtle Bottom Ambient Glow for depth */}
      <div
        className={`absolute -bottom-36 right-1/4 w-[600px] h-[300px] rounded-full blur-[160px] pointer-events-none transition-opacity duration-300 ${
          isDark
            ? "bg-blue-600/5 opacity-30"
            : "bg-blue-400/5 opacity-50"
        }`}
      />
    </div>
  );
}
