"use client";

import { useEffect, useState } from "react";

/**
 * Detecta viewport mobile via matchMedia. Começa em `false` (mesmo valor do
 * server) e só atualiza após montar, evitando mismatch de hidratação.
 */
export function useIsMobileViewport(breakpoint = 860): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [breakpoint]);

  return isMobile;
}
