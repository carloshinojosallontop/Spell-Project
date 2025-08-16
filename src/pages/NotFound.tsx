import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "src/components/not-found.module.css";

export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.dataset.modality = "pointer";
  }, []);

  const onKeyDown: React.KeyboardEventHandler = (e) => {
    if (e.key === "Escape" || e.key === "Backspace") {
      e.preventDefault();
      navigate("/");
    }
  };

  return (
    <main className={styles.main} onKeyDown={onKeyDown}>
      <div className={styles.card} role="alert" aria-live="polite">
        <div className={styles.code}>404</div>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.desc}>
          La ruta que intentaste abrir no existe o fue movida.
        </p>

        <div className={styles.actions}>
          <button
            className={styles.btn}
            onClick={() => navigate(-1)}
            aria-label="Volver"
          >
            ← Atrás
          </button>

          <Link className={styles.linkBtn} to="/" aria-label="Ir al inicio">
            Ir al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
