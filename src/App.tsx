import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Private } from "@/routes/Private";

import Login from "@/pages/login";
import Register from "@/pages/register";

import PageNotFound from "@/pages/error";
import Anuncios from "@/pages/anuncios";
import Galeria from "@/pages/gallery";
import Fotos from "@/pages/photos";
import EditarAnuncio from "./pages/editar-anuncio";
import AssistirAnuncio from "./pages/assistir-anuncio";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/", // Todos os anúncios, privado.
        element: (
          <Private>
            <Anuncios />
          </Private>
        ),
      },
      {
        path: "/galeria", // Todos os albums
        element: (
          <Private>
            <Galeria />
          </Private>
        ),
      },
      {
        path: "/albuns/:slug", // todas as fotos pertencentes ao album
        element: (
          <Private>
            <Fotos />
          </Private>
        ),
      },
      {
        path: "/editar/anuncio/:slug", // Editar Anuncio
        element: (
          <Private>
            <EditarAnuncio />
          </Private>
        ),
      },
    ],
  },
  {
    path: "/anuncio/:slug", // Anuncio específico Reprodução, PUBLICO
    element: <AssistirAnuncio />,
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
