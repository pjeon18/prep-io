import { Navigate, Route, Routes } from "react-router-dom";
import { DebugPanel } from "./components/DebugPanel";
import { Toasts } from "./components/Toasts";
import Breakout from "./screens/Breakout";
import Fair from "./screens/Fair";
import Follows from "./screens/Follows";
import HostProfile from "./screens/HostProfile";
import LiveRoom from "./screens/LiveRoom";
import SectionView from "./screens/SectionView";
import Settings from "./screens/Settings";
import Splash from "./screens/Splash";
import VodPlayer from "./screens/VodPlayer";
import GoLiveWizard from "./screens/host/GoLiveWizard";
import HostHub from "./screens/host/HostHub";
import HostRoom from "./screens/host/HostRoom";
import Recap from "./screens/host/Recap";
import Verify from "./screens/host/Verify";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/fair" element={<Fair />} />
        <Route path="/section/:id" element={<SectionView />} />
        <Route path="/room/:sessionId" element={<LiveRoom />} />
        <Route path="/vod/:vodId" element={<VodPlayer />} />
        <Route path="/profile/:hostId" element={<HostProfile />} />
        <Route path="/breakout" element={<Breakout />} />
        <Route path="/follows" element={<Follows />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/host" element={<HostHub />} />
        <Route path="/host/verify" element={<Verify />} />
        <Route path="/host/golive" element={<GoLiveWizard />} />
        <Route path="/host/live" element={<HostRoom />} />
        <Route path="/host/recap" element={<Recap />} />
        <Route path="*" element={<Navigate to="/fair" replace />} />
      </Routes>
      <Toasts />
      <DebugPanel />
    </>
  );
}
