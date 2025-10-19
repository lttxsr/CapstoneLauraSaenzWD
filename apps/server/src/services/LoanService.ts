import { prisma } from "../prisma.js";
import type { BookPayload } from "../types/book.js";
import type { Reservation as DbReservation } from "@prisma/client";

export class LoanService {
  async list(userId: string, includeHistory = false) {
    return prisma.loan.findMany({
      where: { userId, ...(includeHistory ? {} : { returned: false }) },
      orderBy: [{ returned: "asc" }, { createdAt: "desc" }],
    });
  }

  async create(userId: string, b: BookPayload, days = 14) {
    const activeLoan = await prisma.loan.findFirst({
      where: { bookId: b.id, returned: false },
      select: { id: true, userId: true, due: true },
    });

    if (activeLoan) {
      if (activeLoan.userId === userId) {
        return { conflict: true as const, message: "Ya tienes este libro en préstamo.", due: activeLoan.due };
      }

      const existing = await prisma.reservation.findUnique({
        where: { userId_bookId_status: { userId, bookId: b.id, status: "PENDING" } },
      });

      const reservation = existing
        ? existing
        : await prisma.reservation.create({
            data: {
              userId,
              bookId: b.id,
              title: b.title,
              author: b.author ?? undefined,
              coverUrl: b.coverUrl ?? undefined,
              year: b.year ?? undefined,
              requestedDays: days ?? 14,
            },
          });

      const ahead = await prisma.reservation.count({
        where: { bookId: b.id, status: "PENDING", createdAt: { lt: reservation.createdAt } },
      });

      return { reservation, position: ahead + 1 };
    }

    const due = new Date();
    due.setDate(due.getDate() + (days ?? 14));

    const loan = await prisma.loan.create({
      data: {
        userId,
        bookId: b.id,
        title: b.title,
        author: b.author ?? undefined,
        coverUrl: b.coverUrl ?? undefined,
        year: b.year ?? undefined,
        due,
      },
    });

    return { loan };
  }

  async return(userId: string, id: string) {
    return prisma.$transaction(async (tx) => {
      const current = await tx.loan.findFirst({ where: { id, userId, returned: false } });
      if (!current) return { updated: 0 };

      await tx.loan.update({
        where: { id },
        data: { returned: true, returnedAt: new Date() },
      });

      const nextRes = await tx.reservation.findFirst({
        where: { bookId: current.bookId, status: "PENDING" },
        orderBy: { createdAt: "asc" },
      });

      if (nextRes) {
        const due = new Date();
        due.setDate(due.getDate() + (nextRes.requestedDays ?? 14));

        await tx.loan.create({
          data: {
            userId: nextRes.userId,
            bookId: current.bookId,
            title: current.title,
            author: current.author ?? undefined,
            coverUrl: current.coverUrl ?? undefined,
            year: current.year ?? undefined,
            due,
          },
        });

        await tx.reservation.update({
          where: { id: nextRes.id },
          data: { status: "FULFILLED", fulfilledAt: new Date() },
        });

        return { updated: 1, autoAssignedToReservationUserId: nextRes.userId };
      }

      return { updated: 1 };
    });
  }

  async renew(userId: string, id: string, days = 7) {
    return prisma.$transaction(async (tx) => {
      const loan = await tx.loan.findFirst({ where: { id, userId, returned: false } });
      if (!loan) return { ok: false as const, reason: "NOT_FOUND" as const };

      const pending = await tx.reservation.count({
        where: { bookId: loan.bookId, status: "PENDING" },
      });
      if (pending > 0) return { ok: false as const, reason: "HAS_RESERVATIONS" as const };

      const newDue = new Date(loan.due);
      newDue.setDate(newDue.getDate() + (days ?? 7));

      const updated = await tx.loan.update({ where: { id }, data: { due: newDue } });
      return { ok: true as const, loan: updated };
    });
  }

  async listReservations(userId: string) {
    const reservations = await prisma.reservation.findMany({
      where: { userId, status: "PENDING" },
      orderBy: { createdAt: "asc" },
    });

    const withPosition = await Promise.all(
      reservations.map(async (r: DbReservation) => {
        const ahead = await prisma.reservation.count({
          where: { bookId: r.bookId, status: "PENDING", createdAt: { lt: r.createdAt } },
        });
        return { ...r, position: ahead + 1 };
      })
    );

    return withPosition;
  }

  async cancelReservation(userId: string, reservationId: string) {
    const r = await prisma.reservation.findFirst({ where: { id: reservationId, userId, status: "PENDING" } });
    if (!r) return { ok: false };
    await prisma.reservation.update({
      where: { id: r.id },
      data: { status: "CANCELED", canceledAt: new Date() },
    });
    return { ok: true };
  }
}
