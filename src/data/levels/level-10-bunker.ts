import type { Decision, Level, Puzzle, Room } from '@/types/game'

const ROOM: Room = {
  id: 'bunker',
  name: 'Búnker',
  background: 'bg-gradient-to-b from-green-950 to-black',
  sceneKey: 'bunker-v1',
  hotspots: [
    {
      id: 'phone-book',
      x: 40, y: 83, w: 9, h: 11,
      label: 'Libreta del operador',
      icon: 'FileText',
      cursor: 'look',
      onClick: [
        {
          type: 'dialog',
          text: 'En la libreta, anotado con birome: "1-1-7-9". Sin más contexto.',
          tone: 'info',
        },
      ],
    },
    {
      id: 'launch-panel',
      x: 30, y: 25, w: 16, h: 36,
      label: 'Panel de lanzamiento',
      icon: 'KeyRound',
      cursor: 'use',
      visibleWhen: { type: 'not', child: { type: 'flag', key: 'bk_launch' } },
      onClick: [{ type: 'startPuzzle', puzzleId: 'bk-launch-code' }],
    },
    {
      id: 'wiring',
      x: 50, y: 25, w: 18, h: 36,
      label: 'Circuito principal',
      icon: 'Cable',
      cursor: 'use',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'bk_launch' },
          { type: 'not', child: { type: 'flag', key: 'bk_wires' } },
        ],
      },
      onClick: [{ type: 'startPuzzle', puzzleId: 'bk-wires' }],
    },
    {
      id: 'valve',
      x: 72, y: 25, w: 14, h: 36,
      label: 'Válvula de presión N₂',
      icon: 'Target',
      cursor: 'use',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'bk_wires' },
          { type: 'not', child: { type: 'flag', key: 'bk_valve' } },
        ],
      },
      onClick: [{ type: 'startPuzzle', puzzleId: 'bk-valve-timing' }],
    },
    {
      id: 'hatch',
      x: 86, y: 75, w: 13, h: 20,
      label: 'Escotilla de superficie',
      icon: 'LogOut',
      cursor: 'enter',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'bk_launch' },
          { type: 'flag', key: 'bk_wires' },
          { type: 'flag', key: 'bk_valve' },
        ],
      },
      onClick: [{ type: 'openDecision', decisionId: 'bunker-final-quiz' }],
    },
  ],
}

const FINAL_QUIZ: Decision = {
  id: 'bunker-final-quiz',
  prompt:
    'Antes de abrir la escotilla, el sistema te pide una confirmación final: "¿en qué año se desarrolla esta operación?".',
  options: [
    {
      id: 'a',
      label: '1962',
      isCorrect: false,
      consequences: [
        { type: 'recordDecision', decisionId: 'bunker-final-quiz', optionId: 'a', correct: false },
        { type: 'loseLife' },
        { type: 'dialog', text: 'Crisis cubana no, esta vez.', tone: 'error' },
      ],
      feedback: 'El intro decía 1979.',
    },
    {
      id: 'b',
      label: '1972',
      isCorrect: false,
      consequences: [
        { type: 'recordDecision', decisionId: 'bunker-final-quiz', optionId: 'b', correct: false },
        { type: 'loseLife' },
        { type: 'dialog', text: 'Casi.', tone: 'error' },
      ],
      feedback: 'Fue 1979.',
    },
    {
      id: 'c',
      label: '1979',
      isCorrect: true,
      consequences: [
        { type: 'recordDecision', decisionId: 'bunker-final-quiz', optionId: 'c', correct: true },
        { type: 'dialog', text: '1979. Confirmado. La escotilla cede. Salís a una mañana de otoño en Nevada.', tone: 'success' },
        { type: 'winLevel' },
      ],
      feedback: 'El título mismo lo dice: Búnker \'79.',
    },
    {
      id: 'd',
      label: '1985',
      isCorrect: false,
      consequences: [
        { type: 'recordDecision', decisionId: 'bunker-final-quiz', optionId: 'd', correct: false },
        { type: 'loseLife' },
        { type: 'dialog', text: 'Más temprano.', tone: 'error' },
      ],
      feedback: 'Fue 1979.',
    },
  ],
}

const LAUNCH: Puzzle = {
  id: 'bk-launch-code',
  kind: 'code',
  prompt: 'Código de abort',
  payload: { length: 4 },
  solution: '1179',
  onSolve: [
    { type: 'setFlag', key: 'bk_launch', value: true },
    { type: 'dialog', text: 'Abort confirmado. La cuenta regresiva se congela en T-00:08.', tone: 'success' },
  ],
  onFail: [{ type: 'dialog', text: 'Código rechazado. La cuenta regresiva sigue.', tone: 'error' }],
}

const WIRES: Puzzle = {
  id: 'bk-wires',
  kind: 'wire',
  prompt: 'Desconectar el circuito',
  payload: {
    leftColors: ['red', 'blue', 'yellow', 'green', 'purple'],
    rightColors: ['blue', 'purple', 'red', 'green', 'yellow'],
    matchRule: 'alphabetical',
  },
  solution: 'wired',
  onSolve: [
    { type: 'setFlag', key: 'bk_wires', value: true },
    { type: 'dialog', text: 'Los 5 cables matchean. El sistema entra en standby.', tone: 'success' },
  ],
  onFail: [{ type: 'dialog', text: 'Una chispa. Cambio de cable, rápido.', tone: 'error' }],
}

const VALVE: Puzzle = {
  id: 'bk-valve-timing',
  kind: 'timing',
  prompt: 'Liberar presión N₂',
  payload: {
    rounds: [
      { greenSize: 18, greenPos: 50, cycleMs: 1300 },
      { greenSize: 12, greenPos: 50, cycleMs: 950 },
      { greenSize: 8, greenPos: 50, cycleMs: 700 },
    ],
  },
  solution: 'timing-ok',
  onSolve: [
    { type: 'setFlag', key: 'bk_valve', value: true },
    { type: 'dialog', text: 'Tres pulsos perfectos. La presión cae. El búnker deja de zumbar.', tone: 'success' },
  ],
}

export const LEVEL_10_BUNKER: Level = {
  id: 'level-10-bunker',
  title: "Búnker '79",
  subtitle: 'Tono: cold war · nivel 10',
  tone: 'mystery',
  startRoomId: 'bunker',
  rooms: { bunker: ROOM },
  decisions: { 'bunker-final-quiz': FINAL_QUIZ },
  puzzles: {
    'bk-launch-code': LAUNCH,
    'bk-wires': WIRES,
    'bk-valve-timing': VALVE,
  },
  initialInventory: [],
  maxLives: 3,
  winCondition: {
    type: 'and',
    children: [
      { type: 'flag', key: 'bk_launch' },
      { type: 'flag', key: 'bk_wires' },
      { type: 'flag', key: 'bk_valve' },
    ],
  },
  loseCondition: { type: 'not', child: { type: 'livesAtLeast', n: 1 } },
  intro: {
    text:
      '1979. La cuenta regresiva ya empezó: 8 minutos para el lanzamiento. Tenés que abortar el código, cortar el circuito principal y liberar la presión del nitrógeno. En ese orden. Si fallás uno, todo el procedimiento se reinicia.',
  },
  outro: {
    good: 'Abort exitoso. Subís a una mañana de otoño en el medio de Nevada.',
    bad: 'No llegaste a tiempo. La cuenta llegó a cero.',
  },
}
