import type { Company } from "../data/seed";

/* ------------------------------------------------------------------ */
/* Illustrated people. Flat, friendly, featureless busts (the way      */
/* Slack or Headspace draw people) so every host and viewer looks like */
/* a person without pretending to be a photo.                          */
/* ------------------------------------------------------------------ */

export type HairStyle = "short" | "side" | "long" | "bun" | "curly" | "buzz" | "bob";
export interface Look {
  skin: string;
  hair: string;
  style: HairStyle;
  shirt: string;
  collar: "crew" | "v" | "blazer";
  glasses?: boolean;
  bg: string;
  wall: string;
  room: "shelf" | "window" | "art";
}

const SKIN = ["#f5d7bf", "#e8bb96", "#c98d62", "#9c6644", "#6e4630", "#f0c9a8"];
const HAIR = ["#231c18", "#3e2b20", "#6b4a2f", "#a8743f", "#d6ad6a", "#16120f"];
const SHIRT = ["#3a5a8c", "#3f7a62", "#b3544f", "#e9e4da", "#4b4b57", "#1f5bff", "#e2a33b", "#7a5aa6"];
const BG = ["#dfeaff", "#ffe8cc", "#dcf3e6", "#efe2ff", "#ffe1e1", "#dff2f6", "#fff1c9"];
const WALL = ["#eaf1ff", "#fff3e3", "#e8f6ee", "#f4ecff", "#fdeeee", "#e9f6f8", "#fdf6df"];

export const LOOKS: Record<string, Look> = {
  priya: { skin: SKIN[2], hair: HAIR[0], style: "long", shirt: SHIRT[0], collar: "blazer", bg: BG[0], wall: WALL[0], room: "shelf" },
  oliver: { skin: SKIN[0], hair: HAIR[3], style: "side", shirt: SHIRT[4], collar: "crew", glasses: true, bg: BG[5], wall: WALL[5], room: "window" },
  marcus: { skin: SKIN[4], hair: HAIR[5], style: "buzz", shirt: SHIRT[1], collar: "crew", bg: BG[2], wall: WALL[2], room: "window" },
  lena: { skin: SKIN[5], hair: HAIR[1], style: "bob", shirt: SHIRT[6], collar: "crew", glasses: true, bg: BG[1], wall: WALL[1], room: "art" },
  jordan: { skin: SKIN[1], hair: HAIR[2], style: "curly", shirt: SHIRT[7], collar: "v", bg: BG[3], wall: WALL[3], room: "art" },
  daniel: { skin: SKIN[5], hair: HAIR[0], style: "short", shirt: SHIRT[0], collar: "blazer", bg: BG[0], wall: WALL[0], room: "shelf" },
  ife: { skin: SKIN[4], hair: HAIR[0], style: "bun", shirt: SHIRT[2], collar: "crew", bg: BG[4], wall: WALL[4], room: "window" },
  aisha: { skin: SKIN[3], hair: HAIR[0], style: "curly", shirt: SHIRT[6], collar: "v", bg: BG[6], wall: WALL[6], room: "art" },
  kevin: { skin: SKIN[1], hair: HAIR[0], style: "side", shirt: SHIRT[3], collar: "blazer", glasses: true, bg: BG[5], wall: WALL[5], room: "shelf" },
  rebecca: { skin: SKIN[0], hair: HAIR[4], style: "long", shirt: SHIRT[4], collar: "blazer", bg: BG[4], wall: WALL[4], room: "window" },
  sam: { skin: SKIN[0], hair: HAIR[2], style: "short", shirt: SHIRT[0], collar: "blazer", bg: BG[0], wall: WALL[0], room: "shelf" },
  tomas: { skin: SKIN[1], hair: HAIR[1], style: "short", shirt: SHIRT[1], collar: "crew", glasses: true, bg: BG[2], wall: WALL[2], room: "shelf" },
  rui: { skin: SKIN[5], hair: HAIR[0], style: "bob", shirt: SHIRT[5], collar: "crew", bg: BG[3], wall: WALL[3], room: "art" },
  nina: { skin: SKIN[2], hair: HAIR[1], style: "bun", shirt: SHIRT[2], collar: "v", bg: BG[1], wall: WALL[1], room: "window" },
  alex: { skin: SKIN[1], hair: HAIR[1], style: "side", shirt: SHIRT[5], collar: "crew", bg: BG[6], wall: WALL[6], room: "art" },
};

