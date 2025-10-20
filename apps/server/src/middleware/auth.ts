import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "UNAUTHORIZED" });
  try {
    const payload = jwt.verify(token, config.jwtSecret) as { sub: string; email: string };
    (req as any).user = { id: payload.sub, email: payload.email };
    next();
  } catch {
    return res.status(401).json({ error: "INVALID_TOKEN" });
  }
}
