type InstagramOriginalIconProps = {
  className?: string;
};

export function InstagramOriginalIcon({ className }: InstagramOriginalIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="igGradient" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F58529" />
          <stop offset="35%" stopColor="#DD2A7B" />
          <stop offset="70%" stopColor="#8134AF" />
          <stop offset="100%" stopColor="#515BD4" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#igGradient)" />
      <rect x="7" y="7" width="10" height="10" rx="5" stroke="white" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.2" fill="white" />
    </svg>
  );
}
