import { db } from "@/lib/firebase";
import { Ads, DB_NAME } from "@/types";
import { Slide } from "@/types/Slide";
import { generateSlug } from "@/utils/generateSlug";
import {
  addDoc,
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  Timestamp,
  where,
  orderBy,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

interface CreateAdsProps {
  title: string;
  slug: string;
  userId: string;
}

const AdsCollection = collection(db, DB_NAME.ads);
export const AdsService = {
  create: async ({ userId, slug, title }: CreateAdsProps) => {
    try {
      const alreadyExists = await AdsService.getBySlug(slug);
      if (alreadyExists) {
        throw new Error("Anúncio já cadastrado");
      }
      const data: Pick<
        Ads,
        "created_at" | "durationSlide" | "slug" | "title" | "user_id" | "draft"
      > = {
        user_id: userId,
        title,
        slug,
        durationSlide: 5,
        created_at: Timestamp.fromDate(new Date()),
        draft: true,
      };

      const ads = await addDoc(AdsCollection, data);

      const response: Ads = {
        id: ads.id,
        ...data,
      };

      return response;
    } catch (error) {
      console.log(error);
      throw new Error(
        error instanceof Error ? error.message : "Erro ao cadastrar"
      );
    }
  },
  getBySlug: async (slug: string) => {
    try {
      const querySnapshot = await getDocs(
        query(AdsCollection, where("slug", "==", slug))
      );
      if (querySnapshot.empty) {
        return;
      }
      const adsResponse: Ads = {
        id: querySnapshot.docs[0].id as string,
        user_id: querySnapshot.docs[0].data().user_id as string,
        title: querySnapshot.docs[0].data().title as string,
        slug: querySnapshot.docs[0].data().slug as string,
        durationSlide: querySnapshot.docs[0].data().durationSlide as number,
        created_at: querySnapshot.docs[0].data().createdAt as Timestamp,
        draft: querySnapshot.docs[0].data().draft as boolean,
      };
      return adsResponse;
    } catch (error) {
      console.log(error);
      return;
    }
  },
  updateAds: async (
    ads_id: string,
    data: { title: string; duration: number }
  ) => {
    const ads = doc(db, DB_NAME.ads, ads_id);
    const alreadyExists = await AdsService.getBySlug(generateSlug(data.title));
    if (alreadyExists && alreadyExists.id !== ads_id) {
      throw new Error("Título já cadastrado. Escolha outro título");
    }
    await updateDoc(ads, {
      title: data.title,
      slug: generateSlug(data.title),
      durationSlide: data.duration,
    });
  },
  publishAds: async (ads_id: string, isDraft: boolean = false) => {
    await updateDoc(doc(db, DB_NAME.ads, ads_id), {
      draft: isDraft,
    });
  },
  addSlides: async (slides: Slide[], ads_id: string) => {
    if (!ads_id) {
      throw new Error("Anúncio não informado");
    }
    if (slides.length === 0) {
      throw new Error("Nenhuma foto enviada");
    }
    try {
      const slidesCollection = collection(
        db,
        DB_NAME.ads,
        ads_id,
        DB_NAME.slides
      );
      const slidesID = slides.map((slide) => slide.id);
      const querySnapshot = await getDocs(query(slidesCollection));
      querySnapshot.forEach(async (document) => {
        if (!slidesID.includes(document.id)) {
          await deleteDoc(
            doc(db, DB_NAME.ads, ads_id, DB_NAME.slides, document.id)
          );
        }
      });

      for (let i = 0; i < slides.length; i++) {
        const slide: Slide = {
          id: slides[i].id,
          ads_id: slides[i].ads_id,
          photo_id: slides[i].photo_id,
          photo_url: slides[i].photo_url,
          order: i,
        };
        await setDoc(
          doc(db, DB_NAME.ads, ads_id, DB_NAME.slides, slide.id),
          slide
        );
      }
    } catch (error) {
      console.log(error);
    }
  },
  getSlides: async (ads_id: string) => {
    const q = query(
      collection(db, DB_NAME.ads, ads_id, DB_NAME.slides),
      orderBy("order", "asc")
    );

    const data = await getDocs(q);
    const slides: Slide[] = [];
    data.forEach((doc) => {
      slides.push({
        id: doc.id,
        ads_id: doc.data().ads_id,
        photo_id: doc.data().photo_id,
        photo_url: doc.data().photo_url,
        order: doc.data().order,
      });
    });
    return slides;
  },
  getAdsAndSlidesBySlug: async (slug: string) => {
    try {
      const ads = await AdsService.getBySlug(slug);
      if (!ads) {
        throw new Error("Álbum não encontrado");
      }
      if (ads.draft) {
        throw new Error("Álbum não pode ser exibido");
      }
      const slides = await AdsService.getSlides(ads.id);

      return {
        ads,
        slides,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Ops! Erro inesperado. Tente novamente");
      }
    }
  },
  delete: async (ads_id: string) => {
    try {
      const slidesCollection = collection(
        db,
        DB_NAME.ads,
        ads_id,
        DB_NAME.slides
      );
      const querySnapshot = await getDocs(query(slidesCollection));
      querySnapshot.forEach(async (document) => {
        await deleteDoc(
          doc(db, DB_NAME.ads, ads_id, DB_NAME.slides, document.id)
        );
      });
      await deleteDoc(doc(db, DB_NAME.ads, ads_id));
    } catch (error) {
      console.log(error);
    }
  },
};
