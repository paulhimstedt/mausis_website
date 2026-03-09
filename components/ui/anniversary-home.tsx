"use client";

import { useCallback } from "react";

import type { AnniversaryImage } from "@/content/image-types";
import { siteContent } from "@/content/site-content";
import { AnimatedMarqueeHero } from "@/components/ui/hero-3";
import { LoveTimeline } from "@/components/ui/love-timeline";
import { PhotoGrid } from "@/components/ui/photo-grid";

interface AnniversaryHomeProps {
  images: AnniversaryImage[];
}

export const AnniversaryHome = ({ images }: AnniversaryHomeProps) => {
  const scrollToGallery = useCallback(() => {
    document.getElementById("galerie")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  return (
    <main className="overflow-x-hidden pb-20">
      <AnimatedMarqueeHero
        tagline={siteContent.eyebrow}
        title={siteContent.heroTitle}
        description={siteContent.heroDescription}
        ctaText={siteContent.ctaText}
        images={images.map((image) => image.thumbSrc)}
        onCtaClick={scrollToGallery}
      />

      <LoveTimeline items={siteContent.timeline} />
      <PhotoGrid images={images} />
    </main>
  );
};
