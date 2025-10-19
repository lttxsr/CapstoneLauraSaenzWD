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
  createdAt: string;
};
