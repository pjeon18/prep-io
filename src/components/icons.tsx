import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };
const b = (size = 20): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
});

export const Home = ({ size, ...p }: P) => <svg {...b(size)} {...p}><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1v-9.5Z" /></svg>;
export const HomeFill = ({ size, ...p }: P) => <svg {...b(size)} {...p}><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1v-9.5Z" fill="currentColor" /></svg>;
export const Video = ({ size, ...p }: P) => <svg {...b(size)} {...p}><rect x="3" y="5.5" width="13" height="13" rx="2.5" /><path d="m16 10 5-3v10l-5-3" /></svg>;
export const Calendar = ({ size, ...p }: P) => <svg {...b(size)} {...p}><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>;
export const Building = ({ size, ...p }: P) => <svg {...b(size)} {...p}><path d="M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16M15 9h4a1 1 0 0 1 1 1v11M3 21h18M8 8h3M8 12h3M8 16h3" /></svg>;
export const Broadcast = ({ size, ...p }: P) => <svg {...b(size)} {...p}><circle cx="12" cy="12" r="2.2" /><path d="M8 8a5.6 5.6 0 0 0 0 8M16 8a5.6 5.6 0 0 1 0 8M5.2 5.2a9.6 9.6 0 0 0 0 13.6M18.8 5.2a9.6 9.6 0 0 1 0 13.6" /></svg>;
export const Search = ({ size, ...p }: P) => <svg {...b(size)} {...p}><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></svg>;
export const Bell = ({ size, ...p }: P) => <svg {...b(size)} {...p}><path d="M6 9.5a6 6 0 1 1 12 0c0 5.5 2.2 7 2.2 7H3.8S6 15 6 9.5Z" /><path d="M10 20a2.2 2.2 0 0 0 4 0" /></svg>;
export const BellFill = ({ size, ...p }: P) => <svg {...b(size)} {...p}><path d="M6 9.5a6 6 0 1 1 12 0c0 5.5 2.2 7 2.2 7H3.8S6 15 6 9.5Z" fill="currentColor" /><path d="M10 20a2.2 2.2 0 0 0 4 0" /></svg>;
export const Check = ({ size, ...p }: P) => <svg {...b(size)} {...p}><path d="m5 12.5 4.2 4.2L19 7" /></svg>;
export const Plus = ({ size, ...p }: P) => <svg {...b(size)} {...p}><path d="M12 5v14M5 12h14" /></svg>;
export const Up = ({ size, ...p }: P) => <svg {...b(size)} {...p}><path d="M12 19V6m-6 6 6-6 6 6" /></svg>;
export const Send = ({ size, ...p }: P) => <svg {...b(size)} {...p}><path d="M5 12h13M13 6l6 6-6 6" /></svg>;
export const Bookmark = ({ size, ...p }: P) => <svg {...b(size)} {...p}><path d="M6.5 4h11v16l-5.5-4-5.5 4V4Z" /></svg>;
export const BookmarkFill = ({ size, ...p }: P) => <svg {...b(size)} {...p}><path d="M6.5 4h11v16l-5.5-4-5.5 4V4Z" fill="currentColor" /></svg>;
export const External = ({ size, ...p }: P) => <svg {...b(size)} {...p}><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>;
export const ChevronRight = ({ size, ...p }: P) => <svg {...b(size)} {...p}><path d="m9 6 6 6-6 6" /></svg>;
export const ChevronLeft = ({ size, ...p }: P) => <svg {...b(size)} {...p}><path d="m15 6-6 6 6 6" /></svg>;
export const Eye = ({ size, ...p }: P) => <svg {...b(size)} {...p}><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="3" /></svg>;
export const Play = ({ size, ...p }: P) => <svg {...b(size)} {...p}><path d="M7 5.5v13a.6.6 0 0 0 .9.5l10.4-6.5a.6.6 0 0 0 0-1L7.9 5a.6.6 0 0 0-.9.5Z" fill="currentColor" stroke="none" /></svg>;
export const Pause = ({ size, ...p }: P) => <svg {...b(size)} {...p}><path d="M8.5 5.5v13M15.5 5.5v13" strokeWidth={2.6} /></svg>;
export const Volume = ({ size, ...p }: P) => <svg {...b(size)} {...p}><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4v-5Z" /><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" /></svg>;
export const Captions = ({ size, ...p }: P) => <svg {...b(size)} {...p}><rect x="3" y="5.5" width="18" height="13" rx="2.5" /><path d="M10.5 10.2a2.2 2.2 0 1 0 0 3.6M17 10.2a2.2 2.2 0 1 0 0 3.6" /></svg>;
export const Expand = ({ size, ...p }: P) => <svg {...b(size)} {...p}><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>;
export const Gear = ({ size, ...p }: P) => <svg {...b(size)} {...p}><circle cx="12" cy="12" r="3" /><path d="M12 2.8v2.4M12 18.8v2.4M4.2 7.5l2.1 1.2M17.7 15.3l2.1 1.2M4.2 16.5l2.1-1.2M17.7 8.7l2.1-1.2" /></svg>;
export const Briefcase = ({ size, ...p }: P) => <svg {...b(size)} {...p}><rect x="3" y="7" width="18" height="13" rx="2.5" /><path d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7M3 12.5h18" /></svg>;
export const Chat = ({ size, ...p }: P) => <svg {...b(size)} {...p}><path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.1A8 8 0 1 1 20 12Z" /></svg>;

/** Verified: a filled badge in the brand green. */
export const VerifiedBadge = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-label="Verified">
    <path fill="#0f5c3b" d="M12 1.8 14.6 4l3.4-.3.9 3.3 3 1.7-1.3 3.2 1.3 3.2-3 1.7-.9 3.3-3.4-.3L12 22.2 9.4 20l-3.4.3-.9-3.3-3-1.7 1.3-3.2-1.3-3.2 3-1.7.9-3.3 3.4.3L12 1.8Z" />
    <path d="m8 12.3 2.7 2.7L16.2 9.4" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
