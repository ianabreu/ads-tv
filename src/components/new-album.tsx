import { Input } from "@/components";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlbumService } from "@/services/AlbumService";
import { generateSlug } from "@/utils/generateSlug";

interface NewAlbumProps {
  handleCloseModal: () => void;
}

export function NewAlbum({ handleCloseModal }: NewAlbumProps) {
  const { user } = useAuth();

  const NewAlbumSchema = z.object({
    title: z.string().min(1, "O título não pode estar vazio."),
  });

  type FormData = z.infer<typeof NewAlbumSchema>;

  const {
    register,
    handleSubmit,
    setError,
    resetField,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(NewAlbumSchema),
    mode: "onSubmit",
  });

  async function onSubmit({ title }: FormData) {
    if (!user) return;
    try {
      await AlbumService.create({
        title,
        slug: generateSlug(title),
        userId: user.id,
      });
      resetField("title");
      handleCloseModal();
    } catch (error) {
      if (error instanceof Error) {
        setError("title", { message: error.message });
      }
    }
  }

  return (
    <form action="" method="post" onSubmit={handleSubmit(onSubmit)}>
      <Label className="my-2 flex" htmlFor="title">
        Título
      </Label>
      <div className="flex w-full gap-2">
        <Input
          id="title"
          name="title"
          register={register}
          type="text"
          error={errors.title?.message}
          autoFocus
        />
        <Button type="submit" variant={"default"} size={"icon"}>
          <Plus />
        </Button>
      </div>
    </form>
  );
}
