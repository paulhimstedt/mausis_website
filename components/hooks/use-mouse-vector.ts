"use client";

import { RefObject, useEffect, useState } from "react";

export const useMouseVector = (
  containerRef?: RefObject<HTMLElement | SVGElement | null>,
) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [vector, setVector] = useState({ dx: 0, dy: 0 });

  useEffect(() => {
    let lastPosition = { x: 0, y: 0 };

    const updatePosition = (x: number, y: number) => {
      let newX: number;
      let newY: number;

      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        newX = x - rect.left;
        newY = y - rect.top;
      } else {
        newX = x;
        newY = y;
      }

      const dx = newX - lastPosition.x;
      const dy = newY - lastPosition.y;

      setVector({ dx, dy });
      setPosition({ x: newX, y: newY });
      lastPosition = { x: newX, y: newY };
    };

    const handleMouseMove = (event: MouseEvent) => {
      updatePosition(event.clientX, event.clientY);
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) {
        return;
      }
      updatePosition(touch.clientX, touch.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [containerRef]);

  return { position, vector };
};
