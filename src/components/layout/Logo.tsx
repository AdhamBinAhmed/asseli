/**
 * The brand wordmark ("أصيلي") is a black-on-transparent PNG, so it vanishes on
 * dark surfaces. We use it as a CSS mask and paint a gold gradient through it,
 * giving a crisp, on-brand logo that reads on any background.
 * Size it with `className` (e.g. "h-11 w-32") — keep roughly a 3:1 ratio.
 */
export function Logo({ className = '' }: { className?: string }) {
  const mask = {
    WebkitMaskImage: 'url(/logo.png)',
    maskImage: 'url(/logo.png)',
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
  } as const;

  return (
    <span
      role="img"
      aria-label="Asseli"
      className={`block bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 ${className}`}
      style={mask}
    />
  );
}
