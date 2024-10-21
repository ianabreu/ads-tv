import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Button } from "./ui/button";
import { PhotoService } from "@/services/PhotoService";
import { Album, Photo } from "@/types";
import { Check, ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";

export function SelectItems({
  closeModal,
  addSlides,
}: {
  closeModal: () => void;
  addSlides: (photos: Photo[]) => void;
}) {
  const { albums } = useApi();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album>();
  const [selectedImages, setSelectedImages] = useState<Photo[]>([]);

  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const allSelected = selectedImages.length === photos.length;
    setSelectAll(allSelected);
  }, [selectedImages, photos.length]);

  async function openAlbum(album: Album) {
    PhotoService.getByAlbumId(album.id).then((photos) => {
      setSelectedAlbum(album);
      setPhotos(photos);
    });
  }

  const toggleImageSelection = (image: Photo) => {
    if (selectedImages.includes(image)) {
      setSelectedImages(
        selectedImages.filter((selectedId) => selectedId !== image)
      );
    } else {
      setSelectedImages([...selectedImages, image]);
    }
  };
  function handleSelectAll() {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    if (newSelectAll) {
      setSelectedImages(photos);
    } else {
      setSelectedImages([]);
    }
  }

  async function addPhotosToAd() {
    if (selectedImages.length === 0) return;
    // try {
    setLoading(true);
    addSlides(selectedImages);
    toast.success("Fotos adicionadas com sucesso.");
    closeModal();
    // } catch (error) {
    // toast.error("Erro ao adicionar fotos.");
    // } finally {
    setLoading(false);
    // }
  }
  return (
    <div className="h-[80vh] flex flex-col">
      <header className="flex justify-between sm:items-center sm:flex-row flex-col gap-2 mb-2">
        <div className="flex items-center px-2 h-full">
          {selectedAlbum && (
            <Button
              variant={"link"}
              size={"icon"}
              onClick={() => {
                setSelectedImages([]);
                setSelectedAlbum(undefined);
              }}
            >
              <ChevronLeft />
            </Button>
          )}
          <span className="font-bold text-xl">
            {selectedAlbum?.title || "Galeria"}
          </span>
        </div>
        <div className="flex items-center px-2 h-full justify-end flex-1">
          <span className="font-medium text-sm">
            {selectedImages.length === 1
              ? "1 imagem selecionada"
              : selectedImages.length > 1
              ? `${selectedImages.length} imagens selecionadas`
              : ""}
          </span>
        </div>
      </header>
      <section className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {!selectedAlbum &&
          albums.map((album) => (
            <div
              className="cursor-pointer max-h-fit p-1 bg-slate-800 rounded-lg"
              onClick={() => openAlbum(album)}
              key={album.id}
            >
              <div className="w-full rounded-lg mb-2 max-h-32 aspect-square transition-all overflow-hidden">
                <img
                  src={"../../images/folder.png"}
                  alt={album.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="text-white">{album.title}</p>
            </div>
          ))}
        {selectedAlbum &&
          photos.map((image) => (
            <div
              key={image.id}
              className={`relative cursor-pointer w-full select-none aspect-square`}
              onClick={() => toggleImageSelection(image)}
            >
              <img
                src={image.image_url}
                alt={image.title}
                className="w-full rounded-lg aspect-square object-cover"
                draggable={false}
              />
              {selectedImages.includes(image) && (
                <div className="absolute top-0 left-0 w-full h-full rounded-lg border bg-green-600 bg-opacity-50 flex items-center justify-center">
                  <Check
                    size={48}
                    className="text-green-200 animate-out repeat-1 transition-all"
                  />
                </div>
              )}
            </div>
          ))}
      </section>
      <footer className="h-12 flex items-center justify-end px-2 mt-2">
        {selectedAlbum && (
          <>
            <div className="w-full">
              <label className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  name="select-all"
                  id="select-all"
                  className="h-5 w-5 text-blue-600"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
                <span>{selectAll ? "Remover" : "Selecionar"} tudo</span>
              </label>
            </div>
            <Button
              disabled={selectedImages.length === 0 || loading}
              onClick={addPhotosToAd}
            >
              Adicionar
            </Button>
          </>
        )}
      </footer>
    </div>
  );
}
