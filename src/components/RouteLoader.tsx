import c from "classnames";
import styles from "./route-loader.module.css";

export function RouteLoader({ active }: { active: boolean }) {
  return (
    <div
      className={c(styles.backdrop, active && styles.backdropActive)}
      aria-live="polite"
      aria-busy={active || undefined}
    >
      {/* Spinner grande, sin texto visible ni tarjetas */}
      <div className={styles.spinner} role="status" aria-label="Cargando" />
    </div>
  );
}
