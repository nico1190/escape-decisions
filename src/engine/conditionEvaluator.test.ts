import { describe, expect, it } from 'vitest'
import { evaluate } from './conditionEvaluator'
import { createInitialPlayerState } from './playerState'
import type { PlayerState } from '@/types/game'

function base(overrides: Partial<PlayerState> = {}): PlayerState {
  return { ...createInitialPlayerState(), ...overrides }
}

describe('conditionEvaluator', () => {
  it('returns true for undefined condition', () => {
    expect(evaluate(undefined, base())).toBe(true)
  })

  describe('hasItem', () => {
    it('is true when the item is present', () => {
      const state = base({ inventory: [{ itemId: 'key', quantity: 1 }] })
      expect(evaluate({ type: 'hasItem', itemId: 'key' }, state)).toBe(true)
    })
    it('respects minQty', () => {
      const state = base({ inventory: [{ itemId: 'coin', quantity: 2 }] })
      expect(evaluate({ type: 'hasItem', itemId: 'coin', minQty: 3 }, state)).toBe(false)
      expect(evaluate({ type: 'hasItem', itemId: 'coin', minQty: 2 }, state)).toBe(true)
    })
    it('is false when the item is missing', () => {
      expect(evaluate({ type: 'hasItem', itemId: 'key' }, base())).toBe(false)
    })
  })

  describe('lacksItem', () => {
    it('is true when the item is absent', () => {
      expect(evaluate({ type: 'lacksItem', itemId: 'key' }, base())).toBe(true)
    })
    it('is false when the item is present', () => {
      const state = base({ inventory: [{ itemId: 'key', quantity: 1 }] })
      expect(evaluate({ type: 'lacksItem', itemId: 'key' }, state)).toBe(false)
    })
  })

  describe('flag', () => {
    it('matches truthy flag without value param', () => {
      const state = base({ flags: { fireOut: true } })
      expect(evaluate({ type: 'flag', key: 'fireOut' }, state)).toBe(true)
    })
    it('respects explicit value=false', () => {
      const state = base({ flags: { fireOut: true } })
      expect(evaluate({ type: 'flag', key: 'fireOut', value: false }, state)).toBe(false)
    })
    it('returns false for missing flag with value=true', () => {
      expect(evaluate({ type: 'flag', key: 'unset', value: true }, base())).toBe(false)
    })
    it('returns true for missing flag with value=false', () => {
      expect(evaluate({ type: 'flag', key: 'unset', value: false }, base())).toBe(true)
    })
  })

  describe('decisionMade', () => {
    it('matches by id when no optionId provided', () => {
      const state = base({
        decisionsLog: [
          { levelId: 'l1', decisionId: 'fire', optionId: 'water', correct: false, t: 0 },
        ],
      })
      expect(evaluate({ type: 'decisionMade', decisionId: 'fire' }, state)).toBe(true)
    })
    it('matches by id + optionId', () => {
      const state = base({
        decisionsLog: [
          { levelId: 'l1', decisionId: 'fire', optionId: 'gas', correct: true, t: 0 },
        ],
      })
      expect(
        evaluate({ type: 'decisionMade', decisionId: 'fire', optionId: 'gas' }, state),
      ).toBe(true)
      expect(
        evaluate({ type: 'decisionMade', decisionId: 'fire', optionId: 'water' }, state),
      ).toBe(false)
    })
  })

  describe('inRoom / livesAtLeast', () => {
    it('inRoom matches currentRoomId', () => {
      const state = base({ currentRoomId: 'kitchen' })
      expect(evaluate({ type: 'inRoom', roomId: 'kitchen' }, state)).toBe(true)
      expect(evaluate({ type: 'inRoom', roomId: 'hallway' }, state)).toBe(false)
    })
    it('livesAtLeast respects threshold', () => {
      const state = base({ lives: 2 })
      expect(evaluate({ type: 'livesAtLeast', n: 2 }, state)).toBe(true)
      expect(evaluate({ type: 'livesAtLeast', n: 3 }, state)).toBe(false)
    })
  })

  describe('logical operators', () => {
    const state = base({
      inventory: [{ itemId: 'key', quantity: 1 }],
      flags: { door_open: true },
    })

    it('and: all must be true', () => {
      expect(
        evaluate(
          {
            type: 'and',
            children: [
              { type: 'hasItem', itemId: 'key' },
              { type: 'flag', key: 'door_open' },
            ],
          },
          state,
        ),
      ).toBe(true)
      expect(
        evaluate(
          {
            type: 'and',
            children: [
              { type: 'hasItem', itemId: 'key' },
              { type: 'flag', key: 'door_open', value: false },
            ],
          },
          state,
        ),
      ).toBe(false)
    })

    it('or: at least one must be true', () => {
      expect(
        evaluate(
          {
            type: 'or',
            children: [
              { type: 'hasItem', itemId: 'missing' },
              { type: 'flag', key: 'door_open' },
            ],
          },
          state,
        ),
      ).toBe(true)
    })

    it('not: inverts child', () => {
      expect(
        evaluate({ type: 'not', child: { type: 'hasItem', itemId: 'missing' } }, state),
      ).toBe(true)
    })

    it('nested combinations work', () => {
      expect(
        evaluate(
          {
            type: 'and',
            children: [
              { type: 'not', child: { type: 'flag', key: 'fire_on' } },
              {
                type: 'or',
                children: [
                  { type: 'hasItem', itemId: 'key' },
                  { type: 'hasItem', itemId: 'crowbar' },
                ],
              },
            ],
          },
          state,
        ),
      ).toBe(true)
    })
  })
})
