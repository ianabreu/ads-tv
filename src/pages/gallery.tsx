import { useState } from "react";
import { Container, Modal, Title } from "@/components";
import { useApi } from "@/hooks/useApi";
import { AlbumItem } from "@/components/item-album";
import { Grid } from "@/components/grid";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NewAlbum } from "@/components/new-album";

export default function Gallery() {
  const { albums, deleteAlbum, loadingAlbums } = useApi();
  const [loadImages, setLoadImages] = useState<string[]>([]);

  const [openNewAlbum, setOpenNewAlbum] = useState<boolean>(false);

  function handleCloseModal() {
    setOpenNewAlbum(false);
  }

  function handleImageLoad(id: string) {
    setLoadImages((prevImageloaded) => [...prevImageloaded, id]);
  }

  return (
    <Container>
      <Title>Galeria</Title>

      <div className="my-2 text-right">
        <Button
          variant={"default"}
          size={"sm"}
          className="w-full md:max-w-40"
          onClick={() => {
            setOpenNewAlbum(true);
          }}
        >
          {<Plus />} Novo Álbum
        </Button>
      </div>
      <hr className="border-slate-700" />

      {/*--------------------------------------- Exibir lista ----------------------*/}
      <Grid
        loading={loadingAlbums}
        isEmpty={albums.length < 1}
        emptyType="album"
      >
        {albums.map((album) => (
          <AlbumItem
            key={album.id}
            album={album}
            deleteAlbum={deleteAlbum}
            loadedImages={loadImages}
            onImageLoad={handleImageLoad}
          />
        ))}
      </Grid>
      <Modal
        isOpen={openNewAlbum}
        onClose={handleCloseModal}
        header="Novo álbum"
      >
        <NewAlbum handleCloseModal={handleCloseModal} />
      </Modal>
    </Container>
  );
}
