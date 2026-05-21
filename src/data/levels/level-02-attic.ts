import type { Decision, Level, Puzzle, Room } from '@/types/game'

/**
 * Nivel 2 — "El Desván del Abuelo"
 * Tono: misterio / aventura.
 *
 * Premisa: heredás la casa de tu abuelo. En el desván hay un baúl con tres
 * candados antiguos. Cada candado es un mini-juego distinto:
 *  - Candado de letras → typing word (clue: foto en el escritorio)
 *  - Candado de colores → Simon-style sequence (clue: vitrales del ventanal)
 *  - Candado de números → memory flash (los números aparecen 2.5s y desaparecen)
 *
 * Al abrir los 3, el baúl se entreabre y podés terminar el nivel.
 */

const ATTIC: Room = {
  id: 'attic',
  name: 'Desván',
  background: 'bg-gradient-to-b from-amber-950 to-zinc-950',
  sceneKey: 'attic-v1',
  hotspots: [
    {
      // SMALL real photo on the desk — has the ROSE inscription.
      // SVG (85.2, 31.5, 3.4, 2.6) → CSS (85, 56%, 4, 5).
      id: 'photo-frame-desk',
      x: 85,
      y: 56,
      w: 4,
      h: 5,
      label: 'Foto enmarcada',
      icon: 'Image',
      cursor: 'look',
      onClick: [
        {
          type: 'dialog',
          text:
            'A small sepia photo. Your grandfather, very young, next to a girl. On the back, a faded handwriting in English: "For my dear ROSE — summer of \'52."',
          tone: 'info',
        },
      ],
    },
    {
      // DECOY frame #1 — landscape painting on the wall (upper-right).
      // SVG (89, 14, 8, 6) → CSS (89, 25%, 8, 11).
      id: 'painting-landscape',
      x: 89,
      y: 25,
      w: 8,
      h: 11,
      label: 'Cuadro de paisaje',
      icon: 'Mountain',
      cursor: 'look',
      onClick: [
        {
          type: 'dialog',
          text:
            'Un paisaje pintado al óleo: montañas al atardecer. Sin firma, sin notas. Solo un cuadro viejo.',
          tone: 'info',
        },
      ],
    },
    {
      // DECOY frame #2 — family portrait leaning on suitcases (left).
      // SVG (16, 22, 5, 6) → CSS (15, 39%, 7, 12).
      id: 'portrait-family',
      x: 15,
      y: 39,
      w: 7,
      h: 12,
      label: 'Retrato apoyado',
      icon: 'Image',
      cursor: 'look',
      onClick: [
        {
          type: 'dialog',
          text:
            'Un retrato familiar viejo: tu bisabuelo, en uniforme militar. Solo eso, sin inscripciones ni fechas atrás.',
          tone: 'info',
        },
      ],
    },
    {
      id: 'pocket-watch',
      // Watch at SVG (92, 32, 2.8, 2.8) → CSS (90.5, 56%, 5, 6).
      x: 90.5,
      y: 56,
      w: 5,
      h: 6,
      label: 'Reloj de bolsillo',
      icon: 'Watch',
      cursor: 'look',
      onClick: [
        {
          type: 'dialog',
          text:
            'Un reloj de bolsillo de oro. En la tapa interior, grabado a mano: "5 - 2 - 8 - 1". No marca la hora, solo eso.',
          tone: 'info',
        },
      ],
    },
    {
      id: 'stained-window',
      x: 44,
      y: 28,
      w: 12,
      h: 22,
      label: 'Ventanal de vitrales',
      icon: 'Sun',
      cursor: 'look',
      onClick: [
        {
          type: 'dialog',
          text:
            'Te acercás y mirás de cerca: las cinco cuñas del ventanal van, desde arriba en sentido horario, rojo → amarillo → azul → verde → violeta. Memorizá el orden.',
          tone: 'info',
        },
      ],
    },
    // ─── 3 padlocks on the trunk ───
    {
      id: 'lock-letters',
      // Padlock 1 at SVG (37, 39.5, 6, 9.5) → CSS (37, 70%, 6, 17).
      x: 37,
      y: 70,
      w: 6,
      h: 17,
      label: 'Candado de letras',
      icon: 'KeyRound',
      cursor: 'use',
      visibleWhen: { type: 'not', child: { type: 'flag', key: 'lock_letters' } },
      onClick: [{ type: 'startPuzzle', puzzleId: 'lock-letters-puzzle' }],
    },
    {
      id: 'lock-colors',
      x: 47,
      y: 70,
      w: 6,
      h: 17,
      label: 'Candado de colores',
      icon: 'Palette',
      cursor: 'use',
      visibleWhen: { type: 'not', child: { type: 'flag', key: 'lock_colors' } },
      onClick: [{ type: 'startPuzzle', puzzleId: 'lock-colors-puzzle' }],
    },
    {
      id: 'lock-numbers',
      x: 57,
      y: 70,
      w: 6,
      h: 17,
      label: 'Candado de números',
      icon: 'Hash',
      cursor: 'use',
      visibleWhen: { type: 'not', child: { type: 'flag', key: 'lock_numbers' } },
      onClick: [{ type: 'startPuzzle', puzzleId: 'lock-numbers-puzzle' }],
    },
    // The trunk itself (only clickable when all locks open)
    {
      id: 'trunk-open',
      // Trunk body at SVG (32, 32, 36, 20) → CSS (32, 57%, 36, 36).
      x: 32,
      y: 57,
      w: 36,
      h: 13,
      label: 'Abrir el baúl',
      icon: 'PackageOpen',
      cursor: 'enter',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'lock_letters' },
          { type: 'flag', key: 'lock_colors' },
          { type: 'flag', key: 'lock_numbers' },
        ],
      },
      onClick: [{ type: 'openDecision', decisionId: 'attic-final-quiz' }],
    },
  ],
}

