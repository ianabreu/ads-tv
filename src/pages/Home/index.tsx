import { Container } from "@/components/Container";
import { EmptyList } from "@/components/EmptyList";
import { useState } from "react";
import { PaginationPhoto } from "@/components/Pagination";
import { PhotoItem } from "@/components/PhotoItem";
import { Photo } from "@/types/Photo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { user, logout } = useAuth();
  const [listPhotos] = useState<Photo[]>([
    {
      name: "Teste",
      slug: "teste",
      url: "https://firebasestorage.googleapis.com/v0/b/ads-tv-2024.appspot.com/o/images%2F04.webp?alt=media&token=f2aa1309-695a-47e0-9949-487f834f7256",
    },
  ]);
  return (
    <Container>
      <Button
        onClick={() => {
          logout();
        }}
        variant={"destructive"}
      >
        Sair {user?.email}
      </Button>
      {/*Area upload*/}
      {/*Area lista de fotos*/}
      {listPhotos.length === 0 ? (
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
      )}
    </Container>
  );
}
