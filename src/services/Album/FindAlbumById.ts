import { db } from "@/lib/firebase";
import { DB_NAME } from "@/types/DB_Names";
import { doc, getDoc } from "firebase/firestore";

interface FindAlbumByIdProps {
  albumId: string;
  userId: string;
}
export async function FindAlbumByIdService({
  albumId,
  userId,
}: FindAlbumByIdProps) {
  const albumRef = await getDoc(
    doc(db, DB_NAME.users, userId, DB_NAME.albuns, albumId)
  );

  return albumRef;
}
