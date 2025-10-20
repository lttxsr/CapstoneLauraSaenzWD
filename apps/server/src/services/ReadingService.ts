import { prisma } from "../prisma";

export type ReadingState = "READING" | "COMPLETED" | "WISHLIST" | "NONE";

export class ReadingService {
  async get(userId: string, bookId: string) {
    const row = await prisma.reading.findUnique({ where: { userId_bookId: { userId, bookId } } });
    return row ?? { userId, bookId, status: "NONE" as ReadingState };
  }

  async set(userId: string, bookId: string, status: ReadingState) {
    const row = await prisma.reading.upsert({
      where: { userId_bookId: { userId, bookId } },
      update: { status },
      create: { userId, bookId, status },
    });
    return row;
  }

  async list(userId: string) {
    return prisma.reading.findMany({ where: { userId }, orderBy: { updatedAt: "desc" } });
  }
}
