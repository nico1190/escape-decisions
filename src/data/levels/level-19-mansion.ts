import type { Decision, Level, Puzzle, Room } from '@/types/game'

/**
 * Nivel 19 — "Mansión Victoriana"
 * Tono: terror gótico victoriano.
 *
 * Mecánicas:
 *   - CONSTELLATION — conectar 5 estrellas en orden correcto a través
 *                     del vidrio empañado de la ventana
 *   - LIGHTS-OUT 4×4 — apagar todas las velas del candelabro
 *   - WORD — armar el nombre de la difunta combinando las pistas que
 *            aparecen al resolver los dos puzzles anteriores
 *
 * Trampa: en el retrato hay una placa "ALICIA — 1879" que TIENTA a
 * dar ese nombre — pero la verdadera difunta no es ella.
 */

const ROOM: Room = {
  id: 'mansion',
  name: 'Mansión Victoriana',
  background: 'bg-gradient-to-b from-stone-950 to-black',
  sceneKey: 'mansion-v1',
  hotspots: [
    {
      id: 'portrait',
      x: 73, y: 11, w: 22, h: 54,
      label: 'Retrato y placa',
      icon: 'BookOpen',
      cursor: 'look',
      onClick: [
        {
          type: 'dialog',
          text: 'La placa medio borrada bajo el retrato: "ALICIA — 1879". El polvo cubre la mitad — podría faltar texto.',
          tone: 'info',
        },
      ],
    },
    {
      id: 'window-constellation',
      x: 3, y: 11, w: 22, h: 45,
      label: 'Ventana del cielo nocturno',
      icon: 'Sparkles',
      cursor: 'use',
      visibleWhen: { type: 'not', child: { type: 'flag', key: 'mn_stars' } },
      onClick: [{ type: 'startPuzzle', puzzleId: 'mn-constellation' }],
    },
    {
      // After constellation solved — fragment of letters revealed in window glass
      id: 'window-glass',
      x: 3, y: 11, w: 22, h: 45,
      label: 'Letras en el vidrio',
      icon: 'BookOpen',
      cursor: 'look',
      visibleWhen: { type: 'flag', key: 'mn_stars' },
      onClick: [
        {
          type: 'dialog',
          text: 'En el vidrio empañado, grabado tenue: " O _ I _ I _ ".',
          tone: 'success',
        },
      ],
    },
    {
      id: 'candelabra',
      x: 40, y: 36, w: 20, h: 30,
      label: 'Candelabro',
      icon: 'Lightbulb',
      cursor: 'use',
      visibleWhen: { type: 'not', child: { type: 'flag', key: 'mn_candles' } },
      onClick: [{ type: 'startPuzzle', puzzleId: 'mn-candelabra' }],
    },
    {
      // After lights out solved — wax base reveals other letter fragment
      id: 'wax-base',
      x: 40, y: 60, w: 20, h: 10,
      label: 'Base del candelabro',
      icon: 'BookOpen',
      cursor: 'look',
      visibleWhen: { type: 'flag', key: 'mn_candles' },
      onClick: [
        {
          type: 'dialog',
          text: 'Bajo la cera derretida hay letras grabadas en la base: " _ L _ V _ A ".',
          tone: 'success',
        },
      ],
    },
    {
      id: 'name-plate',
      x: 73, y: 60, w: 22, h: 10,
      label: 'Placa de la difunta',
      icon: 'ScrollText',
      cursor: 'use',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'mn_stars' },
          { type: 'flag', key: 'mn_candles' },
          { type: 'not', child: { type: 'flag', key: 'mn_word' } },
        ],
      },
      onClick: [{ type: 'startPuzzle', puzzleId: 'mn-name' }],
    },
    {
      id: 'exit-door',
      x: 40, y: 14, w: 20, h: 32,
      label: 'Puerta de salida',
      icon: 'LogOut',
      cursor: 'enter',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'mn_stars' },
          { type: 'flag', key: 'mn_candles' },
          { type: 'flag', key: 'mn_word' },
        ],
      },
      onClick: [{ type: 'openDecision', decisionId: 'mansion-final-quiz' }],
    },
  ],
}

