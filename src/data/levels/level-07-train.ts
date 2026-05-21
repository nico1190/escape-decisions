import type { Decision, Level, Puzzle, Room } from '@/types/game'

const ROOM: Room = {
  id: 'train',
  name: 'Compartimento',
  background: 'bg-gradient-to-b from-amber-950 to-black',
  sceneKey: 'train-v1',
  hotspots: [
    {
      id: 'photo-suspect',
      x: 36, y: 11, w: 10, h: 22,
      label: 'Foto del sospechoso',
      icon: 'Image',
      cursor: 'look',
      onClick: [
        {
          type: 'dialog',
          text:
            'En la foto, una placa pegada con cinta dice: "Inv. M·O·N·D". Es un nombre apellido, parece.',
          tone: 'info',
        },
      ],
    },
    {
      id: 'ticket-clue',
      x: 41, y: 75, w: 12, h: 7,
      label: 'Ticket sobre la mesa',
      icon: 'FileText',
      cursor: 'look',
      onClick: [
        {
          type: 'dialog',
          text:
            'En el ticket están las posiciones: 11 · 05 · 22 · 05 · 14 · 13. Son seis números. Hay 6 letras escondidas.',
          tone: 'info',
        },
      ],
    },
    {
      id: 'name-cipher',
      x: 36, y: 50, w: 32, h: 25,
      label: 'Asiento — descifrar el nombre',
      icon: 'ScrollText',
      cursor: 'use',
      visibleWhen: { type: 'not', child: { type: 'flag', key: 'tr_ticket' } },
      onClick: [{ type: 'startPuzzle', puzzleId: 'tr-name-cipher' }],
    },
    {
      id: 'suspect-memory',
      x: 3, y: 78, w: 14, h: 11,
      label: 'Expediente del sospechoso',
      icon: 'Brain',
      cursor: 'use',
      visibleWhen: { type: 'not', child: { type: 'flag', key: 'tr_suspect' } },
      onClick: [{ type: 'startPuzzle', puzzleId: 'tr-suspect-memory' }],
    },
    {
      id: 'trunk-display',
      x: 72, y: 53, w: 22, h: 14,
      label: 'Display sobre el baúl',
      icon: 'Sparkles',
      cursor: 'look',
      visibleWhen: { type: 'flag', key: 'tr_suspect' },
      onClick: [
        {
          type: 'dialog',
          text: 'Sobre el baúl brillan cuatro dígitos parpadeantes: 6 — 4 — 9 — 1.',
          tone: 'success',
        },
      ],
    },
    {
      id: 'trunk-code',
      x: 72, y: 67, w: 22, h: 18,
      label: 'Cerradura del baúl',
      icon: 'KeyRound',
      cursor: 'use',
      visibleWhen: { type: 'not', child: { type: 'flag', key: 'tr_trunk' } },
      onClick: [{ type: 'startPuzzle', puzzleId: 'tr-trunk-code' }],
    },
    {
      id: 'exit',
      x: 3, y: 52, w: 6, h: 22,
      label: 'Vagón siguiente',
      icon: 'LogOut',
      cursor: 'enter',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'tr_ticket' },
          { type: 'flag', key: 'tr_suspect' },
          { type: 'flag', key: 'tr_trunk' },
        ],
      },
      onClick: [{ type: 'openDecision', decisionId: 'train-final-quiz' }],
    },
  ],
}

const FINAL_QUIZ: Decision = {
  id: 'train-final-quiz',
  prompt:
    'El conductor te detiene en el pasillo, linterna en mano: "para dejarte pasar al otro vagón decime el alias del asesino que descifraste en el ticket".',
  options: [
    {
      id: 'a',
      label: 'ZORRO',
      isCorrect: false,
      consequences: [
        { type: 'recordDecision', decisionId: 'train-final-quiz', optionId: 'a', correct: false },
        { type: 'loseLife' },
        { type: 'dialog', text: 'El conductor te clava la mirada. No.', tone: 'error' },
      ],
      feedback: 'El ticket marcaba 22-9-5-14-20-15.',
    },
    {
      id: 'b',
      label: 'TROVADOR',
      isCorrect: false,
      consequences: [
        { type: 'recordDecision', decisionId: 'train-final-quiz', optionId: 'b', correct: false },
        { type: 'loseLife' },
        { type: 'dialog', text: 'No. Otra vez.', tone: 'error' },
      ],
      feedback: 'Eran 6 letras: 22-9-5-14-20-15.',
    },
    {
      id: 'c',
      label: 'VIENTO',
      isCorrect: true,
      consequences: [
        { type: 'recordDecision', decisionId: 'train-final-quiz', optionId: 'c', correct: true },
        { type: 'dialog', text: 'VIENTO. El conductor abre la puerta del vagón. El asesino te espera del otro lado.', tone: 'success' },
        { type: 'winLevel' },
      ],
      feedback: '22=V, 9=I, 5=E, 14=N, 20=T, 15=O.',
    },
    {
      id: 'd',
      label: 'CUERVO',
      isCorrect: false,
      consequences: [
        { type: 'recordDecision', decisionId: 'train-final-quiz', optionId: 'd', correct: false },
        { type: 'loseLife' },
        { type: 'dialog', text: 'Ese era otro caso.', tone: 'error' },
      ],
      feedback: '22=V, 9=I. Empieza con V.',
    },
  ],
}

