"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useJourney } from "@/context/JourneyContext";
import { useTranslation } from "@/context/LanguageContext";
import { amortizationSchedule, totals } from "@/lib/emi";
import { formatINR } from "@/lib/format";
import type { Recommendation } from "@/lib/types";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import SiteBackground from "@/components/SiteBackground";

export default function CalculatorPage() {
  const { recommendation, ready } = useJourney();
  const { t } = useTranslation();

  if (!ready) {
    return (
      <div className="relative min-h-screen text-white flex items-center justify-center py-32 bg-[#0B0F19]" style={{ color: "#FFFFFF" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#F97316]/20 border-t-[#F97316]" />
          <p className="text-sm font-bold text-[#FED7AA]" style={{ color: "#FED7AA" }}>Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden py-8 sm:py-12 bg-[#0B0F19]" style={{ color: "#FFFFFF" }}>
      {/* Dark Ambient Background with DotGrid Texture */}
      <SiteBackground interactive={false} />

      {/* Foreground Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-3.5 sm:px-4">
        <div className="text-center sm:text-left">
          <span className="inline-block rounded-full liquid-glass-active px-3.5 py-1 text-xs font-bold tracking-wide text-[#FED7AA] uppercase shadow-lg shadow-orange-950/30" style={{ color: "#FED7AA" }}>
            {t("calc_tag")}
          </span>
          <h1 className="mt-2.5 text-2xl sm:text-3xl font-extrabold text-white tracking-tight md:text-4xl" style={{ color: "#FFFFFF" }}>
            {t("calc_title")}
          </h1>
          {recommendation ? (
            <p className="mt-1 text-xs sm:text-sm text-slate-200 font-medium" style={{ color: "#E2E8F0" }}>
              {t("calc_sub_rec")} (<b className="text-[#FED7AA] font-bold" style={{ color: "#FED7AA" }}>{recommendation.schemeName}</b>)
            </p>
          ) : (
            <p className="mt-2.5 rounded-2xl liquid-glass p-3.5 text-xs sm:text-sm text-[#FED7AA] backdrop-blur-md" style={{ color: "#FED7AA" }}>
              {t("calc_sub_rec")}{" "}
              <Link href="/wizard" className="font-bold underline text-white hover:text-[#F97316]" style={{ color: "#FFFFFF" }}>
                {t("nav_wizard")}
              </Link>
            </p>
          )}
        </div>

        {recommendation ? (
          <CalculatorForm
            key={`${recommendation.schemeId}-${recommendation.eligibleAmount}-${recommendation.interestRate}`}
            rec={recommendation}
          />
        ) : (
          <CalculatorForm />
        )}
      </div>
    </div>
  );
}

function CalculatorForm({ rec }: { rec?: Recommendation }) {
  const { t } = useTranslation();
  const [amount, setAmount] = useState(rec?.eligibleAmount ?? 500000);
  const [rate, setRate] = useState(rec?.interestRate ?? 8);
  const [tenureMonths, setTenureMonths] = useState(rec?.maxTenureMonths ?? 60);
  const [moratorium, setMoratorium] = useState(rec?.moratoriumMonths ?? 6);
  const [payMoratoriumInterest, setPayMoratoriumInterest] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const rows = useMemo(
    () => amortizationSchedule(amount, rate, tenureMonths, moratorium, payMoratoriumInterest),
    [amount, rate, tenureMonths, moratorium, payMoratoriumInterest]
  );
  const { totalInterest, totalPayment, regularEmi } = totals(rows);
  const interestShare =
    totalPayment > 0 ? Math.round((totalInterest / totalPayment) * 100) : 0;
  const visibleRows = expanded ? rows : rows.slice(0, 12);

  const donutData = [
    { name: t("calc_principal"), value: amount, fill: "#F97316" },
    { name: t("calc_total_interest"), value: totalInterest, fill: "#1E3A5F" },
  ];

  return (
    <div className="mt-6 sm:mt-8 grid gap-5 sm:gap-6 lg:grid-cols-[1fr_380px]">
      {/* Controls Card with Liquid Glass */}
      <div className="space-y-5 sm:space-y-7 rounded-3xl liquid-glass p-5 sm:p-7 md:p-8 shadow-2xl">
        {[
          {
            label: t("calc_loan_amt"),
            value: formatINR(amount),
            min: 10000,
            max: 5000000,
            step: 10000,
            val: amount,
            set: setAmount,
          },
          {
            label: t("calc_rate"),
            value: `${rate}% p.a.`,
            min: 4,
            max: 18,
            step: 0.5,
            val: rate,
            set: setRate,
          },
          {
            label: t("calc_tenure"),
            value: `${tenureMonths} mo (${(tenureMonths / 12).toFixed(1)} yr)`,
            min: 12,
            max: 180,
            step: 6,
            val: tenureMonths,
            set: setTenureMonths,
          },
          {
            label: t("calc_moratorium"),
            value: `${moratorium} months`,
            min: 0,
            max: 36,
            step: 3,
            val: moratorium,
            set: setMoratorium,
          },
        ].map((ctrl) => (
          <div key={ctrl.label} className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-white" style={{ color: "#FFFFFF" }}>
              <span className="text-slate-100">{ctrl.label}</span>
              <span className="font-mono text-base font-extrabold text-[#F97316]" style={{ color: "#F97316" }}>
                {ctrl.value}
              </span>
            </div>
            <input
              type="range"
              min={ctrl.min}
              max={ctrl.max}
              step={ctrl.step}
              value={ctrl.val}
              onChange={(e) => ctrl.set(Number(e.target.value))}
              className="w-full accent-[#F97316] cursor-pointer h-2 bg-white/10 rounded-lg"
            />
          </div>
        ))}

        {/* Moratorium Switch */}
        {moratorium > 0 && (
          <label className="flex items-start gap-3 rounded-2xl liquid-glass-inner p-3.5 sm:p-4 text-xs cursor-pointer border border-white/10 hover:border-[#F97316]/40 transition">
            <input
              type="checkbox"
              checked={payMoratoriumInterest}
              onChange={(e) => setPayMoratoriumInterest(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded accent-[#F97316] flex-none"
            />
            <div className="leading-snug">
              <p className="font-bold text-white text-xs sm:text-sm" style={{ color: "#FFFFFF" }}>
                {t("calc_moratorium_check")}
              </p>
              <p className="text-[11px] text-slate-300 font-medium mt-0.5" style={{ color: "#CBD5E1" }}>
                {t("calc_moratorium_hint")}
              </p>
            </div>
          </label>
        )}
      </div>

      {/* Results Summary Card with Liquid Glass */}
      <div className="space-y-5 rounded-3xl liquid-glass p-5 sm:p-7 md:p-8 shadow-2xl flex flex-col justify-between">
        <div>
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#FED7AA]" style={{ color: "#FED7AA" }}>
            {t("calc_monthly_emi")}
          </p>
          <p className="mt-1 text-3xl sm:text-4xl font-black text-[#F97316] tracking-tight" style={{ color: "#F97316" }}>
            {formatINR(regularEmi)}
            <span className="text-xs sm:text-sm font-bold text-slate-300"> / month</span>
          </p>
          {moratorium > 0 && (
            <p className="mt-1 text-[11px] sm:text-xs text-slate-200 font-medium" style={{ color: "#E2E8F0" }}>
              {t("calc_grace_emi")} ({moratorium} mo grace)
            </p>
          )}

          {/* Breakdown Pills */}
          <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-2xl liquid-glass-inner p-3">
              <span className="text-[11px] text-slate-300 font-medium block" style={{ color: "#CBD5E1" }}>{t("calc_principal")}</span>
              <span className="text-sm font-bold text-white" style={{ color: "#FFFFFF" }}>{formatINR(amount)}</span>
            </div>
            <div className="rounded-2xl liquid-glass-inner p-3">
              <span className="text-[11px] text-slate-300 font-medium block" style={{ color: "#CBD5E1" }}>{t("calc_total_interest")}</span>
              <span className="text-sm font-bold text-[#FED7AA]" style={{ color: "#FED7AA" }}>{formatINR(totalInterest)}</span>
            </div>
          </div>

          <div className="mt-3 rounded-2xl liquid-glass-inner p-3.5 text-xs flex justify-between items-center">
            <span className="text-slate-200 font-bold" style={{ color: "#E2E8F0" }}>{t("calc_total_repayment")}</span>
            <span className="text-base font-black text-white" style={{ color: "#FFFFFF" }}>{formatINR(totalPayment)}</span>
          </div>

          {/* Chart */}
          <div className="mt-4 h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} stroke="rgba(255,255,255,0.1)" />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => formatINR(val)}
                  contentStyle={{
                    backgroundColor: "#131B2E",
                    borderColor: "rgba(255,255,255,0.15)",
                    borderRadius: "12px",
                    color: "#FFFFFF",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <Link
          href="/locator"
          className="w-full text-center rounded-xl bg-[#F97316] py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:bg-[#EA580C] hover:scale-[1.02]"
          style={{ color: "#FFFFFF" }}
        >
          {t("calc_find_apply")}
        </Link>
      </div>

      {/* Amortization Table */}
      <div className="lg:col-span-2 rounded-3xl liquid-glass p-5 sm:p-7 shadow-2xl">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between text-left font-bold text-white text-sm sm:text-base py-1"
          style={{ color: "#FFFFFF" }}
        >
          <span>📋 {t("calc_repay_sched")} ({rows.length} mo)</span>
          <span className="text-xs text-[#F97316] font-bold" style={{ color: "#F97316" }}>
            {expanded ? t("calc_less") : t("calc_expand")}
          </span>
        </button>

        {expanded && (
          <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10 liquid-glass-inner max-h-96 scrollable-touch">
            <table className="min-w-full text-xs text-left">
              <thead className="bg-[#0B0F19] text-[#FED7AA] font-bold sticky top-0" style={{ color: "#FED7AA" }}>
                <tr>
                  <th className="px-3 py-2 border-b border-white/10">Mo</th>
                  <th className="px-3 py-2 border-b border-white/10">Opening</th>
                  <th className="px-3 py-2 border-b border-white/10">Payment</th>
                  <th className="px-3 py-2 border-b border-white/10">Principal</th>
                  <th className="px-3 py-2 border-b border-white/10">Interest</th>
                  <th className="px-3 py-2 border-b border-white/10">Closing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-[#131B2E]">
                {visibleRows.map((r) => (
                  <tr key={r.month} className="hover:bg-white/5">
                    <td className="px-3 py-2 text-white font-bold" style={{ color: "#FFFFFF" }}>{r.month}</td>
                    <td className="px-3 py-2 text-slate-200" style={{ color: "#E2E8F0" }}>{formatINR(r.openingBalance)}</td>
                    <td className="px-3 py-2 text-[#FED7AA] font-bold" style={{ color: "#FED7AA" }}>{formatINR(r.emi)}</td>
                    <td className="px-3 py-2 text-slate-200" style={{ color: "#E2E8F0" }}>{formatINR(r.principal)}</td>
                    <td className="px-3 py-2 text-slate-200" style={{ color: "#E2E8F0" }}>{formatINR(r.interest)}</td>
                    <td className="px-3 py-2 text-white font-bold" style={{ color: "#FFFFFF" }}>{formatINR(r.closingBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
