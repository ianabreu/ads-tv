import { Photo } from "@/types";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { useState } from "react";

interface PhotoItemProps {
  photo: Photo;
  loadedImages: string[];
  deletePhoto: (photo_id: string) => Promise<void>;
  onImageLoad: (album_id: string) => void;
}

export function PhotoItem({
  photo,
  loadedImages,
  onImageLoad,
  deletePhoto,
}: PhotoItemProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  function handleOpenDialog() {
    setDialogOpen(true);
  }
  return (
    <section
      key={photo.id}
      className="relative w-full rounded-lg p-2 bg-slate-700"
    >
      <Button
        className="absolute top-0 right-0"
        variant={"destructive"}
        size={"icon"}
        type="button"
        onClick={handleOpenDialog}
      >
        <Trash2 />
      </Button>
      <Link to={`${photo.image_url}`} target="_blank">
        <img
          src={"../images/photo.svg"}
          className="w-full rounded-lg h-32 aspect-square"
          style={{
            display: loadedImages.includes(photo.id) ? "none" : "block",
          }}
        />
        <div
          className="w-full rounded-lg mb-2 max-h-32 aspect-square transition-all overflow-hidden"
          style={{
            display: loadedImages.includes(photo.id) ? "block" : "none",
          }}
        >
          <img
            src={photo.image_url || "./images/folder.png"}
            alt={photo.title}
            className="h-full w-full object-cover"
            onLoad={() => {
              onImageLoad(photo.id);
            }}
          />
        </div>

        <span className="text-sm mt-2 text-background text-ellipsis line-clamp-2">
          {photo.title}
        </span>
      </Link>
      <ConfirmationDialog
        open={dialogOpen}
        onCancel={() => setDialogOpen(false)}
        onConfirm={() => {
          deletePhoto(photo.id);
          setDialogOpen(false);
        }}
      />
    </section>
  );
}
