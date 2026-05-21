/**
 * Core domain types for the escape-decisions engine.
 * Levels are data, not code: Condition + GameEffect form a tiny declarative DSL
 * that the engine evaluates and applies generically across all levels.
 */

export type LevelId = string
export type RoomId = string
export type ItemId = string
export type DecisionId = string
export type PuzzleId = string
export type FlagKey = string

export type LevelTone = 'educational' | 'mystery' | 'comedy' | 'realistic'

// ─── Conditions (read-only predicates over PlayerState) ───────────────────────

export type Condition =
  | { type: 'hasItem'; itemId: ItemId; minQty?: number }
  | { type: 'lacksItem'; itemId: ItemId }
  | { type: 'decisionMade'; decisionId: DecisionId; optionId?: string }
  | { type: 'flag'; key: FlagKey; value?: boolean }
  | { type: 'inRoom'; roomId: RoomId }
  | { type: 'livesAtLeast'; n: number }
  | { type: 'and'; children: Condition[] }
  | { type: 'or'; children: Condition[] }
  | { type: 'not'; child: Condition }

// ─── Effects (state transitions + side effects) ───────────────────────────────

export type GameEffect =
  | { type: 'addItem'; itemId: ItemId; qty?: number }
  | { type: 'removeItem'; itemId: ItemId; qty?: number }
  | { type: 'setFlag'; key: FlagKey; value: boolean }
  | { type: 'navigate'; roomId: RoomId }
  | { type: 'openDecision'; decisionId: DecisionId }
  | { type: 'startPuzzle'; puzzleId: PuzzleId }
  | { type: 'loseLife'; amount?: number }
  | { type: 'gainLife'; amount?: number }
  | { type: 'winLevel' }
  | { type: 'loseLevel'; reason?: string }
  | { type: 'dialog'; text: string; tone?: 'info' | 'success' | 'warning' | 'error' }
  | { type: 'recordDecision'; decisionId: DecisionId; optionId: string; correct: boolean }
  | {
      type: 'applyIf'
      condition: Condition
      then: GameEffect[]
      else?: GameEffect[]
    }

// ─── Static content (loaded from data files) ──────────────────────────────────

export interface Hotspot {
  id: string
  /** Coordinates in % of the room canvas (0–100). Hotspots scale with the room. */
  x: number
  y: number
  w: number
  h: number
  label: string
  cursor?: 'look' | 'grab' | 'use' | 'enter'
  /** If present, hotspot is rendered only when this condition evaluates true. */
  visibleWhen?: Condition
  /** If present, hotspot acts only when the dragged item id matches. */
  requiresItem?: ItemId
  /** Effects applied when the hotspot is clicked (or item-dropped on it). */
  onClick: GameEffect[]
  /** Optional badge / shorthand icon (Lucide name) shown on the hotspot. */
  icon?: string
}

export interface Room {
  id: RoomId
  name: string
  /**
   * Tailwind/CSS class for the background — used as fallback when sceneKey
   * is not provided.
   */
  background: string
  /** Optional key into the scene registry (src/components/scenes/registry.ts). */
  sceneKey?: string
  /** Optional decorative overlay (e.g. an animated gradient layer for fire). */
  overlay?: { className: string; visibleWhen?: Condition }
  hotspots: Hotspot[]
  /** Effects fired once when the player enters this room. */
  onEnter?: GameEffect[]
  /**
   * If set, the room is rendered in darkness: only a small spot around the
   * cursor is visible. Holding the `flashlight` item widens the beam into a
   * proper light cone.
   */
  darkness?: {
    /** Item that unlocks a wider light cone when held. */
    lightSourceItem: ItemId
  }
}

export interface DecisionOption {
  id: string
  label: string
  isCorrect: boolean
  consequences: GameEffect[]
  feedback: string
}

export interface Decision {
  id: DecisionId
  prompt: string
  /** If set, the dialog ticks down; on timeout the first non-correct option triggers. */
  timerMs?: number
  options: DecisionOption[]
}

export interface Item {
  id: ItemId
  name: string
  /** Lucide icon name. */
  icon: string
  description: string
  combinableWith?: ItemId[]
  /**
   * Effects fired when the player clicks this item in the inventory.
   * Use `applyIf` inside to make the effect context-aware (current room,
   * flags, etc.). If omitted, clicking the item is a no-op.
   */
  onUse?: GameEffect[]
}

export type PuzzleKind =
  | 'code'
  | 'word'
  | 'color-sequence'
  | 'memory'
  | 'slider'
  | 'wire'
  | 'timing'
  | 'rotation'
  | 'cipher'
  | 'lights-out'

export interface Puzzle {
  id: PuzzleId
  kind: PuzzleKind
  prompt: string
  /** Free-form payload interpreted by the puzzle component for this kind. */
  payload: unknown
  /** Free-form solution checked by the puzzle component. */
  solution: unknown
  onSolve: GameEffect[]
  onFail?: GameEffect[]
}

export interface Level {
  id: LevelId
  title: string
  subtitle?: string
  tone: LevelTone
  startRoomId: RoomId
  rooms: Record<RoomId, Room>
  decisions: Record<DecisionId, Decision>
  puzzles?: Record<PuzzleId, Puzzle>
  initialInventory?: ItemId[]
  maxLives: number
  winCondition: Condition
  loseCondition?: Condition
  intro?: { text: string; image?: string }
  outro?: { good: string; bad?: string }
}

// ─── Player & save state ──────────────────────────────────────────────────────

export interface InventoryEntry {
  itemId: ItemId
  quantity: number
}

export interface DecisionLogEntry {
  levelId: LevelId
  decisionId: DecisionId
  optionId: string
  correct: boolean
  t: number
}

export interface PlayerState {
  currentLevelId: LevelId | null
  currentRoomId: RoomId | null
  inventory: InventoryEntry[]
  lives: number
  flags: Record<FlagKey, boolean>
  decisionsLog: DecisionLogEntry[]
  unlockedLevels: LevelId[]
  completedLevels: LevelId[]
}

export interface SaveSlot {
  id: string
  schemaVersion: number
  createdAt: number
  updatedAt: number
  player: PlayerState
}

// ─── Side-effects emitted by the reducer that the UI layer must consume ───────

export type EngineSideEffect =
  | { kind: 'openDecision'; decisionId: DecisionId }
  | { kind: 'startPuzzle'; puzzleId: PuzzleId }
  | { kind: 'dialog'; text: string; tone: 'info' | 'success' | 'warning' | 'error' }
  | { kind: 'winLevel' }
  | { kind: 'loseLevel'; reason?: string }

export interface ReducerResult {
  state: PlayerState
  sideEffects: EngineSideEffect[]
}
