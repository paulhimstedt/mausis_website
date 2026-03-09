import type { AnniversaryImageManifest } from "@/content/image-types";
import imageManifest from "@/content/image-manifest.json";
import { AnniversaryHome } from "@/components/ui/anniversary-home";

export default function Home() {
  const { images } = imageManifest as AnniversaryImageManifest;
  return <AnniversaryHome images={images} />;
}
