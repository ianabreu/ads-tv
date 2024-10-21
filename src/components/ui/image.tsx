import React, { useState } from "react";
import loadingImage from "@/assets/photo.svg";
import { cn } from "@/lib/utils";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ src, className, ...props }, ref) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
      <img
        className={cn(className, "object-contain h-full w-auto")}
        onLoad={() => {
          setIsLoading(false);
        }}
        ref={ref}
        src={isLoading ? loadingImage : src}
        {...props}
      />
    );
  }
);
Image.displayName = "Image";
export { Image };
