export type BookPayload = {
  id: string;
  title: string;
  author?: string;
  coverUrl?: string | null;
  year?: number | null;
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
  status: "PENDING" | "FULFILLED" | "CANCELED";
  createdAt: string;
  fulfilledAt?: string | null;
  canceledAt?: string | null;
  position?: number;
};

export type CreateLoanResult =
  | { loan: Loan }
  | { reservation: Reservation; position: number }
  | { conflict: true; message: string; due: string };
