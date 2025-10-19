import { prisma } from "../prisma.js";
import type { BookPayload } from "../types/book.js";

export class LoanService {
  async list(userId: string) {
    return prisma.loan.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  }

  async create(userId: string, b: BookPayload, days = 14) {
    const due = new Date(); due.setDate(due.getDate() + (days ?? 14));
    return prisma.loan.create({
      data: { userId, bookId: b.id, title: b.title, author: b.author, coverUrl: b.coverUrl ?? undefined, year: b.year ?? undefined, due }
    });
  }

  async return(userId: string, id: string) {
    const updated = await prisma.loan.updateMany({ where: { id, userId, returned: false }, data: { returned: true } });
    return { updated: updated.count };
  }
}
