const content = {
  album: {
    message: "Nenhum álbum encontrado",
  },
  photo: {
    message: "Nenhuma foto encontrada",
  },
  anuncio: {
    message: "Nenhum anúncio encontrado",
  },
};
export type EmptyListType = keyof typeof content;
export function EmptyList({ type = "photo" }: { type?: EmptyListType }) {
  return (
    <section className="flex flex-col items-center justify-center h-full min-h-[40vh] gap-4">
      <div className="w-32">
        <img
          src={"../images/empty-box.svg"}
          alt="Lista vazia"
          width={0}
          height={0}
          className="w-full h-full object-contain"
        />
      </div>
      <div>
        <p className="text-center">{content[type].message}</p>
      </div>
    </section>
  );
}
