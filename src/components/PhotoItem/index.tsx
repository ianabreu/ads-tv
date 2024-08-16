import { Photo } from "@/types/Photo";
import { AspectRatio } from "../ui/aspect-ratio";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Eye, Trash } from "lucide-react";
// import { api } from "@/lib/api";

interface PhotoItemProps {
  photo: Photo;
}
export function PhotoItem({ photo }: PhotoItemProps) {
  return (
    <Dialog>
      <div className="bg-slate-600 p-2 rounded group">
        <AspectRatio
          ratio={16 / 9}
          className="bg-photo bg-contain bg-no-repeat bg-center relative bg-slate-700 rounded"
        >
          <div
            className="
            group-hover:scale-y-100 scale-y-0 transition-all duration-600
            origin-bottom rounded
            absolute z-10 bottom-0 right-0 gap-3
            flex items-end justify-end p-2
            w-full h-full bg-gradient-to-t from-[rgba(255,255,255,0.7)] to-transparent
          "
          >
            <DialogTrigger asChild>
              <Button className="" variant={"default"} size={"icon"}>
                <Eye />
              </Button>
            </DialogTrigger>
            <Button
              className="group-hover:opacity-100 opacity-0 transition-all duration-300"
              variant={"destructive"}
              size={"icon"}
              onClick={async () => {
                // const deleted = await api.delete("/photo", {
                //   params: { slug: photo.slug },
                // });
                // console.log(deleted.data.ok);
              }}
            >
              <Trash />
            </Button>
          </div>
          <img
            src={photo.url}
            alt={photo.name}
            width={0}
            height={0}
            sizes="33vw"
            className="rounded-md object-cover w-full h-full"
          />
        </AspectRatio>
        <p className="text-xs mt-2 truncate ">{photo.name}</p>
      </div>
      <DialogContent
        className="bg-slate-600 p-4 border-slate-500"
        aria-describedby={photo.name}
      >
        <DialogHeader>
          <DialogTitle>{photo.name}</DialogTitle>
        </DialogHeader>
        <AspectRatio
          ratio={16 / 9}
          className="bg-photo bg-contain bg-no-repeat bg-center bg-slate-700 rounded"
        >
          <img
            src={photo.url}
            alt={photo.name}
            width={0}
            height={0}
            sizes="100vw"
            className="rounded-md object-cover w-full h-full"
          />
        </AspectRatio>
      </DialogContent>
    </Dialog>
  );
}
