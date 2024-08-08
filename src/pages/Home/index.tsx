import useNavigation from "../../hooks/useNatigation";

export default function Home() {
  const { navigate, paths } = useNavigation();

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      Home
      {paths.map((path, index) => (
        <button key={index} onClick={() => navigate(path.link)}>
          {path.name}
        </button>
      ))}
    </div>
  );
}
