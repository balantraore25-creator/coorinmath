import { useRef, useState, useLayoutEffect } from "react";

/**
 * Hook qui observe la taille d’un conteneur et renvoie sa largeur/hauteur
 * utile pour rendre un canvas ou une scène Konva responsive.
 */
export function useContainerSize(maxSize = 680) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: maxSize, height: maxSize });

  useLayoutEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        const canvasSize = Math.min(width, maxSize);
        setSize({ width: canvasSize, height: canvasSize });
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [maxSize]);

  return { ref, size };
}
