
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

export function SpellDiagram({
  highlightedClass,
  selectedClass,
  background,
  onOpenSpell,
}: Props) {
  const spellsByLevel = groupSpellsByLevel(spells as SpellType[]);
  const status = selectedClass ? "selected" : highlightedClass ? "highlighted" : "none";
  const currentClass = selectedClass || highlightedClass;
  const highlightedSpells = currentClass ? new Set((spellsByClass as SellsByClass)[currentClass]) : new Set<SpellId>();
  const isSpellHighlighted = (spell: SpellType) => highlightedClass && highlightedSpells.has(spell.id);
  const isSpellDetailed = (spell: SpellType) => selectedClass && highlightedSpells.has(spell.id);

  // Navegación por teclado
  const keyDown: React.KeyboardEventHandler = (event) => {
    const activeEl = document.activeElement as HTMLElement | null;
    if (event.key === KEY_TAB) {
      if (!activeEl?.matches?.('article[data-detailed="true"]')) return;
      const items = Array.from(document.querySelectorAll<HTMLElement>('article[data-detailed="true"]'));
      const currentIndex = items.findIndex((el) => el === activeEl);
      if (currentIndex < 0 || items.length === 0) return;
      event.preventDefault();
      document.body.dataset.modality = "keyboard";
      const wrap = (i: number) => (i + items.length) % items.length;
      const dir = event.shiftKey ? -1 : +1;
      const nextIndex = wrap(currentIndex + dir);
      items.forEach((el, i) => (el.tabIndex = i === nextIndex ? 0 : -1));
      const target = items[nextIndex];
      try { target.focus({ preventScroll: true }); } catch { target.focus(); }
      return;
    }
    if (!activeEl?.matches?.('article[data-detailed="true"]')) return;
    if (!isKeyboardKey(event.key)) return;
    if (event.key === "Escape" || event.key === "Backspace") {
      event.preventDefault();
      const items = Array.from(document.querySelectorAll<HTMLElement>('article[data-detailed="true"]'));
      items.forEach((el) => (el.tabIndex = -1));
      activeEl.blur();
      document.body.dataset.modality = "pointer";
      return;
    }
    const items = Array.from(document.querySelectorAll<HTMLElement>('article[data-detailed="true"]'));
    const currentIndex = items.findIndex((el) => el === activeEl);
    if (currentIndex < 0 || items.length === 0) return;
    if (items.length === 1) { event.preventDefault(); return; }
    const wrap = (i: number) => (i + items.length) % items.length;
    let nextIndex = currentIndex;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        nextIndex = wrap(currentIndex + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        nextIndex = wrap(currentIndex - 1);
        break;
      default:
        break;
    }
    if (nextIndex !== currentIndex) {
      event.preventDefault();
      document.body.dataset.modality = "keyboard";
      items.forEach((el, i) => (el.tabIndex = i === nextIndex ? 0 : -1));
      const target = items[nextIndex];
      try { target.focus({ preventScroll: true }); } catch { target.focus(); }
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
      {Array.from({ length: 7 }, (_, level) => {
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

function twoRows(spells: SpellType[] = []) {
  const half = Math.ceil(spells.length / 2);
  return {
    firstHalf: spells.slice(0, half),
    secondHalf: spells.slice(half),
  };
}

function groupSpellsByLevel(spells: SpellType[]) {
  return spells.reduce<Record<number, SpellType[]>>((acc, spell) => {
    if (!acc[spell.level]) acc[spell.level] = [];
    acc[spell.level].push(spell);
    return acc;
  }, {});
}
