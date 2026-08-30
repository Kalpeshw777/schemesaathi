// Generates src/data/partners.json — a deterministic mock dataset of
// NSCFDC-style Channel Partners (banks / NBFCs / regional agencies).
// Run: node scripts/generate-partners.mjs

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Seeded RNG so the dataset is stable between regenerations
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260825);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const rangeInt = (min, max) => Math.floor(rand() * (max - min + 1)) + min;

// [state, district, lat, lng]
const DISTRICTS = [
  ["Maharashtra", "Pune", 18.5204, 73.8567],
  ["Maharashtra", "Nagpur", 21.1458, 79.0882],
  ["Maharashtra", "Mumbai", 19.076, 72.8777],
  ["Uttar Pradesh", "Lucknow", 26.8467, 80.9462],
  ["Uttar Pradesh", "Varanasi", 25.3176, 82.9739],
  ["Uttar Pradesh", "Gorakhpur", 26.7606, 83.3732],
  ["Madhya Pradesh", "Bhopal", 23.2599, 77.4126],
  ["Madhya Pradesh", "Indore", 22.7196, 75.8577],
  ["Madhya Pradesh", "Jabalpur", 23.1815, 79.9864],
  ["Bihar", "Patna", 25.5941, 85.1376],
  ["Bihar", "Gaya", 24.7914, 85.0002],
  ["Bihar", "Muzaffarpur", 26.1209, 85.3647],
  ["Tamil Nadu", "Chennai", 13.0827, 80.2707],
  ["Tamil Nadu", "Madurai", 9.9252, 78.1198],
  ["Tamil Nadu", "Coimbatore", 11.0168, 76.9558],
  ["Karnataka", "Bengaluru", 12.9716, 77.5946],
  ["Karnataka", "Mysuru", 12.2958, 76.6394],
  ["Karnataka", "Kalaburagi", 17.3297, 76.8343],
  ["Rajasthan", "Jaipur", 26.9124, 75.7873],
  ["Rajasthan", "Jodhpur", 26.2389, 73.0243],
  ["Rajasthan", "Kota", 25.2138, 75.8648],
  ["West Bengal", "Kolkata", 22.5726, 88.3639],
  ["West Bengal", "Siliguri", 26.7271, 88.3953],
  ["West Bengal", "Bardhaman", 23.2324, 87.8615],
  ["Punjab", "Ludhiana", 30.901, 75.8573],
  ["Punjab", "Amritsar", 31.634, 74.8723],
  ["Punjab", "Patiala", 30.3398, 76.3869],
  ["Andhra Pradesh", "Vijayawada", 16.5062, 80.648],
  ["Andhra Pradesh", "Visakhapatnam", 17.6868, 83.2185],
  ["Andhra Pradesh", "Tirupati", 13.6288, 79.4192],
  ["Gujarat", "Ahmedabad", 23.0225, 72.5714],
  ["Gujarat", "Surat", 21.1702, 72.8311],
  ["Gujarat", "Rajkot", 22.3039, 70.8022],
  ["Telangana", "Hyderabad", 17.385, 78.4867],
  ["Telangana", "Warangal", 17.9689, 79.5941],
  ["Telangana", "Nizamabad", 18.6725, 78.0941],
];

const PSB = [
  "State Bank of India",
  "Punjab National Bank",
  "Bank of Baroda",
  "Canara Bank",
  "Union Bank of India",
  "Bank of India",
  "Indian Bank",
  "Central Bank of India",
  "UCO Bank",
  "Bank of Maharashtra",
  "Punjab & Sind Bank",
];
const PRIVATE_BANK = [
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "IDFC FIRST Bank",
  "IndusInd Bank",
  "Yes Bank",
];
const NBFC = [
  "Muthoot Finance",
  "Manappuram Finance",
  "Bajaj Finserv",
  "Shriram Finance",
  "Mahindra Finance",
  "L&T Finance",
  "HDB Financial Services",
  "IIFL Finance",
  "CreditAccess Grameen",
  "Spandana Sphoorty",
  "Arohan Financial Services",
  "Satin Creditcare",
];
const LANDMARKS = [
  "Bus Stand",
  "Railway Station",
  "Collectorate",
  "Main Market",
  "Civil Hospital",
  "Court Road",
  "Industrial Area",
  "Old Post Office",
];
const AREAS = [
  "MG Road",
  "Gandhi Nagar",
  "Station Road",
  "Nehru Marg",
  "Subhash Chowk",
  "Ambedkar Chowk",
  "Market Yard",
  "Cantonment Area",
];

const ALL_SCHEMES = ["micro-finance", "term-loan", "education-loan"];
const MICRO_TERM = ["micro-finance", "term-loan"];

function makePartner(state, district, lat, lng, idxInDistrict, dIdx) {
  const roll = rand();
  let type, name, schemes, npaBase;
  if (roll < 0.38) {
    type = "public-sector-bank";
    name = `${pick(PSB)}, ${district} Main Branch`;
    schemes = rand() < 0.75 ? [...ALL_SCHEMES] : MICRO_TERM;
    npaBase = [3, 12];
  } else if (roll < 0.55) {
    type = "private-bank";
    name = `${pick(PRIVATE_BANK)}, ${district}`;
    schemes = rand() < 0.5 ? [...ALL_SCHEMES] : MICRO_TERM;
    npaBase = [2, 8];
  } else if (roll < 0.8) {
    type = "nbfc";
    name = `${pick(NBFC)} — ${district}`;
    schemes = rand() < 0.6 ? MICRO_TERM : ["micro-finance"];
    npaBase = [4, 18];
  } else if (roll < 0.92) {
    type = "regional-agency";
    name = `${state} SC/ST Development Corporation (${district})`;
    schemes = [...ALL_SCHEMES];
    npaBase = [2, 10];
  } else {
    type = "cooperative";
    name = `${district} District Co-operative Bank`;
    schemes = rand() < 0.7 ? ["micro-finance"] : MICRO_TERM;
    npaBase = [5, 15];
  }

  const npaPercent = Math.round((npaBase[0] + rand() * (npaBase[1] - npaBase[0])) * 10) / 10;
  const jitterLat = (rand() - 0.5) * 0.6;
  const jitterLng = (rand() - 0.5) * 0.6;

  return {
    id: `CP${String(dIdx * 10 + idxInDistrict + 1).padStart(4, "0")}`,
    name,
    type,
    schemes,
    npaPercent,
    address: `Plot ${rangeInt(1, 250)}, ${pick(AREAS)}, near ${pick(LANDMARKS)}`,
    city: district,
    district,
    state,
    pincode: String(110000 + dIdx * 997 + rangeInt(1, 900)),
    phone: `+91 ${rangeInt(70, 99)}${rangeInt(10000000, 99999999)}`,
    lat: Math.round((lat + jitterLat) * 10000) / 10000,
    lng: Math.round((lng + jitterLng) * 10000) / 10000,
  };
}

const partners = [];
DISTRICTS.forEach(([state, district, lat, lng], dIdx) => {
  const count = rangeInt(4, 7);
  for (let i = 0; i < count; i++) {
    partners.push(makePartner(state, district, lat, lng, i, dIdx));
  }
});

const outPath = join(__dirname, "..", "src", "data", "partners.json");
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(partners, null, 2));
console.log(`Wrote ${partners.length} partners -> ${outPath}`);
