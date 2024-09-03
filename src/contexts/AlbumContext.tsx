import {
  useState,
  useEffect,
  createContext,
  ReactNode,
  useCallback,
} from "react";
import { Album } from "@/types/Album";
import { CreateAlbumService, ListAllAlbunsService } from "@/services/Album";
import { useAuth } from "@/hooks/useAuth";

interface AlbumProviderProps {
  children: ReactNode;
}

export type AlbumContextData = {
  albuns: Album[];
  loading: boolean;
  createAlbum: (title: string) => Promise<void>;
};

export const AlbumContext = createContext({} as AlbumContextData);

export function AlbumProvider({ children }: AlbumProviderProps) {
  const { user } = useAuth();
  const [albuns, setAlbuns] = useState<Album[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAlbuns = useCallback(async () => {
    try {
      if (!user) return;
      setLoading(true);
      const albumList = await ListAllAlbunsService({ userId: user.uid });
      setAlbuns(albumList);
    } catch (error) {
      throw new Error("fetchAlbuns");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAlbuns();
  }, [fetchAlbuns]);

  async function createAlbum(name: string) {
    try {
      if (!user) throw new Error("Usuário não encontrado");
      const newAlbum = await CreateAlbumService({
        title: name,
        userId: user.uid,
      });
      setAlbuns((prev) =>
        [...prev, newAlbum].sort((a, b) => a.title.localeCompare(b.title))
      );
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AlbumContext.Provider
      value={{
        albuns,
        loading,
        createAlbum,
      }}
    >
      {children}
    </AlbumContext.Provider>
  );
}
