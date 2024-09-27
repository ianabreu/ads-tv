import { HTMLProps } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Book, DoorOpen, ImagePlay, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components";

interface NavProps extends HTMLProps<HTMLElement> {
  horizontal?: boolean;
  onClick?: () => void;
}

export function Nav({
  horizontal = false,
  className,
  onClick,
  ...rest
}: NavProps) {
  const { signed, logout, loadingAuth } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <nav
      className={cn(
        className,
        horizontal
          ? "ml-10 flex items-center gap-4"
          : "px-2 pt-2 pb-3 space-y-1 sm:px-3"
      )}
      {...rest}
    >
      {signed && (
        <>
          <NavLink
            to={"/"}
            className={horizontal ? "" : "border-b-[1px] border-slate-800 p-2"}
            active={pathname === "/"}
            onClick={onClick}
          >
            <ImagePlay className="mr-1" size={16} />
            Meus Anúncios
          </NavLink>

          <NavLink
            to={"/galeria"}
            className={horizontal ? "" : "border-b-[1px] border-slate-800 p-2"}
            active={pathname === "/galeria"}
            onClick={onClick}
          >
            <Book className="mr-1" size={16} />
            Galeria
          </NavLink>
        </>
      )}

      <Button
        onClick={
          signed
            ? logout
            : () => {
                navigate("/login");
              }
        }
        variant={"link"}
        disabled={loadingAuth}
        size={"sm"}
        className={`${horizontal ? "" : "w-full p-2"} `}
      >
        {signed ? (
          <>
            <LogOut className="mr-1" size={16} /> Sair
          </>
        ) : (
          <>
            <DoorOpen className="mr-1" size={16} /> Fazer Login
          </>
        )}
      </Button>
    </nav>
  );
}
