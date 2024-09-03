import { db } from "@/lib/firebase";
import { Album } from "@/types/Album";
import { DB_NAME } from "@/types/DB_Names";
import { addDoc, collection } from "firebase/firestore";
import { FindAlbumByTitleService } from "./FindAlbumByTitle";
import { generateSlug } from "@/utils/generateSlug";

interface CreateAlbumProps {
  title: string;
  userId: string;
}
export async function CreateAlbumService({ title, userId }: CreateAlbumProps) {
  const alreadyExists = await FindAlbumByTitleService({ title, userId });
  if (alreadyExists) {
    throw new Error("Título já cadastrado");
  }
  const albumRef = collection(db, DB_NAME.users, userId, DB_NAME.albuns);
  const data: Pick<Album, "createdAt" | "photos" | "slug" | "title"> = {
    title: title,
    slug: generateSlug(title),
    photos: [],
    createdAt: new Date().toISOString(),
  };
  const album = await addDoc(albumRef, data);
  const response: Album = {
    id: album.id,
    ...data,
  };

  return response;
}
