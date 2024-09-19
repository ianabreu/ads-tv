import { Timestamp } from "firebase/firestore";

export type Photo = {
  id: string;
  album_id: string;
  title: string;
  image_url: string;
  createdAt: Timestamp;
};