const FINAL_QUIZ: Decision = {
  id: 'mansion-final-quiz',
  prompt:
    'La puerta cede, pero algo te detiene en el umbral. Una voz susurra: "decí mi nombre, no el del retrato".',
  options: [
    {
      id: 'a',
      label: 'ALICIA',
      isCorrect: false,
      consequences: [
        { type: 'recordDecision', decisionId: 'mansion-final-quiz', optionId: 'a', correct: false },
        { type: 'loseLife' },
        { type: 'dialog', text: 'Ese es el retrato. Yo no.', tone: 'error' },
      ],
      feedback: 'El retrato es de Alicia. La difunta sin tumba es otra.',
    },
    {
      id: 'b',
      label: 'OLIVIA',
      isCorrect: true,
      consequences: [
        { type: 'recordDecision', decisionId: 'mansion-final-quiz', optionId: 'b', correct: true },
        { type: 'dialog', text: 'OLIVIA. El umbral te deja pasar. La voz se apaga.', tone: 'success' },
        { type: 'winLevel' },
      ],
      feedback: 'Vidrio: O_I_I_ · Cera: _L_V_A · Combinado: OLIVIA.',
    },
    {
      id: 'c',
      label: 'OFELIA',
      isCorrect: false,
      consequences: [
        { type: 'recordDecision', decisionId: 'mansion-final-quiz', optionId: 'c', correct: false },
        { type: 'loseLife' },
        { type: 'dialog', text: 'No.', tone: 'error' },
      ],
      feedback: 'OLIVIA — las letras del vidrio y la base combinadas.',
    },
    {
      id: 'd',
      label: 'AMELIA',
      isCorrect: false,
      consequences: [
        { type: 'recordDecision', decisionId: 'mansion-final-quiz', optionId: 'd', correct: false },
        { type: 'loseLife' },
        { type: 'dialog', text: 'Tampoco.', tone: 'error' },
      ],
      feedback: 'O_I_I_ + _L_V_A = OLIVIA.',
    },
  ],
}

const CONSTELLATION: Puzzle = {
  id: 'mn-constellation',
  kind: 'constellation',
  prompt: 'Conectar las estrellas',
  payload: {
    // 5 stars arranged in a slight cross shape
    stars: [
      { id: 's1', x: 30, y: 14 },
      { id: 's2', x: 50, y: 22 },
      { id: 's3', x: 72, y: 18 },
      { id: 's4', x: 42, y: 38 },
      { id: 's5', x: 62, y: 44 },
    ],
    hint: 'El orden empieza arriba a la izquierda. Una equivocación reinicia.',
  },
  solution: 's1,s4,s2,s5,s3',
  onSolve: [
    { type: 'setFlag', key: 'mn_stars', value: true },
    { type: 'dialog', text: 'Las estrellas se conectan. Algo brilla en el vidrio empañado.', tone: 'success' },
  ],
}

// 4×4 lights-out — start pattern that requires ~8 clicks to clear.
const CANDLES: Puzzle = {
  id: 'mn-candelabra',
  kind: 'lights-out',
  prompt: 'Apagar las velas',
  payload: {
    initialGrid: [
      [1, 0, 0, 1],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [1, 0, 0, 1],
    ],
    target: 'all-off',
  },
  solution: 'all-off',
  onSolve: [
    { type: 'setFlag', key: 'mn_candles', value: true },
    { type: 'dialog', text: 'La última llama se apaga. El cuarto huele a cera fría. Algo aparece en la base del candelabro.', tone: 'success' },
  ],
}

const NAME_PUZZLE: Puzzle = {
  id: 'mn-name',
  kind: 'word',
  prompt: 'Nombre de la difunta',
  payload: {
    length: 6,
    hint: 'Vidrio: O_I_I_ — Cera: _L_V_A. Combinalas.',
    bank: ['O', 'L', 'I', 'V', 'I', 'A', 'R', 'N', 'S', 'M'],
  },
  solution: 'OLIVIA',
  onSolve: [
    { type: 'setFlag', key: 'mn_word', value: true },
    { type: 'dialog', text: 'OLIVIA. Algo cruje en la puerta principal.', tone: 'success' },
  ],
  onFail: [{ type: 'dialog', text: 'No coincide. Hay otra mujer en esta casa.', tone: 'error' }],
}

export const LEVEL_19_MANSION: Level = {
  id: 'level-19-mansion',
  title: 'Mansión Victoriana',
  subtitle: 'Tono: gótico · nivel 19',
  tone: 'mystery',
  startRoomId: 'mansion',
  rooms: { mansion: ROOM },
  decisions: { 'mansion-final-quiz': FINAL_QUIZ },
  puzzles: {
    'mn-constellation': CONSTELLATION,
    'mn-candelabra': CANDLES,
    'mn-name': NAME_PUZZLE,
  },
  initialInventory: [],
  maxLives: 2,
  winCondition: {
    type: 'and',
    children: [
      { type: 'flag', key: 'mn_stars' },
      { type: 'flag', key: 'mn_candles' },
      { type: 'flag', key: 'mn_word' },
    ],
  },
  loseCondition: { type: 'not', child: { type: 'livesAtLeast', n: 1 } },
  intro: {
    text:
      'Te refugiaste en una mansión victoriana durante una tormenta y la puerta principal se trabó. Una voz susurra en algún rincón. El nombre de la difunta no está en ningún lado — solo fragmentos: en el cielo nocturno por la ventana, en la base del candelabro y en una placa final. El retrato es engañoso: hay un nombre falso colgado en él.',
  },
  outro: {
    good: 'La puerta principal cede. La tormenta sigue afuera pero al menos la voz se calmó.',
    bad: 'Te quedaste sin intentos. La voz sigue susurrando un nombre que ya no escuchás.',
  },
}
