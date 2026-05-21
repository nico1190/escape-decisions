import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { setMuted, setVolume } from '@/lib/audio'

interface AudioState {
  muted: boolean
  volume: number
  setMuted: (v: boolean) => void
  toggleMuted: () => void
  setVolume: (v: number) => void
}

/**
 * Persisted audio preference. Pushes changes through to the audio engine
 * so the master gain stays in sync.
 */
export const useAudioStore = create<AudioState>()(
  persist(
    (set, get) => ({
      muted: false,
      volume: 0.6,
      setMuted: (v) => {
        setMuted(v)
        set({ muted: v })
      },
      toggleMuted: () => get().setMuted(!get().muted),
      setVolume: (v) => {
        const clamped = Math.max(0, Math.min(1, v))
        setVolume(clamped)
        set({ volume: clamped })
      },
    }),
    {
      name: 'escape-decisions:audio',
      version: 1,
      onRehydrateStorage: () => (state) => {
        // After load, push the saved preferences into the audio engine.
        if (state) {
          setMuted(state.muted)
          setVolume(state.volume)
        }
      },
    },
  ),
)
