import { useState } from "react";
import { Container, SearchAndFilterRow, Title } from "@/components";
import { useApi } from "@/hooks/useApi";
import { AlbumItem } from "@/components/item-album";
import { Grid } from "@/components/grid";

export default function Gallery() {
  const { albums, deleteAlbum, loadingAlbums } = useApi();
  const [loadImages, setLoadImages] = useState<string[]>([]);
  function handleImageLoad(id: string) {
    setLoadImages((prevImageloaded) => [...prevImageloaded, id]);
  }

  return (
    <Container>
      <Title>Galeria</Title>
      <SearchAndFilterRow filterOptions={["ian"]} onCreate={() => {}} />
      <Grid
        loading={loadingAlbums}
        isEmpty={albums.length < 1}
        emptyType="album"
      >
        {albums.map((album) => (
          <AlbumItem
            album={album}
            deleteAlbum={deleteAlbum}
            loadedImages={loadImages}
            onImageLoad={handleImageLoad}
          />
        ))}
      </Grid>
    </Container>
  );
}
