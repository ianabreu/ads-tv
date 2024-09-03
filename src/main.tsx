import "./index.css";
import ReactDOM from "react-dom/client";
import { router } from "@/App";
import { AuthProvider } from "@/contexts/AuthContext.tsx";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AlbumProvider } from "./contexts/AlbumContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <Toaster position="top-right" reverseOrder={false} gutter={3000} />
    <AuthProvider>
      <AlbumProvider>
        <RouterProvider router={router} />
      </AlbumProvider>
    </AuthProvider>
  </>
);
