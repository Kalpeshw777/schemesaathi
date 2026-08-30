// Pushes src/data/partners.json into MongoDB.
// Usage: set MONGODB_URI in .env.local (or env), then `npm run seed`.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { MongoClient } from "mongodb";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadUri() {
  if (process.env.MONGODB_URI) return process.env.MONGODB_URI;
  try {
    const envFile = readFileSync(join(__dirname, "..", ".env.local"), "utf8");
    const line = envFile.split("\n").find((l) => l.startsWith("MONGODB_URI="));
    if (line) return line.slice("MONGODB_URI=".length).trim();
  } catch {}
  return null;
}

const uri = loadUri();
if (!uri) {
  console.error("MONGODB_URI not set. Add it to .env.local — e.g.\nMONGODB_URI=mongodb+srv://user:pass@cluster/loansaathi");
  process.exit(1);
}

const partners = JSON.parse(readFileSync(join(__dirname, "..", "src", "data", "partners.json"), "utf8"));

const client = new MongoClient(uri);
try {
  await client.connect();
  const col = client.db().collection("partners");
  await col.deleteMany({});
  const { insertedCount } = await col.insertMany(partners);
  await col.createIndex({ state: 1, district: 1 });
  console.log(`Seeded ${insertedCount} partners into ${client.db().databaseName}.partners`);
} finally {
  await client.close();
}
