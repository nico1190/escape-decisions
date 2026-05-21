import type {
  EngineSideEffect,
  GameEffect,
  PlayerState,
  ReducerResult,
} from '@/types/game'
import { evaluate } from './conditionEvaluator'

/**
 * Apply a sequence of GameEffects to a PlayerState. Returns a new state plus
 * a list of side effects the UI layer must consume (open dialog, navigate,
 * show toast, win/lose level). Effects are applied in order — earlier effects
 * may affect the conditions seen by later effects.
 */
export function applyEffects(
  state: PlayerState,
  effects: readonly GameEffect[],
): ReducerResult {
  let s = state
  const sideEffects: EngineSideEffect[] = []
  for (const effect of effects) {
    const result = applyOne(s, effect)
    s = result.state
    sideEffects.push(...result.sideEffects)
  }
  return { state: s, sideEffects }
}

function applyOne(state: PlayerState, effect: GameEffect): ReducerResult {
  switch (effect.type) {
    case 'addItem': {
      const qty = effect.qty ?? 1
      const idx = state.inventory.findIndex((e) => e.itemId === effect.itemId)
      const inventory =
        idx === -1
          ? [...state.inventory, { itemId: effect.itemId, quantity: qty }]
          : state.inventory.map((e, i) =>
              i === idx ? { ...e, quantity: e.quantity + qty } : e,
            )
      return { state: { ...state, inventory }, sideEffects: [] }
    }
    case 'removeItem': {
      const qty = effect.qty ?? 1
      const inventory = state.inventory
        .map((e) =>
          e.itemId === effect.itemId ? { ...e, quantity: e.quantity - qty } : e,
        )
        .filter((e) => e.quantity > 0)
      return { state: { ...state, inventory }, sideEffects: [] }
    }
    case 'setFlag': {
      return {
        state: { ...state, flags: { ...state.flags, [effect.key]: effect.value } },
        sideEffects: [],
      }
    }
    case 'navigate': {
      return { state: { ...state, currentRoomId: effect.roomId }, sideEffects: [] }
    }
    case 'openDecision': {
      return {
        state,
        sideEffects: [{ kind: 'openDecision', decisionId: effect.decisionId }],
      }
    }
    case 'startPuzzle': {
      return {
        state,
        sideEffects: [{ kind: 'startPuzzle', puzzleId: effect.puzzleId }],
      }
    }
    case 'loseLife': {
      const amount = effect.amount ?? 1
      return { state: { ...state, lives: Math.max(0, state.lives - amount) }, sideEffects: [] }
    }
    case 'gainLife': {
      const amount = effect.amount ?? 1
      return { state: { ...state, lives: state.lives + amount }, sideEffects: [] }
    }
    case 'dialog': {
      return {
        state,
        sideEffects: [{ kind: 'dialog', text: effect.text, tone: effect.tone ?? 'info' }],
      }
    }
    case 'recordDecision': {
      const levelId = state.currentLevelId
      if (!levelId) return { state, sideEffects: [] }
      return {
        state: {
          ...state,
          decisionsLog: [
            ...state.decisionsLog,
            {
              levelId,
              decisionId: effect.decisionId,
              optionId: effect.optionId,
              correct: effect.correct,
              t: Date.now(),
            },
          ],
        },
        sideEffects: [],
      }
    }
    case 'winLevel': {
      const completed = state.completedLevels.includes(state.currentLevelId ?? '')
        ? state.completedLevels
        : state.currentLevelId
          ? [...state.completedLevels, state.currentLevelId]
          : state.completedLevels
      return {
        state: { ...state, completedLevels: completed },
        sideEffects: [{ kind: 'winLevel' }],
      }
    }
    case 'loseLevel': {
      return {
        state,
        sideEffects: [{ kind: 'loseLevel', reason: effect.reason }],
      }
    }
    case 'applyIf': {
      const branch = evaluate(effect.condition, state) ? effect.then : (effect.else ?? [])
      return applyEffects(state, branch)
    }
  }
}
