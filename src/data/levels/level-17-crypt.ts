import type { Decision, Level, Puzzle, Room } from '@/types/game'

/**
 * Nivel 17 — "La Cripta"
 *
 * Tres mecanismos: apagar el candelabro (Lights Out), descifrar el nombre
 * grabado en la lápida (cipher TUMBA), abrir la verja de la cripta (code).
 *
 * Las pistas son intencionalmente sutiles:
 *  - El código no aparece en cartel: hay que deducirlo de los años grabados
 *    en la lápida (1847–1903 → año de muerte 1903 = código).
 *  - El cifrado solo muestra los números, sin texto explicativo.
 *  - El Lights Out es puro razonamiento, sin pistas.
 */

const ROOM: Room = {
  id: 'crypt',
  name: 'Cripta',
  background: 'bg-gradient-to-b from-stone-950 to-black',
  sceneKey: 'crypt-v1',
  hotspots: [
    {
      // The tombstone — both cipher entry AND a clue (dates).
      id: 'tombstone',
      x: 74, y: 35, w: 20, h: 36,
      label: 'Lápida grabada',
      icon: 'BookOpen',
      cursor: 'look',
      onClick: [
        {
          type: 'dialog',
          text:
            'La piedra está erosionada pero todavía se leen dos fechas debajo del nombre: 1847 — 1903. Y abajo, cinco números esculpidos a cincel: 20 · 21 · 13 · 2 · 1.',
          tone: 'info',
        },
      ],
    },
    {
      // Candelabra — lights out entry
      id: 'candelabra',
      x: 42, y: 38, w: 16, h: 32,
      label: 'Candelabro de cinco velas',
      icon: 'Lightbulb',
      cursor: 'use',
      visibleWhen: { type: 'not', child: { type: 'flag', key: 'cr2_candles' } },
      onClick: [{ type: 'startPuzzle', puzzleId: 'crypt-candles' }],
    },
    {
      // Tombstone again, but to OPEN the cipher puzzle (not just look)
      id: 'tomb-cipher',
      x: 74, y: 71, w: 20, h: 10,
      label: 'Descifrar el nombre',
      icon: 'ScrollText',
      cursor: 'use',
      visibleWhen: { type: 'not', child: { type: 'flag', key: 'cr2_name' } },
      onClick: [{ type: 'startPuzzle', puzzleId: 'crypt-cipher' }],
    },
    {
      // Keypad next to the iron gate
      id: 'gate-keypad',
      x: 62, y: 25, w: 6, h: 14,
      label: 'Keypad de la verja',
      icon: 'KeyRound',
      cursor: 'use',
      visibleWhen: { type: 'not', child: { type: 'flag', key: 'cr2_door' } },
      onClick: [{ type: 'startPuzzle', puzzleId: 'crypt-gate-code' }],
    },
    {
      id: 'exit-arch',
      x: 40, y: 7, w: 20, h: 40,
      label: 'Salir por la verja',
      icon: 'LogOut',
      cursor: 'enter',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'cr2_candles' },
          { type: 'flag', key: 'cr2_name' },
          { type: 'flag', key: 'cr2_door' },
        ],
      },
      onClick: [{ type: 'openDecision', decisionId: 'crypt-final-quiz' }],
    },
  ],
}

const CANDLES: Puzzle = {
  id: 'crypt-candles',
  kind: 'lights-out',
  prompt: 'Apagar las velas',
  payload: {
    initialGrid: [
      [1, 0, 1, 0, 1],
      [0, 1, 0, 1, 0],
      [1, 0, 1, 0, 1],
      [0, 1, 0, 1, 0],
      [1, 0, 1, 0, 1],
    ],
    target: 'all-off',
  },
  solution: 'lights-out',
  onSolve: [
    { type: 'setFlag', key: 'cr2_candles', value: true },
    { type: 'dialog', text: 'La última vela cede. Silencio en la cripta.', tone: 'success' },
  ],
}

