import { Routes, Route } from "react-router-dom";
import Home from "src/pages/Home";
import Classpage from "src/pages/classpage";
import NotFound from "src/pages/NotFound";

import { useRouteLoading } from "src/hooks/useRouteLoading"; // ⬅️ NUEVO
import { RouteLoader } from "src/components/RouteLoader"; // ⬅️ NUEVO

export function App() {
  const loading = useRouteLoading({
    delayBeforeShow: 120, // ajustable
    minVisible: 380, // ajustable (similar a tus 400ms)
  });

  return (
    <>
      <RouteLoader active={loading} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path=":classId" element={<Classpage />} />
        <Route path=":classId/:spellId" element={<Classpage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
