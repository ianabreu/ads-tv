import { Loader2 } from "lucide-react";

export function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh]">
      <Loader2 className="animate-spin" size={24} />
      <span className="text-lg">Carregando</span>
    </div>
  );
}
