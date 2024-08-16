export function EmptyList() {
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
        <p className="text-center">Nenhuma foto encontrada.</p>
        <p className="text-center">Faça upload de suas fotos</p>
      </div>
    </div>
  );
}
