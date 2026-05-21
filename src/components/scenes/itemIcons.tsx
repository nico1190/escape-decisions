interface IconProps {
  className?: string
}

/**
 * Pixel-clean illustrated item icons, drawn for the 5 inventory items.
 * Each renders inside a 24×24 box with consistent stroke weight so they sit
 * nicely together in the inventory bar.
 */

export function ExtinguisherIcon({
  className,
  variant,
}: IconProps & { variant: 'A' | 'K' }) {
  const body = variant === 'A' ? '#dc2626' : '#eab308'
  const label = variant === 'A' ? '#7f1d1d' : '#854d0e'
  const labelBg = variant === 'A' ? '#fef3c7' : '#1f1f1f'
  const labelFg = variant === 'A' ? '#dc2626' : '#eab308'

  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {/* valve */}
      <rect x="9" y="2" width="6" height="3" rx="0.6" fill="#1f2937" />
      <rect x="10.5" y="0.5" width="3" height="2" fill="#1f2937" />
      {/* hose */}
      <path d="M 14.5 4 Q 18 5, 17.5 8" stroke="#1f2937" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* body */}
      <rect x="6.5" y="5" width="11" height="17" rx="1.6" fill={body} stroke={label} strokeWidth="0.8" />
      {/* highlight */}
      <rect x="7.5" y="6.5" width="1.4" height="13" rx="0.6" fill="#ffffff" opacity="0.18" />
      {/* label panel */}
      <rect x="7.5" y="13" width="9" height="6" rx="0.4" fill={labelBg} stroke={label} strokeWidth="0.4" />
      <text
        x="12"
        y="17.6"
        textAnchor="middle"
        fontSize="5.6"
        fontWeight="800"
        fill={labelFg}
        fontFamily="monospace"
      >
        {variant}
      </text>
    </svg>
  )
}

export function LidIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="lidGrad" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
      </defs>
      {/* handle */}
      <rect x="10" y="3" width="4" height="3" rx="1" fill="#1f2937" />
      <rect x="9" y="6" width="6" height="1.5" rx="0.5" fill="#334155" />
      {/* dome */}
      <path d="M 3 12 Q 12 6, 21 12 L 21 14 L 3 14 Z" fill="url(#lidGrad)" stroke="#1f2937" strokeWidth="0.6" />
      {/* highlight */}
      <path d="M 5 12 Q 9 9, 12 9" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="0.7" fill="none" />
      {/* rim */}
      <rect x="3" y="14" width="18" height="2" rx="0.5" fill="#334155" stroke="#1f2937" strokeWidth="0.4" />
    </svg>
  )
}

export function BakingSodaIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {/* box */}
      <rect x="4" y="5" width="16" height="16" rx="0.6" fill="#fef3c7" stroke="#854d0e" strokeWidth="0.6" />
      {/* yellow band */}
      <rect x="4" y="9" width="16" height="4" fill="#facc15" />
      {/* label text suggestion */}
      <rect x="6" y="14" width="12" height="0.6" fill="#854d0e" opacity="0.6" />
      <rect x="6" y="15.4" width="9" height="0.6" fill="#854d0e" opacity="0.5" />
      <rect x="6" y="16.8" width="11" height="0.6" fill="#854d0e" opacity="0.4" />
      {/* "+" cross above (bicarbonate suggestion) */}
      <rect x="11" y="6.4" width="2" height="2" fill="#dc2626" />
      <rect x="10.2" y="7.2" width="3.6" height="0.6" fill="#dc2626" />
      {/* top flap */}
      <path d="M 4 5 L 12 3 L 20 5 Z" fill="#facc15" stroke="#854d0e" strokeWidth="0.4" />
    </svg>
  )
}

export function KeysIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {/* keyring */}
      <circle cx="12" cy="6" r="3" fill="none" stroke="#94a3b8" strokeWidth="1.2" />
      {/* key 1 */}
      <g transform="translate(8 9) rotate(-18)">
        <rect x="0" y="0" width="2" height="12" rx="0.4" fill="#fbbf24" stroke="#854d0e" strokeWidth="0.3" />
        <rect x="-0.6" y="10.5" width="3.2" height="1.2" fill="#fbbf24" />
        <rect x="-0.6" y="12" width="2" height="1" fill="#fbbf24" />
      </g>
      {/* key 2 */}
      <g transform="translate(15 9) rotate(18)">
        <rect x="0" y="0" width="2" height="12" rx="0.4" fill="#cbd5e1" stroke="#475569" strokeWidth="0.3" />
        <rect x="-0.6" y="10.5" width="3.2" height="1.2" fill="#cbd5e1" />
        <rect x="-0.6" y="12" width="2" height="1" fill="#cbd5e1" />
      </g>
    </svg>
  )
}

const ICONS_MAP: Record<string, React.FC<{ className?: string }>> = {
  ExtinguisherA: (p) => <ExtinguisherIcon {...p} variant="A" />,
  ExtinguisherK: (p) => <ExtinguisherIcon {...p} variant="K" />,
  Lid: LidIcon,
  BakingSoda: BakingSodaIcon,
  Keys: KeysIcon,
}

export function getItemIcon(name: string): React.FC<{ className?: string }> | null {
  return ICONS_MAP[name] ?? null
}
