import c from "classnames";
import { useEffect, useMemo, useState } from "react";
import upcastIcon from "src/assets/icons/other/upcast.png";
import type { Spell } from "src/models/spell";
import styles from "./spell.module.css";

export function Spell({
  spell,
  highlighted,
  detailed,
  onOpen,
}: {
  spell: Spell;
  highlighted?: boolean;
  detailed?: boolean;
  onOpen?: (spell: Spell) => void;
}) {
  const [selected, setSelected] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const randomDuration = useMemo(() => (Math.random() + 0.5).toFixed(2), []);
  const randomDelay = useMemo(() => (Math.random() * 2 + 1).toFixed(2), []);

  const animatedSpellStyles = {
    "--randomDelay": randomDelay + "s",
    "--randomDuration": randomDuration + "s",
  } as React.CSSProperties;

  useEffect(() => {
    if (detailed) {
      const transitionTime = (parseFloat(randomDuration) + parseFloat(randomDelay)) * 1000;
      const timer = setTimeout(() => setShowImage(true), transitionTime);
      return () => {
        clearTimeout(timer);
        setShowImage(false);
      };
    } else {
      setShowImage(false);
    }
  }, [detailed, randomDuration, randomDelay]);

  // Selección global de spell
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ id: string; selected: boolean }>).detail;
      if (!detail) return;
      if (detail.selected) setSelected(spell.id === detail.id);
    };
    window.addEventListener("spell:selected", handler as EventListener);
    return () => {
      window.removeEventListener("spell:selected", handler as EventListener);
    };
  }, [spell.id]);

  return (
    <article
      role="button"
      className={c(
        styles.spell,
        highlighted && styles.highlighted,
        detailed && styles.detailed
      )}
      data-spell-id={spell.id}
      data-detailed={detailed ? "true" : "false"}
      style={animatedSpellStyles}
      tabIndex={-1}
      aria-label={spell.name}
      onMouseDown={(e) => detailed && e.preventDefault()}
      onClick={() => onOpen?.(spell)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onOpen?.(spell);
        }
      }}
    >
      {detailed && showImage && (
        <div className={styles.image}>
          <img src={spell.icon} alt={spell.name} className={styles.icon} />
          {spell.upcast && (
            <img src={upcastIcon} alt="upcast" className={styles.upcast} />
          )}
        </div>
      )}
    </article>
  );
}
