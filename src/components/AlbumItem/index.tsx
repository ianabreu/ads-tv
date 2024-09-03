import { DeleteAlbumService } from "@/services/Album/DeleteAlbumService";
import { Album } from "@/types/Album";
import { ImagesIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

interface AlbumItemProps {
  album: Album;
}

export function AlbumItem({ album }: AlbumItemProps) {
  if (!album.slug) {
    return <div>Album não encontrado</div>;
  }
  return (
    <div className="flex flex-col bg-slate-700 p-2 rounded h-full">
      <Link to={`/albuns/${album.slug}`}>
        <ImagesIcon className="w-full h-auto" />
      </Link>
      <Button
        variant={"destructive"}
        onClick={() => {
          DeleteAlbumService({
            albumId: album.id,
            userId: "WV2hFzn8YGUfBZy66aYBx4dT5MT2",
          });
        }}
      >
        Deletar
      </Button>
      <span className="text-sm mt-2 text-background text-ellipsis line-clamp-2">
        {album.title}
      </span>
    </div>
  );
}
