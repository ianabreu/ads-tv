import { Timestamp } from "firebase/firestore";

export interface Album {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  cover: string | null;
  createdAt: Timestamp;
}
