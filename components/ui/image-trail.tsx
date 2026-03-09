"use client";

import { Children, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  type AnimationSequence,
  motion,
  type Target,
  type Transition,
  useAnimate,
  useAnimationFrame,
} from "framer-motion";
import { v4 as uuidv4 } from "uuid";

import { useMouseVector } from "@/components/hooks/use-mouse-vector";

type TrailSegment = [Target, Transition];
type TrailAnimationSequence = TrailSegment[];

interface ImageTrailProps {
  children: React.ReactNode;
  containerRef?: React.RefObject<HTMLElement | null>;
  newOnTop?: boolean;
  rotationRange?: number;
  animationSequence?: TrailAnimationSequence;
  interval?: number;
  velocityDependentSpawn?: boolean;
  mobileAutoPlay?: boolean;
  desktopAutoPlay?: boolean;
  mobileScaleMultiplier?: number;
  desktopScaleMultiplier?: number;
  autoDriftPattern?: "loop" | "zigzag";
  maxTrailItems?: number;
}

interface TrailItem {
  id: string;
  x: number;
  y: number;
  rotation: number;
  animationSequence: TrailAnimationSequence;
  scale: number;
  child: React.ReactNode;
}

const ImageTrail = ({
  children,
  newOnTop = true,
  rotationRange = 15,
  containerRef,
  animationSequence = [
    [{ opacity: 1, scale: 1.08 }, { duration: 0.2, ease: "circOut" }],
    [{ opacity: 1, scale: 1 }, { duration: 1.45, ease: "linear" }],
    [{ opacity: 0, scale: 0.82 }, { duration: 0.38, ease: "easeOut" }],
  ],
  interval = 100,
  velocityDependentSpawn = false,
  mobileAutoPlay = true,
  desktopAutoPlay = false,
  mobileScaleMultiplier = 1.24,
  desktopScaleMultiplier = 1,
  autoDriftPattern = "loop",
  maxTrailItems = 12,
}: ImageTrailProps) => {
  const [trailItems, setTrailItems] = useState<TrailItem[]>([]);
  const lastAddedTimeRef = useRef(0);
  const currentIndexRef = useRef(0);
  const intervalRef = useRef(interval);
  const childrenRef = useRef<React.ReactNode[]>([]);
  const configRef = useRef({
    newOnTop,
    rotationRange,
    animationSequence,
    maxTrailItems,
  });
  const [isTouchDevice, setIsTouchDevice] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    return coarsePointer || navigator.maxTouchPoints > 0;
  });

  const { position: mousePosition, vector: mouseVector } =
    useMouseVector(containerRef);
  const lastMousePosRef = useRef(mousePosition);

  const childrenArray = useMemo(() => Children.toArray(children), [children]);

  useEffect(() => {
    childrenRef.current = childrenArray;
    currentIndexRef.current = 0;
  }, [childrenArray]);

  useEffect(() => {
    configRef.current = {
      newOnTop,
      rotationRange,
      animationSequence,
      maxTrailItems,
    };
  }, [animationSequence, maxTrailItems, newOnTop, rotationRange]);

  useEffect(() => {
    intervalRef.current = interval;
  }, [interval]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: coarse)");
    const updateTouchState = () => {
      setIsTouchDevice(mediaQuery.matches || navigator.maxTouchPoints > 0);
    };

    mediaQuery.addEventListener("change", updateTouchState);
    return () => {
      mediaQuery.removeEventListener("change", updateTouchState);
    };
  }, []);

  const addToTrail = useCallback((point: { x: number; y: number }, scale = 1) => {
    const pool = childrenRef.current;
    const { animationSequence, maxTrailItems, newOnTop, rotationRange } =
      configRef.current;

    if (pool.length === 0) {
      return;
    }

    const selected = pool[currentIndexRef.current];
    currentIndexRef.current = (currentIndexRef.current + 1) % pool.length;

    const newItem: TrailItem = {
      id: uuidv4(),
      x: point.x,
      y: point.y,
      rotation: (Math.random() - 0.5) * rotationRange * 2,
      animationSequence,
      scale,
      child: selected,
    };

    setTrailItems((previous) => {
      const next = newOnTop ? [...previous, newItem] : [newItem, ...previous];
      if (next.length <= maxTrailItems) {
        return next;
      }
      return newOnTop
        ? next.slice(next.length - maxTrailItems)
        : next.slice(0, maxTrailItems);
    });
  }, []);

  const removeFromTrail = useCallback((itemId: string) => {
    setTrailItems((previous) => previous.filter((item) => item.id !== itemId));
  }, []);

  useAnimationFrame((time) => {
    const autoplayActive = isTouchDevice ? mobileAutoPlay : desktopAutoPlay;
    if (autoplayActive) {
      return;
    }

    if (
      lastMousePosRef.current.x === mousePosition.x &&
      lastMousePosRef.current.y === mousePosition.y
    ) {
      return;
    }

    const movementSpeed = Math.hypot(mouseVector.dx, mouseVector.dy);
    if (velocityDependentSpawn && movementSpeed < 1.8) {
      return;
    }

    if (time - lastAddedTimeRef.current < intervalRef.current) {
      return;
    }

    lastMousePosRef.current = mousePosition;
    lastAddedTimeRef.current = time;
    addToTrail(mousePosition, 1);
  });

  useEffect(() => {
    const autoplayActive = isTouchDevice ? mobileAutoPlay : desktopAutoPlay;
    if (!autoplayActive) {
      return;
    }

    let phase = 0;
    const scale = isTouchDevice ? mobileScaleMultiplier : desktopScaleMultiplier;

    const spawnAtDriftPosition = () => {
      const host = containerRef?.current;
      const width = host?.clientWidth ?? window.innerWidth;
      const height = host?.clientHeight ?? window.innerHeight;

      const normalizedX =
        autoDriftPattern === "zigzag"
          ? 0.1 +
            0.8 * ((Math.sin(phase * 1.25) + 1) / 2) +
            0.04 * Math.sin(phase * 2.8)
          : 0.08 + 0.84 * ((Math.sin(phase) + 1) / 2);

      const normalizedY =
        autoDriftPattern === "zigzag"
          ? 0.22 +
            0.58 * ((Math.cos(phase * 0.8) + 1) / 2) +
            0.035 * Math.cos(phase * 2.1)
          : 0.18 + 0.64 * ((Math.cos(phase * 1.05) + 1) / 2);

      addToTrail(
        {
          x: width * normalizedX,
          y: height * normalizedY,
        },
        scale,
      );

      phase += isTouchDevice ? 0.26 : 0.22;
    };

    const timer = window.setInterval(
      spawnAtDriftPosition,
      Math.max(220, intervalRef.current * 2),
    );

    return () => {
      window.clearInterval(timer);
    };
  }, [
    autoDriftPattern,
    containerRef,
    desktopAutoPlay,
    desktopScaleMultiplier,
    isTouchDevice,
    mobileAutoPlay,
    mobileScaleMultiplier,
    addToTrail,
  ]);

  return (
    <div className="pointer-events-none relative h-full w-full">
      {trailItems.map((item) => (
        <TrailItem key={item.id} item={item} onComplete={removeFromTrail} />
      ))}
    </div>
  );
};

interface TrailItemProps {
  item: TrailItem;
  onComplete: (id: string) => void;
}

const TrailItem = ({ item, onComplete }: TrailItemProps) => {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const sequence = item.animationSequence.map((segment: TrailSegment) => [
      scope.current,
      ...segment,
    ]);

    animate(sequence as AnimationSequence)
      .then(() => {
        onComplete(item.id);
      })
      .catch(() => {
        onComplete(item.id);
      });
  }, [animate, item.animationSequence, item.id, onComplete, scope]);

  return (
    <motion.div
      ref={scope}
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{
        left: item.x,
        top: item.y,
        rotate: item.rotation,
        scale: item.scale,
      }}
    >
      {item.child}
    </motion.div>
  );
};

export { ImageTrail };
