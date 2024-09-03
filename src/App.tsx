import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/home";
import Fotos from "@/pages/fotos";

import Login from "@/pages/login";
import Register from "@/pages/register";

import { Layout } from "@/components/Layout";
import { Private } from "@/routes/Private";

import PageNotFound from "@/pages/error";
import Albuns from "./pages/albuns";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <Private>
            <Home />
          </Private>
        ),
      },
      {
        path: "/fotos",
        element: (
          <Private>
            <Fotos />
          </Private>
        ),
      },
      {
        path: "/albuns",
        element: (
          <Private>
            <Albuns />
          </Private>
        ),
      },
      {
        path: "/albuns/:slug",
        element: (
          <Private>
            <Fotos />
          </Private>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/cadastro",
    element: <Register />,
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

export { router };
