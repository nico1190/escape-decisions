/**
 * Tiny audio engine for the game. Synthesizes all sounds via Web Audio API —
 * no audio assets required.
 *
 * Public API:
 *  - `playSfx(name)` — fire-and-forget short sound effect
 *  - `startAmbient(profile)` / `stopAmbient()` — looping background drone
 *  - `setMuted(boolean)` / `setVolume(0..1)`
 *
 * The audio context is created lazily (on first user gesture) to comply with
 * browser autoplay policies.
 */

type SfxName =
  | 'click'
  | 'success'
  | 'error'
  | 'pickup'
  | 'puzzle-solve'
  | 'level-win'
  | 'lose-life'
  | 'dialog-open'

type AmbientProfile = 'warm' | 'eerie' | 'sci-fi'

let ctx: AudioContext | null = null
let masterGain: GainNode | null = null
let muted = false
let volume = 0.6

// Ambient state
let ambientNodes: { stop: () => void } | null = null
let currentAmbient: AmbientProfile | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    try {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AC) return null
      ctx = new AC()
      masterGain = ctx.createGain()
      masterGain.gain.value = muted ? 0 : volume
      masterGain.connect(ctx.destination)
    } catch {
      return null
    }
  }
  return ctx
}

function applyMasterGain() {
  if (!masterGain || !ctx) return
  const target = muted ? 0 : volume
  masterGain.gain.cancelScheduledValues(ctx.currentTime)
  masterGain.gain.linearRampToValueAtTime(target, ctx.currentTime + 0.08)
}

export function setMuted(v: boolean) {
  muted = v
  applyMasterGain()
}

export function setVolume(v: number) {
  volume = Math.max(0, Math.min(1, v))
  applyMasterGain()
}

export function isAudioReady(): boolean {
  return ctx !== null
}

/**
 * "Wake up" the audio system — must be called from a user gesture for browsers
 * that block autoplay. After this, subsequent SFX work without further gestures.
 */
export function unlockAudio() {
  const c = getCtx()
  if (c && c.state === 'suspended') {
    void c.resume()
  }
}

// ─── SFX synthesis ─────────────────────────────────────────────────────────────

interface ToneOpts {
  freq: number
  durationMs: number
  type?: OscillatorType
  attackMs?: number
  releaseMs?: number
  peakGain?: number
  delayMs?: number
}

function playTone({ freq, durationMs, type = 'sine', attackMs = 5, releaseMs = 60, peakGain = 0.5, delayMs = 0 }: ToneOpts) {
  const c = getCtx()
  if (!c || !masterGain) return
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = type
  osc.frequency.value = freq
  osc.connect(gain).connect(masterGain)
  const start = c.currentTime + delayMs / 1000
  const peak = start + attackMs / 1000
  const end = start + durationMs / 1000
  gain.gain.setValueAtTime(0, start)
  gain.gain.linearRampToValueAtTime(peakGain, peak)
  gain.gain.linearRampToValueAtTime(0, end + releaseMs / 1000)
  osc.start(start)
  osc.stop(end + releaseMs / 1000 + 0.02)
}

