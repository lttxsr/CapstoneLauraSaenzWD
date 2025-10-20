import { Router } from "express";
import { z } from "zod";
import { FavoriteService } from "../services/FavoriteService";
import { requireAuth } from "../middleware/auth";

const r = Router();
const svc = new FavoriteService();

const BookSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string().optional(),
  coverUrl: z.string().nullable().optional(),
  year: z.number().nullable().optional()
});

r.use(requireAuth);

r.get("/", async (req, res) => {
  const userId = (req as any).user.id as string;
  const data = await svc.list(userId);
  res.json(data);
});

r.post("/", async (req, res) => {
  const userId = (req as any).user.id as string;
  const parsed = BookSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_DATA" });
  const fav = await svc.upsert(userId, parsed.data);
  res.status(201).json(fav);
});

r.delete("/", async (req, res) => {
  const userId = (req as any).user.id as string;
  const bookId = req.query.bookId as string | undefined;
  if (!bookId) return res.status(400).json({ error: "bookId_required" });
  const out = await svc.remove(userId, bookId);
  res.json(out);
});

export default r;
