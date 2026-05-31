/**
 * Full demo dataset for PVMS manual + API testing.
 * Run: npm run seed:demo
 */
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/User.js";
import Property from "../models/Property.js";
import Violation from "../models/Violation.js";
import Payment from "../models/Payment.js";
import Notification from "../models/Notification.js";

dotenv.config();

const TEST_PASSWORD = "password123";
const TEST_EMAILS = [
  "citizen@pvms.test",
  "owner@pvms.test",
  "owner2@pvms.test",
  "officer@pvms.test",
  "admin@pvms.test",
  "pending.citizen@pvms.test",
  "pending.owner@pvms.test",
  "citizen@test.com",
  "owner@test.com",
  "officer@test.com",
];

const propertyGeo = (lat, lng) => ({
  latitude: lat,
  longitude: lng,
  locationGeo: { type: "Point", coordinates: [lng, lat] },
});

const violationGeo = (lat, lng) => ({
  location: { latitude: lat, longitude: lng },
  locationGeo: { type: "Point", coordinates: [lng, lat] },
});

async function seedDemoData() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const hashed = await bcrypt.hash(TEST_PASSWORD, 10);

  await User.deleteMany({ email: { $in: TEST_EMAILS } });
  const existingViolations = await Violation.find({
    description: { $regex: /^(\[DEMO\]|Garbage dumping|Loud music)/ },
  }).select("_id");
  const demoViolationIds = existingViolations.map((v) => v._id);
  if (demoViolationIds.length) {
    await Payment.deleteMany({ violation: { $in: demoViolationIds } });
    await Notification.deleteMany({ title: { $regex: /^\[DEMO\]/ } });
    await Violation.deleteMany({ _id: { $in: demoViolationIds } });
  }
  await Property.deleteMany({ permitNumber: { $regex: /^PVMS-DEMO-/ } });

  const officer = await User.create({
    name: "Demo Officer",
    email: "officer@pvms.test",
    password: hashed,
    role: "OFFICER",
    approved: true,
    phone: "9000000001",
  });

  await User.create({
    name: "Demo Admin",
    email: "admin@pvms.test",
    password: hashed,
    role: "ADMIN",
    approved: true,
    phone: "9000000005",
  });

  const citizen = await User.create({
    name: "Demo Citizen",
    email: "citizen@pvms.test",
    password: hashed,
    role: "CITIZEN",
    approved: true,
    approvedBy: officer._id,
    phone: "9000000002",
    address: "Ward 12, Thane",
  });

  const owner = await User.create({
    name: "Demo Owner",
    email: "owner@pvms.test",
    password: hashed,
    role: "PERMIT_HOLDER",
    approved: true,
    approvedBy: officer._id,
    phone: "9000000003",
    address: "Shop 4, Station Road, Thane",
  });

  const owner2 = await User.create({
    name: "Demo Owner Two",
    email: "owner2@pvms.test",
    password: hashed,
    role: "PERMIT_HOLDER",
    approved: true,
    approvedBy: officer._id,
    phone: "9000000004",
  });

  await User.create([
    {
      name: "Pending Citizen",
      email: "pending.citizen@pvms.test",
      password: hashed,
      role: "CITIZEN",
      approved: false,
      phone: "9000000010",
    },
    {
      name: "Pending Owner",
      email: "pending.owner@pvms.test",
      password: hashed,
      role: "PERMIT_HOLDER",
      approved: false,
      phone: "9000000011",
    },
  ]);

  // Legacy test.com accounts (approved)
  await User.create([
    {
      name: "Test Citizen",
      email: "citizen@test.com",
      password: hashed,
      role: "CITIZEN",
      approved: true,
      approvedBy: officer._id,
    },
    {
      name: "Test Owner",
      email: "owner@test.com",
      password: hashed,
      role: "PERMIT_HOLDER",
      approved: true,
      approvedBy: officer._id,
    },
    {
      name: "Test Officer",
      email: "officer@test.com",
      password: hashed,
      role: "OFFICER",
      approved: true,
    },
  ]);

  const now = new Date();
  const nextYear = new Date(now);
  nextYear.setFullYear(nextYear.getFullYear() + 1);

  const shop = await Property.create({
    owner: owner._id,
    propertyName: "Demo Kirana Shop",
    propertyType: "Shop",
    address: "12 Station Road, Thane",
    wardNumber: "12",
    zone: "Central",
    permitNumber: "PVMS-DEMO-001",
    permitValidFrom: now,
    permitValidTo: nextYear,
    status: "ACTIVE",
    approvedBy: officer._id,
    approvalDate: now,
    ...propertyGeo(19.197, 72.963),
  });

  const industry = await Property.create({
    owner: owner._id,
    propertyName: "Demo Small Industry",
    propertyType: "Industry",
    address: "Plot 8 MIDC Road, Thane",
    wardNumber: "8",
    zone: "Industrial",
    permitNumber: "PVMS-DEMO-002",
    permitValidFrom: now,
    permitValidTo: nextYear,
    status: "ACTIVE",
    approvedBy: officer._id,
    approvalDate: now,
    ...propertyGeo(19.199, 72.965),
  });

  await Property.create({
    owner: owner2._id,
    propertyName: "Demo Residence",
    propertyType: "Residence",
    address: "Flat 302 Green Heights, Thane",
    wardNumber: "5",
    zone: "Residential",
    permitNumber: "PVMS-DEMO-003",
    permitValidFrom: now,
    permitValidTo: nextYear,
    status: "ACTIVE",
    approvedBy: officer._id,
    approvalDate: now,
    ...propertyGeo(19.201, 72.967),
  });

  const pendingProperty = await Property.create({
    owner: owner._id,
    propertyName: "Demo Pending Warehouse",
    propertyType: "Industry",
    address: "Warehouse 2, Thane",
    wardNumber: "9",
    zone: "Industrial",
    permitNumber: "PVMS-DEMO-PENDING",
    permitValidFrom: now,
    permitValidTo: nextYear,
    status: "PENDING_APPROVAL",
    ...propertyGeo(19.203, 72.969),
  });

  const baseDecision = {
    decision: "FINE",
    amount: 2500,
    ruleApplied: "WASTE-002",
    ruleSnapshot: {
      title: "Garbage dumping",
      act: "Municipal Act",
      section: "45",
      authority: "Municipal Corporation",
      severity: "MEDIUM",
    },
    requiresHuman: false,
  };

  const violations = await Violation.insertMany([
    {
      reportedBy: citizen._id,
      relatedProperty: shop._id,
      violationType: "WASTE-002",
      description: "[DEMO] Garbage dumped outside shop entrance",
      status: "AWAITING_OWNER",
      decision: baseDecision,
      ...violationGeo(19.1972, 72.9632),
    },
    {
      reportedBy: citizen._id,
      relatedProperty: industry._id,
      violationType: "NOISE-001",
      description: "[DEMO] Loud machinery after 10 PM",
      status: "OBJECTED",
      objectionReason: "Equipment was under scheduled maintenance with municipal notice.",
      decision: { ...baseDecision, amount: 5000, ruleApplied: "NOISE-001" },
      ...violationGeo(19.1992, 72.9652),
    },
    {
      reportedBy: citizen._id,
      violationType: "SIGN-001",
      description: "[DEMO] Unauthorized hoarding on public land",
      status: "REPORTED",
      decision: { ...baseDecision, amount: 1500, ruleApplied: "SIGN-001" },
      ...violationGeo(19.198, 72.964),
    },
    {
      reportedBy: citizen._id,
      relatedProperty: shop._id,
      violationType: "WASTE-002",
      description: "[DEMO] Repeat waste violation (fine multiplier test)",
      status: "CLOSED",
      decision: { ...baseDecision, amount: 5000 },
      ...violationGeo(19.1975, 72.9635),
    },
    {
      reportedBy: citizen._id,
      relatedProperty: industry._id,
      violationType: "WATER-001",
      description: "[DEMO] Auto-decided water misuse",
      status: "AUTO_DECIDED",
      decision: { ...baseDecision, amount: 3000, ruleApplied: "WATER-001" },
      ...violationGeo(19.1995, 72.9655),
    },
  ]);

  const objected = violations.find((v) => v.status === "OBJECTED");
  const closed = violations.find((v) => v.status === "CLOSED");

  await Payment.create({
    violation: closed._id,
    payer: owner._id,
    amount: 5000,
    paymentMethod: "UPI",
    transactionId: `DEMO-TXN-${Date.now()}`,
    status: "COMPLETED",
  });

  await Notification.insertMany([
    {
      recipient: owner._id,
      type: "PAYMENT_DUE",
      title: "[DEMO] Fine payment due",
      message: "A fine of ₹2500 is due for violation at Demo Kirana Shop.",
      link: "/owner/violations",
      relatedEntity: { entityType: "VIOLATION", entityId: violations[0]._id },
    },
    {
      recipient: owner._id,
      type: "VIOLATION_STATUS_CHANGED",
      title: "[DEMO] Objection under review",
      message: "Your objection for loud machinery violation is being reviewed.",
      link: "/owner/violations",
      relatedEntity: { entityType: "VIOLATION", entityId: objected._id },
    },
    {
      recipient: citizen._id,
      type: "VIOLATION_REPORTED",
      title: "[DEMO] Report received",
      message: "Your violation report has been logged successfully.",
      read: true,
    },
  ]);

  console.log("\n✅ Demo data seeded successfully\n");
  console.log("── Test accounts (password for all: password123) ──");
  console.log("Citizen (approved):  citizen@pvms.test");
  console.log("Owner (approved):    owner@pvms.test");
  console.log("Owner 2:             owner2@pvms.test");
  console.log("Officer:             officer@pvms.test");
  console.log("Admin:               admin@pvms.test");
  console.log("Pending citizen:     pending.citizen@pvms.test (cannot login)");
  console.log("Pending owner:       pending.owner@pvms.test (cannot login)");
  console.log("\nLegacy: citizen@test.com / owner@test.com / officer@test.com");
  console.log(`\nProperties: 3 active + 1 pending (${pendingProperty.permitNumber})`);
  console.log(`Violations: ${violations.length} demo cases (AWAITING_OWNER, OBJECTED, REPORTED, CLOSED, AUTO_DECIDED)`);
  console.log("\nPortal: http://localhost:5173/test-info");
  console.log("Docs:  docs/USER-MANUAL.md, docs/TESTING.md\n");

  await mongoose.disconnect();
}

seedDemoData().catch((err) => {
  console.error(err);
  process.exit(1);
});
