"use client";

import { useEffect, useRef } from "react";

interface SwipeEvent {
  x: number;
  y: number;
  type: "tap" | "swipe";
}

export function useSwipeControls(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  onSwipe: (event: SwipeEvent) => void
) {
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      touchStartRef.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
        time: Date.now(),
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      if (!touchStartRef.current) return;

      const touch = e.changedTouches[0];
      const rect = canvas.getBoundingClientRect();
      const endX = touch.clientX - rect.left;
      const endY = touch.clientY - rect.top;

      const deltaX = endX - touchStartRef.current.x;
      const deltaY = endY - touchStartRef.current.y;
      const deltaTime = Date.now() - touchStartRef.current.time;
      const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

      const type = distance < 10 && deltaTime < 200 ? "tap" : "swipe";

      // Scale coordinates to game canvas
      const scaleX = 800 / canvas.width;
      const scaleY = 600 / canvas.height;

      onSwipe({
        x: endX * scaleX,
        y: endY * scaleY,
        type,
      });

      touchStartRef.current = null;
    };

    // Mouse support for desktop testing
    const handleMouseClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (800 / canvas.width);
      const y = (e.clientY - rect.top) * (600 / canvas.height);
      onSwipe({ x, y, type: "tap" });
    };

    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: false });
    canvas.addEventListener("click", handleMouseClick);

    return () => {
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("click", handleMouseClick);
    };
  }, [canvasRef, onSwipe]);
}
