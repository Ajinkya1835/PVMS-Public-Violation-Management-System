import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import violationRoutes from "./routes/violationRoutes.js";
import ruleRoutes from "./routes/ruleRoutes.js";
import officerRoutes from "./routes/officerRoutes.js";
import ownerRoutes from "./routes/ownerRoutes.js";
import mapSearchRoutes from "./routes/mapSearchRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";

const app = express();

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((o) => o.trim())
  : ["http://localhost:5173", "http://127.0.0.1:5173"];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    credentials: true,
  })
);
app.use(express.json()); // ✅ THIS LINE IS CRITICAL

app.use("/api/violations", violationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/rules", ruleRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/officer", officerRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/map", mapSearchRoutes);
app.use("/api/properties", propertyRoutes);


app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "PVMS backend is live",
    time: new Date().toISOString()
  });
});

export default app;
