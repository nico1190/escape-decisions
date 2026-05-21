import type { Level, Puzzle, Room } from '@/types/game'

const ROOM: Room = {
  id: 'submarine',
  name: 'Submarino',
  background: 'bg-gradient-to-b from-slate-950 to-black',
  sceneKey: 'submarine-v1',
  darkness: { lightSourceItem: 'flashlight' },
  hotspots: [
    {
      id: 'toolbox',
      x: 22, y: 80, w: 6, h: 8,
      label: 'Caja de emergencia',
      icon: 'Wrench',
      cursor: 'grab',
      visibleWhen: { type: 'lacksItem', itemId: 'flashlight' },
      onClick: [
        { type: 'addItem', itemId: 'flashlight' },
        { type: 'dialog', text: 'Una linterna sumergible y a prueba de fallas. Ahora se puede ver.', tone: 'success' },
      ],
    },
    {
      id: 'depth-hint',
      x: 33, y: 78, w: 8, h: 11,
      label: 'Manual de profundidad',
      icon: 'FileText',
      cursor: 'look',
      onClick: [
        {
          type: 'dialog',
          text: 'En el manual: Profundidades de calibración por canal — 2 · 5 · 1 · 3. Los 4 ajustes.',
          tone: 'info',
        },
      ],
    },
    {
      id: 'radio-hint',
      x: 84, y: 82, w: 9, h: 11,
      label: 'Frecuencia de emergencia',
      icon: 'FileText',
      cursor: 'look',
      onClick: [
        {
          type: 'dialog',
          text: 'Una nota pegada en la radio: FREQ 4-7-2-9. La frecuencia de rescate.',
          tone: 'info',
        },
      ],
    },
    {
      id: 'valve-panel',
      x: 3, y: 36, w: 14, h: 28,
      label: 'Válvulas de presión',
      icon: 'Target',
      cursor: 'use',
      visibleWhen: { type: 'not', child: { type: 'flag', key: 'sub_valves' } },
      onClick: [{ type: 'startPuzzle', puzzleId: 'sub-valves-timing' }],
    },
    {
      id: 'depth-console',
      x: 32, y: 50, w: 32, h: 21,
      label: 'Consola de profundidad',
      icon: 'Sliders',
      cursor: 'use',
      visibleWhen: { type: 'not', child: { type: 'flag', key: 'sub_depth' } },
      onClick: [{ type: 'startPuzzle', puzzleId: 'sub-depth-sliders' }],
    },
    {
      id: 'radio-keypad',
      x: 68, y: 57, w: 14, h: 16,
      label: 'Radio de auxilio',
      icon: 'KeyRound',
      cursor: 'use',
      visibleWhen: { type: 'not', child: { type: 'flag', key: 'sub_radio' } },
      onClick: [{ type: 'startPuzzle', puzzleId: 'sub-radio-code' }],
    },
    {
      id: 'hatch',
      x: 42, y: 73, w: 16, h: 25,
      label: 'Emerger por la escotilla',
      icon: 'LogOut',
      cursor: 'enter',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'sub_valves' },
          { type: 'flag', key: 'sub_depth' },
          { type: 'flag', key: 'sub_radio' },
        ],
      },
      onClick: [
        { type: 'dialog', text: 'La escotilla se libera con un siseo. Subís a la superficie.', tone: 'success' },
        { type: 'winLevel' },
      ],
    },
  ],
}

const VALVES: Puzzle = {
  id: 'sub-valves-timing',
  kind: 'timing',
  prompt: 'Cerrar válvulas a presión',
  payload: {
    rounds: [
      { greenSize: 20, greenPos: 50, cycleMs: 1500 },
      { greenSize: 14, greenPos: 50, cycleMs: 1100 },
      { greenSize: 10, greenPos: 50, cycleMs: 800 },
      { greenSize: 7, greenPos: 50, cycleMs: 650 },
    ],
  },
  solution: 'timing-ok',
  onSolve: [
    { type: 'setFlag', key: 'sub_valves', value: true },
    { type: 'dialog', text: 'Cuatro pulsos perfectos. Las válvulas cierran. El sub deja de inundarse.', tone: 'success' },
  ],
}

const DEPTH: Puzzle = {
  id: 'sub-depth-sliders',
  kind: 'slider',
  prompt: 'Calibrar profundidad',
  payload: {
    targets: [2, 5, 1, 3],
    range: { min: 0, max: 9 },
    labels: ['Proa', 'Centro', 'Popa', 'Lastre'],
  },
  solution: '2513',
  onSolve: [
    { type: 'setFlag', key: 'sub_depth', value: true },
    { type: 'dialog', text: 'Los 4 canales en cero. El submarino se nivela.', tone: 'success' },
  ],
}

const RADIO: Puzzle = {
  id: 'sub-radio-code',
  kind: 'code',
  prompt: 'Frecuencia de auxilio',
  payload: { length: 4 },
  solution: '4729',
  onSolve: [
    { type: 'setFlag', key: 'sub_radio', value: true },
    { type: 'dialog', text: 'La radio crepita una respuesta. Te ubicaron en superficie.', tone: 'success' },
  ],
  onFail: [{ type: 'dialog', text: 'Solo estática. Frecuencia incorrecta.', tone: 'error' }],
}

export const LEVEL_06_SUBMARINE: Level = {
  id: 'level-06-submarine',
  title: 'Submarino a la Deriva',
  subtitle: 'Tono: claustrofobia · nivel 6',
  tone: 'mystery',
  startRoomId: 'submarine',
  rooms: { submarine: ROOM },
  decisions: {},
  puzzles: {
    'sub-valves-timing': VALVES,
    'sub-depth-sliders': DEPTH,
    'sub-radio-code': RADIO,
  },
  initialInventory: [],
  maxLives: 3,
  winCondition: {
    type: 'and',
    children: [
      { type: 'flag', key: 'sub_valves' },
      { type: 'flag', key: 'sub_depth' },
      { type: 'flag', key: 'sub_radio' },
    ],
  },
  loseCondition: { type: 'not', child: { type: 'livesAtLeast', n: 1 } },
  intro: {
    text:
      'Tu submarino quedó sin energía a 400 metros. Por las válvulas entra agua. Tenés que: cerrar válvulas (4 pulsos seguidos), nivelar la profundidad y emitir el SOS. Si fallás un timing, todo se reinicia.',
  },
  outro: {
    good: 'El submarino emerge. Aire fresco. La radio sigue crujiendo de gente buscándote.',
    bad: 'El submarino se hundió más rápido de lo previsto.',
  },
}
