import { useState, useEffect, createContext, ReactNode } from "react";
import { AlbumService } from "@/services/AlbumService";
import { useAuth } from "@/hooks/useAuth";
import { generateSlug } from "@/utils/generateSlug";
import { Album, DB_NAME, Photo } from "@/types";
import toast from "react-hot-toast";
import { PhotoService } from "@/services/PhotoService";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface AlbumProviderProps {
  children: ReactNode;
}

export type AlbumContextData = {
  albums: Album[];
  setAlbums: (albums: Album[]) => void;
  loadingAlbums: boolean;
  createAlbum: (title: string) => Promise<void>;
  deleteAlbum: (album_id: string) => Promise<void>;

  photos: Photo[];
  deletePhoto: (photo_id: string) => Promise<void>;
};

export const AlbumContext = createContext({} as AlbumContextData);

export function AlbumProvider({ children }: AlbumProviderProps) {
  const { user } = useAuth();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loadingAlbums, setLoadingAlbums] = useState<boolean>(true);

  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(
        query(
          collection(db, DB_NAME.albums),
          where("user_id", "==", user.id),
          orderBy("title", "asc")
        ),
        (querySnapshot) => {
          const response: Album[] = [];

          querySnapshot.forEach((doc) => {
            response.push({
              id: doc.id,
              user_id: doc.data().user_id,
              title: doc.data().title,
              createdAt: doc.data().createdAt,
              cover: doc.data().cover,
              slug: doc.data().slug,
            });
          });
          setAlbums(response);
          setLoadingAlbums(false);
        }
      );

      return () => unsubscribe();
    }
  }, [user]);

  async function createAlbum(title: string) {
    try {
      if (!user) throw new Error("Usuário não encontrado");
      const newAlbum = await AlbumService.create({
        title: title,
        slug: generateSlug(title),
        userId: user.id,
      });
      setAlbums((prev) =>
        [...prev, newAlbum].sort((a, b) => a.title.localeCompare(b.title))
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteAlbum(album_id: string) {
    try {
      const alreadyExist = await AlbumService.isEmpty(album_id);
      if (!alreadyExist) {
        throw new Error("O álbum precisa estar vazio");
      }
      await AlbumService.delete(album_id);
      const list = [...albums].filter((album) => album.id !== album_id);
      setAlbums(list);
      toast.success("Álbum deletado com sucesso.");
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }
      toast.error("Erro ao deletar o álbum.");
    }
  }

  {
    /*Funções relacionadas a fotos*/
  }

  // const findPhotosByAlbumSlug = useCallback(async (album_slug: string) => {
  //   setLoadingPhotos(true);
  //   try {
  //     const album = await AlbumService.getBySlug(album_slug);
  //     if (!album) {
  //       throw new Error("Álbum não encontrado");
  //     }
  //     const photoList = await PhotoService.getByAlbumId(album.id);
  //     setPhotos(photoList);
  //     return album.id;
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error(
  //       error instanceof Error ? error.message : "Erro ao buscar fotos"
  //     );
  //   } finally {
  //     setLoadingPhotos(false);
  //   }
  // }, []);

  async function deletePhoto(photo_id: string) {
    //Verificar se há foto nos anuncios
    try {
      await PhotoService.delete(photo_id);
      setPhotos((prevPhotos) =>
        prevPhotos.filter((photo) => photo.id !== photo_id)
      );
    } catch (error) {
      console.log(error);
      toast.error("Erro ao excluir foto.");
    }
  }
  return (
    <AlbumContext.Provider
      value={{
        albums,
        loadingAlbums,
        createAlbum,

        setAlbums,
        deleteAlbum,

        photos,

        deletePhoto,
      }}
    >
      {children}
    </AlbumContext.Provider>
  );
}
