import { describe, expect, it } from 'vitest'
import { applyEffects } from './effectReducer'
import { createInitialPlayerState } from './playerState'
import type { PlayerState } from '@/types/game'

function base(overrides: Partial<PlayerState> = {}): PlayerState {
  return {
    ...createInitialPlayerState(),
    currentLevelId: 'level-01',
    currentRoomId: 'kitchen',
    lives: 3,
    ...overrides,
  }
}

describe('effectReducer', () => {
  it('addItem inserts a new inventory entry', () => {
    const { state } = applyEffects(base(), [{ type: 'addItem', itemId: 'key' }])
    expect(state.inventory).toEqual([{ itemId: 'key', quantity: 1 }])
  })

  it('addItem stacks quantities on the existing entry', () => {
    const start = base({ inventory: [{ itemId: 'coin', quantity: 2 }] })
    const { state } = applyEffects(start, [{ type: 'addItem', itemId: 'coin', qty: 3 }])
    expect(state.inventory).toEqual([{ itemId: 'coin', quantity: 5 }])
  })

  it('removeItem decrements and removes empty entries', () => {
    const start = base({ inventory: [{ itemId: 'key', quantity: 1 }] })
    const { state } = applyEffects(start, [{ type: 'removeItem', itemId: 'key' }])
    expect(state.inventory).toEqual([])
  })

  it('setFlag writes flags', () => {
    const { state } = applyEffects(base(), [{ type: 'setFlag', key: 'fireOut', value: true }])
    expect(state.flags.fireOut).toBe(true)
  })

  it('navigate updates currentRoomId', () => {
    const { state } = applyEffects(base(), [{ type: 'navigate', roomId: 'hallway' }])
    expect(state.currentRoomId).toBe('hallway')
  })

  it('loseLife floors at zero', () => {
    const start = base({ lives: 1 })
    const { state } = applyEffects(start, [{ type: 'loseLife' }, { type: 'loseLife' }])
    expect(state.lives).toBe(0)
  })

  it('openDecision emits a side effect without mutating state', () => {
    const start = base()
    const { state, sideEffects } = applyEffects(start, [
      { type: 'openDecision', decisionId: 'fire-choice' },
    ])
    expect(state).toEqual(start)
    expect(sideEffects).toEqual([{ kind: 'openDecision', decisionId: 'fire-choice' }])
  })

  it('dialog emits a side effect with default info tone', () => {
    const { sideEffects } = applyEffects(base(), [{ type: 'dialog', text: 'hi' }])
    expect(sideEffects[0]).toEqual({ kind: 'dialog', text: 'hi', tone: 'info' })
  })

  it('recordDecision appends a decision log entry', () => {
    const { state } = applyEffects(base(), [
      { type: 'recordDecision', decisionId: 'fire', optionId: 'gas', correct: true },
    ])
    expect(state.decisionsLog).toHaveLength(1)
    expect(state.decisionsLog[0]).toMatchObject({
      decisionId: 'fire',
      optionId: 'gas',
      correct: true,
      levelId: 'level-01',
    })
  })

  it('winLevel adds the level to completedLevels and emits side effect', () => {
    const { state, sideEffects } = applyEffects(base(), [{ type: 'winLevel' }])
    expect(state.completedLevels).toContain('level-01')
    expect(sideEffects).toContainEqual({ kind: 'winLevel' })
  })

  it('winLevel does not duplicate completed entries', () => {
    const start = base({ completedLevels: ['level-01'] })
    const { state } = applyEffects(start, [{ type: 'winLevel' }])
    expect(state.completedLevels).toEqual(['level-01'])
  })

  describe('applyIf', () => {
    it('runs then branch when condition is true', () => {
      const start = base({ flags: { fireOn: true } })
      const { state, sideEffects } = applyEffects(start, [
        {
          type: 'applyIf',
          condition: { type: 'flag', key: 'fireOn' },
          then: [
            { type: 'setFlag', key: 'fireOut', value: true },
            { type: 'dialog', text: 'apagado', tone: 'success' },
          ],
          else: [{ type: 'dialog', text: 'no hay nada', tone: 'info' }],
        },
      ])
      expect(state.flags.fireOut).toBe(true)
      expect(sideEffects).toContainEqual({ kind: 'dialog', text: 'apagado', tone: 'success' })
    })

    it('runs else branch when condition is false', () => {
      const start = base()
      const { state, sideEffects } = applyEffects(start, [
        {
          type: 'applyIf',
          condition: { type: 'flag', key: 'fireOn' },
          then: [{ type: 'setFlag', key: 'fireOut', value: true }],
          else: [{ type: 'dialog', text: 'no hay nada', tone: 'info' }],
        },
      ])
      expect(state.flags.fireOut).toBeUndefined()
      expect(sideEffects).toContainEqual({
        kind: 'dialog',
        text: 'no hay nada',
        tone: 'info',
      })
    })

    it('treats missing else as no-op when condition is false', () => {
      const start = base()
      const { state, sideEffects } = applyEffects(start, [
        {
          type: 'applyIf',
          condition: { type: 'flag', key: 'never' },
          then: [{ type: 'loseLife' }],
        },
      ])
      expect(state.lives).toBe(start.lives)
      expect(sideEffects).toEqual([])
    })

    it('evaluates condition against state after prior effects in the chain', () => {
      const start = base()
      const { state } = applyEffects(start, [
        { type: 'setFlag', key: 'opened', value: true },
        {
          type: 'applyIf',
          condition: { type: 'flag', key: 'opened' },
          then: [{ type: 'addItem', itemId: 'reward' }],
        },
      ])
      expect(state.inventory).toEqual([{ itemId: 'reward', quantity: 1 }])
    })
  })

  it('chains effects in order: earlier effects affect later state', () => {
    const start = base({ inventory: [] })
    const { state } = applyEffects(start, [
      { type: 'addItem', itemId: 'key' },
      { type: 'addItem', itemId: 'key' },
      { type: 'removeItem', itemId: 'key' },
    ])
    expect(state.inventory).toEqual([{ itemId: 'key', quantity: 1 }])
  })
})