const STYLES: HairStyle[] = ["short", "side", "long", "bun", "curly", "buzz", "bob"];
const hash = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
export function lookFor(key: string): Look {
  const k = key.toLowerCase();
  if (LOOKS[k]) return LOOKS[k];
  const h = hash(k);
  return {
    skin: SKIN[h % SKIN.length],
    hair: HAIR[(h >> 3) % HAIR.length],
    style: STYLES[(h >> 5) % STYLES.length],
    shirt: SHIRT[(h >> 7) % SHIRT.length],
    collar: (["crew", "v", "crew"] as const)[(h >> 9) % 3],
    glasses: (h >> 11) % 5 === 0,
    bg: BG[(h >> 13) % BG.length],
    wall: WALL[(h >> 13) % WALL.length],
    room: (["shelf", "window", "art"] as const)[(h >> 15) % 3],
  };
}

const shade = (hex: string, amt: number) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (c: number) => Math.max(0, Math.min(255, Math.round(c * (1 + amt))));
  return `rgb(${f(n >> 16)}, ${f((n >> 8) & 255)}, ${f(n & 255)})`;
};

/** The person, in a 100×100 coordinate space. */
export function Bust({ look, bob = 0 }: { look: Look; bob?: number }) {
  const { skin, hair, style, shirt, collar, glasses } = look;
  const hy = bob; // head bob while speaking, in units
  const back =
    style === "long" ? "M31.5 44 C29.5 23 40 17.5 50 17.5 C61 17.5 71 23 68.5 44 L70.5 71 C63 75 37 75 29.5 71 Z"
    : style === "bob" ? "M32 43 C30.5 22.5 40.5 18 50 18 C60 18 70 22.5 68 43 L68.5 57 C62 61.5 38 61.5 31.5 57 Z"
    : null;
  const front =
    style === "short" ? "M34.2 38.5 C33.2 25 41 20.3 50 20.3 C59.6 20.3 67.2 25.5 65.8 38.5 C64 31 58.5 27.6 51 28.6 C44 29.5 37.8 32.2 34.2 38.5 Z"
    : style === "side" ? "M34.2 39.5 C32.8 24 42 19.4 51 19.8 C61.2 20.3 67.6 26 65.9 38.6 C62 30.2 55 29 46.5 31 C40.8 32.4 36.8 35.2 34.2 39.5 Z"
    : style === "buzz" ? "M34.8 36.5 C35 25 42 21.4 50 21.4 C58 21.4 65 25 65.2 36.5 C60 30.4 40 30.4 34.8 36.5 Z"
    : style === "curly" ? null
    : "M34.4 38 C34 25 42 20.8 50 20.8 C58 20.8 66 25 65.6 38 C60.5 31 54 28.4 50 28.7 C45 29 39.4 32 34.4 38 Z";
  return (
    <g transform={`translate(0 ${hy})`}>
      {back && <path d={back} fill={hair} />}
      <path d="M44 53 L56 53 L56 71 C53 74 47 74 44 71 Z" fill={shade(skin, -0.12)} />
      <path d="M11 104 C12.5 80.5 30 69.5 50 69.5 C70 69.5 87.5 80.5 89 104 Z" fill={shirt} />
      {collar === "blazer" && (
        <>
          <path d="M42 69.8 L50 86 L58 69.8 Z" fill="#fbfaf7" />
          <path d="M42 69.8 L50 86 L44 104 L33 104 L36 76 Z" fill={shade(shirt, -0.18)} />
          <path d="M58 69.8 L50 86 L56 104 L67 104 L64 76 Z" fill={shade(shirt, -0.18)} />
        </>
      )}
      {collar === "v" && <path d="M43 70 L50 81 L57 70" fill="none" stroke={shade(shirt, -0.22)} strokeWidth="2.2" strokeLinejoin="round" />}
      {collar === "crew" && <path d="M42.5 70.4 C46 74.6 54 74.6 57.5 70.4" fill="none" stroke={shade(shirt, -0.22)} strokeWidth="2.2" strokeLinecap="round" />}
      <ellipse cx="34.6" cy="42" rx="2.6" ry="4" fill={shade(skin, -0.06)} />
      <ellipse cx="65.4" cy="42" rx="2.6" ry="4" fill={shade(skin, -0.06)} />
      <ellipse cx="50" cy="40" rx="15.6" ry="18.2" fill={skin} />
      {front && <path d={front} fill={hair} />}
      {style === "curly" &&
        [[36, 32, 5.2], [40, 26, 5.6], [46, 22.5, 5.8], [53, 22, 5.8], [59.5, 25, 5.6], [64, 31, 5.2], [50, 27, 5]].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill={hair} />
        ))}
      {style === "bun" && <circle cx="50" cy="15.5" r="6.8" fill={hair} />}
      {glasses && (
        <g fill="none" stroke="#2a2522" strokeWidth="1.5">
          <rect x="38.6" y="37.6" width="9.4" height="7" rx="3" />
          <rect x="52" y="37.6" width="9.4" height="7" rx="3" />
          <path d="M48 40.4 C49.3 39.4 50.7 39.4 52 40.4" />
        </g>
      )}
    </g>
  );
}

