import c from "classnames";
import { useRef } from "react";
import { isKeyboardKey } from "src/utils/Keys";
import classesJson from "src/data/classes.json";
import { ClassGridItem } from "./class-item";
import type { CharacterClass, ClassId } from "src/models/character-class";
import styles from "./class-grid.module.css";

type Props = {
  selectedClass?: ClassId;
  background?: boolean;
  onClick: (c: ClassId | undefined) => void;
  highlight: (c: ClassId | undefined) => void;
};

const classes = classesJson as CharacterClass[];

export function ClassGrid({
  selectedClass,
  background,
  highlight,
  onClick,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const itemButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const items = selectedClass
    ? classes.filter((cls) => cls.slug === selectedClass)
    : classes;

  // Calcula el índice del elemento actualmente resaltado
  const currentHighlight = () => {
    return selectedClass
      ? items.findIndex((cls) => cls.slug === selectedClass)
      : Array.from(itemButtonRefs.current).findIndex(
          (ref) => ref === document.activeElement
        );
  };

  // Navegación por teclado en la cuadrícula
  const keyDown = (event: React.KeyboardEvent) => {
    if (!document.activeElement?.classList.contains(styles.classCell)) return;
    if (!isKeyboardKey(event.key)) return;

    const currentIndex = currentHighlight();
    if (currentIndex < 0) return;

    let nextIndex = currentIndex;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        nextIndex = Math.min(items.length - 1, currentIndex + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        nextIndex = Math.max(0, currentIndex - 1);
        break;
      default:
        break;
    }

    if (nextIndex !== currentIndex) {
      event.preventDefault();
      itemButtonRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <section
      ref={ref}
      className={c(styles.classGrid, background && styles.background)}
      aria-label="Class Grid"
      onKeyDown={keyDown}
      role="grid"
    >
      {items.map((cls, index) => (
        <ClassGridItem
          key={cls.slug}
          name={cls.name}
          classId={cls.slug}
          selected={selectedClass === cls.slug}
          highlight={highlight}
          onClick={() => onClick(cls.slug)}
          ref={(el) => {
            if (el) {
              itemButtonRefs.current[index] = el;
              if (selectedClass === cls.slug) {
                el.focus();
              }
            } else {
              itemButtonRefs.current[index] = null;
            }
            return () => {
              itemButtonRefs.current[index] = null;
            };
          }}
        />
      ))}
    </section>
  );
}

