-- DropIndex
DROP INDEX "Reservation_userId_bookId_status_key";

-- CreateIndex
CREATE INDEX "Reservation_userId_bookId_status_idx" ON "Reservation"("userId", "bookId", "status");
