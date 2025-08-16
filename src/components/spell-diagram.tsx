import { useMemo } from "react";
import c from "classnames";
import spellsByClass from "src/data/spells-by-class.json";
import spells from "src/data/spells.json";
import { Spell } from "./spell";

import type { ClassId, SellsByClass } from "src/models/character-class";
import type { SpellId, Spell as SpellType } from "src/models/spell";

import styles from "./spell-diagram.module.css";
import { KEY_TAB, isKeyboardKey } from "src/utils/Keys";

type Props = {
  highlightedClass?: ClassId;
  selectedClass?: ClassId;
  background?: boolean;
  onOpenSpell?: (spell: SpellType) => void;
};

/** Selector común para los spells “detallados” (focus navegable). */
const DETAILED_SELECTOR = 'article[data-detailed="true"]';
/** Cantidad de niveles a mostrar. */
const LEVELS = 7;

/** Diagrama de hechizos agrupados por nivel con navegación por teclado. */
export function SpellDiagram({
  highlightedClass,
  selectedClass,
  background,
  onOpenSpell,
}: Props) {
  // Agrupar hechizos por nivel (costo fijo, memorizado)
  const spellsByLevel = useMemo(
    () => groupSpellsByLevel(spells as SpellType[]),
    []
  );

  // Estado visual: none | highlighted | selected
  const status =
    selectedClass ? "selected" : highlightedClass ? "highlighted" : "none";

  const currentClass = selectedClass ?? highlightedClass;

  // Set de hechizos resaltados/detallados para la clase activa
  const highlightedSpells = useMemo(() => {
    return currentClass
      ? new Set((spellsByClass as SellsByClass)[currentClass])
      : new Set<SpellId>();
  }, [currentClass]);

  const isSpellHighlighted = (spell: SpellType) =>
    Boolean(highlightedClass && highlightedSpells.has(spell.id));
  const isSpellDetailed = (spell: SpellType) =>
    Boolean(selectedClass && highlightedSpells.has(spell.id));

  // ---------------------------------------
  // Utilidades de navegación por teclado
  // ---------------------------------------
  const getDetailedItems = () =>
    Array.from(
      document.querySelectorAll<HTMLElement>(DETAILED_SELECTOR)
    );

  const setRovingTabIndexAndFocus = (
    items: HTMLElement[],
    nextIndex: number
  ) => {
    items.forEach((el, i) => (el.tabIndex = i === nextIndex ? 0 : -1));
    const target = items[nextIndex];
    try {
      target.focus({ preventScroll: true });
    } catch {
      target.focus();
    }
  };

  const wrapIndex = (i: number, len: number) => (i + len) % len;

  // Navegación por teclado (Tab cíclico, flechas, Escape/Backspace)
  const keyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    const activeEl = document.activeElement as HTMLElement | null;

    // --- TAB: moverse entre spells detallados si ya estás en uno ---
    if (event.key === KEY_TAB) {
      if (!activeEl?.matches?.(DETAILED_SELECTOR)) return;

      const items = getDetailedItems();
      const currentIndex = items.findIndex((el) => el === activeEl);
      if (currentIndex < 0 || items.length === 0) return;

      event.preventDefault();
      document.body.dataset.modality = "keyboard";

      const dir = event.shiftKey ? -1 : +1;
      const nextIndex = wrapIndex(currentIndex + dir, items.length);
      setRovingTabIndexAndFocus(items, nextIndex);
      return;
    }

    // A partir de aquí, otras teclas (flechas, Escape, Backspace)
    if (!activeEl?.matches?.(DETAILED_SELECTOR)) return;
    if (!isKeyboardKey(event.key)) return;

    // --- ESC / Backspace: salir de modo teclado (quitar tabIndex y blur) ---
    if (event.key === "Escape" || event.key === "Backspace") {
      event.preventDefault();
      const items = getDetailedItems();
      items.forEach((el) => (el.tabIndex = -1));
      activeEl.blur();
      document.body.dataset.modality = "pointer";
      return;
    }

    // --- Flechas con wrap ---
    const items = getDetailedItems();
    const currentIndex = items.findIndex((el) => el === activeEl);
    if (currentIndex < 0 || items.length === 0) return;

    if (items.length === 1) {
      event.preventDefault();
      return;
    }

    let nextIndex = currentIndex;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        nextIndex = wrapIndex(currentIndex + 1, items.length);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        nextIndex = wrapIndex(currentIndex - 1, items.length);
        break;
      default:
        break;
    }

    if (nextIndex !== currentIndex) {
      event.preventDefault();
      document.body.dataset.modality = "keyboard";
      setRovingTabIndexAndFocus(items, nextIndex);
    }
  };

  return (
    <div
      className={c(
        styles.spellDiagram,
        background && styles.background,
        status === "selected" && styles.selected,
        status === "highlighted" && styles.highlighted
      )}
      onKeyDown={keyDown}
    >
      {Array.from({ length: LEVELS }, (_, level) => {
        const { firstHalf, secondHalf } = twoRows(spellsByLevel[level]);

        return (
          <div key={level} className={styles.levelGroup} data-level={level}>
            <div className={styles.row}>
              {firstHalf.map((spell, idx) => (
                <Spell
                  key={`${level}-1-${idx}`}
                  spell={spell}
                  highlighted={isSpellHighlighted(spell)}
                  detailed={isSpellDetailed(spell)}
                  onOpen={onOpenSpell}
                />
              ))}
            </div>
            <div className={styles.row}>
              {secondHalf.map((spell, idx) => (
                <Spell
                  key={`${level}-2-${idx}`}
                  spell={spell}
                  highlighted={isSpellHighlighted(spell)}
                  detailed={isSpellDetailed(spell)}
                  onOpen={onOpenSpell}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Divide una lista de hechizos en dos mitades. */
function twoRows(list: SpellType[] = []) {
  const half = Math.ceil(list.length / 2);
  return {
    firstHalf: list.slice(0, half),
    secondHalf: list.slice(half),
  };
}

/** Agrupa los hechizos por nivel. */
function groupSpellsByLevel(list: SpellType[]) {
  return list.reduce<Record<number, SpellType[]>>((acc, spell) => {
    (acc[spell.level] ||= []).push(spell);
    return acc;
  }, {});
}

