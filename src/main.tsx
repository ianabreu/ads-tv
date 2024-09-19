import "./index.css";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { router } from "@/App";
import { AuthProvider } from "@/contexts/AuthContext.tsx";
import { RouterProvider } from "react-router-dom";
import { AlbumProvider } from "./contexts/AlbumContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <Toaster position="top-center" reverseOrder={false} gutter={3000} />
    <AuthProvider>
      <AlbumProvider>
        <RouterProvider router={router} />
      </AlbumProvider>
    </AuthProvider>
  </>
);
