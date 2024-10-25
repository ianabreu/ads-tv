import { Container, Modal, Title } from "@/components";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { AdsService } from "@/services/AdsService";
import { Ads, Photo } from "@/types";
import { Plus, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { Slide } from "@/types/Slide";
import { SelectItems } from "@/components/select-items";
import { Image } from "@/components/ui/image";
import { z, ZodError } from "zod";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { InputUI } from "@/components/inputRef";
import { v4 as uuidv4 } from "uuid";

const schema = z.object({
  title: z.string().min(1, "O título não pode estar vazio."),
  duration: z.coerce
    .number()
    .min(3, { message: "A duração deve ser de no mínimo 3 segundos." })
    .max(60, { message: "A duração máxima é de 60 segundos (1 minuto)." }),
});

export default function EditarAnuncio() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { slug } = useParams() as { slug: string };
  const [anuncio, setAnuncio] = useState<Ads>({} as Ads);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ title?: string; duration?: string }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const dialogSave = [
    {
      title: "Salvar como rascunho?",
      confirmationText: "Salvar",
      contentText: "O anúncio não ficará disponível até que seja publicado.",
      onConfirm: () => {
        publish("draft");
        setIsOpenDialog(false);
      },
    },
    {
      title: "Deseja publicar este anúncio?",
      confirmationText: "Publicar",
      contentText: "O anúncio ficará disponível para reprodução.",
      onConfirm: () => {
        publish("publish");
        setIsOpenDialog(false);
      },
    },
    {
      title: "Deseja excluir todo o anúncio?",
      confirmationText: "Excluir",
      contentText: "Exta ação não poderá ser desfeita.",
      onConfirm: () => {
        deleteAds(anuncio.id);
        setIsOpenDialog(false);
      },
    },
  ];

  const [dialogContent, setDialogContent] = useState<(typeof dialogSave)[0]>({
    title: dialogSave[1].title,
    confirmationText: dialogSave[1].confirmationText,
    contentText: dialogSave[1].contentText,
    onConfirm: dialogSave[1].onConfirm,
  });

  const inputTitle = useRef<HTMLInputElement | null>(null);
  const inputDuration = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    async function loadSlides() {
      const slidesResponse = await AdsService.getSlides(anuncio.id);
      setSlides(slidesResponse);
    }
    if (anuncio.id) {
      loadSlides();
    }
  }, [anuncio.id]);

  useEffect(() => {
    AdsService.getBySlug(slug)
      .then((anuncio) => {
        if (!anuncio) {
          navigate("/");
          throw new Error("Anúncio não localizado");
        }
        if (user?.id != anuncio?.user_id) {
          navigate("/");
          throw new Error("Não autorizado");
        }
        if (inputTitle.current) {
          inputTitle.current.value = anuncio.title;
        }
        if (inputDuration.current) {
          inputDuration.current.value = anuncio.durationSlide.toString();
        }
        setAnuncio(anuncio);
      })
      .catch((error) => {
        if (error instanceof Error) {
          toast.error(error.message);
          return;
        }
        toast.error("Erro não identificado");
      });
  }, [slug, user, navigate]);

  useEffect(() => {
    if (modalIsOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [modalIsOpen]);

  function handleAddSlides(newPhotoList: Photo[]) {
    const slideList = [...slides];
    let lastOrder = 0;
    if (slideList.length != 0) {
      lastOrder = slideList[slideList.length - 1].order;
    }
    let acc = 1;
    for (const photo of newPhotoList) {
      const id = uuidv4();

      slideList.push({
        id: id,
        ads_id: anuncio.id,
        photo_id: photo.id,
        photo_url: photo.image_url,
        order: lastOrder + acc,
      });
      acc += 1;
    }
    setSlides(slideList);
  }

  function reorder<T>(list: T[], startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }
  function onDragEnd(result: DropResult<string>) {
    if (!result.destination) return;
    const items = reorder(
      slides,
      result.source.index,
      result.destination.index
    );
    setSlides(items);
  }
  function formatOrderNumber(orderNumber: number, Totallength: number): string {
    return orderNumber.toString().padStart(Totallength.toString().length, "0");
  }

  function handleDeleteSlide(order: number) {
    setSlides(slides.filter((_, index) => index !== order));
  }
  function handleOpenDialog(type: "draft" | "publish" | "delete") {
    setDialogContent(
      dialogSave[type === "publish" ? 1 : type === "draft" ? 0 : 2]
    );
    setIsOpenDialog(true);
  }

  async function publish(type: "draft" | "publish") {
    setIsLoading(true);
    try {
      const title = inputTitle.current?.value;
      const duration = inputDuration.current?.value;
      setErrors({});
      const data = schema.parse({ title, duration });

      if (slides.length === 0) {
        toast.error("A lista de fotos está vazia.");
        setIsLoading(false);
        return;
      }
      await AdsService.updateAds(anuncio.id, data);
      await AdsService.addSlides(slides, anuncio.id);
      await AdsService.publishAds(anuncio.id, type === "draft");

      navigate("/");
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors = error.errors.reduce(
          (acc: Record<string, string>, curr) => {
            acc[curr.path[0]] = curr.message;
            return acc;
          },
          {}
        );
        setErrors(fieldErrors);
        return;
      }
      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }
      toast.error("Erro inesperado, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteAds(ads_id: string) {
    try {
      await AdsService.delete(ads_id);
      toast.success("Anúncio deletado com sucesso");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error("Erro ao deletar");
    }
  }
  return (
    <Container>
      <div className="flex sm:flex-row flex-col justify-between items-center">
        <Title line={false}>{anuncio.title}</Title>
        <Button
          variant={"destructive"}
          size={"xs"}
          className="sm:mb-0 mb-2"
          onClick={() => handleOpenDialog("delete")}
        >
          Deletar Anúncio
        </Button>
      </div>
      <hr className="border-slate-700" />

      <div className="flex sm:flex-row flex-col w-full gap-2 my-2 justify-end">
        <Button
          variant={"default"}
          size={"sm"}
          className="w-full md:max-w-40"
          onClick={() => {
            setModalIsOpen(true);
          }}
          disabled={isLoading}
        >
          {<Plus />} Adicionar imagens
        </Button>
        <Button
          variant={"outline"}
          size={"sm"}
          className="w-full md:max-w-40"
          onClick={() => {
            handleOpenDialog("draft");
          }}
          disabled={isLoading}
        >
          Salvar como rascunho
        </Button>
        <Button
          variant={"default"}
          size={"sm"}
          className="w-full md:max-w-40"
          onClick={() => {
            handleOpenDialog("publish");
          }}
          disabled={isLoading}
        >
          Publicar
        </Button>
      </div>
      <hr className="border-slate-700" />
      <div className="flex flex-col-reverse md:flex-row">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="images" type="list" direction={"vertical"}>
            {(provided) => (
              <article
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-col flex-1"
              >
                <h2 className="text-lg font-semibold text-center my-2">
                  Lista de Reprodução
                </h2>
                {slides.length === 0 && (
                  <section className="flex flex-col items-center justify-center h-full min-h-[40vh] gap-4">
                    <div className="w-32">
                      <img
                        src={"../../images/empty-box.svg"}
                        alt="Lista vazia"
                        width={0}
                        height={0}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <p className="text-center">
                        Nenhuma imagem adicionada ao projeto
                      </p>
                    </div>
                  </section>
                )}
                {slides.map((slide, index) => (
                  <Draggable
                    key={index}
                    draggableId={index.toString()}
                    index={index}
                  >
                    {(providedDrag) => (
                      <div
                        {...providedDrag.draggableProps}
                        {...providedDrag.dragHandleProps}
                        ref={providedDrag.innerRef}
                        className="flex items-center justify-center m-2 rounded-lg bg-slate-700 gap-2"
                      >
                        <span className="font-bold p-2">
                          #{formatOrderNumber(index + 1, slides.length)}
                        </span>

                        <div className="relative rounded w-[250px] h-[140.62px] flex items-center justify-center overflow-hidden bg-black">
                          <Button
                            variant={"destructive"}
                            size={"icon"}
                            className="p-2 w-auto h-auto absolute right-1 bottom-1"
                            onClick={() => handleDeleteSlide(index)}
                          >
                            <Trash size={18} />
                          </Button>
                          <Image
                            src={slide.photo_url}
                            alt={"Imagem " + slide.id}
                          />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </article>
            )}
          </Droppable>
        </DragDropContext>
        <section className="justify-start flex flex-1 flex-col">
          <h2 className="text-lg font-semibold text-center my-2">
            Configurações do Anúncio
          </h2>
          <div className="flex flex-col text-slate-800">
            <InputUI
              label="Título do Anúncio"
              name="title"
              placeholder="Título"
              type="text"
              error={errors.title}
              ref={inputTitle}
              className={errors.title ? "border-red-400" : ""}
            />
            <InputUI
              label="Duração de cada foto (seg.)"
              name="duration"
              placeholder="Ex: 5"
              type="number"
              error={errors.duration}
              ref={inputDuration}
              className={errors.duration ? "border-red-400" : ""}
            />
          </div>
        </section>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        header="Adicionar imagens"
      >
        <SelectItems
          closeModal={() => setModalIsOpen(false)}
          addSlides={handleAddSlides}
        />
      </Modal>

      <ConfirmationDialog
        open={isOpenDialog}
        onCancel={() => setIsOpenDialog(false)}
        onConfirm={dialogContent.onConfirm}
        header={dialogContent.title}
        onConfirmText={dialogContent.confirmationText}
        contentText={dialogContent.contentText}
      />
    </Container>
  );
}
