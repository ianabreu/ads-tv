import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loading } from "@/components";

interface PrivateProps {
  children: ReactNode;
}

export function Private({ children }: PrivateProps) {
  const { signed, loadingAuth } = useAuth();

  if (loadingAuth) {
    return <Loading />;
  }

  if (!signed) {
    return <Navigate to="/login" />;
  }

  return children;
}
