import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Modal, Title } from "@/components";

import { Grid } from "@/components/grid";
import { NewPhoto } from "@/components/new-photo";
import { PhotoItem } from "@/components/item-photo";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Album, DB_NAME, Photo } from "@/types";
import { AlbumService } from "@/services/AlbumService";
import toast from "react-hot-toast";

export default function Photos() {
  const { slug } = useParams() as { slug: string };
  const { deletePhoto } = useApi();
  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  const [album, setAlbum] = useState<Album>();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState<boolean>(true);
  const [openNewPhoto, setOpenNewPhoto] = useState<boolean>(false);
  const navigate = useNavigate();
  useEffect(() => {
    AlbumService.getBySlug(slug).then((album) => {
      if (album) {
        setAlbum(album);
      } else {
        toast.error("Álbum não encontrado");
        navigate("/galeria", { replace: true });
      }
    });
  }, [slug, navigate]);

  useEffect(() => {
    if (album) {
      const unsubscribe = onSnapshot(
        query(
          collection(db, DB_NAME.photos),
          where("album_id", "==", album.id),
          orderBy("createdAt", "desc")
        ),
        (querySnapshot) => {
          const response: Photo[] = [];

          querySnapshot.forEach((doc) => {
            response.push({
              id: doc.id,
              album_id: doc.data().album_id,
              title: doc.data().title,
              createdAt: doc.data().createdAt,
              image_url: doc.data().image_url,
            });
          });
          setPhotos(response);
          setLoadingPhotos(false);
        }
      );

      return () => {
        unsubscribe();
      };
    }
  }, [album]);

  function handleCloseModal() {
    setOpenNewPhoto(false);
  }
  function handleOpenModal() {
    setOpenNewPhoto(true);
  }
  async function handleDeletePhoto(photo_id: string) {
    try {
      await deletePhoto(photo_id);
    } catch (error) {
      console.log(error);
    }
  }
  function handleImageLoad(id: string) {
    setLoadedImages((prevImageloaded) => [...prevImageloaded, id]);
  }
  if (album) {
    return (
      <Container>
        <Title>Fotos do Álbum: {album?.title}</Title>
        <div className="my-2 text-right">
          <Button
            variant={"default"}
            size={"sm"}
            className="w-full md:max-w-40"
            onClick={handleOpenModal}
          >
            {<Plus />} Adicionar Fotos
          </Button>
        </div>
        <hr className="border-slate-700" />

        <Grid
          loading={loadingPhotos}
          isEmpty={photos.length < 1}
          emptyType="photo"
        >
          {photos.map((photo) => (
            <PhotoItem
              key={photo.id}
              loadedImages={loadedImages}
              photo={photo}
              onImageLoad={handleImageLoad}
              deletePhoto={handleDeletePhoto}
            />
          ))}
        </Grid>
        <Modal
          isOpen={openNewPhoto}
          onClose={handleCloseModal}
          header="Adicionar fotos"
        >
          <NewPhoto handleCloseModal={handleCloseModal} album_id={album.id} />
        </Modal>
      </Container>
    );
  }
}
