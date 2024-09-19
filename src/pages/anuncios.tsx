import { Container, Title } from "@/components";
import { Grid } from "@/components/grid";
import { Ads } from "@/types";

import { useState } from "react";
import { Link } from "react-router-dom";

export default function Anuncios() {
  const [anuncios] = useState<Ads[]>([]);
  const [loading] = useState(false);

  const [loadImages, setLoadImages] = useState<string[]>([]);
  function handleImageLoad(id: string) {
    setLoadImages((prevImageloaded) => [...prevImageloaded, id]);
  }

  return (
    <Container>
      <Title>Meus Anúncios</Title>
      <Grid loading={loading} isEmpty={anuncios.length < 1} emptyType="anuncio">
        {anuncios.map((anuncio) => (
          <Link to={`/albuns/${anuncio.slug}`} key={anuncio.id}>
            <section className="w-full rounded-lg p-2 bg-slate-700">
              <div
                className="w-full rounded-lg h-32 aspect-square bg-slate-300"
                style={{
                  display: loadImages.includes(anuncio.id) ? "none" : "block",
                }}
              ></div>

              <div
                className="w-full rounded-lg mb-2 max-h-32 aspect-square transition-all overflow-hidden"
                style={{
                  display: loadImages.includes(anuncio.id) ? "block" : "none",
                }}
              >
                <img
                  src={anuncio.cover || "./images/folder.png"}
                  alt={anuncio.title}
                  className="h-full w-full object-cover"
                  onLoad={() => {
                    handleImageLoad(anuncio.id);
                  }}
                />
              </div>

              <span className="text-sm mt-2 text-background text-ellipsis line-clamp-2">
                {anuncio.title}
              </span>
            </section>
          </Link>
        ))}
      </Grid>
    </Container>
  );
}
