import { motion } from 'framer-motion'
import type { PlayerState } from '@/types/game'

interface Props {
  state: PlayerState
}

/**
 * Level 3 — "Estación Abandonada"
 * Cold sci-fi palette: navy/teal walls, metallic floor, emergency lights.
 *
 * Reactive elements:
 *  - Wire panel (left) — door open showing tangled cables until wires fixed
 *  - Control desk (center) — sliders puzzle entry
 *  - Sealed door (right) — keypad entry; opens with green light when all 3
 *    systems are online (slider, wire, code)
 *  - Status display panel — flickers numbers (the slider targets clue)
 *  - Maintenance schedule poster — small numbers (the keypad code clue)
 *  - Round porthole — stars and slow drifting dust
 */
export function StationScene({ state }: Props) {
  const sysPower = !!state.flags.sys_power         // slider solved
  const sysCom = !!state.flags.sys_comms           // wire solved
  const sysDoor = !!state.flags.sys_door           // code solved
  const sysPressure = !!state.flags.sys_pressure   // timing puzzle solved
  const hasFlashlight = state.inventory.some((e) => e.itemId === 'flashlight')
  const allOnline = sysPower && sysCom && sysDoor && sysPressure

  return (
    <svg
      viewBox="0 0 100 56"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      role="img"
      aria-label="Estación abandonada"
    >
      <defs>
        <linearGradient id="stationWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
        <linearGradient id="stationFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="metalPanel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <radialGradient id="emerLightLeft" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="emerLightRight" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor={allOnline ? '#10b981' : '#ef4444'} stopOpacity="0.7" />
          <stop offset="100%" stopColor={allOnline ? '#10b981' : '#ef4444'} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="screenGlow" cx="0.5" cy="0.5" r="0.7">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="vignetteSci" cx="0.5" cy="0.55" r="0.75">
          <stop offset="0%" stopColor="transparent" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.6" />
        </radialGradient>
      </defs>

      {/* Wall + floor */}
      <rect x="0" y="0" width="100" height="40" fill="url(#stationWall)" />
      <rect x="0" y="40" width="100" height="16" fill="url(#stationFloor)" />
      {/* Floor grating lines */}
      {[10, 22, 36, 52, 70, 88].map((x) => (
        <line key={x} x1={x} y1="40" x2={x - 6} y2="56" stroke="#0a0a0a" strokeOpacity="0.7" strokeWidth="0.2" />
      ))}
      {[44, 48, 52].map((y) => (
        <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#0a0a0a" strokeOpacity="0.4" strokeWidth="0.15" />
      ))}
      <rect x="0" y="39.5" width="100" height="0.7" fill="#0a0a0a" />

      {/* Ceiling pipe / wiring conduit */}
      <rect x="0" y="0" width="100" height="3" fill="#1e293b" />
      <rect x="0" y="2.6" width="100" height="0.3" fill="#0a0a0a" opacity="0.7" />

      {/* Emergency strobe lights ceiling-mounted */}
      <motion.rect
        x="2" y="3" width="6" height="1.6" rx="0.3" fill="#ef4444"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.rect
        x="92" y="3" width="6" height="1.6" rx="0.3"
        fill={allOnline ? '#10b981' : '#ef4444'}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
      />
      {/* Light bleed under lights */}
      <rect x="0" y="3" width="14" height="14" fill="url(#emerLightLeft)" />
      <rect x="86" y="3" width="14" height="14" fill="url(#emerLightRight)" />

      {/* Porthole window with stars */}
      <g transform="translate(50 14)">
        <circle r="7" fill="#0a0a0a" stroke="#475569" strokeWidth="0.6" />
        <circle r="6.3" fill="#020617" />
        {/* stars */}
        {[
          { x: -3.5, y: -2, r: 0.18 },
          { x: -1, y: -4, r: 0.12 },
          { x: 2, y: -3, r: 0.2 },
          { x: 3.5, y: 0.5, r: 0.13 },
          { x: -3, y: 2.5, r: 0.16 },
          { x: 0.5, y: 3.5, r: 0.12 },
          { x: -1.5, y: 0.5, r: 0.1 },
          { x: 4, y: -1.5, r: 0.14 },
        ].map((s, i) => (
          <motion.circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill="#fef3c7"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
        {/* distant planet */}
        <circle cx="-4" cy="3.5" r="1.1" fill="#1e3a8a" opacity="0.85" />
        <circle cx="-3.5" cy="3" r="0.4" fill="#3b82f6" opacity="0.6" />
        {/* window rim bolts */}
        {[0, 90, 180, 270].map((deg) => {
          const a = (deg * Math.PI) / 180
          return (
            <circle key={deg} cx={6.5 * Math.cos(a)} cy={6.5 * Math.sin(a)} r="0.3" fill="#475569" />
          )
        })}
      </g>

      {/* LEFT WALL: wire/comms panel — open box with cables hanging out */}
      <g>
        {/* mounting box */}
        <rect x="3" y="22" width="14" height="14" fill="#1e293b" stroke="#0a0a0a" strokeWidth="0.4" rx="0.4" />
        {/* opened panel cover hanging by one screw */}
        <rect x="2" y="20.5" width="14" height="2" fill="url(#metalPanel)" stroke="#0a0a0a" strokeWidth="0.3" transform="rotate(-12 9 21.5)" />
        <circle cx="3" cy="20.8" r="0.3" fill="#fbbf24" />
        {/* inside cavity */}
        <rect x="4" y="23" width="12" height="12" fill="#0a0a0a" />
        {/* COMMS label */}
        <rect x="4" y="35.5" width="12" height="1.4" fill="#0f172a" stroke="#475569" strokeWidth="0.15" />
        <text x="10" y="36.6" textAnchor="middle" fontSize="0.9" fill={sysCom ? '#10b981' : '#fbbf24'} fontFamily="monospace" fontWeight="bold">
          COMMS {sysCom ? 'OK' : 'OFFLINE'}
        </text>
        {sysCom ? (
          // Neat connected wires (after solve)
          <g>
            {[24.5, 26.5, 28.5, 30.5].map((y, i) => (
              <line
                key={i}
                x1="5"
                y1={y}
                x2="15"
                y2={y}
                stroke={['#ef4444', '#3b82f6', '#fbbf24', '#10b981'][i]}
                strokeWidth="0.5"
                strokeLinecap="round"
              />
            ))}
            {/* status LED */}
            <circle cx="14" cy="33" r="0.5" fill="#10b981" />
          </g>
        ) : (
          // Tangled cables hanging out
          <g>
            <path d="M 5 24 Q 7 26, 10 25 T 14 28" stroke="#ef4444" strokeWidth="0.5" fill="none" />
            <path d="M 5 26 Q 8 28, 6 31 T 11 34" stroke="#3b82f6" strokeWidth="0.5" fill="none" />
            <path d="M 5 28 Q 9 31, 13 30 T 15 33" stroke="#fbbf24" strokeWidth="0.5" fill="none" />
            <path d="M 5 30 Q 10 33, 7 35" stroke="#10b981" strokeWidth="0.5" fill="none" />
            {/* sparks */}
            <motion.circle
              cx="8" cy="27" r="0.3" fill="#fef3c7"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.4, repeat: Infinity, delay: 0.5 }}
            />
            <motion.circle
              cx="12" cy="30" r="0.25" fill="#fef3c7"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, delay: 1.2 }}
            />
          </g>
        )}
      </g>

      {/* CENTER FLOOR: control desk with sliders + status display */}
      <g>
        {/* desk body */}
        <rect x="32" y="32" width="36" height="9" fill="url(#metalPanel)" stroke="#0a0a0a" strokeWidth="0.4" rx="0.5" />
        {/* desk legs */}
        <rect x="33" y="41" width="2" height="5" fill="#1e293b" />
        <rect x="65" y="41" width="2" height="5" fill="#1e293b" />

        {/* Status display (the slider clue) — glitchy LCD on the back of the desk */}
        <g transform="translate(50 27)">
          <rect x="-9" y="0" width="18" height="5" rx="0.5" fill="#0a0a0a" stroke="#22d3ee" strokeWidth="0.3" />
          <rect x="-9" y="0" width="18" height="5" rx="0.5" fill="url(#screenGlow)" opacity="0.5" />
          {/* glitch noise lines */}
          <line x1="-8.5" y1="1.5" x2="8.5" y2="1.5" stroke="#22d3ee" strokeWidth="0.05" opacity="0.4" />
          <line x1="-8.5" y1="3.5" x2="8.5" y2="3.5" stroke="#22d3ee" strokeWidth="0.05" opacity="0.4" />
          {/* the values flicker in & out — only readable if the player focuses */}
          <motion.text
            x="0" y="3.4" textAnchor="middle" fontSize="2.6" fontWeight="bold"
            fill="#22d3ee" fontFamily="monospace" letterSpacing="0.8"
            animate={{ opacity: [0.85, 0.3, 0.95, 0.55, 0.9] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            7 · 2 · 5 · 8
          </motion.text>
          {/* "PWR" label */}
          <text x="-8" y="6" fontSize="0.9" fill="#22d3ee" fontFamily="monospace">
            PWR
          </text>
        </g>

        {/* Slider knobs on the desk — visual decoration */}
        {[40, 46, 54, 60].map((x, i) => (
          <g key={x}>
            <rect x={x - 0.5} y="34" width="1" height="5.5" fill="#0a0a0a" stroke="#475569" strokeWidth="0.15" />
            <rect
              x={x - 1.4}
              y={sysPower ? 34.5 : 34.5 + i * 0.7}
              width="2.8"
              height="0.9"
              rx="0.2"
              fill={sysPower ? '#10b981' : '#fbbf24'}
            />
          </g>
        ))}

        {/* status LEDs */}
        <circle cx="36" cy="34" r="0.45" fill={sysPower ? '#10b981' : '#ef4444'} />
        <circle cx="65" cy="34" r="0.45" fill={sysPower ? '#10b981' : '#ef4444'} />

        {/* label */}
        <rect x="40" y="40" width="20" height="1" fill="#0f172a" stroke="#475569" strokeWidth="0.1" />
        <text x="50" y="40.8" textAnchor="middle" fontSize="0.7" fill={sysPower ? '#10b981' : '#fbbf24'} fontFamily="monospace" fontWeight="bold">
          REACTOR POWER {sysPower ? 'STABLE' : 'UNSTABLE'}
        </text>
      </g>

      {/* RIGHT WALL: sealed blast door with keypad + maintenance poster */}
      <g>
        {/* door frame */}
        <rect x="78" y="10" width="18" height="34" fill="#0a0a0a" stroke="#475569" strokeWidth="0.5" />
        {/* two sliding panels */}
        {allOnline ? (
          // Door open — sliding panels retracted to the sides
          <g>
            <rect x="78.5" y="11" width="2" height="32" fill="url(#metalPanel)" />
            <rect x="93.5" y="11" width="2" height="32" fill="url(#metalPanel)" />
            {/* corridor beyond */}
            <rect x="80.5" y="11" width="13" height="32" fill="#1e293b" />
            {/* light spilling from corridor */}
            <rect x="80.5" y="11" width="13" height="32" fill="#10b981" opacity="0.18" />
            <text x="87" y="28" textAnchor="middle" fontSize="1.6" fill="#10b981" fontFamily="monospace" fontWeight="bold">
              EXIT →
            </text>
          </g>
        ) : (
          // Door sealed
          <g>
            <rect x="79" y="11" width="8" height="32" fill="url(#metalPanel)" stroke="#0a0a0a" strokeWidth="0.3" />
            <rect x="87" y="11" width="8" height="32" fill="url(#metalPanel)" stroke="#0a0a0a" strokeWidth="0.3" />
            {/* center seam */}
            <rect x="86.7" y="11" width="0.6" height="32" fill="#0a0a0a" />
            {/* hazard stripes top + bottom */}
            <rect x="79" y="11" width="16" height="1.4" fill="#fbbf24" />
            <line x1="79" y1="11" x2="80.4" y2="12.4" stroke="#000" strokeWidth="0.3" />
            <line x1="81.4" y1="11" x2="82.8" y2="12.4" stroke="#000" strokeWidth="0.3" />
            <line x1="83.8" y1="11" x2="85.2" y2="12.4" stroke="#000" strokeWidth="0.3" />
            <line x1="86.2" y1="11" x2="87.6" y2="12.4" stroke="#000" strokeWidth="0.3" />
            <line x1="88.6" y1="11" x2="90" y2="12.4" stroke="#000" strokeWidth="0.3" />
            <line x1="91" y1="11" x2="92.4" y2="12.4" stroke="#000" strokeWidth="0.3" />
            <line x1="93.4" y1="11" x2="94" y2="12.4" stroke="#000" strokeWidth="0.3" />
            <rect x="79" y="41.6" width="16" height="1.4" fill="#fbbf24" />
            {/* lock light */}
            <circle cx="87" cy="22" r="0.9" fill="#ef4444" />
            <motion.circle
              cx="87" cy="22" r="1.3"
              fill="none" stroke="#ef4444" strokeWidth="0.3"
              animate={{ scale: [1, 1.6, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              style={{ transformOrigin: '87px 22px' }}
            />
            {/* center text */}
            <text x="87" y="32" textAnchor="middle" fontSize="1.2" fill="#475569" fontFamily="monospace">
              SEALED
            </text>
          </g>
        )}

        {/* Keypad to the right of the door — small panel */}
        <g>
          <rect x="89" y="25" width="6" height="9" fill="#0a0a0a" stroke="#475569" strokeWidth="0.3" rx="0.3" />
          {/* keypad grid */}
          {[0, 1, 2].map((row) =>
            [0, 1, 2].map((col) => (
              <rect
                key={`${row}-${col}`}
                x={89.7 + col * 1.6}
                y={25.7 + row * 2}
                width="1.4"
                height="1.6"
                rx="0.2"
                fill="#1e293b"
                stroke="#334155"
                strokeWidth="0.1"
              />
            )),
          )}
          {/* small status LED */}
          <circle cx="92" cy="33.5" r="0.3" fill={sysDoor ? '#10b981' : '#ef4444'} />
        </g>

        {/* Maintenance poster pinned next to keypad — the code clue */}
        <g>
          <rect x="78.5" y="44.5" width="9" height="6" fill="#fef3c7" stroke="#92400e" strokeWidth="0.2" transform="rotate(-3 83 47.5)" />
          {/* pin */}
          <circle cx="79.5" cy="44.6" r="0.25" fill="#dc2626" transform="rotate(-3 83 47.5)" />
          {/* tiny title */}
          <text x="83" y="46.4" textAnchor="middle" fontSize="0.7" fill="#92400e" fontFamily="monospace" fontWeight="bold" transform="rotate(-3 83 47.5)">
            OVERRIDE
          </text>
          <text x="83" y="49.5" textAnchor="middle" fontSize="1.6" fill="#92400e" fontFamily="monospace" fontWeight="bold" transform="rotate(-3 83 47.5)">
            9-3-1-6
          </text>
        </g>
      </g>

      {/* Scattered debris on floor — atmosphere */}
      <g opacity="0.85">
        {/* Toolbox (gives flashlight when clicked) */}
        <g>
          <rect x="20" y="44" width="6" height="3.8" fill={hasFlashlight ? '#1e293b' : '#dc2626'} stroke="#0a0a0a" strokeWidth="0.25" rx="0.2" />
          <rect x="20" y="44" width="6" height="0.7" fill={hasFlashlight ? '#0a0a0a' : '#7f1d1d'} />
          {/* handle */}
          <path d="M 21.5 44 Q 23 42.8, 24.5 44" stroke="#0a0a0a" strokeWidth="0.3" fill="none" />
          {/* clasp / hazard sticker */}
          <rect x="22" y="45.3" width="2" height="1.2" fill="#fbbf24" />
          <text x="23" y="46.2" textAnchor="middle" fontSize="0.7" fill="#0a0a0a" fontFamily="monospace" fontWeight="bold">
            TOOL
          </text>
          {hasFlashlight && <text x="23" y="48.5" textAnchor="middle" fontSize="0.6" fill="#64748b" fontFamily="monospace">vacía</text>}
        </g>

        {/* Pressure valve panel on the floor (timing puzzle entry) — between toolbox and desk */}
        <g>
          {/* base box */}
          <rect x="27" y="42" width="5.5" height="5.5" fill="#1e293b" stroke="#475569" strokeWidth="0.3" rx="0.3" />
          {/* pressure gauge dial */}
          <circle cx="29.75" cy="44.6" r="1.5" fill="#0a0a0a" stroke="#475569" strokeWidth="0.2" />
          <circle cx="29.75" cy="44.6" r="1.2" fill={sysPressure ? '#10b981' : '#1e3a8a'} opacity="0.6" />
          {/* needle */}
          <line x1="29.75" y1="44.6" x2={sysPressure ? 30.6 : 28.9} y2={sysPressure ? 44.1 : 43.7} stroke="#fef3c7" strokeWidth="0.2" />
          <circle cx="29.75" cy="44.6" r="0.18" fill="#dc2626" />
          {/* label */}
          <text x="29.75" y="47.2" textAnchor="middle" fontSize="0.7" fill={sysPressure ? '#10b981' : '#fbbf24'} fontFamily="monospace" fontWeight="bold">
            VALVE
          </text>
          {/* pulsing red warning */}
          {!sysPressure && (
            <motion.circle
              cx="31.6"
              cy="42.6"
              r="0.35"
              fill="#ef4444"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
          )}
        </g>

        {/* fallen pipes */}
        <rect x="70" y="45" width="6" height="0.6" fill="#64748b" transform="rotate(-8 73 45.3)" />
        <rect x="69" y="46.2" width="5" height="0.5" fill="#475569" transform="rotate(5 71.5 46.45)" />

        {/* puddle */}
        <ellipse cx="60" cy="50" rx="3" ry="0.5" fill="#1e3a8a" opacity="0.6" />
        <ellipse cx="60" cy="49.8" rx="2.4" ry="0.3" fill="#3b82f6" opacity="0.5" />
      </g>

      {/* corner vignette */}
      <rect x="0" y="0" width="100" height="56" fill="url(#vignetteSci)" />
    </svg>
  )
}
