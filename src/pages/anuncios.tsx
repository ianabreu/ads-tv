import { Container, Modal, Title } from "@/components";
import { Grid } from "@/components/grid";
import { NewAds } from "@/components/new-ads";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/useApi";
import { cn } from "@/lib/utils";
import { Edit, Play, Plus } from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Anuncios() {
  const { ads, loadingAds } = useApi();
  const [openNewAds, setOpenNewAds] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {}, []);

  const [loadImages, setLoadImages] = useState<string[]>([]);
  function handleImageLoad(id: string) {
    setLoadImages((prevImageloaded) => [...prevImageloaded, id]);
  }
  function goTo(slug: string, play: boolean = false) {
    if (play) {
      navigate(`/anuncio/${slug}`);
    } else {
      navigate(`/editar/anuncio/${slug}`);
    }
  }
  return (
    <Container>
      <Title>Meus Anúncios</Title>
      <div className="my-2 text-right">
        <Button
          variant={"default"}
          size={"sm"}
          className="w-full md:max-w-40"
          onClick={() => {
            setOpenNewAds(true);
          }}
        >
          {<Plus />} Novo Anúncio
        </Button>
      </div>
      <hr className="border-slate-700" />

      <Grid loading={loadingAds} isEmpty={ads.length < 1} emptyType="anuncio">
        {ads.map((anuncio) => (
          <section
            key={anuncio.id}
            className={cn(
              "w-full rounded-lg p-2 bg-slate-700 border-green-700 border-l-8",
              { "border-amber-700 ": anuncio.draft }
            )}
          >
            <div
              className="w-full max-w-36 rounded-lg mb-2 transition-all overflow-hidden m-auto"
              style={{
                display: loadImages.includes(anuncio.id) ? "block" : "none",
              }}
            >
              <img
                src={"./images/film.svg"}
                alt={anuncio.title}
                className="h-full w-full object-cover"
                onLoad={() => {
                  handleImageLoad(anuncio.id);
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sm text-background text-ellipsis line-clamp-2">
                {anuncio.title}
              </p>
              <p className="text-xs text-background text-ellipsis">
                <span className="font-bold">Status:</span>{" "}
                {anuncio.draft ? "Rascunho" : "Publicado"}
              </p>
              <div className="flex gap-1 w-full justify-between">
                <Button
                  variant={"alert"}
                  size={"xs"}
                  onClick={() => goTo(anuncio.slug)}
                >
                  <Edit size={16} /> Editar
                </Button>
                <Button
                  variant={"confirm"}
                  size={"xs"}
                  disabled={anuncio.draft}
                  className="select-none"
                  onClick={() => goTo(anuncio.slug, true)}
                >
                  <Play size={16} /> Assistir
                </Button>
              </div>
            </div>
          </section>
        ))}
      </Grid>
      <Modal
        isOpen={openNewAds}
        onClose={() => setOpenNewAds(false)}
        header="Novo Anúncio"
      >
        <NewAds handleCloseModal={() => setOpenNewAds(false)} />
      </Modal>
    </Container>
  );
}
