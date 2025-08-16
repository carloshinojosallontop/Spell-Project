import { Routes, Route } from "react-router-dom";
import Home from "src/pages/Home";
import Classpage from "src/pages/Classpage";
import NotFound from "src/pages/NotFound";

import { useRouteLoading } from "src/hooks/useRouteLoading";
import { RouteLoader } from "src/components/RouteLoader";

export function App() {
  const loading = useRouteLoading({
    delayBeforeShow: 120, 
    minVisible: 380,
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
