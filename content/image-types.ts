export interface AnniversaryImage {
  id: string;
  originalName: string;
  originalSrc: string;
  heroSrc: string;
  thumbSrc: string;
}

export interface AnniversaryImageManifest {
  generatedAt: string;
  signature: string;
  count: number;
  images: AnniversaryImage[];
}
