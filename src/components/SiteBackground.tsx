"use client";

import dynamic from "next/dynamic";

const LightRays = dynamic(() => import("@/components/LightRays"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#0B0F19]" />,
});

export interface SiteBackgroundProps {
  interactive?: boolean;
  opacity?: number;
  className?: string;
}

export default function SiteBackground({
  interactive = true,
  opacity = 0.85,
  className = "",
}: SiteBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-0 pointer-events-none bg-[#0B0F19] overflow-hidden ${className}`.trim()}
    >
      {/* Ambient top spotlight glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-white/10 via-slate-400/5 to-transparent blur-[120px] pointer-events-none" />

      {/* Pure White Spotlight LightRays by React Bits */}
      <div className="absolute inset-0" style={{ opacity }}>
        <LightRays
          raysOrigin="top-center"
          raysColor="#FFFFFF"
          raysSpeed={0.8}
          lightSpread={0.7}
          rayLength={1.6}
          followMouse={interactive}
          mouseInfluence={0.15}
          noiseAmount={0.04}
          distortion={0.03}
        />
      </div>
    </div>
  );
}
