import type { Condition, PlayerState } from '@/types/game'

/**
 * Pure evaluator. No side-effects, no mutation. Returns true when the
 * condition holds for the given player state. Undefined conditions are
 * treated as true (so `visibleWhen: undefined` means "always visible").
 */
export function evaluate(condition: Condition | undefined, state: PlayerState): boolean {
  if (!condition) return true

  switch (condition.type) {
    case 'hasItem': {
      const min = condition.minQty ?? 1
      const entry = state.inventory.find((e) => e.itemId === condition.itemId)
      return !!entry && entry.quantity >= min
    }
    case 'lacksItem':
      return !state.inventory.some((e) => e.itemId === condition.itemId && e.quantity > 0)
    case 'decisionMade':
      return state.decisionsLog.some(
        (d) =>
          d.decisionId === condition.decisionId &&
          (condition.optionId === undefined || d.optionId === condition.optionId),
      )
    case 'flag': {
      const v = state.flags[condition.key] === true
      return condition.value === undefined ? v : v === condition.value
    }
    case 'inRoom':
      return state.currentRoomId === condition.roomId
    case 'livesAtLeast':
      return state.lives >= condition.n
    case 'and':
      return condition.children.every((c) => evaluate(c, state))
    case 'or':
      return condition.children.some((c) => evaluate(c, state))
    case 'not':
      return !evaluate(condition.child, state)
  }
}
