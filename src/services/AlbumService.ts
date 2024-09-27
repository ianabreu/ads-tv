import { Album, DB_NAME } from "@/types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface CreateAlbumProps {
  title: string;
  slug: string;
  userId: string;
}

interface ListAllAlbunsProps {
  user_id: string;
  order?: keyof Pick<Album, "title" | "createdAt">;
  limitSize?: number;
}
const albumCollection = collection(db, DB_NAME.albums);
const AlbumService = {
  create: async ({ title, slug, userId }: CreateAlbumProps) => {
    try {
      const alreadyExists = await AlbumService.getBySlug(slug);
      if (alreadyExists) {
        throw new Error("Álbum já cadastrado");
      }
      const data: Pick<
        Album,
        "createdAt" | "cover" | "slug" | "title" | "user_id"
      > = {
        user_id: userId,
        title,
        slug,
        cover: null,
        createdAt: Timestamp.fromDate(new Date()),
      };

      const album = await addDoc(albumCollection, data);

      const response: Album = {
        id: album.id,
        ...data,
      };

      return response;
    } catch (error) {
      console.log(error);
      throw new Error(
        error instanceof Error ? error.message : "Erro ao cadastrar"
      );
    }
  },

  getAll: async ({
    user_id,
    order = "title",
    limitSize = 20,
  }: ListAllAlbunsProps): Promise<Album[]> => {
    const albuns: Album[] = [];

    const q = query(
      albumCollection,
      where("user_id", "==", user_id),
      orderBy(order),
      limit(limitSize)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      albuns.push({
        id: doc.id,
        user_id: doc.data().user_id,
        title: doc.data().title,
        slug: doc.data().slug,
        createdAt: doc.data().createdAt,
        cover: doc.data().cover,
      });
    });
    return albuns;
  },

  getBySlug: async (slug: string) => {
    try {
      const querySnapshot = await getDocs(
        query(albumCollection, where("slug", "==", slug))
      );
      if (querySnapshot.empty) {
        return;
      }
      const albumResponse: Album = {
        id: querySnapshot.docs[0].id as string,
        user_id: querySnapshot.docs[0].data().user_id as string,
        title: querySnapshot.docs[0].data().title as string,
        slug: querySnapshot.docs[0].data().slug as string,
        cover: querySnapshot.docs[0].data().cover as string,
        createdAt: querySnapshot.docs[0].data().createdAt as Timestamp,
      };
      return albumResponse;
    } catch (error) {
      console.log(error);
      return;
    }
  },
  getById: async (album_id: string): Promise<Album | null> => {
    const albumRef = doc(db, DB_NAME.albums, album_id);
    const docSnap = await getDoc(albumRef);
    if (docSnap.exists()) {
      const album = {
        id: docSnap.id,
        user_id: docSnap.data().user_id,
        cover: docSnap.data().cover,
        slug: docSnap.data().slug,
        title: docSnap.data().title,
        createdAt: docSnap.data().createdAt,
      };
      return album;
    } else {
      return null;
    }

    // const albumResponse: Album[] = [];
    // const q = query(album, where("slug", "==", slug));
    // const querySnapshot = await getDocs(q);
    // querySnapshot.forEach((doc) => {
    //   albumResponse.push({
    //     id: doc.id,
    //     user_id: doc.data().user_id,
    //     title: doc.data().title,
    //     slug: doc.data().slug,
    //     cover: doc.data().cover,
    //     createdAt: doc.data().createdAt,
    //   });
    // });

    // return albumResponse[0];
  },
  isEmpty: async (album_id: string): Promise<boolean> => {
    const photos = collection(db, DB_NAME.photos);
    const q = query(photos, where("album_id", "==", album_id));
    const snapshot = await getCountFromServer(q);
    if (snapshot.data().count === 0) {
      return true;
    }
    return false;
  },
  delete: async (albumId: string) => {
    const albumRef = doc(db, DB_NAME.albums, albumId);
    await deleteDoc(albumRef);
  },
};

export { AlbumService };
