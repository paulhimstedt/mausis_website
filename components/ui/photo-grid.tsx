"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { AnniversaryImage } from "@/content/image-types";

interface PhotoGridProps {
  images: AnniversaryImage[];
}

export const PhotoGrid = ({ images }: PhotoGridProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const hasImages = images.length > 0;

  const activeImage = useMemo(() => {
    if (activeIndex === null) {
      return null;
    }
    return images[activeIndex] ?? null;
  }, [activeIndex, images]);

  const closeLightbox = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const showPrevious = useCallback(() => {
    setActiveIndex((previous) => {
      if (previous === null || images.length === 0) {
        return previous;
      }
      return (previous - 1 + images.length) % images.length;
    });
  }, [images.length]);

  const showNext = useCallback(() => {
    setActiveIndex((previous) => {
      if (previous === null || images.length === 0) {
        return previous;
      }
      return (previous + 1) % images.length;
    });
  }, [images.length]);

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
      }
      if (event.key === "ArrowLeft") {
        showPrevious();
      }
      if (event.key === "ArrowRight") {
        showNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, closeLightbox, showNext, showPrevious]);

  return (
    <section id="galerie" className="mx-auto mt-20 w-full max-w-6xl px-6 pb-12">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-semibold text-stone-900 sm:text-4xl">
          Unsere Galerie
        </h2>
        <p className="mt-2 text-sm text-stone-600 sm:text-base">
          Tippe oder klicke auf ein Bild, um es groß zu öffnen.
        </p>
      </div>

      {hasImages ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-rose-100/80 bg-white shadow-sm"
            >
              <Image
                src={image.heroSrc}
                alt={`Galerie Bild ${index + 1}`}
                fill
                unoptimized
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      ) : (
        <p className="text-center text-sm text-stone-600">Keine Bilder gefunden.</p>
      )}

      {activeImage ? (
        <div
          className="fixed inset-0 z-50 bg-black/80 px-4 py-6 backdrop-blur-sm"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Bildansicht"
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-stone-900 shadow-md"
            aria-label="Schließen"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showPrevious();
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-stone-900 shadow-md sm:left-6"
            aria-label="Vorheriges Bild"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-stone-900 shadow-md sm:right-6"
            aria-label="Nächstes Bild"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div
            className="relative mx-auto h-full w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={activeImage.heroSrc}
              alt={activeImage.originalName}
              fill
              unoptimized
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>
        </div>
      ) : null}
    </section>
  );
};
