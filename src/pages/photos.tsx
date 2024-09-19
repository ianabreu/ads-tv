import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Container, SearchAndFilterRow, Title } from "@/components";

import { PhotoService } from "@/services/PhotoService";
import { AlbumService } from "@/services/AlbumService";
import { Photo } from "@/types";
import { Grid } from "@/components/grid";

export default function Photos() {
  const { slug } = useParams();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedAlbum] = useState<string | undefined>(slug);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadImages, setLoadImages] = useState<string[]>([]);

  useEffect(() => {
    async function fetchPhotos() {
      if (!selectedAlbum) {
        return;
      }
      try {
        const { id } = await AlbumService.getBySlug(selectedAlbum);

        const photoList = await PhotoService.getByAlbumId(id);
        setPhotos(photoList);
        setLoading(false);
      } catch (error) {
        console.log(error);

        throw new Error("fetchAlbuns");
      }
    }
    fetchPhotos();
  }, [selectedAlbum]);

  function handleImageLoad(id: string) {
    setLoadImages((prevImageloaded) => [...prevImageloaded, id]);
  }

  return (
    <Container>
      <Title>Fotos</Title>
      <SearchAndFilterRow filterOptions={["ian"]} onCreate={() => {}} />
      <Grid loading={loading} isEmpty={photos.length < 1} emptyType="photo">
        {photos.map((photo) => (
          <Link to={photo.image_url} target="_blank" key={photo.id}>
            <section className="w-full rounded-lg p-2 bg-slate-700">
              <div
                className="w-full rounded-lg h-auto aspect-square bg-slate-300"
                style={{
                  display: loadImages.includes(photo.id) ? "none" : "block",
                }}
              ></div>

              <div
                className="w-full rounded-lg mb-2 max-h-auto aspect-square transition-all overflow-hidden"
                style={{
                  display: loadImages.includes(photo.id) ? "block" : "none",
                }}
              >
                <img
                  src={photo.image_url || "./images/folder.png"}
                  alt={photo.title}
                  className="h-full w-full object-cover"
                  onLoad={() => {
                    handleImageLoad(photo.id);
                  }}
                />
              </div>

              <span className="text-sm mt-2 text-background text-ellipsis line-clamp-2">
                {photo.title}
              </span>
            </section>
          </Link>
        ))}
      </Grid>
    </Container>
  );
}
