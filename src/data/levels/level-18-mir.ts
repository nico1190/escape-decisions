import type { Decision, Level, Puzzle, Room } from '@/types/game'

/**
 * Nivel 18 — "Estación Mir Abandonada"
 * Tono: sci-fi soviético · zero-G.
 *
 * Mecánicas:
 *   - PIPE (oxígeno) — conectar surtidor a la esclusa
 *   - CIPHER (caesar shift descubrible) — descifrar mensaje cirílico
 *   - TIMING (esclusa de aire) — compresión sincronizada
 *
 * Twist: el shift de la cifra Caesar (clave = 3) está oculto en el
 * manómetro del puzzle de tuberías (después de resolverlo aparece "К=3"
 * en el indicador). El jugador tiene que resolver pipes ANTES del cipher.
 */

const ROOM: Room = {
  id: 'mir',
  name: 'Estación Mir',
  background: 'bg-gradient-to-b from-slate-950 to-black',
  sceneKey: 'mir-v1',
  hotspots: [
    {
      // Cyrillic warning poster — reveals partial hint
      id: 'warning-sign',
      x: 86, y: 11, w: 12, h: 11,
      label: 'Cartel de advertencia',
      icon: 'FileText',
      cursor: 'look',
      onClick: [
        {
          type: 'dialog',
          text: 'En el cartel amarillo en cirílico: "ОПАСНО — desplazamiento Cesar". Nada más.',
          tone: 'info',
        },
      ],
    },
    {
      // Pipe panel (left) — pipe puzzle
      id: 'oxygen-pipes',
      x: 3, y: 36, w: 22, h: 50,
      label: 'Panel de tuberías',
      icon: 'Droplets',
      cursor: 'use',
      visibleWhen: { type: 'not', child: { type: 'flag', key: 'mir_pipes' } },
      onClick: [{ type: 'startPuzzle', puzzleId: 'mir-pipe-puzzle' }],
    },
    {
      // After pipes solved — manometer reveals K=3 hint
      id: 'manometer',
      x: 3, y: 78, w: 22, h: 10,
      label: 'Manómetro',
      icon: 'Sparkles',
      cursor: 'look',
      visibleWhen: { type: 'flag', key: 'mir_pipes' },
      onClick: [
        {
          type: 'dialog',
          text: 'El manómetro estabilizado marca un número en la esfera: К = 3.',
          tone: 'success',
        },
      ],
    },
    {
      // Cipher panel (center)
      id: 'cipher-panel',
      x: 35, y: 39, w: 28, h: 39,
      label: 'Consola de cifra',
      icon: 'ScrollText',
      cursor: 'use',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'mir_pipes' },
          { type: 'not', child: { type: 'flag', key: 'mir_cipher' } },
        ],
      },
      onClick: [{ type: 'startPuzzle', puzzleId: 'mir-cipher-caesar' }],
    },
    {
      // Airlock hatch (right) — timing puzzle
      id: 'airlock',
      x: 72, y: 32, w: 26, h: 36,
      label: 'Esclusa de aire',
      icon: 'Target',
      cursor: 'use',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'mir_cipher' },
          { type: 'not', child: { type: 'flag', key: 'mir_airlock' } },
        ],
      },
      onClick: [{ type: 'startPuzzle', puzzleId: 'mir-airlock-timing' }],
    },
    {
      // Final exit
      id: 'exit',
      x: 72, y: 32, w: 26, h: 36,
      label: 'Eyectar a la órbita',
      icon: 'LogOut',
      cursor: 'enter',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'mir_pipes' },
          { type: 'flag', key: 'mir_cipher' },
          { type: 'flag', key: 'mir_airlock' },
        ],
      },
      onClick: [{ type: 'openDecision', decisionId: 'mir-final-quiz' }],
    },
  ],
}

