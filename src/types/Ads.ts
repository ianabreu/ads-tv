import { Timestamp } from "firebase/firestore";

export type Ads = {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  durationSlide: number;
  draft: boolean;
  created_at: Timestamp;
};
