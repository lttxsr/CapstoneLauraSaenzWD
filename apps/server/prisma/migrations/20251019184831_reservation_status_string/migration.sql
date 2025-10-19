-- AlterTable
ALTER TABLE "Loan" ADD COLUMN "returnedAt" DATETIME;

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "coverUrl" TEXT,
    "year" INTEGER,
    "requestedDays" INTEGER NOT NULL DEFAULT 14,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fulfilledAt" DATETIME,
    "canceledAt" DATETIME,
    CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Reservation_bookId_status_createdAt_idx" ON "Reservation"("bookId", "status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_userId_bookId_status_key" ON "Reservation"("userId", "bookId", "status");

-- CreateIndex
CREATE INDEX "Loan_bookId_returned_idx" ON "Loan"("bookId", "returned");
