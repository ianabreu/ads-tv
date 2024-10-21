import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdsService } from "@/services/AdsService";
import { Ads } from "@/types/Ads";
import toast from "react-hot-toast";
import ImageGallery from "@/components/ImageGallery";
import { Slide } from "@/types/Slide";

const AssistirAnuncio = () => {
  const { slug } = useParams() as { slug: string };
  const navigate = useNavigate();
  const [anuncio, setAnuncio] = React.useState<Ads>({} as Ads);
  const [slides, setSlides] = React.useState<Slide[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const { ads, slides } = await AdsService.getAdsAndSlidesBySlug(slug);
        setAnuncio(ads);
        setSlides(slides);
        setLoading(false);
      } catch (e) {
        if (e instanceof Error) {
          toast.error(e.message);
        } else {
          toast.error("Anúncio não encontrado");
        }
        navigate("/");
      }
    }
    loadData();
  }, [navigate, slug]);

  if (loading) {
    return <div>Carregando</div>;
  }
  if (!loading && slides.length !== 0) {
    return (
      <ImageGallery
        images={slides.map((sl) => sl.photo_url)}
        durationInSeconds={anuncio.durationSlide}
        transitionTime="2s"
        closeSlideShow={() => navigate("/")}
      />
    );
  }
};

export default AssistirAnuncio;
