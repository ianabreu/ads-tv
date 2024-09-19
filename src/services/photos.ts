// import { Photo } from "@/types/Photo";
// import { storage } from "@/lib/firebase";
// import {
//   ref,
//   listAll,
//   getDownloadURL,
//   list,
//   deleteObject,
// } from "firebase/storage";

// async function getAll(): Promise<Photo[]> {
//   const list: Photo[] = [];
//   const imagesFolder = ref(storage, "images");
//   const photoList = await listAll(imagesFolder);

//   for (const i in photoList.items) {
//     const photoUrl = await getDownloadURL(photoList.items[i]);
//     list.push({
//       name: photoList.items[i].name,
//       url: photoUrl,
//       slug: photoList.items[i].fullPath,
//     });
//   }

//   return list;
// }
// async function getByPage({
//   maxResults,
//   nextPage,
// }: {
//   maxResults: number;
//   nextPage: string | null;
// }): Promise<{ nextPageToken?: string; listPhotos: Photo[] }> {
//   const listPhotos: Photo[] = [];
//   const imagesFolder = ref(storage, "images");
//   const photoList = await list(imagesFolder, {
//     maxResults: maxResults,
//     pageToken: nextPage,
//   });
//   const nextPageToken = photoList.nextPageToken;
//   for (const i in photoList.items) {
//     const photoUrl = await getDownloadURL(photoList.items[i]);
//     listPhotos.push({
//       name: photoList.items[i].name,
//       url: photoUrl,
//       slug: photoList.items[i].fullPath,
//     });
//   }

//   return { nextPageToken, listPhotos };
// }

// async function deletePhoto(fullPath: string) {
//   try {
//     const photoRef = ref(storage, fullPath);
//     await deleteObject(photoRef);
//     return true;
//   } catch (error) {
//     console.log("deletePhoto ", error);
//     return false;
//   }
// }

// export { getAll, getByPage, deletePhoto };
