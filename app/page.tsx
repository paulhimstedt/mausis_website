import type { AnniversaryImageManifest } from "@/content/image-types";
import imageManifest from "@/content/image-manifest.json";
import { AnniversaryHome } from "@/components/ui/anniversary-home";

export default function Home() {
  const withBasePath = (src: string) => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    if (!src.startsWith("/")) {
      return src;
    }
    return `${basePath}${src}`;
  };

  const { images } = imageManifest as AnniversaryImageManifest;
  const prefixedImages = images.map((image) => ({
    ...image,
    originalSrc: withBasePath(image.originalSrc),
    heroSrc: withBasePath(image.heroSrc),
    thumbSrc: withBasePath(image.thumbSrc),
  }));

  return <AnniversaryHome images={prefixedImages} />;
}
