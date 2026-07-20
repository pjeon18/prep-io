import { useLocation, useNavigate } from "react-router-dom";
import { IconCompass, IconHome, IconLibrary, IconMic } from "./icons";

/** Bottom tab bar — the modern streaming-app shell. Home is the fair;
 *  Explore is goal-driven (never an algorithmic feed); Library is yours. */
export function BottomNav() {
  const nav = useNavigate();
  const { pathname } = useLocation();

  const tabs = [
    { to: "/fair", label: "Home", icon: IconHome, match: ["/fair", "/section", "/company", "/search", "/event"] },
    { to: "/explore", label: "Explore", icon: IconCompass, match: ["/explore", "/shorts"] },
    { to: "/library", label: "Library", icon: IconLibrary, match: ["/library", "/playlist", "/premium"] },
    { to: "/host", label: "Host", icon: IconMic, match: ["/host"] },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t lg:hidden"
      style={{
        background: "rgba(255, 255, 255, 0.95)",
        borderColor: "var(--prep-line)",
        backdropFilter: "blur(10px)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="mx-auto flex max-w-md items-stretch">
        {tabs.map((t) => {
          const active = t.match.some((m) => pathname.startsWith(m));
          return (
            <button
              key={t.to}
              className="flex flex-1 flex-col items-center gap-1 pb-2.5 pt-2.5"
              style={{ color: active ? "var(--prep-text)" : "var(--prep-text-3)" }}
              onClick={() => nav(t.to)}
            >
              <t.icon size={21} strokeWidth={active ? 2.1 : 1.7} />
              <span className="text-[10.5px] font-medium">{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
