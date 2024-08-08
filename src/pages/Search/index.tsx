// import useNavigation from "../../hooks/useNatigation";
import ImageGallery from "../../ImageGallery";

export default function Search() {
  // const { navigate, paths } = useNavigation();
  const images = [
    "https://cdn.pixabay.com/photo/2023/12/13/15/24/st-isaacs-cathedral-8447100_1280.jpg",
    "https://media.istockphoto.com/id/1454773665/pt/foto/winter-in-st-petersburg.jpg?s=1024x1024&w=is&k=20&c=gDHrP7a_mHSLZ5djRMsy_r8PPAQ8kraBqschl9K7U5A=",
    "https://media.istockphoto.com/id/1678211217/pt/foto/saint-isaacs-cathedral-and-spit-of-vasilievsky-island-seen-from-neva-river-dramatic-rainy.jpg?s=1024x1024&w=is&k=20&c=Y0H7lLgoUiPqDyyRaEC22s1FOMY0BGkgrl6RYUFSk14=",
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <ImageGallery images={images} />
    </div>
  );
}
