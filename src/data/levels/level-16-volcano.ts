import type { Level, Puzzle, Room } from '@/types/game'

const ROOM: Room = {
  id: 'volcano',
  name: 'Puesto Volcánico',
  background: 'bg-gradient-to-b from-stone-900 to-black',
  sceneKey: 'volcano-v1',
  hotspots: [
    {
      id: 'escape-poster',
      x: 20, y: 80, w: 9, h: 11,
      label: 'Cartel de escape',
      icon: 'FileText',
      cursor: 'look',
      onClick: [
        {
          type: 'dialog',
          text:
            'Cartel pegado a la pared: "ESCAPE 8-1-5-2". El código de lanzamiento de la cápsula.',
          tone: 'info',
        },
      ],
    },
    {
      id: 'alarm-panel',
      x: 3, y: 53, w: 14, h: 26,
      label: 'Panel de la alarma',
      icon: 'Cable',
      cursor: 'use',
      visibleWhen: { type: 'not', child: { type: 'flag', key: 'vo_alarm' } },
      onClick: [{ type: 'startPuzzle', puzzleId: 'vo-alarm-wires' }],
    },
    {
      id: 'seismograph',
      x: 38, y: 57, w: 24, h: 20,
      label: 'Sismógrafo',
      icon: 'Target',
      cursor: 'use',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'vo_alarm' },
          { type: 'not', child: { type: 'flag', key: 'vo_tremor' } },
        ],
      },
      onClick: [{ type: 'startPuzzle', puzzleId: 'vo-tremor-timing' }],
    },
    {
      id: 'pod-keypad',
      x: 80, y: 88, w: 12, h: 10,
      label: 'Keypad de la cápsula',
      icon: 'KeyRound',
      cursor: 'use',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'vo_tremor' },
          { type: 'not', child: { type: 'flag', key: 'vo_pod' } },
        ],
      },
      onClick: [{ type: 'startPuzzle', puzzleId: 'vo-pod-code' }],
    },
    {
      id: 'escape-pod',
      x: 76, y: 53, w: 20, h: 38,
      label: 'Lanzar cápsula',
      icon: 'LogOut',
      cursor: 'enter',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'vo_alarm' },
          { type: 'flag', key: 'vo_tremor' },
          { type: 'flag', key: 'vo_pod' },
        ],
      },
      onClick: [
        { type: 'dialog', text: 'La compuerta de la cápsula se abre. Te sentás. El cohete dispara hacia el cielo, atrás queda el cono ardiendo.', tone: 'success' },
        { type: 'winLevel' },
      ],
    },
  ],
}

const ALARM: Puzzle = {
  id: 'vo-alarm-wires',
  kind: 'wire',
  prompt: 'Cortar alarma sísmica',
  payload: {
    leftColors: ['red', 'blue', 'yellow', 'green'],
    rightColors: ['yellow', 'green', 'red', 'blue'],
    matchRule: 'alphabetical',
  },
  solution: 'wired',
  onSolve: [
    { type: 'setFlag', key: 'vo_alarm', value: true },
    { type: 'dialog', text: 'La alarma cede. El sismógrafo todavía marca tremores fuertes — hay que estabilizarlo manualmente.', tone: 'success' },
  ],
  onFail: [{ type: 'dialog', text: 'Cortocircuito. La alarma sigue chillando.', tone: 'error' }],
}

const TREMOR: Puzzle = {
  id: 'vo-tremor-timing',
  kind: 'timing',
  prompt: 'Estabilizar el tremor',
  payload: {
    rounds: [
      { greenSize: 18, greenPos: 50, cycleMs: 1100 },
      { greenSize: 12, greenPos: 50, cycleMs: 850 },
      { greenSize: 8, greenPos: 50, cycleMs: 650 },
      { greenSize: 6, greenPos: 50, cycleMs: 500 },
    ],
  },
  solution: 'timing-ok',
  onSolve: [
    { type: 'setFlag', key: 'vo_tremor', value: true },
    { type: 'dialog', text: 'Cuatro pulsos clavados. El sismógrafo pasa a verde. La cápsula está habilitada.', tone: 'success' },
  ],
}

const POD: Puzzle = {
  id: 'vo-pod-code',
  kind: 'code',
  prompt: 'Lanzamiento de la cápsula',
  payload: { length: 4 },
  solution: '8152',
  onSolve: [
    { type: 'setFlag', key: 'vo_pod', value: true },
    { type: 'dialog', text: 'El cerrojo cede. La cápsula está lista para despegar.', tone: 'success' },
  ],
  onFail: [{ type: 'dialog', text: 'Código rechazado. El volcán sigue gruñendo.', tone: 'error' }],
}

export const LEVEL_16_VOLCANO: Level = {
  id: 'level-16-volcano',
  title: 'Volcán Activo',
  subtitle: 'Tono: acción · nivel 16',
  tone: 'mystery',
  startRoomId: 'volcano',
  rooms: { volcano: ROOM },
  decisions: {},
  puzzles: {
    'vo-alarm-wires': ALARM,
    'vo-tremor-timing': TREMOR,
    'vo-pod-code': POD,
  },
  initialInventory: [],
  maxLives: 3,
  winCondition: {
    type: 'and',
    children: [
      { type: 'flag', key: 'vo_alarm' },
      { type: 'flag', key: 'vo_tremor' },
      { type: 'flag', key: 'vo_pod' },
    ],
  },
  loseCondition: { type: 'not', child: { type: 'livesAtLeast', n: 1 } },
  intro: {
    text:
      'El cono entró en fase explosiva. Tu puesto de observación está temblando. Tres cosas en orden: cortar la alarma sísmica (cables en orden alfabético), estabilizar el sismógrafo manualmente (cuatro pulsos), y lanzar la cápsula de escape. Antes que la lava llegue al puesto.',
  },
  outro: {
    good: 'La cápsula despega justo cuando el techo cae. Salís a la atmósfera entre humo gris.',
    bad: 'La lava llegó primero al puesto.',
  },
}
