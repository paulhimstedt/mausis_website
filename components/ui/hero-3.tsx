"use client";

import React, { useRef } from "react";
import { motion, type Variants } from "framer-motion";
import Image from "next/image";

import { ImageTrail } from "@/components/ui/image-trail";
import { cn } from "@/lib/utils";

interface AnimatedMarqueeHeroProps {
  tagline: string;
  title: React.ReactNode;
  description: string;
  ctaText: string;
  images: string[];
  className?: string;
  onCtaClick?: () => void;
}

const TRAIL_SIZE_CLASSES = [
  "h-36 w-28 md:h-56 md:w-40",
  "h-40 w-32 md:h-64 md:w-44",
  "h-44 w-32 md:h-72 md:w-48",
  "h-48 w-36 md:h-80 md:w-52",
] as const;

const ActionButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <motion.button
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className="mt-8 rounded-full bg-[var(--brand)] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/30 transition-colors hover:bg-[var(--brand-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
    type="button"
  >
    {children}
  </motion.button>
);

export const AnimatedMarqueeHero: React.FC<AnimatedMarqueeHeroProps> = ({
  tagline,
  title,
  description,
  ctaText,
  images,
  className,
  onCtaClick,
}) => {
  const trailContainerRef = useRef<HTMLDivElement>(null);

  const fadeInVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 110, damping: 20 },
    },
  };

  return (
    <section
      className={cn(
        "relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-24 text-center",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_15%_20%,rgba(254,205,211,0.55),transparent_45%),radial-gradient(circle_at_85%_10%,rgba(251,191,36,0.2),transparent_35%),linear-gradient(180deg,#fff7f4_0%,#fffefe_100%)]"
      />

      <div
        ref={trailContainerRef}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <ImageTrail
          containerRef={trailContainerRef}
          interval={250}
          mobileAutoPlay
          desktopAutoPlay
          mobileScaleMultiplier={1.34}
          desktopScaleMultiplier={1.18}
          autoDriftPattern="zigzag"
          maxTrailItems={7}
        >
          {images.map((src, index) => (
            <figure
              key={`${src}-${index}`}
              className={cn(
                "relative overflow-hidden rounded-2xl border border-white/90 bg-white shadow-xl shadow-rose-900/20",
                TRAIL_SIZE_CLASSES[index % TRAIL_SIZE_CLASSES.length],
              )}
            >
              <Image
                src={src}
                alt={`Gemeinsamer Moment ${index + 1}`}
                fill
                unoptimized
                sizes="(max-width: 768px) 144px, 208px"
                className="h-full w-full object-cover"
              />
            </figure>
          ))}
        </ImageTrail>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.72)_25%,rgba(255,255,255,0.38)_50%,rgba(255,255,255,0.14)_66%,rgba(255,255,255,0)_80%)]"
      />

      <div className="z-10 flex max-w-4xl flex-col items-center">
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeInVariants}
          className="mb-5 inline-flex rounded-full border border-rose-200/80 bg-white/70 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-rose-700 backdrop-blur-sm sm:text-sm"
        >
          {tagline}
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
          className="text-balance text-5xl font-semibold tracking-tight text-stone-900 sm:text-6xl md:text-7xl"
        >
          {typeof title === "string"
            ? title.split(" ").map((word, index) => (
                <motion.span
                  key={`${word}-${index}`}
                  variants={fadeInVariants}
                  className="inline-block"
                >
                  {word}&nbsp;
                </motion.span>
              ))
            : title}
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          variants={fadeInVariants}
          transition={{ delay: 0.25 }}
          className="mt-6 max-w-2xl text-pretty text-base text-stone-600 sm:text-lg"
        >
          {description}
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeInVariants}
          transition={{ delay: 0.3 }}
        >
          <ActionButton onClick={onCtaClick}>{ctaText}</ActionButton>
        </motion.div>
      </div>
    </section>
  );
};