const FINAL_QUIZ: Decision = {
  id: 'attic-final-quiz',
  prompt:
    'Antes de tocar el baúl, parate. La voz del abuelo te queda en la cabeza: "¿de qué año era la foto del verano con Rose?". Si no podés responder, no merecés lo de adentro.',
  options: [
    {
      id: 'a',
      label: '1948',
      isCorrect: false,
      consequences: [
        { type: 'recordDecision', decisionId: 'attic-final-quiz', optionId: 'a', correct: false },
        { type: 'loseLife' },
        { type: 'dialog', text: 'La nota decía claramente "summer of \'52". Probá de nuevo.', tone: 'error' },
      ],
      feedback: 'La inscripción al dorso de la foto decía "summer of \'52".',
    },
    {
      id: 'b',
      label: '1952',
      isCorrect: true,
      consequences: [
        { type: 'recordDecision', decisionId: 'attic-final-quiz', optionId: 'b', correct: true },
        {
          type: 'dialog',
          text:
            'Sí, verano del 52. Levantás la tapa. Adentro hay cartas, fotos y la vieja medalla de tu abuelo. Todo en orden.',
          tone: 'success',
        },
        { type: 'winLevel' },
      ],
      feedback: '"For my dear ROSE — summer of \'52". Exacto.',
    },
    {
      id: 'c',
      label: '1968',
      isCorrect: false,
      consequences: [
        { type: 'recordDecision', decisionId: 'attic-final-quiz', optionId: 'c', correct: false },
        { type: 'loseLife' },
        { type: 'dialog', text: 'La foto era mucho más vieja. Mirala otra vez.', tone: 'error' },
      ],
      feedback: '"summer of \'52" en la foto sepia.',
    },
    {
      id: 'd',
      label: '1974',
      isCorrect: false,
      consequences: [
        { type: 'recordDecision', decisionId: 'attic-final-quiz', optionId: 'd', correct: false },
        { type: 'loseLife' },
        { type: 'dialog', text: 'Para esa fecha el abuelo ya era viejo.', tone: 'error' },
      ],
      feedback: '"summer of \'52" — está en el reverso del marco.',
    },
  ],
}

