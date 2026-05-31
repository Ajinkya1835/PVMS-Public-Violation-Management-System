import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs/promises";
import ViolationRule from "../models/ViolationRule.js";

dotenv.config();

const parseCsv = (text) => {
  const [headerLine, ...rows] = text.trim().split(/\r?\n/);
  const headers = headerLine.split(",");

  return rows
    .filter((row) => row.trim())
    .map((row) => {
      const values = row.split(",");
      return Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]));
    });
};

const normalizeSeverity = (value) => {
  if (!value) return "Low";
  const v = value.toLowerCase();
  if (v === "high" || v === "critical") return "High";
  if (v === "medium") return "Medium";
  return "Low";
};

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const csvText = await fs.readFile("rules.csv", "utf8");
  const rules = parseCsv(csvText);

  const docs = rules.map((r) => ({
    violation_code: r.violation_code,
    title: r.title,
    category: r.category,
    entity_type: r.entity_type.split("|"),
    act: r.act,
    section: r.section,
    authority: r.authority,
    severity: normalizeSeverity(r.severity),
    compoundable: ["yes", "true"].includes(r.compoundable.toLowerCase()),
    description: r.description,
    keywords: [r.title, r.category, r.description]
      .join(" ")
      .toLowerCase()
      .split(/\W+/)
      .filter(Boolean),
  }));

  await ViolationRule.deleteMany({});
  await ViolationRule.insertMany(docs);

  console.log(`Rules imported: ${docs.length}`);
  await mongoose.disconnect();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
