import { create } from 'zustand'
import type {
  DecisionId,
  EngineSideEffect,
  GameEffect,
  Level,
  LevelTone,
  PlayerState,
  PuzzleId,
} from '@/types/game'
import { applyEffects } from '@/engine/effectReducer'
import { evaluate } from '@/engine/conditionEvaluator'
import { createInitialPlayerState, startLevel } from '@/engine/playerState'
import { playSfx, startAmbient, stopAmbient, unlockAudio } from '@/lib/audio'
import { useProgressStore } from './useProgressStore'
import { getNextLevel } from '@/data/levels'

type DialogToast = {
  id: number
  text: string
  tone: 'info' | 'success' | 'warning' | 'error'
}

interface GameState {
  player: PlayerState
  level: Level | null
  route: 'title' | 'select'

  pendingDecisionId: DecisionId | null
  pendingPuzzleId: PuzzleId | null
  toasts: DialogToast[]
  outcome: { kind: 'win' | 'lose'; reason?: string } | null

  shakeTick: number

  beginLevel: (level: Level) => void
  applyEffects: (effects: readonly GameEffect[]) => void
  dismissToast: (id: number) => void
  closeDecision: () => void
  closePuzzle: () => void
  submitPuzzle: (correct: boolean) => void
  resetOutcome: () => void
  goToSelect: () => void
  goToTitle: () => void
  reset: () => void
}

let _toastId = 0

const TONE_TO_AMBIENT: Record<LevelTone, 'warm' | 'eerie' | 'sci-fi'> = {
  educational: 'warm',
  realistic: 'warm',
  comedy: 'warm',
  mystery: 'eerie',
}

function ambientForLevel(level: Level): 'warm' | 'eerie' | 'sci-fi' {
  if (level.id === 'level-03-station') return 'sci-fi'
  return TONE_TO_AMBIENT[level.tone] ?? 'warm'
}

export const useGameStore = create<GameState>((set, get) => ({
  player: createInitialPlayerState(),
  level: null,
  route: 'title',
  pendingDecisionId: null,
  pendingPuzzleId: null,
  toasts: [],
  outcome: null,
  shakeTick: 0,

  beginLevel: (level) => {
    unlockAudio()
    startAmbient(ambientForLevel(level))
    set({
      level,
      player: startLevel(get().player, level),
      pendingDecisionId: null,
      pendingPuzzleId: null,
      toasts: [],
      outcome: null,
      shakeTick: 0,
    })
  },

  applyEffects: (effects) => {
    const { player, level } = get()
    if (!level) return
    const prevLives = player.lives
    const { state: nextPlayer, sideEffects } = applyEffects(player, effects)
    const lostLife = nextPlayer.lives < prevLives

    const sideEffectsFinal: EngineSideEffect[] = [...sideEffects]
    let outcome = get().outcome
    if (!outcome) {
      if (level.loseCondition && evaluate(level.loseCondition, nextPlayer)) {
        sideEffectsFinal.push({ kind: 'loseLevel' })
      }
    }

    const newToasts: DialogToast[] = []
    let pendingDecisionId = get().pendingDecisionId
    let pendingPuzzleId = get().pendingPuzzleId
    for (const fx of sideEffectsFinal) {
      switch (fx.kind) {
        case 'dialog':
          newToasts.push({ id: ++_toastId, text: fx.text, tone: fx.tone })
          if (fx.tone === 'success') playSfx('pickup')
          else if (fx.tone === 'error') playSfx('error')
          break
        case 'openDecision':
          pendingDecisionId = fx.decisionId
          playSfx('dialog-open')
          break
        case 'startPuzzle':
          pendingPuzzleId = fx.puzzleId
          playSfx('dialog-open')
          break
        case 'winLevel':
          outcome = { kind: 'win' }
          break
        case 'loseLevel':
          outcome = { kind: 'lose', reason: fx.reason }
          break
      }
    }

    if (lostLife) playSfx('lose-life')

    // Win-level side effects: stop ambient, play stinger, persist progress
    if (outcome?.kind === 'win' && get().outcome?.kind !== 'win') {
      stopAmbient()
      playSfx('level-win')
      const progress = useProgressStore.getState()
      progress.markComplete(level.id)
      const next = getNextLevel(level.id)
      if (next) progress.unlock(next.id)
    }

    if (outcome?.kind === 'lose' && get().outcome?.kind !== 'lose') {
      stopAmbient()
      playSfx('error')
    }

    set({
      player: nextPlayer,
      pendingDecisionId,
      pendingPuzzleId,
      toasts: [...get().toasts, ...newToasts].slice(-4),
      outcome,
      shakeTick: lostLife ? get().shakeTick + 1 : get().shakeTick,
    })
  },

  dismissToast: (id) => {
    set({ toasts: get().toasts.filter((t) => t.id !== id) })
  },

  closeDecision: () => set({ pendingDecisionId: null }),
  closePuzzle: () => set({ pendingPuzzleId: null }),

  submitPuzzle: (correct) => {
    const { pendingPuzzleId, level } = get()
    if (!pendingPuzzleId || !level) return
    const puzzle = level.puzzles?.[pendingPuzzleId]
    if (!puzzle) return
    set({ pendingPuzzleId: null })
    if (correct) playSfx('puzzle-solve')
    const effects = correct ? puzzle.onSolve : (puzzle.onFail ?? [])
    if (effects.length) get().applyEffects(effects)
  },

  resetOutcome: () => set({ outcome: null }),

  goToSelect: () => {
    unlockAudio()
    set({ route: 'select' })
  },
  goToTitle: () => set({ route: 'title' }),

  reset: () => {
    stopAmbient()
    set({
      player: createInitialPlayerState(),
      level: null,
      route: 'select',
      pendingDecisionId: null,
      pendingPuzzleId: null,
      toasts: [],
      outcome: null,
      shakeTick: 0,
    })
  },
}))
