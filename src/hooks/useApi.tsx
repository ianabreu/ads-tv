import { AlbumContext } from "@/contexts/AlbumContext";
import { useContext } from "react";
import { useAuth } from "./useAuth";

export function useApi() {
  const context = useContext(AlbumContext);
  if (!context) {
    throw new Error("Fora do contexto");
  }
  const { user } = useAuth();

  if (!user) {
    throw new Error("User not found");
  }
  return context;
}
