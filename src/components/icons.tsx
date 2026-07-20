/**
 * The custom stroke icon set. NO EMOJI anywhere in UI chrome — when a new
 * glyph is needed, add it here. 24x24 viewBox, currentColor strokes.
 */

interface IconProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
}

function base(props: IconProps) {
  return {
    width: props.size ?? 20,
    height: props.size ?? 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: props.strokeWidth ?? 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: props.className,
  };
}

export const IconHand = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M8 12V5.5a1.5 1.5 0 0 1 3 0V11" />
    <path d="M11 11V4.5a1.5 1.5 0 0 1 3 0V11" />
    <path d="M14 11V6a1.5 1.5 0 0 1 3 0v7.5" />
    <path d="M17 13.5c1.2-1.8 3-1 2.4.6l-2 4.6A5.5 5.5 0 0 1 12.3 22h-1a5.5 5.5 0 0 1-4.6-2.5L4 15.2c-.9-1.4 1-2.8 2.2-1.6L8 15.5" />
  </svg>
);

export const IconEye = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const IconCheck = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4.5 12.5 10 18 19.5 7" />
  </svg>
);

export const IconShieldCheck = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 2.5 4.5 5.5v6c0 4.5 3.2 8.2 7.5 9.5 4.3-1.3 7.5-5 7.5-9.5v-6L12 2.5Z" />
    <path d="m8.8 12 2.3 2.3 4.1-4.6" />
  </svg>
);

export const IconShieldQuestion = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 2.5 4.5 5.5v6c0 4.5 3.2 8.2 7.5 9.5 4.3-1.3 7.5-5 7.5-9.5v-6L12 2.5Z" />
    <path d="M10 9.5a2 2 0 1 1 3 1.7c-.7.4-1 .9-1 1.8" />
    <circle cx="12" cy="15.7" r="0.4" fill="currentColor" />
  </svg>
);

export const IconCalendar = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="4" y="5.5" width="16" height="15" rx="2.5" />
    <path d="M4 10h16M8.5 3.5v3.5M15.5 3.5v3.5" />
  </svg>
);

export const IconBell = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 10a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 14 6 10Z" />
    <path d="M10 19a2.2 2.2 0 0 0 4 0" />
  </svg>
);

export const IconPlay = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M7.5 5.5v13l11-6.5-11-6.5Z" />
  </svg>
);

export const IconChat = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M20.5 11.5a8 8 0 0 1-11.7 7L4 20l1.6-4.5a8 8 0 1 1 14.9-4Z" />
  </svg>
);

export const IconArrowLeft = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M19 12H5M11 5.5 4.5 12 11 18.5" />
  </svg>
);

export const IconArrowUp = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 19V5M5.5 11 12 4.5 18.5 11" />
  </svg>
);

export const IconX = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const IconMic = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3.5" />
  </svg>
);

export const IconUsers = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="9" cy="8.5" r="3.5" />
    <path d="M3 20a6 6 0 0 1 12 0" />
    <path d="M16 5.6a3.5 3.5 0 0 1 0 5.8M17.5 14.5a6 6 0 0 1 3.5 5.5" />
  </svg>
);

export const IconSpark = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
  </svg>
);

export const IconGear = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2.8v2.4M12 18.8v2.4M4.5 6.5l1.7 1.7M17.8 17.8l1.7 1.7M2.8 12h2.4M18.8 12h2.4M4.5 17.5l1.7-1.7M17.8 6.2l1.7-1.7" />
  </svg>
);

export const IconBook = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21V5.5Z" />
    <path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20" />
  </svg>
);

export const IconDoor = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M14 3H5v18h9" />
    <path d="M14 3l5 2v14l-5 2V3Z" />
    <circle cx="16.2" cy="12" r="0.5" fill="currentColor" />
  </svg>
);

export const IconClock = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2.5" />
  </svg>
);

export const IconDollar = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3.5v17M16.5 7.5c0-1.7-2-2.8-4.5-2.8S7.5 5.8 7.5 7.7c0 4.3 9 2.4 9 6.8 0 1.9-2 3-4.5 3s-4.5-1.2-4.5-2.9" />
  </svg>
);

export const IconSearch = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="m15.5 15.5 5 5" />
  </svg>
);

export const IconHome = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 11.5 12 4l8 7.5" />
    <path d="M6 10v10h12V10" />
  </svg>
);

export const IconCompass = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
  </svg>
);

export const IconLibrary = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 4.5v15M8.5 4.5v15" />
    <path d="m12.5 5.5 5.5 13.5" transform="rotate(-8 15 12)" />
  </svg>
);

export const IconHeart = (p: IconProps & { filled?: boolean }) => (
  <svg {...base(p)} fill={p.filled ? "currentColor" : "none"}>
    <path d="M12 20s-7.5-4.6-7.5-10A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7.5 3c0 5.4-7.5 10-7.5 10Z" />
  </svg>
);

export const IconTicket = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 8a2 2 0 0 0 2-2h12a2 2 0 0 0 2 2v3a2 2 0 0 0 0 2v3a2 2 0 0 0-2 2H6a2 2 0 0 0-2-2v-3a2 2 0 0 0 0-2V8Z" transform="rotate(0 12 12)" />
    <path d="M14 6.5v11" strokeDasharray="2 2.5" />
  </svg>
);

export const IconBolt = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M13 3 5.5 13.5H11L10 21l7.5-10.5H12L13 3Z" />
  </svg>
);

export const IconDownload = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 4v11M7 11l5 5 5-5" />
    <path d="M5 20h14" />
  </svg>
);

export const IconPlus = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconList = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M9 6.5h11M9 12h11M9 17.5h11" />
    <circle cx="5" cy="6.5" r="0.6" fill="currentColor" />
    <circle cx="5" cy="12" r="0.6" fill="currentColor" />
    <circle cx="5" cy="17.5" r="0.6" fill="currentColor" />
  </svg>
);

export const IconVideo = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3.5" y="6.5" width="12" height="11" rx="2.5" />
    <path d="m15.5 11 5-3v8l-5-3" />
  </svg>
);

export const IconStar = (p: IconProps & { filled?: boolean }) => (
  <svg {...base(p)} fill={p.filled ? "currentColor" : "none"}>
    <path d="m12 4 2.35 4.9 5.35.7-3.93 3.72.99 5.32L12 16.06l-4.76 2.58.99-5.32L4.3 9.6l5.35-.7L12 4Z" />
  </svg>
);

export const IconBuilding = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 20.5V5a1.5 1.5 0 0 1 1.5-1.5h7A1.5 1.5 0 0 1 15 5v15.5" />
    <path d="M15 9.5h3A1.5 1.5 0 0 1 19.5 11v9.5M3.5 20.5h17" />
    <path d="M8 7.5h1.5M11 7.5h1.5M8 11h1.5M11 11h1.5M8 14.5h1.5M11 14.5h1.5" />
  </svg>
);

export const IconLink = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M9.5 14.5 14.5 9.5" />
    <path d="M11 6.5 12.8 4.7a3.8 3.8 0 0 1 5.4 5.4L16.4 12" />
    <path d="M13 17.5 11.2 19.3a3.8 3.8 0 0 1-5.4-5.4L7.6 12" />
  </svg>
);
