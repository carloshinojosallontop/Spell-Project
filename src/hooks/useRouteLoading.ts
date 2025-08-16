import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

type Options = {
  /** Espera antes de mostrar el loader (evita flashes en nav rápidas) */
  delayBeforeShow?: number; // default 120
  /** Tiempo mínimo visible del loader una vez mostrado */
  minVisible?: number; // default 380
};

/**
 * Muestra un overlay de carga con retardo antes de mostrar y mínimo visible.
 * Se auto-oculta en la MISMA navegación (no espera a la siguiente).
 */
export function useRouteLoading(opts: Options = {}) {
  const { delayBeforeShow = 120, minVisible = 380 } = opts;
  const { key } = useLocation();

  const [visible, setVisible] = useState(false);
  const showTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);

  useEffect(() => {
    // Limpia timers previos
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    let shown = false;

    // Programa "mostrar" tras el delay
    showTimerRef.current = window.setTimeout(() => {
      shown = true;
      setVisible(true);
    }, delayBeforeShow);

    // Programa "ocultar" tras delay + minVisible (misma navegación)
    hideTimerRef.current = window.setTimeout(() => {
      // si nunca llegó a mostrarse (nav súper rápida), igualmente lo dejamos oculto
      if (shown) setVisible(false);
      else setVisible(false);
      showTimerRef.current = null;
      hideTimerRef.current = null;
    }, delayBeforeShow + minVisible);

    // Limpieza al desmontar o al iniciar otra nav
    return () => {
      if (showTimerRef.current) {
        clearTimeout(showTimerRef.current);
        showTimerRef.current = null;
      }
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
      // Nota: NO ocultamos aquí; ya hay un timer para ocultar en esta navegación
    };
  }, [key, delayBeforeShow, minVisible]);

  return visible;
}