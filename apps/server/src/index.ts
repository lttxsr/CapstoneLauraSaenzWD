import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { config } from "./config.js";
import authRoutes from "./routes/auth.js";
import favoritesRoutes from "./routes/favorites.js";
import loansRoutes from "./routes/loans.js";
import reservationsRouter from "./routes/reservations.js";
import readingRouter from "./routes/reading.js";

const app = express();

const origins = (config.corsOrigin || "*")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (origins.includes("*") || origins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(helmet());
app.use(cors(corsOptions));
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

app.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: "INTERNAL_ERROR" });
  }
);

export default app;

if (!process.env.VERCEL) {
  const port = Number(config.port || 4000);
  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
    console.log(`CORS origins: ${origins.join(", ") || "*"}`);
  });
}
