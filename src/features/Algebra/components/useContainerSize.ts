import { useRef, useState, useLayoutEffect } from "react";

type Size = { width: number; height: number };

/**
 * Hook qui observe la taille d’un conteneur et renvoie sa largeur/hauteur
 * utile pour rendre un canvas ou une scène Konva responsive.
 */
export function useContainerSize(maxSize = 680) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<Size>({ width: maxSize, height: maxSize });

  useLayoutEffect(() => {
    let frameId: number;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        // carré par défaut, mais extensible
        const canvasSize = Math.min(width, height, maxSize);
        cancelAnimationFrame(frameId);
        frameId = requestAnimationFrame(() => {
          setSize({ width: canvasSize, height: canvasSize });
        });
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [maxSize]);

  return { ref, size };
}
