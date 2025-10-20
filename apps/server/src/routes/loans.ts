import { Router } from "express";
import { z } from "zod";
import { LoanService } from "../services/LoanService";
import { requireAuth } from "../middleware/auth";

const r = Router();
const svc = new LoanService();

const CreateLoanSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string().optional(),
  coverUrl: z.string().nullable().optional(),
  year: z.number().nullable().optional(),
  days: z.number().int().min(1).max(60).optional().default(14),
});

const RenewSchema = z.object({
  days: z.number().int().min(1).max(60).optional().default(7),
});

r.use(requireAuth);

r.get("/", async (req, res) => {
  const userId = (req as any).user.id as string;
  const includeHistory = String(req.query.includeHistory) === "true";
  const data = await svc.list(userId, includeHistory);
  res.json(data);
});

r.post("/", async (req, res) => {
  const userId = (req as any).user.id as string;
  const parsed = CreateLoanSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_DATA" });

  const { days, ...book } = parsed.data;
  const out = await svc.create(userId, book, days ?? 14);
  res.status(201).json(out);
});

r.patch("/", async (req, res) => {
  const userId = (req as any).user.id as string;
  const id = req.query.id as string | undefined;
  const action = req.query.action as "return" | "renew" | undefined;

  if (!id || !action) return res.status(400).json({ error: "INVALID_PARAMS" });

  if (action === "return") {
    const out = await svc.return(userId, id);
    return res.json(out);
  }

  if (action === "renew") {
    const parsed = RenewSchema.safeParse(req.body ?? {});
    if (!parsed.success) return res.status(400).json({ error: "INVALID_DATA" });
    const out = await svc.renew(userId, id, parsed.data.days ?? 7);
    return res.json(out);
  }

  return res.status(400).json({ error: "UNKNOWN_ACTION" });
});

export default r;