const LOCK_LETTERS_PUZZLE: Puzzle = {
  id: 'lock-letters-puzzle',
  kind: 'word',
  prompt: 'Candado de letras',
  payload: {
    length: 4,
    hint: 'A name written somewhere in the attic — in English.',
    bank: ['R', 'O', 'S', 'E', 'V', 'L', 'D', 'A', 'M', 'N'],
  },
  solution: 'ROSE',
  onSolve: [
    { type: 'setFlag', key: 'lock_letters', value: true },
    {
      type: 'dialog',
      text: 'El candado de letras cede con un click suave. Un menos.',
      tone: 'success',
    },
  ],
  onFail: [
    {
      type: 'dialog',
      text: 'El candado no se mueve. Esa palabra no es.',
      tone: 'error',
    },
  ],
}

const LOCK_COLORS_PUZZLE: Puzzle = {
  id: 'lock-colors-puzzle',
  kind: 'color-sequence',
  prompt: 'Candado de colores',
  payload: {
    palette: ['red', 'yellow', 'blue', 'green', 'purple'],
    // Same order as the stained glass clockwise.
    sequence: ['red', 'yellow', 'blue', 'green', 'purple'],
  },
  solution: 'red,yellow,blue,green,purple',
  onSolve: [
    { type: 'setFlag', key: 'lock_colors', value: true },
    {
      type: 'dialog',
      text: 'Los discos del candado giran solos y se alinean. Otro menos.',
      tone: 'success',
    },
  ],
  onFail: [
    {
      type: 'dialog',
      text: 'Orden incorrecto. El candado vuelve a su posición inicial.',
      tone: 'error',
    },
  ],
}

const LOCK_NUMBERS_PUZZLE: Puzzle = {
  id: 'lock-numbers-puzzle',
  kind: 'memory',
  prompt: 'Candado de números',
  payload: {
    // The watch hint already gives the digits in the right order (5-2-8-1).
    // The flash here is a feint: shown reversed (1-8-2-5) and SUPER fast.
    // If you didn't read the watch, the flash trolls you into entering the
    // wrong number. The actual solution is 5281, from the watch.
    numbers: [5, 2, 8, 1],
    showMs: 550,
    reverseDisplay: true,
  },
  solution: '5281',
  onSolve: [
    { type: 'setFlag', key: 'lock_numbers', value: true },
    {
      type: 'dialog',
      text: 'Los dígitos coinciden. El último candado se abre. El baúl tiembla.',
      tone: 'success',
    },
  ],
  onFail: [
    {
      type: 'dialog',
      text: 'No es la secuencia. Probá de nuevo cuando estés listo.',
      tone: 'error',
    },
  ],
}

export const LEVEL_02_ATTIC: Level = {
  id: 'level-02-attic',
  title: 'El Desván del Abuelo',
  subtitle: 'Tono: misterio · nivel 2',
  tone: 'mystery',
  startRoomId: 'attic',
  rooms: { attic: ATTIC },
  decisions: { 'attic-final-quiz': FINAL_QUIZ },
  puzzles: {
    'lock-letters-puzzle': LOCK_LETTERS_PUZZLE,
    'lock-colors-puzzle': LOCK_COLORS_PUZZLE,
    'lock-numbers-puzzle': LOCK_NUMBERS_PUZZLE,
  },
  initialInventory: [],
  maxLives: 3,
  // The trunk is opened manually via the trunk-open hotspot, which fires
  // winLevel. The auto-detection condition mirrors its visibleWhen.
  winCondition: {
    type: 'and',
    children: [
      { type: 'flag', key: 'lock_letters' },
      { type: 'flag', key: 'lock_colors' },
      { type: 'flag', key: 'lock_numbers' },
    ],
  },
  loseCondition: { type: 'not', child: { type: 'livesAtLeast', n: 1 } },
  intro: {
    text:
      'Heredaste la casa de tu abuelo. El desván huele a madera vieja y a polvo. En el centro: un baúl cerrado con tres candados antiguos. Algo te dice que adentro hay algo que él guardaba para vos.',
  },
  outro: {
    good:
      'El baúl guardaba cartas, fotos y una medalla. Cosas que el abuelo decidió pasarte. Misión cumplida.',
    bad: 'No lograste abrir el baúl. El secreto se queda con él.',
  },
}
