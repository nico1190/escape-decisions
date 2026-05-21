import type { Decision, Level, Puzzle, Room } from '@/types/game'

/**
 * Nivel 21 — "Despacho del Detective"
 * Tono: noir años 40.
 *
 * Mecánicas:
 *   - MORSE — decodificar transmisión de radio (asesinato confesado)
 *   - WORD — deducir el asesino (estilo Einstein, 4 sospechosos con
 *            restricciones lógicas en la prompt)
 *   - CIPHER — código del archivero
 *
 * Twist: hay un sospechoso que aparece en el morse pero que NO es el
 * asesino — solo descartado por la lógica. Pista falsa intencional.
 */

const ROOM: Room = {
  id: 'detective',
  name: 'Despacho del Detective',
  background: 'bg-gradient-to-b from-zinc-950 to-black',
  sceneKey: 'detective-v1',
  hotspots: [
    {
      id: 'rainy-window',
      x: 3, y: 7, w: 22, h: 40,
      label: 'Ventana con lluvia',
      icon: 'BookOpen',
      cursor: 'look',
      onClick: [
        {
          type: 'dialog',
          text: 'Afuera llueve. Un cartel del bar de enfrente apenas legible: "ROXY · 1947".',
          tone: 'info',
        },
      ],
    },
    {
      id: 'radio',
      x: 40, y: 60, w: 14, h: 14,
      label: 'Radio',
      icon: 'Radio',
      cursor: 'use',
      visibleWhen: { type: 'not', child: { type: 'flag', key: 'dt_morse' } },
      onClick: [{ type: 'startPuzzle', puzzleId: 'dt-radio-morse' }],
    },
    {
      // After morse — confession snippet shown as text hint
      id: 'radio-after',
      x: 40, y: 60, w: 14, h: 14,
      label: 'Radio (transcripción)',
      icon: 'FileText',
      cursor: 'look',
      visibleWhen: { type: 'flag', key: 'dt_morse' },
      onClick: [
        {
          type: 'dialog',
          text: 'Transcripción: "LO MATÉ YO". Identidad no, solo confesión.',
          tone: 'info',
        },
      ],
    },
    {
      id: 'evidence-board',
      x: 73, y: 11, w: 23, h: 43,
      label: 'Tablero de pruebas',
      icon: 'ScrollText',
      cursor: 'use',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'dt_morse' },
          { type: 'not', child: { type: 'flag', key: 'dt_deduce' } },
        ],
      },
      onClick: [{ type: 'startPuzzle', puzzleId: 'dt-deduction' }],
    },
    {
      id: 'cabinet',
      x: 73, y: 57, w: 23, h: 25,
      label: 'Archivero',
      icon: 'KeyRound',
      cursor: 'use',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'dt_deduce' },
          { type: 'not', child: { type: 'flag', key: 'dt_cipher' } },
        ],
      },
      onClick: [{ type: 'startPuzzle', puzzleId: 'dt-cabinet-cipher' }],
    },
    {
      id: 'exit',
      x: 42, y: 4, w: 14, h: 50,
      label: 'Salir a confrontar',
      icon: 'LogOut',
      cursor: 'enter',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'dt_morse' },
          { type: 'flag', key: 'dt_deduce' },
          { type: 'flag', key: 'dt_cipher' },
        ],
      },
      onClick: [{ type: 'openDecision', decisionId: 'detective-final-quiz' }],
    },
  ],
}

const FINAL_QUIZ: Decision = {
  id: 'detective-final-quiz',
  prompt:
    'En el umbral aparece tu comisaría: "decime el nombre del asesino — y mejor que sea el correcto, no el del morse".',
  options: [
    {
      id: 'a',
      label: 'KOWALSKI',
      isCorrect: false,
      consequences: [
        { type: 'recordDecision', decisionId: 'detective-final-quiz', optionId: 'a', correct: false },
        { type: 'loseLife' },
        { type: 'dialog', text: 'Ese fue quien confesó — pero mentía. Mirá los testigos.', tone: 'error' },
      ],
      feedback: 'Kowalski confesó para tapar al otro.',
    },
    {
      id: 'b',
      label: 'MILLER',
      isCorrect: false,
      consequences: [
        { type: 'recordDecision', decisionId: 'detective-final-quiz', optionId: 'b', correct: false },
        { type: 'loseLife' },
        { type: 'dialog', text: 'Miller tiene coartada.', tone: 'error' },
      ],
      feedback: 'Miller estaba en el casino, confirmado.',
    },
    {
      id: 'c',
      label: 'OBRIEN',
      isCorrect: true,
      consequences: [
        { type: 'recordDecision', decisionId: 'detective-final-quiz', optionId: 'c', correct: true },
        { type: 'dialog', text: "O'BRIEN. La deducción cierra. La comisaría te abre la puerta. Vamos al bar Roxy.", tone: 'success' },
        { type: 'winLevel' },
      ],
      feedback: "O'Brien era el único sin coartada y con motivo.",
    },
    {
      id: 'd',
      label: 'VARGAS',
      isCorrect: false,
      consequences: [
        { type: 'recordDecision', decisionId: 'detective-final-quiz', optionId: 'd', correct: false },
        { type: 'loseLife' },
        { type: 'dialog', text: 'Vargas era el muerto.', tone: 'error' },
      ],
      feedback: 'Vargas fue la víctima.',
    },
  ],
}

