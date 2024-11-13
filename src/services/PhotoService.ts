import { db, storage } from "@/lib/firebase";
import { DB_NAME, Photo } from "@/types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import Resizer from "react-image-file-resizer";

const photoCollection = collection(db, DB_NAME.photos);
const PhotoService = {
  getByAlbumId: async (album_id: string) => {
    const photoList: Photo[] = [];
    try {
      const querySnapshot = await getDocs(
        query(
          photoCollection,
          where("album_id", "==", album_id),
          orderBy("title")
        )
      );
      querySnapshot.forEach((doc) => {
        photoList.push({
          id: doc.id,
          album_id: doc.data().album_id,
          image_url: doc.data().image_url,
          title: doc.data().title,
          createdAt: doc.data().createdAt,
        });
      });
    } catch (error) {
      console.error("Error fetching photos: ", error);
      throw new Error("Failed to fetch photos");
    }
    return photoList;
  },

  resizeAndConvertPhoto: (file: File) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        1920,
        1080,
        "png",
        80,
        0,
        (uri) => {
          resolve(uri);
        },
        "file"
      );
    }),

  upload: async (album_id: string, photos: File[]) => {
    if (!album_id) {
      throw new Error("Álbum não informado");
    }
    if (!photos) {
      throw new Error("Foto não informada");
    }

    for (const photo of photos) {
      const image = (await PhotoService.resizeAndConvertPhoto(photo)) as File;

      const createdAt = new Date();
      const originalName = image.name;
      const extension =
        originalName.split(".")[originalName.split(".").length - 1];

      const filename = `${album_id}-${createdAt.getTime()}.${extension}`;
      const photoRef = ref(storage, `images/${album_id}/${filename}`);
      uploadBytes(photoRef, image).then(async () => {
        const image_url = await getDownloadURL(photoRef);
        PhotoService.create({
          album_id,
          createdAt,
          title: originalName,
          image_url,
        });
      });
    }
  },
  create: async ({
    title,
    album_id,
    createdAt,
    image_url,
  }: {
    album_id: string;
    title: string;
    image_url: string;
    createdAt: Date;
  }) => {
    const data: Pick<Photo, "createdAt" | "album_id" | "image_url" | "title"> =
      {
        title,
        album_id,
        image_url,
        createdAt: Timestamp.fromDate(createdAt),
      };

    const photo = await addDoc(photoCollection, data);

    const response: Photo = {
      id: photo.id,
      ...data,
    };

    return response;
  },
  delete: async (photo_id: string) => {
    try {
      const photo = await PhotoService.getById(photo_id);
      const storageRef = ref(
        storage,
        `images/${photo.album_id}/${photo.album_id}-${photo.createdAt
          .toDate()
          .getTime()}.png`
      );
      deleteObject(storageRef).then(async () => {
        const photoRef = doc(db, DB_NAME.photos, photo_id);
        await deleteDoc(photoRef);
        console.log("apagou");
      });
    } catch (error) {
      console.log(error);
    }
  },
  getById: async (photo_id: string): Promise<Photo> => {
    const photoRef = doc(db, DB_NAME.photos, photo_id);
    const docSnap = await getDoc(photoRef);
    if (!docSnap.exists()) {
      throw new Error("Foto não encontrada");
    }

    const photo: Photo = {
      id: docSnap.id,
      album_id: docSnap.data().album_id,
      image_url: docSnap.data().image_url,
      title: docSnap.data().title,
      createdAt: docSnap.data().createdAt,
    };
    return photo;
  },
};

export { PhotoService };
