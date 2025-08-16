
import c from "classnames";
import { useEffect } from "react";
import { ACCENT_COLOR, DEFAULT_ACCENT_COLOR } from "src/data/accent-colors";
import bardIcon from "src/assets/icons/classes/bard.png";
import clericIcon from "src/assets/icons/classes/cleric.png";
import druidIcon from "src/assets/icons/classes/druid.png";
import sorcererIcon from "src/assets/icons/classes/sorcerer.png";
import warlockIcon from "src/assets/icons/classes/warlock.png";
import wizardIcon from "src/assets/icons/classes/wizard.png";
import type { ClassId } from "src/models/character-class";
import styles from "./class-grid.module.css";

const ASSETS: Record<ClassId, string> = {
  bard: bardIcon,
  cleric: clericIcon,
  druid: druidIcon,
  sorcerer: sorcererIcon,
  warlock: warlockIcon,
  wizard: wizardIcon,
};

type Props = {
  name: string;
  classId: ClassId;
  selected?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
  highlight: (c: ClassId | undefined) => void;
} & React.ComponentProps<"button">;

export function ClassGridItem({
  name,
  classId,
  selected,
  ref,
  highlight,
  onClick,
  onFocus,
  onBlur,
}: Props) {
  const accentColor = ACCENT_COLOR[classId];

  useEffect(() => {
    if (selected && accentColor) {
      document.documentElement.style.setProperty("--accent", accentColor);
      return () => {
        document.documentElement.style.setProperty("--accent", DEFAULT_ACCENT_COLOR);
      };
    }
  }, [selected, accentColor]);

  const applyHighlight = () => {
    if (selected) return;
    if (accentColor) document.documentElement.style.setProperty("--accent", accentColor);
    highlight(classId);
  };

  const removeHighlight = () => {
    if (selected) return;
    document.documentElement.style.setProperty("--accent", DEFAULT_ACCENT_COLOR);
    highlight(undefined);
  };

  return (
    <button
      ref={ref}
      className={c(styles.classCell, selected && styles.highlighted)}
      tabIndex={0}
      aria-pressed={selected}
      aria-label={name}
      onMouseEnter={applyHighlight}
      onMouseLeave={removeHighlight}
      onClick={onClick}
      onFocus={(ev) => {
        applyHighlight();
        onFocus?.(ev);
      }}
      onBlur={(ev) => {
        removeHighlight();
        onBlur?.(ev);
      }}
    >
      <div className={styles.iconWrapper}>
        <div className={c(styles.corner, styles.topLeft)} aria-hidden />
        <div className={c(styles.corner, styles.topRight)} aria-hidden />
        <div className={c(styles.corner, styles.bottomRight)} aria-hidden />
        <div className={c(styles.corner, styles.bottomLeft)} aria-hidden />
        <img src={ASSETS[classId]} alt={name} className={styles.icon} />
      </div>
      <span className={styles.className}>{name}</span>
    </button>
  );
}
