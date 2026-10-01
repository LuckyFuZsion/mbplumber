type P = { className?: string };
const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const PhoneIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
  </svg>
);
export const MailIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 6L2 7" />
  </svg>
);
export const PinIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
export const CheckIcon = ({ className }: P) => (
  <svg {...base} strokeWidth={2.6} className={className}>
    <path d="m5 12 5 5L20 7" />
  </svg>
);
export const StarIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
    <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
  </svg>
);
export const MenuIcon = ({ className }: P) => (
  <svg {...base} strokeWidth={2.4} className={className}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);
export const CloseIcon = ({ className }: P) => (
  <svg {...base} strokeWidth={2.4} className={className}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const ShieldIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

// Service icons
export const WrenchIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M14.7 6.3a4 4 0 0 0 5 5L22 13.6 13.6 22 2 10.4 10.4 2l2.3 2.3a4 4 0 0 0 2 2z" transform="scale(.9) translate(1.3 1.3)" />
  </svg>
);
export const TapIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M4 8h9a4 4 0 0 1 4 4v1" />
    <path d="M8 8V5M5 5h6" />
    <path d="M17 13v2" />
    <path d="M17 18.5c-.9 1-1.5 1.8-1.5 2.5a1.5 1.5 0 0 0 3 0c0-.7-.6-1.5-1.5-2.5z" />
    <path d="M4 8v3h3" />
  </svg>
);
export const SinkIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M3 12h18v2a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5z" />
    <path d="M12 12V6a2 2 0 0 1 2-2h2" />
    <path d="M7 19v2M17 19v2" />
  </svg>
);
export const BathIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M3 12h18v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z" />
    <path d="M6 12V6a2 2 0 0 1 4 0" />
    <path d="M7 19l-1 2M17 19l1 2" />
  </svg>
);
export const FlameIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M12 22c4 0 7-2.7 7-6.8 0-3-1.8-5-3.2-6.7-.5 1.6-1.4 2.5-2.3 2.8C13.9 7.4 12.600 4.600 10 2c.2 3-1.700 5.200-3.300 7.200C5.400 10.900 5 12.700 5 15.200 5 19.300 8 22 12 22z" />
  </svg>
);

export const SERVICE_ICONS: Record<string, (p: P) => React.JSX.Element> = {
  wrench: WrenchIcon,
  tap: TapIcon,
  sink: SinkIcon,
  bath: BathIcon,
  flame: FlameIcon,
};

/** Service icon from /public/icons, drawn as a mask so it takes the current text colour. */
export function ServiceIcon({ name, className = "h-7 w-7" }: { name: string; className?: string }) {
  const url = `url(/icons/${name}.png)`;
  return (
    <span
      aria-hidden
      className={`inline-block bg-current ${className}`}
      style={{ WebkitMask: `${url} center / contain no-repeat`, mask: `${url} center / contain no-repeat` }}
    />
  );
}
