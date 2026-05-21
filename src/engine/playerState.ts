import type { Level, PlayerState } from '@/types/game'

export function createInitialPlayerState(): PlayerState {
  return {
    currentLevelId: null,
    currentRoomId: null,
    inventory: [],
    lives: 0,
    flags: {},
    decisionsLog: [],
    unlockedLevels: [],
    completedLevels: [],
  }
}

/**
 * Reset state for the start of a level. Keeps cross-level progress
 * (unlockedLevels, completedLevels) intact.
 */
export function startLevel(state: PlayerState, level: Level): PlayerState {
  const inventory = (level.initialInventory ?? []).map((itemId) => ({ itemId, quantity: 1 }))
  return {
    ...state,
    currentLevelId: level.id,
    currentRoomId: level.startRoomId,
    inventory,
    lives: level.maxLives,
    flags: {},
    decisionsLog: state.decisionsLog,
  }
}
