export type BookRef = {
  id: string;
  title: string;
  author?: string;
  coverUrl?: string | null;
  year?: number | null;
};

export type FavoriteRow = {
  id: string;
  userId: string;
  bookId: string;
  title: string;
  author?: string | null;
  coverUrl?: string | null;
  year?: number | null;
  createdAt: string;
};

export type Loan = {
  id: string;
  userId: string;
  bookId: string;
  title: string;
  author?: string | null;
  coverUrl?: string | null;
  year?: number | null;
  due: string;
  returned: boolean;
  returnedAt?: string | null;
  createdAt: string;
};

export type Reservation = {
  id: string;
  userId: string;
  bookId: string;
  title: string;
  author?: string | null;
  coverUrl?: string | null;
  year?: number | null;
  requestedDays: number;
  status: "PENDING" | "FULFILLED" | "CANCELED" | (string & {});
  createdAt: string;
  fulfilledAt?: string | null;
  canceledAt?: string | null;
  position?: number;
};

export type CreateLoanResult =
  | { loan: Loan }
  | { reservation: Reservation; position: number }
  | { conflict: true; message: string; due: string }

export type ReadingState = "READING" | "COMPLETED" | "WISHLIST" | "NONE";

export type ReadingRow = {
  id?: string;
  userId: string;
  bookId: string;
  status: ReadingState;
  createdAt?: string;
  updatedAt?: string;
};