export function Avatar({ who, size = 40, ring }: { who: string; size?: number; ring?: boolean }) {
  const look = lookFor(who);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="shrink-0 rounded-full" style={{ boxShadow: ring ? "0 0 0 2px #fff, 0 0 0 4px #1f5bff" : undefined }} aria-hidden>
      <defs>
        <clipPath id={`c-${size}`}>
          <circle cx="50" cy="50" r="50" />
        </clipPath>
      </defs>
      <g clipPath={`url(#c-${size})`}>
        <rect width="100" height="100" fill={look.bg} />
        <g transform="translate(-14 -2) scale(1.28)">
          <Bust look={look} />
        </g>
      </g>
    </svg>
  );
}

/* A bright home office behind the person: the "video" on Prep.io. */
export function Room({ look, bob = 0, sway = 0 }: { look: Look; bob?: number; sway?: number }) {
  const wall = look.wall;
  const deep = shade(wall, -0.07);
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
      <rect width="1600" height="900" fill={wall} />
      <rect y="760" width="1600" height="140" fill={deep} />
      {look.room === "window" && (
        <g>
          <rect x="1030" y="120" width="400" height="360" rx="10" fill="#ffffff" />
          <rect x="1046" y="136" width="368" height="328" rx="4" fill="#dcecff" />
          <circle cx="1330" cy="220" r="46" fill="#fff6d8" />
          <path d="M1046 400 C1120 350 1190 380 1250 350 C1320 318 1370 350 1414 330 L1414 464 L1046 464 Z" fill="#c9e6d2" />
          <rect x="1226" y="136" width="10" height="328" fill="#ffffff" />
          <rect x="1046" y="296" width="368" height="10" fill="#ffffff" />
          <g transform={`rotate(${sway} 1500 90)`}>
            <path d="M1500 60 L1500 150" stroke="#b9a58a" strokeWidth="3" />
            <path d="M1462 150 L1538 150 L1528 198 L1472 198 Z" fill="#e9d3b4" />
            {[[-38, 12], [-20, 34], [6, 40], [30, 28], [42, 8]].map(([dx, dy], i) => (
              <ellipse key={i} cx={1500 + dx} cy={198 + dy} rx="16" ry="30" fill={i % 2 ? "#5fae7e" : "#4d9a6c"} transform={`rotate(${dx * 0.9} ${1500 + dx} ${198 + dy})`} />
            ))}
          </g>
        </g>
      )}
      {look.room === "shelf" && (
        <g>
          <rect x="980" y="330" width="500" height="16" rx="4" fill="#d9c3a2" />
          <rect x="980" y="560" width="500" height="16" rx="4" fill="#d9c3a2" />
          {[
            [1000, 250, 34, "#1f5bff"], [1038, 230, 28, "#ffb61e"], [1070, 262, 40, "#e5484d"], [1114, 240, 26, "#3f7a62"],
            [1260, 236, 30, "#7a5aa6"], [1294, 256, 44, "#e9e4da"],
          ].map(([x, y, w, c], i) => (
            <rect key={i} x={x as number} y={y as number} width={w as number} height={330 - (y as number)} rx="3" fill={c as string} />
          ))}
          <rect x="1150" y="300" width="80" height="30" rx="4" fill="#efe7da" />
          <g>
            <path d="M1380 330 L1440 330 L1432 280 L1388 280 Z" fill="#f1e1c9" />
            {[[-22, -4], [-8, -20], [10, -22], [24, -6]].map(([dx, dy], i) => (
              <ellipse key={i} cx={1410 + dx} cy={260 + dy} rx="12" ry="26" fill={i % 2 ? "#5fae7e" : "#4d9a6c"} transform={`rotate(${dx * 1.4 + sway} ${1410 + dx} ${260 + dy})`} />
            ))}
          </g>
          {[[1010, 478, 60, "#ffe1b8"], [1080, 470, 46, "#cfe0ff"], [1136, 486, 70, "#f6d4d4"]].map(([x, y, w, c], i) => (
            <rect key={i} x={x as number} y={y as number} width={w as number} height={560 - (y as number)} rx="3" fill={c as string} />
          ))}
          <circle cx="1330" cy="520" r="36" fill="#fff" />
          <circle cx="1330" cy="520" r="28" fill="none" stroke="#d9c3a2" strokeWidth="3" />
          <path d="M1330 520 L1330 500 M1330 520 L1344 528" stroke="#8a7a66" strokeWidth="4" strokeLinecap="round" />
        </g>
      )}
      {look.room === "art" && (
        <g>
          <rect x="1040" y="150" width="250" height="310" rx="6" fill="#ffffff" />
          <rect x="1058" y="168" width="214" height="274" rx="2" fill="#fff4dc" />
          <circle cx="1165" cy="270" r="58" fill="#ffb61e" />
          <rect x="1058" y="340" width="214" height="102" fill="#f2a58e" />
          <rect x="1320" y="220" width="170" height="200" rx="6" fill="#ffffff" />
          <rect x="1334" y="234" width="142" height="172" rx="2" fill="#dfeaff" />
          <path d="M1334 380 L1390 310 L1430 356 L1476 300 L1476 406 L1334 406 Z" fill="#9db8ff" />
          <g transform={`rotate(${sway * 0.6} 1420 760)`}>
            <rect x="1386" y="690" width="68" height="70" rx="8" fill="#e9d3b4" />
            {[[-30, -10], [-14, -40], [4, -54], [22, -38], [36, -12]].map(([dx, dy], i) => (
              <ellipse key={i} cx={1420 + dx} cy={660 + dy} rx="15" ry="42" fill={i % 2 ? "#5fae7e" : "#4d9a6c"} transform={`rotate(${dx * 0.8} ${1420 + dx} ${660 + dy})`} />
            ))}
          </g>
        </g>
      )}
      <g transform="translate(300 128) scale(7.4)">
        <Bust look={look} bob={bob} />
      </g>
    </svg>
  );
}

export function CompanyLogo({ c, size = 48 }: { c: Company; size?: number }) {
  const letters = c.name === "Goldman Sachs" ? "GS" : c.name === "Jane Street" ? "JS" : c.name[0];
  return (
    <span
      className="grid shrink-0 place-items-center font-bold text-white"
      style={{ width: size, height: size, borderRadius: size * 0.22, background: c.tone, fontSize: size * (letters.length > 1 ? 0.36 : 0.46), letterSpacing: "-0.02em" }}
    >
      {letters}
    </span>
  );
}
