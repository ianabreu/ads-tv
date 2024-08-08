import { useNavigate, useParams } from "react-router-dom";

export default function useNavigation() {
  const params = useParams();
  const paths = [
    { link: "/", name: "Home" },
    { link: `/perfil/${params.id}`, name: "Perfil" },
    { link: "/search", name: "Search" },
  ];

  const navigate = useNavigate();
  return { navigate, paths, params };
}
