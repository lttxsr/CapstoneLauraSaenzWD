import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";
import { ReadingService } from "../services/ReadingService";

const r = Router();
const svc = new ReadingService();
const StatusSchema = z.enum(["READING", "COMPLETED", "WISHLIST", "NONE"]);

r.use(requireAuth);

r.get("/", async (req, res, next) => {
  try {
    const userId = (req as any).user.id as string;
    const bookId = (req.query.bookId as string | undefined);
    if (!bookId) return res.status(400).json({ error: "INVALID_PARAMS" });
    const row = await svc.get(userId, bookId);
    res.json(row);
  } catch (e) { next(e); }
});

r.put("/", async (req, res, next) => {
  try {
    const userId = (req as any).user.id as string;
    const Body = z.object({ bookId: z.string().min(1), status: StatusSchema });
    const parsed = Body.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "INVALID_DATA" });
    const row = await svc.set(userId, parsed.data.bookId, parsed.data.status);
    res.json(row);
  } catch (e) { next(e); }
});

r.get("/list", async (req, res, next) => {
  try {
    const userId = (req as any).user.id as string;
    const rows = await svc.list(userId);
    res.json(rows);
  } catch (e) { next(e); }
});

export default r;
