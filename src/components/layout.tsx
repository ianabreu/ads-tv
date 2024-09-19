import { Header } from "@/components";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
