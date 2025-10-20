import "dotenv/config";

export const config = {
  port: process.env.PORT || "4000",
  corsOrigin: process.env.CORS_ORIGIN || "*",
  jwtSecret: process.env.JWT_SECRET || "change-me",
  databaseUrl: process.env.DATABASE_URL!,
};
