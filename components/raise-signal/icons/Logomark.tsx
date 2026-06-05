type LogomarkProps = {
  size?: number;
};

export function Logomark({ size = 30 }: LogomarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className="block"
      aria-hidden
    >
      <defs>
        <linearGradient id="rs-logo-grad" x1="0" y1="32" x2="32" y2="0">
          <stop offset="0" stopColor="var(--primary-600)" />
          <stop offset="1" stopColor="var(--primary)" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#rs-logo-grad)" />
      <rect x="8" y="18" width="3.4" height="6" rx="1.4" fill="#fff" opacity="0.92" />
      <rect x="14.3" y="14" width="3.4" height="10" rx="1.4" fill="#fff" opacity="0.92" />
      <rect x="20.6" y="9" width="3.4" height="15" rx="1.4" fill="#fff" />
      <circle cx="22.3" cy="9" r="2.4" fill="#fff" />
      <circle
        cx="22.3"
        cy="9"
        r="4.4"
        fill="none"
        stroke="#fff"
        strokeWidth="1.1"
        opacity="0.5"
      />
    </svg>
  );
}
