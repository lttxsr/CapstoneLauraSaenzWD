import { prisma } from "../prisma";
import type { BookPayload } from "../types/book";

export class FavoriteService {
  async list(userId: string) {
    return prisma.favorite.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  }

  async upsert(userId: string, b: BookPayload) {
    return prisma.favorite.upsert({
      where: { userId_bookId: { userId, bookId: b.id } },
      update: { title: b.title, author: b.author, coverUrl: b.coverUrl ?? undefined, year: b.year ?? undefined },
      create: { userId, bookId: b.id, title: b.title, author: b.author, coverUrl: b.coverUrl ?? undefined, year: b.year ?? undefined }
    });
  }

  async remove(userId: string, bookId: string) {
    await prisma.favorite.deleteMany({ where: { userId, bookId } });
    return { ok: true };
  }
}
