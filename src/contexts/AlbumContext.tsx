import {
  useState,
  useEffect,
  createContext,
  ReactNode,
  useCallback,
} from "react";
import { AlbumService } from "@/services/AlbumService";
import { useAuth } from "@/hooks/useAuth";
import { generateSlug } from "@/utils/generateSlug";
import { Album } from "@/types";
import toast from "react-hot-toast";

interface AlbumProviderProps {
  children: ReactNode;
}

export type AlbumContextData = {
  albums: Album[];
  setAlbums: (albums: Album[]) => void;
  loadingAlbums: boolean;
  createAlbum: (title: string) => Promise<void>;
  deleteAlbum: (album_id: string) => Promise<void>;
  fetchAlbums: () => Promise<void>;
};

export const AlbumContext = createContext({} as AlbumContextData);

export function AlbumProvider({ children }: AlbumProviderProps) {
  const { user } = useAuth();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loadingAlbums, setLoadingAlbums] = useState<boolean>(true);

  const fetchAlbums = useCallback(async () => {
    try {
      if (!user) return;
      const albumList = await AlbumService.getAll({ user_id: user.id });
      setAlbums(albumList);
      setLoadingAlbums(false);
    } catch (error) {
      throw new Error("fetchAlbuns");
    }
  }, [user]);
  useEffect(() => {
    fetchAlbums();
  }, [user, fetchAlbums]);

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
      console.log(error);
      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }
      toast.error("Erro ao deletar o álbum.");
    }
  }

  return (
    <AlbumContext.Provider
      value={{
        albums,
        loadingAlbums,
        createAlbum,
        fetchAlbums,
        setAlbums,
        deleteAlbum,
      }}
    >
      {children}
    </AlbumContext.Provider>
  );
}
