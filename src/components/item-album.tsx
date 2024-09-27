import { Album } from "@/types";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { useState } from "react";

interface AlbumItemProps {
  album: Album;
  loadedImages: string[];
  deleteAlbum: (album_id: string) => Promise<void>;
  onImageLoad: (album_id: string) => void;
}

export function AlbumItem({
  album,
  loadedImages,
  onImageLoad,
  deleteAlbum,
}: AlbumItemProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  function handleOpenDialog() {
    setDialogOpen(true);
  }
  return (
    <section className="relative w-full rounded-lg p-2 bg-slate-700">
      <Button
        className="absolute top-0 right-0"
        variant={"destructive"}
        size={"icon"}
        type="button"
        onClick={handleOpenDialog}
      >
        <Trash2 />
      </Button>
      <Link to={`/albuns/${album.slug}`}>
        <img
          src={"./images/folder.png"}
          className="w-full rounded-lg h-32 aspect-square"
          style={{
            display: loadedImages.includes(album.id) ? "none" : "block",
          }}
        />
        <div
          className="w-full rounded-lg mb-2 max-h-32 aspect-square transition-all overflow-hidden"
          style={{
            display: loadedImages.includes(album.id) ? "block" : "none",
          }}
        >
          <img
            src={album.cover || "./images/folder.png"}
            alt={album.title}
            className="h-full w-full object-cover"
            onLoad={() => {
              onImageLoad(album.id);
            }}
          />
        </div>

        <span className="text-sm mt-2 text-background text-ellipsis line-clamp-2">
          {album.title}
        </span>
      </Link>
      <ConfirmationDialog
        open={dialogOpen}
        onCancel={() => setDialogOpen(false)}
        onConfirm={() => {
          deleteAlbum(album.id);
          setDialogOpen(false);
        }}
        contentText={`Tem certeza de que deseja excluir o álbum ${album.title}?`}
      />
    </section>
  );
}