// 11·05·22·05·14·13 → K·E·V·E·N·M → uh, that's weird. Let me use 13·05·14·09·13·09 → MEMINM... no.
// Let me pick a clean 6-letter word. "ROMANS" → R(18) O(15) M(13) A(1) N(14) S(19)
// Encrypted: 18-15-13-01-14-19 → "ROMANS"... or 11-05-22-05-14-13 → K E V E N M (nope)
// Let me redo: solution "VIENTO" (6 letters, Spanish, fits mystery vibe)
// V=22, I=9, E=5, N=14, T=20, O=15 → encrypted 22-9-5-14-20-15
// I'll use that.

const NAME_CIPHER: Puzzle = {
  id: 'tr-name-cipher',
  kind: 'cipher',
  prompt: 'Descifrar el alias del sospechoso',
  payload: {
    encrypted: [22, 9, 5, 14, 20, 15],
    hint: 'A = 01 … Z = 26. Seis letras forman el alias.',
  },
  solution: 'VIENTO',
  onSolve: [
    { type: 'setFlag', key: 'tr_ticket', value: true },
    { type: 'dialog', text: 'El alias era VIENTO — un viejo asesino a sueldo que se cree muerto.', tone: 'success' },
  ],
  onFail: [{ type: 'dialog', text: 'No cuadra con la fotografía.', tone: 'error' }],
}

const SUSPECT_MEMORY: Puzzle = {
  id: 'tr-suspect-memory',
  kind: 'memory',
  prompt: 'Memorizar el expediente',
  payload: {
    numbers: [3, 9, 1, 7, 4],
    showMs: 1300,
    reverseDisplay: false,
  },
  solution: '39174',
  onSolve: [
    { type: 'setFlag', key: 'tr_suspect', value: true },
    {
      type: 'dialog',
      text:
        'Coincide. Sobre la tapa del baúl, las cifras se encienden y forman el código: 6 — 4 — 9 — 1. Probalo en la cerradura.',
      tone: 'success',
    },
  ],
}

const TRUNK: Puzzle = {
  id: 'tr-trunk-code',
  kind: 'code',
  prompt: 'Cerradura del baúl',
  payload: { length: 4 },
  solution: '6491',
  onSolve: [
    { type: 'setFlag', key: 'tr_trunk', value: true },
    { type: 'dialog', text: 'El baúl se abre. Dentro: documentos, dinero, y un revólver con iniciales.', tone: 'success' },
  ],
  onFail: [{ type: 'dialog', text: 'El baúl no cede.', tone: 'error' }],
}

export const LEVEL_07_TRAIN: Level = {
  id: 'level-07-train',
  title: 'Tren Nocturno',
  subtitle: 'Tono: whodunit · nivel 7',
  tone: 'mystery',
  startRoomId: 'train',
  rooms: { train: ROOM },
  decisions: { 'train-final-quiz': FINAL_QUIZ },
  puzzles: {
    'tr-name-cipher': NAME_CIPHER,
    'tr-suspect-memory': SUSPECT_MEMORY,
    'tr-trunk-code': TRUNK,
  },
  initialInventory: [],
  maxLives: 3,
  winCondition: {
    type: 'and',
    children: [
      { type: 'flag', key: 'tr_ticket' },
      { type: 'flag', key: 'tr_suspect' },
      { type: 'flag', key: 'tr_trunk' },
    ],
  },
  loseCondition: { type: 'not', child: { type: 'livesAtLeast', n: 1 } },
  intro: {
    text:
      'El tren cruza la pampa de madrugada. En tu compartimento dejaron un ticket con números, una foto y un baúl. Tres pistas para identificar al pasajero del compartimento contiguo: el asesino del tren.',
  },
  outro: {
    good: 'Cerrás el baúl con la evidencia. El revólver con iniciales V.A. — VIENTO está acá. Movés al pasillo a confrontarlo.',
    bad: 'El tren llegó antes que vos. El sospechoso se bajó en la próxima estación.',
  },
}
