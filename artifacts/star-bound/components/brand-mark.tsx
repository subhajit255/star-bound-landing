export function StarMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#7a52e8" />
      <path d="M16 6l2.2 6.2L24.5 14l-6.3 1.8L16 22l-2.2-6.2L7.5 14l6.3-1.8z" fill="#fff" />
      <circle cx="24" cy="7.5" r="1.6" fill="#f3c969" />
      <circle cx="8" cy="24" r="1.2" fill="#f3c969" />
    </svg>
  );
}
