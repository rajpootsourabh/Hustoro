// src/hooks/useDebouncedEffect.js
import { useEffect, useRef } from "react";

export function useDebouncedEffect(callback, deps, delay = 300) {
  const timeoutRef = useRef();

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(callback, delay);

    return () => clearTimeout(timeoutRef.current);
  }, [...deps, delay]);
}
