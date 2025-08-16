import { useCallback, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import upcastIcon from "src/assets/icons/other/upcast.png";
import styles from "./spell-details.module.css";
import type { Spell as SpellType } from "src/models/spell";

type Props = {
  spell: SpellType;
  onClose: () => void;
};

export function SpellDetailsDialog({ spell, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  // IDs accesibles estables por spell
  const titleId = useMemo(() => `spell-title-${spell.id}`, [spell.id]);
  const descId = useMemo(() => `spell-desc-${spell.id}`, [spell.id]);

  // Helpers
  const focusAutofocus = useCallback(() => {
    const el = dialogRef.current?.querySelector<HTMLElement>("[data-autofocus]");
    try {
      el?.focus({ preventScroll: true });
    } catch {
      el?.focus();
    }
  }, []);

  const handleKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    },
    [onClose]
  );

  const onBackdropMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  // Montaje: listener de ESC + lock scroll + foco inicial
  useEffect(() => {
    document.addEventListener("keydown", handleKeydown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Foco tras pintar (rAF es más fiable que setTimeout(0))
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(focusAutofocus);
      // guard para limpiar el segundo
      (focusAutofocus as any)._raf2 = raf2;
    });

    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.body.style.overflow = prevOverflow;

      cancelAnimationFrame(raf1);
      if ((focusAutofocus as any)._raf2) {
        cancelAnimationFrame((focusAutofocus as any)._raf2);
      }
    };
  }, [handleKeydown, focusAutofocus]);

  // Type guards suaves para damage
  const damageList = useMemo(() => {
    const arr = Array.isArray(spell.damage) ? spell.damage : [];
    return arr as Array<Partial<{ dice: string; damageType: string }>>;
  }, [spell.damage]);

  return createPortal(
    <div className={styles.backdrop} onMouseDown={onBackdropMouseDown}>
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
      >
        <header className={styles.header}>
          <div className={styles.titleBlock}>
            <img
              src={spell.icon}
              alt=""
              className={styles.icon}
              loading="lazy"
              decoding="async"
            />
            <h2 id={titleId} className={styles.title}>
              {spell.name}
            </h2>
            {spell.upcast && (
              <img
                src={upcastIcon}
                alt="Upcast"
                title="Upcast"
                className={styles.upcast}
                loading="lazy"
                decoding="async"
              />
            )}
          </div>

          <button
            className={styles.close}
            onClick={onClose}
            aria-label="Cerrar detalles del hechizo"
            data-autofocus
          >
            ×
          </button>
        </header>

        <div id={descId} className={styles.content}>
          <section className={styles.meta}>
            <div className={styles.metaItem}>
              <span>Level</span>
              <strong>{spell.level}</strong>
            </div>
            <div className={styles.metaItem}>
              <span>Action</span>
              <strong>{spell.action}</strong>
            </div>
            <div className={styles.metaItem}>
              <span>Duration</span>
              <strong>{spell.duration}</strong>
            </div>
            <div className={styles.metaItem}>
              <span>Range</span>
              <strong>{spell.range}</strong>
            </div>
            <div className={styles.metaItem}>
              <span>Type</span>
              <strong>{spell.type}</strong>
            </div>
          </section>

          {damageList.length > 0 && (
            <section className={styles.damage} aria-label="Daño">
              <h3 className={styles.sectionTitle}>Damage</h3>
              <ul className={styles.damageList}>
                {damageList.map((d, i) => (
                  <li key={i} className={styles.damageItem}>
                    {d.dice ? <span className={styles.badge}>{d.dice}</span> : null}
                    {d.damageType ? (
                      <span className={styles.badgeSecondary}>{d.damageType}</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <footer className={styles.footer}>
          <a
            className={styles.link}
            href={spell.url}
            target="_blank"
            rel="noreferrer noopener"
          >
            Ver en wiki ↗
          </a>
        </footer>
      </div>
    </div>,
    document.body
  );
}
