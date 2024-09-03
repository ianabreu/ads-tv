import { db } from "@/lib/firebase";
import { DB_NAME } from "@/types/DB_Names";
import { deleteDoc, doc } from "firebase/firestore";
import { FindAlbumByIdService } from "./FindAlbumById";

interface DeleteAlbumProps {
  albumId: string;
  userId: string;
}
export async function DeleteAlbumService({
  albumId,
  userId,
}: DeleteAlbumProps) {
  const album = await FindAlbumByIdService({ albumId, userId });
  if (!album.exists()) {
    throw new Error("Album não encontrado");
  }
  const albumRef = doc(db, DB_NAME.users, userId, DB_NAME.albuns, albumId);

  await deleteDoc(albumRef);

  return true;
}
