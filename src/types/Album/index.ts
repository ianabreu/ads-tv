import { Photo } from "../Photo";

export interface Album {
  id: string;
  title: string;
  slug: string;
  photos: Photo[];
  createdAt: string;
}
