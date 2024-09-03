import { db } from "@/lib/firebase";
import { Album } from "@/types/Album";
import { DB_NAME } from "@/types/DB_Names";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

interface ListAllAlbunsProps {
  userId: string;
  order?: keyof Pick<Album, "title" | "createdAt">;
}
export async function ListAllAlbunsService({
  userId,
  order = "title",
}: ListAllAlbunsProps): Promise<Album[]> {
  const albuns: Album[] = [];

  const q = query(
    collection(db, DB_NAME.users, userId, DB_NAME.albuns),
    orderBy(order)
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    albuns.push({
      id: doc.id,
      title: doc.data().title,
      slug: doc.data().slug,
      createdAt: doc.data().createdAt,
      photos: doc.data().photos,
    });
  });
  return albuns;
}
