/**
 * Import demo database from JSON files in database/data/
 * Run: npm run db:import
 */
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import User from "../models/User.js";
import Property from "../models/Property.js";
import Violation from "../models/Violation.js";
import Payment from "../models/Payment.js";
import Notification from "../models/Notification.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, "../../../database/data");

const readJson = (file) =>
  JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), "utf-8"));

const propertyGeo = (lat, lng) => ({
  latitude: lat,
  longitude: lng,
  locationGeo: { type: "Point", coordinates: [lng, lat] },
});

const violationGeo = (lat, lng) => ({
  location: { latitude: lat, longitude: lng },
  locationGeo: { type: "Point", coordinates: [lng, lat] },
});

async function importDatabase() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");
  console.log("Importing from:", DATA_DIR);

  const usersData = readJson("users.json");
  const propertiesData = readJson("properties.json");
  const violationsData = readJson("violations.json");
  const notificationsData = readJson("notifications.json");

  const emails = usersData.map((u) => u.email);
  await User.deleteMany({ email: { $in: emails } });
  await Property.deleteMany({ permitNumber: { $regex: /^PVMS-DEMO/ } });
  await Violation.deleteMany({ description: { $regex: /^\[DEMO\]/ } });
  await Notification.deleteMany({ title: { $regex: /^\[DEMO\]/ } });

  const userByEmail = {};
  const now = new Date();
  const nextYear = new Date(now);
  nextYear.setFullYear(nextYear.getFullYear() + 1);

  for (const row of usersData) {
    const doc = {
      name: row.name,
      email: row.email,
      password: row.passwordHash,
      role: row.role,
      approved: row.approved,
      phone: row.phone,
      address: row.address,
    };
    const created = await User.create(doc);
    userByEmail[row.email] = created;
  }

  for (const row of usersData) {
    if (!row.approvedByEmail) continue;
    const user = userByEmail[row.email];
    const approver = userByEmail[row.approvedByEmail];
    if (user && approver) {
      user.approvedBy = approver._id;
      await user.save();
    }
  }

  const propertyByPermit = {};
  for (const row of propertiesData) {
    const owner = userByEmail[row.ownerEmail];
    if (!owner) throw new Error(`Owner not found: ${row.ownerEmail}`);

    const officer = userByEmail["officer@pvms.test"];
    const prop = await Property.create({
      owner: owner._id,
      propertyName: row.propertyName,
      propertyType: row.propertyType,
      address: row.address,
      wardNumber: row.wardNumber,
      zone: row.zone,
      permitNumber: row.permitNumber,
      permitValidFrom: now,
      permitValidTo: nextYear,
      status: row.status,
      ...(row.status === "ACTIVE" && officer
        ? { approvedBy: officer._id, approvalDate: now }
        : {}),
      ...propertyGeo(row.latitude, row.longitude),
    });
    propertyByPermit[row.permitNumber] = prop;
  }

  const violationByDescription = {};
  for (const row of violationsData) {
    const reporter = userByEmail[row.reporterEmail];
    if (!reporter) throw new Error(`Reporter not found: ${row.reporterEmail}`);

    const relatedProperty = row.propertyPermit
      ? propertyByPermit[row.propertyPermit]?._id
      : undefined;

    const violation = await Violation.create({
      reportedBy: reporter._id,
      relatedProperty,
      violationType: row.violationType,
      description: row.description,
      status: row.status,
      objectionReason: row.objectionReason || "",
      decision: row.decision,
      ...violationGeo(row.latitude, row.longitude),
    });
    violationByDescription[row.description] = violation;

    if (row.createPayment) {
      const owner = userByEmail["owner@pvms.test"];
      await Payment.create({
        violation: violation._id,
        payer: owner._id,
        amount: row.decision.amount,
        paymentMethod: "UPI",
        transactionId: `DEMO-TXN-${Date.now()}`,
        status: "COMPLETED",
      });
    }
  }

  for (const row of notificationsData) {
    const recipient = userByEmail[row.recipientEmail];
    if (!recipient) continue;

    let entityId;
    if (row.matchViolationDescription) {
      entityId = violationByDescription[row.matchViolationDescription]?._id;
    }

    await Notification.create({
      recipient: recipient._id,
      type: row.type,
      title: row.title,
      message: row.message,
      link: row.link,
      read: row.read ?? false,
      ...(row.relatedEntityType && entityId
        ? {
            relatedEntity: {
              entityType: row.relatedEntityType,
              entityId,
            },
          }
        : {}),
    });
  }

  console.log("\n✅ Database imported from JSON files");
  console.log(`   Users: ${usersData.length}`);
  console.log(`   Properties: ${propertiesData.length}`);
  console.log(`   Violations: ${violationsData.length}`);
  console.log(`   Notifications: ${notificationsData.length}`);
  console.log("\n   Login password for all accounts: password123\n");

  await mongoose.disconnect();
}

importDatabase().catch((err) => {
  console.error(err);
  process.exit(1);
});
