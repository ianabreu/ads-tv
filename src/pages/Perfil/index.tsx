import useNavigation from "../../hooks/useNatigation";

export default function Perfil() {
  const { navigate, paths, params } = useNavigation();

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      Perfil {params.id}
      {paths.map((path, index) => (
        <button key={index} onClick={() => navigate(path.link)}>
          {path.name}
        </button>
      ))}
    </div>
  );
}
