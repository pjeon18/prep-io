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
