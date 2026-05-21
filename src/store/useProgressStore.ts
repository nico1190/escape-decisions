import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LevelId } from '@/types/game'

const CURRENT_SCHEMA = 1

interface ProgressState {
  schemaVersion: number
  unlockedLevels: LevelId[]
  completedLevels: LevelId[]
  unlock: (id: LevelId) => void
  markComplete: (id: LevelId) => void
  isUnlocked: (id: LevelId) => boolean
  isCompleted: (id: LevelId) => boolean
  reset: () => void
}

/**
 * Persistent progress: which levels the player has unlocked / completed.
 * Stored in localStorage under "escape-decisions:progress".
 *
 * Independent from useGameStore (which holds volatile in-session state) so
 * we can reset the game freely without losing progress.
 */
export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      schemaVersion: CURRENT_SCHEMA,
      unlockedLevels: [],
      completedLevels: [],
      unlock: (id) =>
        set((s) => ({
          unlockedLevels: s.unlockedLevels.includes(id)
            ? s.unlockedLevels
            : [...s.unlockedLevels, id],
        })),
      markComplete: (id) =>
        set((s) => ({
          completedLevels: s.completedLevels.includes(id)
            ? s.completedLevels
            : [...s.completedLevels, id],
        })),
      isUnlocked: (id) => get().unlockedLevels.includes(id),
      isCompleted: (id) => get().completedLevels.includes(id),
      reset: () =>
        set({
          unlockedLevels: [],
          completedLevels: [],
          schemaVersion: CURRENT_SCHEMA,
        }),
    }),
    {
      name: 'escape-decisions:progress',
      version: CURRENT_SCHEMA,
      // Migration scaffold for future schema bumps. Add cases here when
      // CURRENT_SCHEMA changes — never edit old saves in place.
      migrate: (persisted, version) => {
        if (version === CURRENT_SCHEMA) return persisted as ProgressState
        // Unknown / future version: fall back to a fresh state but preserve a
        // backup in localStorage so the player can recover if needed.
        try {
          localStorage.setItem(
            `escape-decisions:progress:backup:${Date.now()}`,
            JSON.stringify(persisted),
          )
        } catch {
          // ignore quota errors
        }
        return {
          schemaVersion: CURRENT_SCHEMA,
          unlockedLevels: [],
          completedLevels: [],
        } as unknown as ProgressState
      },
    },
  ),
)

/**
 * Ensure that at least the first level is unlocked. Called once on startup.
 */
export function ensureFirstLevelUnlocked(firstLevelId: LevelId) {
  if (!useProgressStore.getState().isUnlocked(firstLevelId)) {
    useProgressStore.getState().unlock(firstLevelId)
  }
}
