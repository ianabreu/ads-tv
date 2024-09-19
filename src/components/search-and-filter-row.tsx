import { useState } from "react";
import { Label } from "@/components/ui/label";
import { SelectInput, CheckBoxWithText, Input } from "@/components";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AlbumService } from "@/services/AlbumService";
import { generateSlug } from "@/utils/generateSlug";
import { useAuth } from "@/hooks/useAuth";
import { Modal } from "./modal";
import { useApi } from "@/hooks/useApi";

interface SearchAndFilterRowProps {
  filterOptions: string[];
  onCreate: () => void;
}

const schema = z.object({
  title: z.string().min(1, "O título não pode estar vazio."),
});

type FormData = z.infer<typeof schema>;

function SearchAndFilterRow({ onCreate }: SearchAndFilterRowProps) {
  const { user } = useAuth();
  const { fetchAlbums } = useApi();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [reverse, setReverse] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    resetField,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  function handleValueChange(value: string) {
    setSelectedFilter(value);
  }

  async function onSubmit({ title }: FormData) {
    if (!user) return;
    try {
      await AlbumService.create({
        title,
        slug: generateSlug(title),
        userId: user.id,
      });
      resetField("title");
      setOpen(false);
      fetchAlbums();
    } catch (error) {
      if (error instanceof Error) {
        setError("title", { message: error.message });
      }
    }
  }
  function handleCloseModal() {
    resetField("title");
    setOpen(false);
  }
  return (
    <div className="mb-4">
      <div className="flex justify-between gap-8 text-slate-500 flex-col md:flex-row items-center mb-4">
        <Label className="flex flex-col gap-1 w-full">
          Pesquisar
          <div className="flex rounded-lg bg-white overflow-hidden">
            <button
              onClick={onCreate}
              className="px-2 py-3 hover:text-slate-800 text-slate-500"
            >
              <Search size={16} />
            </button>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite aqui..."
              className="outline-none ring-0 border-none placeholder:text-slate-500 text-slate-800"
            />
          </div>
        </Label>
        <div className="flex justify-between gap-8 flex-col md:flex-row items-start md:items-center text-nowrap w-full">
          <Label className="flex flex-col gap-1 w-full">
            Ordenação
            <SelectInput
              value={selectedFilter}
              onValueChange={handleValueChange}
              options={["Data de Modificação"]}
              placehoder="Ordenar por"
            />
          </Label>
          <CheckBoxWithText
            onCheck={() => {
              setReverse(!reverse);
            }}
            checked={reverse}
          >
            Ordem Reversa
          </CheckBoxWithText>
        </div>
        <Button
          variant={"default"}
          size={"sm"}
          className="w-full md:max-w-40"
          onClick={() => {
            setOpen(true);
          }}
        >
          {<Plus />} Novo Álbum
        </Button>
      </div>
      <hr className="border-slate-700" />

      <Modal isOpen={open} onClose={handleCloseModal} header="Novo álbum">
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
      </Modal>
    </div>
  );
}

export { SearchAndFilterRow };
