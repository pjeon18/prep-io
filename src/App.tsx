import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Nav } from "./components/Nav";
import { DebugPanel } from "./components/DebugPanel";
import { startFloor } from "./lib/sim";
import Home from "./screens/Home";
import SessionPage from "./screens/Session";
import Events from "./screens/Events";
import { Companies, Company } from "./screens/Companies";
import GoLive from "./screens/GoLive";

export default function App() {
  const loc = useLocation();
  useEffect(() => startFloor(), []);
  useEffect(() => window.scrollTo(0, 0), [loc.pathname]);
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/session/:id" element={<SessionPage />} />
        <Route path="/events" element={<Events />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/company/:id" element={<Company />} />
        <Route path="/go-live" element={<GoLive />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <DebugPanel />
    </>
  );
}
