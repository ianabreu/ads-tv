import { Photo } from "@/types/Photo";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";

export function ModalPhoto({ url, name }: Photo) {
  return (
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{name}</DialogTitle>
          <AspectRatio
            ratio={16 / 9}
            className="bg-photo bg-contain bg-no-repeat bg-center bg-slate-700 rounded"
          >
            <Image
              src={url}
              alt={name}
              quality={70}
              width={0}
              height={0}
              sizes="33vw"
              className="rounded-md object-cover w-full h-full"
              priority
            />
          </AspectRatio>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
