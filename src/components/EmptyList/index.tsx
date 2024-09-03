const content = {
  album: {
    message1: "Nenhum álbum encontrado",
    message2: "Crie um álbum para começar.",
  },
  photo: {
    message1: "Nenhuma foto encontrada",
    message2: "Faça upload de suas fotos",
  },
};
export function EmptyList({ type = "photo" }: { type?: keyof typeof content }) {
  return (
    <div className="flex flex-col gap-4 justify-center items-center h-full w-full">
      <div className="w-40">
        <img
          src={"images/empty-box.svg"}
          alt="Lista vazia"
          width={0}
          height={0}
          className="w-full h-full object-contain"
        />
      </div>
      <div>
        <p className="text-center">{content[type].message1}</p>
        <p className="text-center">{content[type].message2}</p>
      </div>
    </div>
  );
}