const FINAL_QUIZ: Decision = {
  id: 'mir-final-quiz',
  prompt:
    'Antes de eyectarte, la voz autómata del HQ pregunta: "¿en qué año se desorbitó la verdadera Mir?".',
  options: [
    {
      id: 'a',
      label: '1989',
      isCorrect: false,
      consequences: [
        { type: 'recordDecision', decisionId: 'mir-final-quiz', optionId: 'a', correct: false },
        { type: 'loseLife' },
        { type: 'dialog', text: 'Demasiado temprano — recién la habían lanzado.', tone: 'error' },
      ],
      feedback: 'Mir orbitó hasta 2001.',
    },
    {
      id: 'b',
      label: '1995',
      isCorrect: false,
      consequences: [
        { type: 'recordDecision', decisionId: 'mir-final-quiz', optionId: 'b', correct: false },
        { type: 'loseLife' },
        { type: 'dialog', text: 'Por ahí estaba activa todavía.', tone: 'error' },
      ],
      feedback: 'Cayó en marzo de 2001.',
    },
    {
      id: 'c',
      label: '2001',
      isCorrect: true,
      consequences: [
        { type: 'recordDecision', decisionId: 'mir-final-quiz', optionId: 'c', correct: true },
        { type: 'dialog', text: '2001. Confirmado. La eyección lanza tu cápsula al Pacífico.', tone: 'success' },
        { type: 'winLevel' },
      ],
      feedback: 'Mir se desorbitó controladamente en marzo de 2001.',
    },
    {
      id: 'd',
      label: '2007',
      isCorrect: false,
      consequences: [
        { type: 'recordDecision', decisionId: 'mir-final-quiz', optionId: 'd', correct: false },
        { type: 'loseLife' },
        { type: 'dialog', text: 'Para entonces ya estaba en el océano.', tone: 'error' },
      ],
      feedback: 'Cayó en 2001.',
    },
  ],
}

// PIPE: 3-row × 5-col grid.
// Source (row 2, col 0) emits right. Sink (row 2, col 4) receives left.
// The path detours up: S → (2,1)elbow → (1,1)straight → (0,1)elbow →
//                     (0,2)straight → (0,3)elbow → (1,3)straight → (2,3)elbow → K
// Targets (each cell's correct rotation):
//   (0,1)=1 (0,2)=0 (0,3)=2
//   (1,1)=1 (1,3)=1
//   (2,1)=3 (2,3)=0
// Seeds: each starts 1-3 rotations away → ~14 clicks to solve.
const PIPE_PUZZLE: Puzzle = {
  id: 'mir-pipe-puzzle',
  kind: 'pipe',
  prompt: 'Conectar línea de O₂',
  payload: {
    grid: [
      // row 0 — top arch
      [
        { type: 'empty', r: 0 },
        { type: 'elbow', r: 3 },     // target r=1 (rotate twice)
        { type: 'straight', r: 1 },  // target r=0 (rotate 3×, or back to 0)
        { type: 'elbow', r: 0 },     // target r=2
        { type: 'empty', r: 0 },
      ],
      // row 1 — vertical risers
      [
        { type: 'empty', r: 0 },
        { type: 'straight', r: 0 },  // target r=1
        { type: 'empty', r: 0 },
        { type: 'straight', r: 0 },  // target r=1
        { type: 'empty', r: 0 },
      ],
      // row 2 — endpoints + corners
      [
        { type: 'source', r: 0, locked: true },
        { type: 'elbow', r: 0 },     // target r=3
        { type: 'blocked', r: 0 },   // forces detour
        { type: 'elbow', r: 2 },     // target r=0
        { type: 'sink', r: 0, locked: true },
      ],
    ],
    source: { r: 2, c: 0 },
    sink: { r: 2, c: 4 },
  },
  solution: 'pipe-connected',
  onSolve: [
    { type: 'setFlag', key: 'mir_pipes', value: true },
    { type: 'dialog', text: 'El O₂ silba. La presión sube. Algo cambia en el manómetro de abajo.', tone: 'success' },
  ],
}

