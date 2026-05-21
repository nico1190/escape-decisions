interface Props {
  /** Mouse position as % of the room canvas (0–100). */
  x: number
  y: number
  /** Whether the player has a light source — widens the beam significantly. */
  hasLight: boolean
}

/**
 * Two-layer darkness:
 *  - The base layer is a near-opaque black overlay with a radial transparent
 *    cutout at the cursor (the "light"). pointer-events: none so it does NOT
 *    intercept hotspot clicks.
 *  - Without a light source, the cutout is a small dim spot — just enough to
 *    aim. With the flashlight, the cutout is a wide soft cone.
 */
export function DarknessOverlay({ x, y, hasLight }: Props) {
  // With light: bigger beam, softer fade. Without: tiny pinpoint, harder fade.
  const innerR = hasLight ? 12 : 2.5
  const outerR = hasLight ? 28 : 9
  const opacityBase = hasLight ? 0.93 : 0.985

  const mask = `radial-gradient(circle at ${x}% ${y}%, transparent 0%, transparent ${innerR}%, black ${outerR}%)`

  return (
    <>
      {/* Cool ambient tint underneath the darkness — keeps a slight blue chill */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(15,23,42,0.6), rgba(2,6,23,0.9))',
        }}
      />
      {/* Darkness layer with cursor cutout */}
      <div
        className="pointer-events-none absolute inset-0 transition-[mask-image] duration-100"
        style={{
          background: `rgba(0,0,0,${opacityBase})`,
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      />
      {/* Warm flashlight tint inside the beam, only when player has light */}
      {hasLight && (
        <div
          className="pointer-events-none absolute inset-0 mix-blend-screen"
          style={{
            background: `radial-gradient(circle at ${x}% ${y}%, rgba(254,243,199,0.25) 0%, rgba(254,243,199,0.08) ${innerR}%, transparent ${outerR}%)`,
          }}
        />
      )}
    </>
  )
}
