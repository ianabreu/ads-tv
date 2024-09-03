import { useAuth } from "@/hooks/useAuth";
import { Button } from "../ui/button";

export function Header() {
  const { logout, loadingAuth } = useAuth();

  return (
    <header className="m-auto max-w-screen-lg p-4 flex justify-between">
      <h1 className="font-bold text-2xl text-center">Galeria de Anúncios</h1>
      <Button onClick={logout} variant={"destructive"} disabled={loadingAuth}>
        logout
      </Button>
    </header>
  );
}
