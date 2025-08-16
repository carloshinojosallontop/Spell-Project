import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClassGrid } from "src/components/class-grid";
import { SpellDiagram } from "src/components/spell-diagram";
import { SpellDetailsDialog } from "src/components/SpellDetailsDialog";

import type { ClassId } from "src/models/character-class";
import type { Spell as SpellType, SpellId } from "src/models/spell";

import spells from "src/data/spells.json";
import styles from "src/app.module.css";

import spellsByClass from "../data/spells-by-class.json";
import NotFound from "./NotFound";

// Validaciones globales
const VALID_CLASSES = new Set(Object.keys(spellsByClass) as ClassId[]);

const VALID_SPELLS = new Set(
  (spells as SpellType[]).map((s) => s.id as SpellId)
);

const CLASS_TO_SPELLS = new Map<ClassId, Set<SpellId>>(
  Object.entries(spellsByClass).map(([cls, arr]) => [
    cls as ClassId,
    new Set((arr as string[]).map((id) => id as SpellId)),
  ])
);

export default function ClassPage() {
  const navigate = useNavigate();
  const { classId, spellId } = useParams<{
    classId?: ClassId;
    spellId?: SpellId;
  }>();

  if (classId && !VALID_CLASSES.has(classId)) {
    return <NotFound />; // ← muestra página 404
  }

  const [selectedClass, setSelectedClass] = useState<ClassId | undefined>(
    undefined
  );
  const [highlightedClass, setHighlightedClass] = useState<ClassId | undefined>(
    undefined
  );
  const [activeSpell, setActiveSpell] = useState<SpellType | null>(null);

  // --- Sincroniza la clase seleccionada con :classId ---
  useEffect(() => {
    if (!classId) {
      setSelectedClass(undefined);
      setHighlightedClass(undefined);
      return;
    }
    setSelectedClass(classId);
    setHighlightedClass(classId);
  }, [classId]);

  // --- Abre/cierra el modal según :spellId en la URL ---
  useEffect(() => {
    if (!spellId) {
      setActiveSpell(null);
      return;
    }
    const found = (spells as SpellType[]).find((s) => s.id === spellId);
    setActiveSpell(found ?? null);
  }, [spellId]);

  // --- Abrir modal navegando a /:classId/:spellId ---
  const handleOpenSpell = (s: SpellType) => {
    const base = classId ?? selectedClass;
    if (base) {
      navigate(`/${base}/${s.id}`);
    }
  };

  // --- Cerrar modal reemplazando historial (evita reabrir con ESC) ---
  const handleCloseSpell = () => {
    if (classId) {
      navigate(`/${classId}`, { replace: true });
    } else {
      navigate("/", { replace: true });
    }
    setActiveSpell(null);
  };

  // --- Manejo global de teclado (ESC y priming de TAB) ---
  const onMainKeyDown = (e: React.KeyboardEvent) => {
    // 1) ESC
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();

      if (spellId) {
        // Si hay modal abierto, ciérralo sin sumar historial
        handleCloseSpell();
      } else if (selectedClass) {
        // Si NO hay modal, vuelve a Home
        navigate("/");
      }
      return;
    }

    // 2) Priming de TAB:
    // Si estamos en vista detallada, NO hay modal, y el foco aún no está en un Spell,
    // la primera pulsación de TAB (o Shift+TAB) pone foco en el primer/último Spell
    // y setea el roving tabIndex. Luego, SpellDiagram manejará el resto.
    if (e.key === "Tab") {
      if (!selectedClass || spellId) return;

      const activeEl = document.activeElement as HTMLElement | null;
      if (activeEl?.matches?.('article[data-detailed="true"]')) {
        return;
      }

      const items = Array.from(
        document.querySelectorAll<HTMLElement>('article[data-detailed="true"]')
      );
      if (items.length === 0) return;

      e.preventDefault();
      e.stopPropagation();

      // Setea roving tabIndex y enfoca primer/último según Shift
      items.forEach((el) => (el.tabIndex = -1));
      const index = e.shiftKey ? items.length - 1 : 0;
      items[index].tabIndex = 0;

      try {
        items[index].focus({ preventScroll: true });
      } catch {
        items[index].focus();
      }
      document.body.dataset.modality = "keyboard";
    }
  };

  // 404 si la clase no existe
  if (classId && !VALID_CLASSES.has(classId)) {
    return <NotFound />;
  }

  // 404 si hay spellId invalido o no pertenece a la clase
  if (spellId) {
    if (!VALID_SPELLS.has(spellId)) return <NotFound />;
    if (classId && !CLASS_TO_SPELLS.get(classId)?.has(spellId))
      return <NotFound />;
  }

  return (
    <main className={styles.main} onKeyDown={onMainKeyDown}>
      <SpellDiagram
        highlightedClass={highlightedClass}
        selectedClass={selectedClass}
        background={selectedClass ? false : true}
        onOpenSpell={handleOpenSpell}
      />

      <ClassGrid
        selectedClass={selectedClass}
        background={selectedClass ? true : false}
        highlight={setHighlightedClass}
        onClick={(c) => {
          if (c) navigate(`/${c}`);
        }}
      />

      {activeSpell && (
        <SpellDetailsDialog spell={activeSpell} onClose={handleCloseSpell} />
      )}
    </main>
  );
}