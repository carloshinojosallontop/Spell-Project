import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

type Options = {
  /** Espera antes de mostrar el loader (evita flashes en nav rápidas) */
  delayBeforeShow?: number;
  /** Tiempo mínimo visible del loader una vez mostrado */
  minVisible?: number;
};

// Clasifica la ruta por cantidad de segmentos (sin contar la barra inicial)
function routeKind(pathname: string): "home" | "class" | "spell" | "other" {
  const segs = pathname.split("/").filter(Boolean); // "" -> []
  if (segs.length === 0) return "home";   // "/"
  if (segs.length === 1) return "class";  // "/:classId"
  if (segs.length === 2) return "spell";  // "/:classId/:spellId"
  return "other";
}

/**
 * Loader de navegación con retardo + mínimo visible,
 * SOLO activo para transiciones Home ⇄ ClassPage.
 * Ignora: open/close modal (Class ⇄ Spell), Class ⇄ Class, etc.
 */
export function useRouteLoading(opts: Options = {}) {
  const { delayBeforeShow = 120, minVisible = 380 } = opts;
  const { pathname } = useLocation();

  const [visible, setVisible] = useState(false);
  const prevPathRef = useRef(pathname);
  const showTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);

  useEffect(() => {
    // Limpia timers previos
    if (showTimerRef.current) { clearTimeout(showTimerRef.current); showTimerRef.current = null; }
    if (hideTimerRef.current) { clearTimeout(hideTimerRef.current); hideTimerRef.current = null; }

    const prev = prevPathRef.current;
    const next = pathname;
    const prevKind = routeKind(prev);
    const nextKind = routeKind(next);

    // Solo mostramos loader en Home ⇄ Class
    const shouldShow =
      (prevKind === "home" && nextKind === "class") || (prevKind === "class" && nextKind === "home");

    if (!shouldShow) {
      // Nada de loader para Class ⇄ Spell (abrir/cerrar modal), Class ⇄ Class, etc.
      setVisible(false);
      prevPathRef.current = pathname;
      return;
    }

    let shown = false;

    // Programa "mostrar" tras el delay
    showTimerRef.current = window.setTimeout(() => {
      shown = true;
      setVisible(true);
    }, delayBeforeShow);

    // Programa "ocultar" tras delay + minVisible (misma navegación)
    hideTimerRef.current = window.setTimeout(() => {
      if (shown) setVisible(false);
      showTimerRef.current = null;
      hideTimerRef.current = null;
    }, delayBeforeShow + minVisible);

    // Guarda ruta actual para la siguiente comparación
    prevPathRef.current = pathname;

    // Limpieza al iniciar otra navegación o desmontar
    return () => {
      if (showTimerRef.current) { clearTimeout(showTimerRef.current); showTimerRef.current = null; }
      if (hideTimerRef.current) { clearTimeout(hideTimerRef.current); hideTimerRef.current = null; }
    };
  }, [pathname, delayBeforeShow, minVisible]);

  return visible;
}
