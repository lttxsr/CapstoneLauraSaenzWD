import { Router } from "express";
import { z } from "zod";
import { LoanService } from "../services/LoanService.js";
import { requireAuth } from "../middleware/auth.js";

const r = Router();
const svc = new LoanService();

const LoanSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string().optional(),
  coverUrl: z.string().nullable().optional(),
  year: z.number().nullable().optional(),
  days: z.number().optional().default(14)
});

r.use(requireAuth);

r.get("/", async (req, res) => {
  const userId = (req as any).user.id as string;
  const data = await svc.list(userId);
  res.json(data);
});

r.post("/", async (req, res) => {
  const userId = (req as any).user.id as string;
  const parsed = LoanSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_DATA" });
  const loan = await svc.create(userId, parsed.data, parsed.data.days ?? 14);
  res.status(201).json(loan);
});

r.patch("/", async (req, res) => {
  const userId = (req as any).user.id as string;
  const id = (req.query.id as string | undefined);
  const action = (req.query.action as string | undefined);
  if (!id || action !== "return") return res.status(400).json({ error: "INVALID_PARAMS" });
  const out = await svc.return(userId, id);
  res.json(out);
});

export default r;
