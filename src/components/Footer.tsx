"use client";

import { useTranslation } from "@/context/LanguageContext";

export default function Footer() {
  const { lang } = useTranslation();

  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-white/15 bg-white/90 dark:bg-[#0B0F19]/90 backdrop-blur-2xl print:hidden py-8 px-4 transition-colors duration-200">
      <div className="mx-auto max-w-5xl text-center">
        {/* Hackathon Prototype Badge */}
        <div className="inline-flex items-center gap-2 rounded-2xl liquid-glass-active px-4 py-1.5 text-xs font-black uppercase tracking-wider shadow-md border border-[#F97316]/50 mb-3">
          <span>🏛️</span>
          <span>Smart India Hackathon Prototype · SIH26092</span>
        </div>

        {/* Title */}
        <p className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
          Scheme<span className="text-[#F97316]">Saathi</span> — Ministry of Social Justice & Empowerment
        </p>

        {/* Detailed High-Contrast Disclaimer */}
        <div className="mt-3 mx-auto max-w-3xl rounded-2xl liquid-glass-inner p-4 border border-slate-300 dark:border-white/15 text-xs sm:text-sm font-semibold leading-relaxed text-slate-700 dark:text-slate-100 shadow-sm dark:shadow-xl text-left sm:text-center">
          {lang === "hi" ? (
            <p>
              ⚠️ <strong className="text-[#EA580C] dark:text-[#FED7AA]">अस्वीकरण (Disclaimer):</strong> यह स्मार्ट इंडिया हैकथॉन (SIH26092) के लिए विकसित एक प्रोटोटाइप है। योजना के पैरामीटर, ब्याज दरें और ऋण सीमाएं सामाजिक न्याय और अधिकारिता मंत्रालय (NSFDC, Stand-Up India, MUDRA) के सार्वजनिक रूप से प्रकाशित दिशा-निर्देशों के अनुरूप हैं। अंतिम स्वीकृति से पहले हमेशा अपने अधिकृत चैनल पार्टनर से वर्तमान योजना विवरण और आवश्यक दस्तावेज़ों की पुष्टि करें।
            </p>
          ) : lang === "mr" ? (
            <p>
              ⚠️ <strong className="text-[#EA580C] dark:text-[#FED7AA]">अस्वीकरण (Disclaimer):</strong> हे स्मार्ट इंडिया हॅकाथॉन (SIH26092) साठी तयार केलेले प्रोटोटाइप आहे. योजनेचे नियम, व्याजदर आणि कर्जाची मर्यादा सामाजिक न्याय आणि सक्षमीकरण मंत्रालय (NSFDC, Stand-Up India, MUDRA) च्या सार्वजनिक मार्गदर्शक तत्त्वांनुसार आहेत. अंतिम कर्ज मंजुरीपूर्वी कृपया आपल्या अधिकृत चॅनल पार्टनर बँकेत चालू योजना तपशील आणि आवश्यक कागदपत्रांची खात्री करा.
            </p>
          ) : (
            <p>
              ⚠️ <strong className="text-[#EA580C] dark:text-[#FED7AA]">Disclaimer:</strong> This is a prototype built for Smart India Hackathon (SIH26092). Scheme parameters, interest rates, and loan limits are aligned with publicly published Ministry of Social Justice and Empowerment (NSFDC, Stand-Up India, MUDRA) guidelines. Always verify current scheme details and required documentation with your authorised Channel Partner before final sanction.
            </p>
          )}
        </div>

        <p className="mt-3 text-[11px] text-[#EA580C] dark:text-[#FED7AA] font-bold">
          © 2026 SchemeSaathi · Built for SC Entrepreneurship & Higher Education
        </p>
      </div>
    </footer>
  );
}
