import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatAssistant from "@/components/ChatAssistant";
import { JourneyProvider } from "@/context/JourneyContext";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "SchemeSaathi — Find, Calculate & Apply for SC Loan Schemes",
  description:
    "Government scheme recommendation, EMI calculator and Channel Partner locator for NSFDC-style concessional loan schemes for Scheduled Caste citizens in English, Hindi, Marathi & regional Indian languages.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0B0F19",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased overflow-x-hidden">
      <body className="min-h-full flex flex-col bg-[#0B0F19] text-white selection:bg-[#F97316] selection:text-white overflow-x-hidden w-full max-w-[100vw]">
        {/* Top Tricolor Accent Bar */}
        <div
          aria-hidden="true"
          className="fixed top-0 left-0 right-0 z-[100] h-[3px] w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] print:hidden"
        />

        <LanguageProvider>
          <JourneyProvider>
            <Header />
            <main className="flex-1 w-full max-w-[100vw] overflow-x-hidden">{children}</main>
            <Footer />
            <ChatAssistant />
          </JourneyProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
