import { AlbumItem } from "@/components/AlbumItem";
import { Container } from "@/components/Container";
import { EmptyList } from "@/components/EmptyList";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApi } from "@/hooks/useApi";
import { Plus } from "lucide-react";
import { FormEvent } from "react";

export default function Albuns() {
  const { albuns, createAlbum, loading } = useApi();

  function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("album")?.toString();
    if (!title) {
      return;
    }
    createAlbum(title);
    e.currentTarget.reset();
  }
  return (
    <Container>
      <form onSubmit={handleCreate}>
        <Input
          className="text-foreground"
          type="text"
          name="album"
          id="album"
        />
        <Button type="submit" variant={"default"} disabled={loading}>
          Cadastrar
        </Button>
      </form>
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold my-2">Albuns</h2>
        <Button variant={"default"} size={"sm"}>
          {<Plus />} Novo Álbum
        </Button>
      </div>
      {albuns.length === 0 && <EmptyList />}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {albuns.length != 0 &&
          albuns.map((album) => <AlbumItem album={album} key={album.id} />)}
      </div>
    </Container>
  );
}
