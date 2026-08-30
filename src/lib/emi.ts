export interface AmortizationRow {
  month: number;
  openingBalance: number;
  emi: number;
  interest: number;
  principal: number;
  closingBalance: number;
}

/** Standard reducing-balance EMI. */
export function calculateEmi(
  principal: number,
  annualRatePct: number,
  tenureMonths: number
): number {
  if (tenureMonths <= 0) return 0;
  const r = annualRatePct / 1200;
  if (r === 0) return principal / tenureMonths;
  const f = Math.pow(1 + r, tenureMonths);
  return (principal * r * f) / (f - 1);
}

export function amortizationSchedule(
  principal: number,
  annualRatePct: number,
  tenureMonths: number,
  moratoriumMonths = 0,
  payInterestDuringMoratorium = false
): AmortizationRow[] {
  const rows: AmortizationRow[] = [];
  const r = annualRatePct / 1200;
  let balance = principal;

  for (let m = 1; m <= moratoriumMonths; m++) {
    const interest = balance * r;
    if (payInterestDuringMoratorium) {
      rows.push({
        month: m,
        openingBalance: balance,
        emi: Math.round(interest),
        interest: Math.round(interest),
        principal: 0,
        closingBalance: Math.round(balance),
      });
    } else {
      balance += interest;
      rows.push({
        month: m,
        openingBalance: Math.round(balance - interest),
        emi: 0,
        interest: Math.round(interest),
        principal: 0,
        closingBalance: Math.round(balance),
      });
    }
  }

  const emi = calculateEmi(balance, annualRatePct, tenureMonths);
  for (let m = 1; m <= tenureMonths; m++) {
    const interest = balance * r;
    let principalPart = emi - interest;
    if (principalPart > balance || m === tenureMonths) principalPart = balance;
    const paidEmi = principalPart + interest;
    const opening = balance;
    balance -= principalPart;
    rows.push({
      month: moratoriumMonths + m,
      openingBalance: Math.round(opening),
      emi: Math.round(paidEmi),
      interest: Math.round(interest),
      principal: Math.round(principalPart),
      closingBalance: Math.round(balance),
    });
  }
  return rows;
}

export function totals(rows: AmortizationRow[]) {
  const totalPayment = rows.reduce((s, row) => s + row.emi, 0);
  const totalInterest = rows.reduce((s, row) => s + row.interest, 0);
  return {
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(totalPayment),
    regularEmi: rows.find((row) => row.principal > 0)?.emi ?? 0,
  };
}
