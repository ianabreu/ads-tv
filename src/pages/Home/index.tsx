import { Container } from "@/components/Container";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApi } from "@/hooks/useApi";
import { FormEvent } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const { createAlbum, loading } = useApi();

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
      {/*Area upload*/}

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
      {/*Area lista de fotos*/}
      {/* {listPhotos.length === 0 ? (
        <EmptyList />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 sm:grid-cols-3 gap-8 items-center ">
            {listPhotos.map((photo, index) => (
              <PhotoItem photo={photo} key={index} />
            ))}
          </div>
          <PaginationPhoto />
        </>
      )} */}
      <Link to={"/albuns"}>
        <p className="bg-green-500 h-11 w-fit rounded p-4 flex items-center mt-5">
          Albuns
        </p>
      </Link>
    </Container>
  );
}