// CAESAR CIPHER — "ХОЦОЕА" with shift 3 → "УЛЦЛБ-?"
// Actually for Cyrillic we'd need a Cyrillic mapping. To keep the puzzle
// portable and the input ASCII, the encoded text is shown on screen as
// stylized but the SOLUTION is the unshifted ASCII (Latin) word "TIERRA".
// Encrypted ascii display: "WLHUUD" (each shifted +3). Player decodes -3.
const CIPHER_PUZZLE: Puzzle = {
  id: 'mir-cipher-caesar',
  kind: 'cipher',
  prompt: 'Descifrar transmisión del HQ',
  payload: {
    encrypted: [23, 12, 8, 21, 21, 4], // ascii letter positions W L H U U D (1-indexed A=1)
    hint: 'Las letras están corridas. El manómetro del panel de O₂ marca el corrimiento.',
  },
  solution: 'TIERRA',
  onSolve: [
    { type: 'setFlag', key: 'mir_cipher', value: true },
    { type: 'dialog', text: '"TIERRA". El HQ confirma la trayectoria. La esclusa se desbloquea.', tone: 'success' },
  ],
  onFail: [{ type: 'dialog', text: 'Transmisión negativa. Reintentá.', tone: 'error' }],
}

const AIRLOCK_PUZZLE: Puzzle = {
  id: 'mir-airlock-timing',
  kind: 'timing',
  prompt: 'Compresión de esclusa',
  payload: {
    rounds: [
      { greenSize: 16, greenPos: 50, cycleMs: 1200 },
      { greenSize: 10, greenPos: 50, cycleMs: 850 },
      { greenSize: 7, greenPos: 50, cycleMs: 600 },
      { greenSize: 5, greenPos: 50, cycleMs: 450 },
    ],
  },
  solution: 'timing-ok',
  onSolve: [
    { type: 'setFlag', key: 'mir_airlock', value: true },
    { type: 'dialog', text: 'Cuatro pulsos sincronizados. La esclusa hace clic. La cápsula está armada.', tone: 'success' },
  ],
}

export const LEVEL_18_MIR: Level = {
  id: 'level-18-mir',
  title: 'Estación Mir Abandonada',
  subtitle: 'Tono: sci-fi soviético · nivel 18',
  tone: 'mystery',
  startRoomId: 'mir',
  rooms: { mir: ROOM },
  decisions: { 'mir-final-quiz': FINAL_QUIZ },
  puzzles: {
    'mir-pipe-puzzle': PIPE_PUZZLE,
    'mir-cipher-caesar': CIPHER_PUZZLE,
    'mir-airlock-timing': AIRLOCK_PUZZLE,
  },
  initialInventory: [],
  maxLives: 2,
  winCondition: {
    type: 'and',
    children: [
      { type: 'flag', key: 'mir_pipes' },
      { type: 'flag', key: 'mir_cipher' },
      { type: 'flag', key: 'mir_airlock' },
    ],
  },
  loseCondition: { type: 'not', child: { type: 'livesAtLeast', n: 1 } },
  intro: {
    text:
      'Te despertaste flotando dentro de una Mir abandonada. La alarma roja parpadea. El oxígeno está cortado. Tenés que: rerutear la tubería de O₂ (rotar piezas hasta conectar el surtidor con la esclusa), descifrar el último mensaje del HQ (los caracteres están corridos — la clave aparece después de los caños), y temporizar la compresión de la esclusa. Sin equivocarte mucho: solo te quedan 2 vidas.',
  },
  outro: {
    good: 'La cápsula se eyecta. Atravesás la atmósfera. Aterrizaje suave en el Pacífico, rescate en 6 horas.',
    bad: 'El oxígeno se agotó antes que pudieras estabilizar la esclusa.',
  },
}
