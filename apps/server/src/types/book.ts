export type BookPayload = {
  id: string;          // key de Open Library, ej. "/works/OLxxxxW"
  title: string;
  author?: string;
  coverUrl?: string | null;
  year?: number | null;
};
