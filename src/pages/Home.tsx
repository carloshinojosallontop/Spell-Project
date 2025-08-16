import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClassGrid } from "src/components/class-grid";
import { SpellDiagram } from "src/components/spell-diagram";
import type { ClassId } from "src/models/character-class";
import styles from "src/app.module.css";

export default function Home() {
  const [selectedClass, setSelectedClass] = useState<ClassId>();
  const [highlightedClass, setHighlightedClass] = useState<ClassId>();
  const navigate = useNavigate();

  const onKeyDown = (event: React.KeyboardEvent) => {
    if ((event.key === "Escape" || event.key === "Backspace") && selectedClass) {
      event.preventDefault();
      setHighlightedClass(undefined);
      setSelectedClass(undefined);
      return;
    }
  };
  
  const background = selectedClass ? "classGrid" : "spellDiagram";

  return (
    <main className={styles.main} onKeyDown={onKeyDown}>
      <SpellDiagram
        highlightedClass={highlightedClass}
        selectedClass={selectedClass}
        background={background === "spellDiagram"}
      />
      <ClassGrid
        selectedClass={selectedClass}
        background={background === "classGrid"}
        highlight={setHighlightedClass}
        onClick={(c) => {
          if (c) navigate(`/${c}`);
        }}
      />
    </main>
  );
}