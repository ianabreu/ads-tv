import { db } from "@/lib/firebase";
import { DB_NAME, Photo } from "@/types";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

const PhotoService = {
  getByAlbumId: async (album_id: string) => {
    const photoList: Photo[] = [];

    const photoCollection = collection(db, DB_NAME.photos);
    const q = query(
      photoCollection,
      where("album_id", "==", album_id),
      orderBy("title")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      photoList.push({
        id: doc.id,
        album_id: doc.data().album_id,
        image_url: doc.data().image_url,
        title: doc.data().title,
        createdAt: doc.data().createdAt,
      });
    });

    return photoList;
  },
};

export { PhotoService };
