import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { config } from "./config";
import authRoutes from "./routes/auth";
import favoritesRoutes from "./routes/favorites";
import loansRoutes from "./routes/loans";
import reservationsRouter from "./routes/reservations";
import readingRouter from "./routes/reading";

const app = express();

const origins = (process.env.CORS_ORIGIN || "*")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(helmet());

const corsOptions: cors.CorsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    if (origins.includes("*") || origins.includes(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/health", (_req, res) =>
  res.json({ ok: true, time: new Date().toISOString() })
);

app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/loans", loansRoutes);
app.use("/api/reservations", reservationsRouter);
app.use("/api/reading", readingRouter);

app.use((_req, res) => res.status(404).json({ error: "NOT_FOUND" }));

interface AppError extends Error { status?: number; code?: string; [k: string]: any; }
app.use((err: AppError, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("❌ Internal error:", err);
  res.status(500).json({ error: "INTERNAL_ERROR" });
});

const port = Number(process.env.PORT) || Number(config.port) || 8080;

app.listen(port, "0.0.0.0", () => {
  console.log(`✅ API listening on port ${port} | allowed origins:`, origins);
});
