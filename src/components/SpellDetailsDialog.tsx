import { useEffect, useMemo, useRef } from "react";
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
  const titleId = useMemo(() => `spell-title-${spell.id}`, [spell.id]);
  const descId = useMemo(() => `spell-desc-${spell.id}`, [spell.id]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const to = setTimeout(() => {
      dialogRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    }, 0);
    return () => {
      clearTimeout(to);
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const onBackdropMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

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
            <img src={spell.icon} alt="" className={styles.icon} />
            <h2 id={titleId} className={styles.title}>{spell.name}</h2>
            {spell.upcast && (
              <img src={upcastIcon} alt="Upcast" title="Upcast" className={styles.upcast} />
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
            <div className={styles.metaItem}><span>Level</span><strong>{spell.level}</strong></div>
            <div className={styles.metaItem}><span>Action</span><strong>{spell.action}</strong></div>
            <div className={styles.metaItem}><span>Duration</span><strong>{spell.duration}</strong></div>
            <div className={styles.metaItem}><span>Range</span><strong>{spell.range}</strong></div>
            <div className={styles.metaItem}><span>Type</span><strong>{spell.type}</strong></div>
          </section>
          {Array.isArray(spell.damage) && spell.damage.length > 0 ? (
            <section className={styles.damage} aria-label="Daño">
              <h3 className={styles.sectionTitle}>Damage</h3>
              <ul className={styles.damageList}>
                {spell.damage.map((d, i) => (
                  <li key={i} className={styles.damageItem}>
                    {"dice" in d ? <span className={styles.badge}>{(d as any).dice}</span> : null}
                    {"damageType" in d ? <span className={styles.badgeSecondary}>{(d as any).damageType}</span> : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
        <footer className={styles.footer}>
          <a className={styles.link} href={spell.url} target="_blank" rel="noreferrer noopener">
            Ver en wiki ↗
          </a>
        </footer>
      </div>
    </div>,
    document.body
  );
}
