import { memo, useCallback, useEffect, useMemo, useState } from "react";
import c from "classnames";
import upcastIcon from "src/assets/icons/other/upcast.png";
import type { Spell as SpellType } from "src/models/spell";
import styles from "./spell.module.css";

type Props = {
  spell: SpellType;
  highlighted?: boolean;
  detailed?: boolean;
  onOpen?: (spell: SpellType) => void;
};

export const Spell = memo(function Spell({
  spell,
  highlighted,
  detailed,
  onOpen,
}: Props) {
  const [showImage, setShowImage] = useState(false);

  // Tiempos aleatorios (en segundos) — persistentes por ciclo de vida del componente
  const randomDurationSec = useMemo(() => Math.random() + 0.5, []);
  const randomDelaySec = useMemo(() => Math.random() * 2 + 1, []);
  const totalMs = useMemo(
    () => (randomDurationSec + randomDelaySec) * 1000,
    [randomDurationSec, randomDelaySec]
  );

  // CSS custom props para animaciones
  const animatedSpellStyles = useMemo(
    () =>
      ({
        "--randomDelay": `${randomDelaySec}s`,
        "--randomDuration": `${randomDurationSec}s`,
      }) as React.CSSProperties,
    [randomDelaySec, randomDurationSec]
  );

  // Mostrar imagen una vez termina la animacion + delay
  useEffect(() => {
    if (!detailed) {
      setShowImage(false);
      return;
    }
    const t = window.setTimeout(() => setShowImage(true), totalMs);
    return () => {
      window.clearTimeout(t);
      setShowImage(false);
    };
  }, [detailed, totalMs]);

  // Handlers
  const handleOpen = useCallback(() => {
    onOpen?.(spell);
  }, [onOpen, spell]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleOpen();
      }
    },
    [handleOpen]
  );

  return (
    <article
      role="button"
      aria-label={spell.name}
      aria-haspopup="dialog"
      tabIndex={-1}
      className={c(
        styles.spell,
        highlighted && styles.highlighted,
        detailed && styles.detailed
      )}
      data-spell-id={spell.id}
      data-detailed={detailed ? "true" : "false"}
      style={animatedSpellStyles}
      onMouseDown={(e) => {
        // evita “steal focus” del click cuando se navega con teclado en modo detallado
        if (detailed) e.preventDefault();
      }}
      onClick={handleOpen}
      onKeyDown={handleKeyDown}
    >
      {detailed && showImage && (
        <div className={styles.image}>
          <img
            src={spell.icon}
            alt={spell.name}
            className={styles.icon}
            loading="lazy"
            decoding="async"
          />
          {spell.upcast && (
            <img
              src={upcastIcon}
              alt="Upcast"
              className={styles.upcast}
              loading="lazy"
              decoding="async"
            />
          )}
        </div>
      )}
    </article>
  );
});

