import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { LoanService } from "../services/LoanService";

const r = Router();
const svc = new LoanService();

r.use(requireAuth);

r.get("/", async (req, res, next) => {
  try {
    const userId = (req as any).user.id as string;
    const data = await svc.listReservations(userId);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

r.delete("/:id", async (req, res, next) => {
  try {
    const userId = (req as any).user.id as string;
    const id = req.params.id as string;
    const out = await svc.cancelReservation(userId, id);
    res.json(out);
  } catch (err) {
    next(err);
  }
});

export default r;