function playNoise({ durationMs, peakGain = 0.3, filterFreq = 1200, delayMs = 0 }: { durationMs: number; peakGain?: number; filterFreq?: number; delayMs?: number }) {
  const c = getCtx()
  if (!c || !masterGain) return
  const buffer = c.createBuffer(1, (c.sampleRate * durationMs) / 1000, c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  const src = c.createBufferSource()
  src.buffer = buffer
  const filter = c.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = filterFreq
  const gain = c.createGain()
  const start = c.currentTime + delayMs / 1000
  gain.gain.setValueAtTime(0, start)
  gain.gain.linearRampToValueAtTime(peakGain, start + 0.005)
  gain.gain.exponentialRampToValueAtTime(0.001, start + durationMs / 1000)
  src.connect(filter).connect(gain).connect(masterGain)
  src.start(start)
  src.stop(start + durationMs / 1000 + 0.05)
}

export function playSfx(name: SfxName) {
  switch (name) {
    case 'click':
      playTone({ freq: 880, durationMs: 35, type: 'square', peakGain: 0.18 })
      break
    case 'success':
      // Major arpeggio C5 → E5 → G5
      playTone({ freq: 523, durationMs: 90, type: 'triangle', peakGain: 0.28 })
      playTone({ freq: 659, durationMs: 90, type: 'triangle', peakGain: 0.28, delayMs: 80 })
      playTone({ freq: 784, durationMs: 140, type: 'triangle', peakGain: 0.3, delayMs: 160 })
      break
    case 'error':
      // Dissonant minor 2nd, descending
      playTone({ freq: 311, durationMs: 110, type: 'sawtooth', peakGain: 0.22 })
      playTone({ freq: 294, durationMs: 200, type: 'sawtooth', peakGain: 0.22, delayMs: 90 })
      break
    case 'pickup':
      playTone({ freq: 1320, durationMs: 70, type: 'sine', peakGain: 0.22 })
      playTone({ freq: 1760, durationMs: 90, type: 'sine', peakGain: 0.2, delayMs: 50 })
      break
    case 'puzzle-solve':
      // Triumphant arpeggio
      playTone({ freq: 392, durationMs: 110, type: 'triangle', peakGain: 0.32 })
      playTone({ freq: 523, durationMs: 110, type: 'triangle', peakGain: 0.32, delayMs: 100 })
      playTone({ freq: 659, durationMs: 110, type: 'triangle', peakGain: 0.32, delayMs: 200 })
      playTone({ freq: 784, durationMs: 260, type: 'triangle', peakGain: 0.36, delayMs: 300 })
      break
    case 'level-win':
      // Big chord
      playTone({ freq: 523, durationMs: 700, type: 'sine', peakGain: 0.22 })
      playTone({ freq: 659, durationMs: 700, type: 'sine', peakGain: 0.22, delayMs: 40 })
      playTone({ freq: 784, durationMs: 700, type: 'sine', peakGain: 0.22, delayMs: 80 })
      playTone({ freq: 1046, durationMs: 600, type: 'triangle', peakGain: 0.18, delayMs: 200 })
      break
    case 'lose-life':
      // Low thump + noise
      playTone({ freq: 110, durationMs: 220, type: 'sine', peakGain: 0.35 })
      playNoise({ durationMs: 220, peakGain: 0.22, filterFreq: 480 })
      break
    case 'dialog-open':
      playTone({ freq: 660, durationMs: 50, type: 'sine', peakGain: 0.18 })
      playTone({ freq: 880, durationMs: 70, type: 'sine', peakGain: 0.16, delayMs: 40 })
      break
  }
}

// ─── Ambient drones ────────────────────────────────────────────────────────────

interface DroneVoice {
  freq: number
  type?: OscillatorType
  gain: number
  detune?: number
}

const AMBIENT_PROFILES: Record<AmbientProfile, { voices: DroneVoice[]; filterFreq: number; lfoFreq: number; lfoDepth: number }> = {
  warm: {
    voices: [
      { freq: 130.81, type: 'sine', gain: 0.12 }, // C3
      { freq: 196.0, type: 'sine', gain: 0.08 },  // G3
      { freq: 261.63, type: 'triangle', gain: 0.06 }, // C4
    ],
    filterFreq: 700,
    lfoFreq: 0.12,
    lfoDepth: 90,
  },
  eerie: {
    voices: [
      { freq: 92.5, type: 'sine', gain: 0.13 },   // F#2
      { freq: 138.59, type: 'triangle', gain: 0.07 }, // C#3 (tritone)
      { freq: 277.18, type: 'sine', gain: 0.05, detune: -15 },
    ],
    filterFreq: 540,
    lfoFreq: 0.07,
    lfoDepth: 120,
  },
  'sci-fi': {
    voices: [
      { freq: 65.41, type: 'sawtooth', gain: 0.1 }, // C2
      { freq: 98.0, type: 'sine', gain: 0.06 },     // G2
      { freq: 196.0, type: 'square', gain: 0.04, detune: 8 },
    ],
    filterFreq: 380,
    lfoFreq: 0.18,
    lfoDepth: 160,
  },
}

export function startAmbient(profile: AmbientProfile) {
  if (currentAmbient === profile) return
  stopAmbient()
  const c = getCtx()
  if (!c || !masterGain) return
  const cfg = AMBIENT_PROFILES[profile]
  const out = c.createGain()
  out.gain.value = 0
  out.gain.linearRampToValueAtTime(1, c.currentTime + 1.2)
  out.connect(masterGain)
  const filter = c.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = cfg.filterFreq
  filter.Q.value = 1.2
  filter.connect(out)
  // LFO modulating the filter — keeps the drone alive
  const lfo = c.createOscillator()
  lfo.frequency.value = cfg.lfoFreq
  const lfoGain = c.createGain()
  lfoGain.gain.value = cfg.lfoDepth
  lfo.connect(lfoGain).connect(filter.frequency)
  lfo.start()
  const oscs = cfg.voices.map((v) => {
    const osc = c.createOscillator()
    osc.type = v.type ?? 'sine'
    osc.frequency.value = v.freq
    if (v.detune) osc.detune.value = v.detune
    const g = c.createGain()
    g.gain.value = v.gain
    osc.connect(g).connect(filter)
    osc.start()
    return { osc, g }
  })

  ambientNodes = {
    stop: () => {
      try {
        const t = c.currentTime
        out.gain.cancelScheduledValues(t)
        out.gain.linearRampToValueAtTime(0, t + 0.8)
        for (const { osc } of oscs) osc.stop(t + 1)
        lfo.stop(t + 1)
        setTimeout(() => {
          try {
            filter.disconnect()
            out.disconnect()
          } catch {
            // ignore
          }
        }, 1100)
      } catch {
        // ignore
      }
    },
  }
  currentAmbient = profile
}

export function stopAmbient() {
  if (ambientNodes) ambientNodes.stop()
  ambientNodes = null
  currentAmbient = null
}
