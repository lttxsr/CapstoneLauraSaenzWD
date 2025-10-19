import { Router } from "express";
import { z } from "zod";
import { AuthService } from "../services/AuthService.js";

const r = Router();
const auth = new AuthService();

r.post("/register", async (req, res) => {
  const schema = z.object({ name: z.string().optional(), email: z.string().email(), password: z.string().min(6) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_DATA" });
  try {
    const out = await auth.register(parsed.data.name, parsed.data.email, parsed.data.password);
    res.status(201).json(out);
  } catch (e: any) {
    if (e.message === "EMAIL_TAKEN") return res.status(409).json({ error: "EMAIL_TAKEN" });
    res.status(500).json({ error: "SERVER_ERROR" });
  }
});

r.post("/login", async (req, res) => {
  const schema = z.object({ email: z.string().email(), password: z.string().min(6) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_DATA" });
  try {
    const out = await auth.login(parsed.data.email, parsed.data.password);
    res.json(out);
  } catch (e: any) {
    if (e.message === "INVALID_CREDENTIALS") return res.status(401).json({ error: "INVALID_CREDENTIALS" });
    res.status(500).json({ error: "SERVER_ERROR" });
  }
});

export default r;