const MORSE: Puzzle = {
  id: 'dt-radio-morse',
  kind: 'morse',
  prompt: 'Mensaje del culpable',
  payload: {
    message: 'KOWALSKI',
    showVisual: true,
    unitMs: 100,
    hint: 'Escuchá la transmisión. Quien confesó por radio.',
  },
  solution: 'KOWALSKI',
  onSolve: [
    { type: 'setFlag', key: 'dt_morse', value: true },
    { type: 'dialog', text: 'KOWALSKI. Confesó por radio. Pero algo no cierra — fijate las coartadas del tablero.', tone: 'success' },
  ],
  onFail: [{ type: 'dialog', text: 'No es eso. Volvé a escuchar.', tone: 'error' }],
}

// Logic deduction via word puzzle. The prompt encodes Einstein-style clues.
const DEDUCTION: Puzzle = {
  id: 'dt-deduction',
  kind: 'word',
  prompt: 'Quién mató a Vargas',
  payload: {
    length: 7,
    hint:
      '4 sospechosos: KOWALSKI, MILLER, OBRIEN, RUIZ. (1) Kowalski confesó pero estaba bebiendo en el bar Roxy. (2) Miller tiene foto en el casino al mismo horario. (3) Ruiz murió hace un mes. (4) Vargas era el muerto. Sin coartada queda uno.',
    bank: ['O', 'B', 'R', 'I', 'E', 'N', 'M', 'A', 'K', 'L'],
  },
  solution: 'OBRIEN',
  onSolve: [
    { type: 'setFlag', key: 'dt_deduce', value: true },
    { type: 'dialog', text: "O'BRIEN. El expediente del caso aparece marcado en el archivero.", tone: 'success' },
  ],
  onFail: [{ type: 'dialog', text: 'No coincide con las coartadas.', tone: 'error' }],
}

// Cipher: O'Brien's case file number encoded with A=1...Z=26.
// "ROXY" → 18·15·24·25 (the bar name appears as evidence chain).
// The player needs to recognize ROXY from the rainy-window dialog.
const CIPHER: Puzzle = {
  id: 'dt-cabinet-cipher',
  kind: 'cipher',
  prompt: 'Número de expediente',
  payload: {
    encrypted: [18, 15, 24, 25],
    hint: 'El último lugar donde fue visto Vargas. Hay un cartel en la ventana.',
  },
  solution: 'ROXY',
  onSolve: [
    { type: 'setFlag', key: 'dt_cipher', value: true },
    { type: 'dialog', text: 'ROXY. El expediente se desbloquea. Hora de salir.', tone: 'success' },
  ],
  onFail: [{ type: 'dialog', text: 'No es esa palabra.', tone: 'error' }],
}

export const LEVEL_21_DETECTIVE: Level = {
  id: 'level-21-detective',
  title: 'Despacho del Detective',
  subtitle: 'Tono: noir · nivel 21',
  tone: 'mystery',
  startRoomId: 'detective',
  rooms: { detective: ROOM },
  decisions: { 'detective-final-quiz': FINAL_QUIZ },
  puzzles: {
    'dt-radio-morse': MORSE,
    'dt-deduction': DEDUCTION,
    'dt-cabinet-cipher': CIPHER,
  },
  initialInventory: [],
  maxLives: 2,
  winCondition: {
    type: 'and',
    children: [
      { type: 'flag', key: 'dt_morse' },
      { type: 'flag', key: 'dt_deduce' },
      { type: 'flag', key: 'dt_cipher' },
    ],
  },
  loseCondition: { type: 'not', child: { type: 'livesAtLeast', n: 1 } },
  intro: {
    text:
      'Llueve sobre la ciudad. Vargas apareció muerto y vos tenés el caso resuelto en 20 minutos. Tres cosas: decodificá la transmisión de radio (alguien confiesa pero miente), deducí el asesino real del tablero de pruebas, y abrí el archivero con el número de expediente cifrado. Una pista te tienta a la respuesta incorrecta — no caigas.',
  },
  outro: {
    good: "Salís al bar Roxy con la orden de arresto. O'Brien te espera fumando.",
    bad: 'Te quedaste sin intentos. El caso queda abierto.',
  },
}
