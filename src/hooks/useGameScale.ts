import { BASE_HEIGHT, BASE_WIDTH } from "../utils/constants";
import { useEffect, useRef, RefObject } from "react";

const EVENT_RESIZE_NAME = "resize";

/**
 * Hook que valida el escalamiento del juego...
 * @returns
 */
export function useGameScale(): RefObject<HTMLDivElement> {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const applyZoom = () => {
      const gameEl = gameRef.current;
      if (!gameEl) return;

      const zoomX = window.innerWidth / BASE_WIDTH;
      const zoomY = window.innerHeight / BASE_HEIGHT;
      const zoom = Math.min(zoomX, zoomY);

      gameEl.style.zoom = `${zoom}`;
    };

    applyZoom();
    window.addEventListener(EVENT_RESIZE_NAME, applyZoom);

    return () => {
      window.removeEventListener(EVENT_RESIZE_NAME, applyZoom);
    };
  }, []);

  return gameRef;
}
