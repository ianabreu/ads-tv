import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/Home";
import Perfil from "../pages/Perfil";
import Search from "../pages/Search";

import NotFound from "../pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/perfil/:id",
    element: <Perfil />,
  },
  {
    path: "/search",
    element: <Search />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export { router };