// 20·21·13·2·1 → T·U·M·B·A → "TUMBA"
const NAME: Puzzle = {
  id: 'crypt-cipher',
  kind: 'cipher',
  prompt: 'Nombre en la lápida',
  payload: {
    encrypted: [20, 21, 13, 2, 1],
    hint: 'Cinco letras grabadas a cincel.',
  },
  solution: 'TUMBA',
  onSolve: [
    { type: 'setFlag', key: 'cr2_name', value: true },
    { type: 'dialog', text: 'La palabra cede del cincel: TUMBA. La piedra deja escapar un suspiro.', tone: 'success' },
  ],
  onFail: [
    { type: 'dialog', text: 'La lápida no responde.', tone: 'error' },
  ],
}

const GATE: Puzzle = {
  id: 'crypt-gate-code',
  kind: 'code',
  prompt: 'Cerradura de la verja',
  payload: { length: 4 },
  solution: '1903',
  onSolve: [
    { type: 'setFlag', key: 'cr2_door', value: true },
    { type: 'dialog', text: 'El cerrojo cede con un chillido oxidado.', tone: 'success' },
  ],
  onFail: [{ type: 'dialog', text: 'La verja no se mueve.', tone: 'error' }],
}

const FINAL_QUIZ: Decision = {
  id: 'crypt-final-quiz',
  prompt:
    'Una voz hueca te detiene en la verja: "antes de irte, decime el año exacto en que murió la que descansa acá".',
  options: [
    {
      id: 'a',
      label: '1847',
      isCorrect: false,
      consequences: [
        { type: 'recordDecision', decisionId: 'crypt-final-quiz', optionId: 'a', correct: false },
        { type: 'loseLife' },
        { type: 'dialog', text: 'Ese era otro año.', tone: 'error' },
      ],
      feedback: 'La lápida tenía dos fechas. La de muerte es la segunda.',
    },
    {
      id: 'b',
      label: '1898',
      isCorrect: false,
      consequences: [
        { type: 'recordDecision', decisionId: 'crypt-final-quiz', optionId: 'b', correct: false },
        { type: 'loseLife' },
        { type: 'dialog', text: 'No.', tone: 'error' },
      ],
      feedback: 'Mirá las fechas grabadas en la lápida.',
    },
    {
      id: 'c',
      label: '1903',
      isCorrect: true,
      consequences: [
        { type: 'recordDecision', decisionId: 'crypt-final-quiz', optionId: 'c', correct: true },
        { type: 'dialog', text: '1903. La voz se calla. La verja queda definitivamente abierta. Salís a la noche.', tone: 'success' },
        { type: 'winLevel' },
      ],
      feedback: 'La segunda fecha en la lápida.',
    },
    {
      id: 'd',
      label: '1912',
      isCorrect: false,
      consequences: [
        { type: 'recordDecision', decisionId: 'crypt-final-quiz', optionId: 'd', correct: false },
        { type: 'loseLife' },
        { type: 'dialog', text: 'Ya estaba enterrada para esa fecha.', tone: 'error' },
      ],
      feedback: '1847 — 1903.',
    },
  ],
}

export const LEVEL_17_CRYPT: Level = {
  id: 'level-17-crypt',
  title: 'La Cripta',
  subtitle: 'Tono: gótico · nivel 17',
  tone: 'mystery',
  startRoomId: 'crypt',
  rooms: { crypt: ROOM },
  decisions: { 'crypt-final-quiz': FINAL_QUIZ },
  puzzles: {
    'crypt-candles': CANDLES,
    'crypt-cipher': NAME,
    'crypt-gate-code': GATE,
  },
  initialInventory: [],
  maxLives: 3,
  winCondition: {
    type: 'and',
    children: [
      { type: 'flag', key: 'cr2_candles' },
      { type: 'flag', key: 'cr2_name' },
      { type: 'flag', key: 'cr2_door' },
    ],
  },
  loseCondition: { type: 'not', child: { type: 'livesAtLeast', n: 1 } },
  intro: {
    text:
      'Bajaste a la cripta familiar buscando un anillo perdido. La verja se cerró sola. El candelabro está prendido — apagalo. La lápida tiene un nombre cifrado. Y el cerrojo de hierro pide cuatro cifras que vas a tener que deducir.',
  },
  outro: {
    good: 'La verja chilla al abrirse. Salís a la noche, el anillo en el bolsillo.',
    bad: 'La cripta no te dejó volver.',
  },
}
