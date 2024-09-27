import { Button } from "./ui/button";
import { Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { PhotoService } from "@/services/PhotoService";
import toast from "react-hot-toast";

interface NewPhotoProps {
  handleCloseModal: () => void;
  album_id: string;
}

export function NewPhoto({ album_id, handleCloseModal }: NewPhotoProps) {
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFilesChange = (files: File[]) => {
    setImages(files);
  };

  async function handleSaveOnGallery() {
    setLoading(true);
    try {
      await PhotoService.upload(album_id, images);
      handleCloseModal();
      toast.success("Upload realizado com sucesso");
    } catch (error) {
      console.log(error);
      toast.error(
        error instanceof Error ? error.message : "Erro ao salvar na galeria"
      );
    } finally {
      setLoading(false);
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      handleFilesChange(Array.from(event.target.files));
    }
    event.target.value = "";
  };

  function handleRemoveImage(index: number) {
    setImages((prev) => prev.filter((item) => images.indexOf(item) != index));
  }

  return (
    <section className="min-h-[50vh] flex flex-col justify-center">
      <div className="flex w-full gap-2 items-center justify-center">
        {images.length === 0 ? (
          <Label
            htmlFor="photos"
            className={`
            flex
            items-center
            justify-center
            w-full
            max-w-xs
            cursor-pointer
            border
            border-amber-500
            text-amber-500
            p-1
            rounded-md
            gap-2
            transition-all
            duration-300
            hover:bg-amber-500
            hover:text-slate-800
            select-none
        
            `}
          >
            <Upload /> Selecione as imagens
          </Label>
        ) : (
          <Button
            type="button"
            variant={"default"}
            size={"default"}
            disabled={images.length === 0 || loading}
            className="w-full max-w-xs select-none"
            onClick={handleSaveOnGallery}
          >
            Salvar na galeria
          </Button>
        )}

        <input
          type="file"
          accept="image/png,image/jpg,image/jpeg"
          name="photos"
          id="photos"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      {images && images.length > 0 && (
        <div
          className={`
          grid
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-5
          gap-4
          p-2
          max-h-[50vh]
          overflow-y-auto
          my-2
        `}
        >
          {images.map((file, index) => (
            <section
              key={index}
              className="relative w-full rounded-lg p-2 bg-slate-700"
            >
              <div className="w-full rounded-lg mb-2 max-h-32 aspect-square transition-all overflow-hidden">
                <img
                  src={URL.createObjectURL(file)}
                  alt="photo.title"
                  className="h-full w-full object-cover"
                  onLoad={() => {}}
                />
              </div>

              <span className="text-sm mt-2 text-background text-ellipsis line-clamp-2">
                {file.name}
              </span>
              <Button
                className="absolute top-0 right-0"
                variant={"destructive"}
                size={"icon"}
                type="button"
                onClick={() => handleRemoveImage(index)}
              >
                <Trash2 />
              </Button>
            </section>
          ))}
        </div>
      )}
    </section>
  );
}
