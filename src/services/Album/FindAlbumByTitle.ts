import { db } from "@/lib/firebase";
import { Album } from "@/types/Album";
import { DB_NAME } from "@/types/DB_Names";
import { collection, getDocs, query, where } from "firebase/firestore";

interface FindAlbumByTitleProps {
  title: string;
  userId: string;
}
export async function FindAlbumByTitleService({
  title,
  userId,
}: FindAlbumByTitleProps) {
  const albumResponse: Album[] = [];
  const album = collection(db, DB_NAME.users, userId, DB_NAME.albuns);
  const q = query(album, where("title", "==", title));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    albumResponse.push({
      id: doc.id,
      title: doc.data().title,
      slug: doc.data().slug,
      photos: doc.data().photos,
      createdAt: doc.data().createdAt,
    });
  });

  return albumResponse[0];
}
