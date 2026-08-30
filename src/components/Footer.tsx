"use client";

import { useTranslation } from "@/context/LanguageContext";

export default function Footer() {
  const { lang } = useTranslation();

  return (
    <footer className="mt-auto border-t border-white/15 bg-[#0B0F19]/90 backdrop-blur-2xl print:hidden py-8 px-4">
      <div className="mx-auto max-w-5xl text-center">
        {/* Hackathon Prototype Badge */}
        <div className="inline-flex items-center gap-2 rounded-2xl liquid-glass-active px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#FED7AA] shadow-lg shadow-orange-950/40 border border-[#F97316]/50 mb-3" style={{ color: "#FED7AA" }}>
          <span>🏛️</span>
          <span>Smart India Hackathon Prototype · SIH26092</span>
        </div>

        {/* Title */}
        <p className="text-sm sm:text-base font-black text-white" style={{ color: "#FFFFFF" }}>
          Loan<span className="text-[#F97316]">Saathi</span> — Ministry of Social Justice & Empowerment
        </p>

        {/* Detailed High-Contrast Disclaimer */}
        <div className="mt-3 mx-auto max-w-3xl rounded-2xl liquid-glass-inner p-4 border border-white/15 text-xs sm:text-sm font-semibold leading-relaxed text-slate-100 shadow-xl" style={{ color: "#F1F5F9" }}>
          {lang === "hi" ? (
            <p style={{ color: "#FFFFFF" }}>
              ⚠️ <strong className="text-[#FED7AA]" style={{ color: "#FED7AA" }}>अस्वीकरण (Disclaimer):</strong> यह वेब एप्लिकेशन स्मार्ट इंडिया हैकथॉन (SIH26092) के लिए विकसित एक प्रोटोटाइप है। सभी ऋण योजना पैरामीटर और ब्याज दरें सामाजिक न्याय और अधिकारिता मंत्रालय (NSFDC / Stand-Up India / MUDRA) के आधिकारिक दिशा-निर्देशों पर आधारित हैं। ऋण के अंतिम संवितरण से पहले कृपया अपनी अधिकृत चैनल पार्टनर बैंक शाखा से दस्तावेज़ों की पुष्टि अवश्य करें।
            </p>
          ) : lang === "mr" ? (
            <p style={{ color: "#FFFFFF" }}>
              ⚠️ <strong className="text-[#FED7AA]" style={{ color: "#FED7AA" }}>अस्वीकरण (Disclaimer):</strong> हे वेब ॲप्लिकेशन स्मार्ट इंडिया हॅकाथॉन (SIH26092) साठी विकसित केलेले प्रोटोटाइप आहे. सर्व कर्ज योजना आणि सवलतीचे व्याजदर सामाजिक न्याय आणि सक्षमीकरण मंत्रालय (NSFDC / Stand-Up India / MUDRA) च्या मार्गदर्शक तत्त्वांनुसार आहेत. अंतिम कर्ज मंजुरीपूर्वी कृपया आपल्या अधिकृत चॅनल पार्टनर बँकेत कागदपत्रांची पडताळणी करा.
            </p>
          ) : (
            <p style={{ color: "#FFFFFF" }}>
              ⚠️ <strong className="text-[#FED7AA]" style={{ color: "#FED7AA" }}>Disclaimer:</strong> This application is an official prototype developed for the Smart India Hackathon (SIH26092). All scheme parameters, concessional interest rates, and loan caps are aligned with official Ministry of Social Justice and Empowerment (NSFDC, Stand-Up India, MUDRA) guidelines. Always verify required branch documentation with your authorised Channel Partner before final sanction.
            </p>
          )}
        </div>

        <p className="mt-3 text-[11px] text-[#FED7AA] font-bold" style={{ color: "#FED7AA" }}>
          © 2026 LoanSaathi · Built with Pride for SC Entrepreneurship & Higher Education
        </p>
      </div>
    </footer>
  );
}
