import type { Decision, Level, Puzzle, Room } from '@/types/game'

/**
 * Nivel 4 — "El Templo Olvidado"
 * Tono: aventura / misterio.
 *
 * Premisa: bajaste a un templo escondido siguiendo un mapa. La puerta de
 * salida está sellada. Tres mecanismos antiguos te separan de la salida:
 *   1. ROTATION — alinear los 3 anillos del altar al norte
 *   2. CIPHER   — descifrar la inscripción usando la estela del alfabeto
 *   3. DOOR     — código de 4 dígitos en el keypad
 *
 * El descifre revela el código de la puerta (cada letra → su número de
 * inscripción; la palabra decodificada genera "1916" usando A=1...Z=26
 * para D·I·O·S → 4·9·15·19... pero el code de la puerta es DISTINTO,
 * dado por otra pista oculta). Para simplificar el primer paso, los 3
 * sistemas son independientes y cada uno setea su flag.
 */

const TEMPLE: Room = {
  id: 'temple',
  name: 'Templo',
  background: 'bg-gradient-to-b from-amber-950 via-zinc-900 to-black',
  sceneKey: 'temple-v1',
  hotspots: [
    {
      // Cipher tablet on left wall — clue
      // SVG (6, 22, 14, 14) → CSS (6, 39%, 14, 25).
      id: 'cipher-tablet',
      x: 6,
      y: 39,
      w: 14,
      h: 25,
      label: 'Inscripción de piedra',
      icon: 'ScrollText',
      cursor: 'look',
      onClick: [
        {
          type: 'dialog',
          text:
            'En la inscripción están grabados, en piedra, cuatro números: 4 · 9 · 15 · 19. Es un mensaje cifrado.',
          tone: 'info',
        },
      ],
    },
    {
      // Alphabet stela on right wall — clue
      // SVG (80, 22, 14, 14) → CSS (80, 39%, 14, 25).
      id: 'stela-alfabeto',
      x: 80,
      y: 39,
      w: 14,
      h: 25,
      label: 'Estela del alfabeto',
      icon: 'BookOpen',
      cursor: 'look',
      onClick: [
        {
          type: 'dialog',
          text:
            'Una estela tallada con el alfabeto: a cada letra le corresponde un número (A=1, B=2 … Z=26). La clave para descifrar.',
          tone: 'info',
        },
      ],
    },
    {
      // 3-ring altar — rotation puzzle
      // SVG (38, 35, 24, 11) — altar block. Rings sit ON TOP at translate(50 30).
      // Hotspot wraps the whole altar/rings area.
      // CSS: x=36, y=42, w=28, h=24 (covers the ring graphic and altar top).
      id: 'altar-rings',
      x: 36,
      y: 42,
      w: 28,
      h: 24,
      label: 'Anillos del altar',
      icon: 'Compass',
      cursor: 'use',
      visibleWhen: { type: 'not', child: { type: 'flag', key: 'temple_rings' } },
      onClick: [{ type: 'startPuzzle', puzzleId: 'temple-rings-puzzle' }],
    },
    {
      // Sealed compartment panel (the cipher entry)
      // SVG (68, 38, 6, 3) → CSS (68, 68%, 6, 5).
      id: 'cipher-panel',
      x: 68,
      y: 68,
      w: 6,
      h: 8,
      label: 'Panel de la cifra',
      icon: 'KeySquare',
      cursor: 'use',
      visibleWhen: { type: 'not', child: { type: 'flag', key: 'temple_cipher' } },
      onClick: [{ type: 'startPuzzle', puzzleId: 'temple-cipher-puzzle' }],
    },
    {
      // Keypad next to sealed door (right of the door)
      // SVG (60, 11, 6, 9) → CSS (60, 20%, 6, 16).
      id: 'door-keypad',
      x: 60,
      y: 20,
      w: 7,
      h: 16,
      label: 'Keypad del portón',
      icon: 'KeyRound',
      cursor: 'use',
      visibleWhen: { type: 'not', child: { type: 'flag', key: 'temple_door' } },
      onClick: [{ type: 'startPuzzle', puzzleId: 'temple-door-puzzle' }],
    },
    {
      // Glowing runes carved into the door's upper face — only visible after
      // the cipher is solved. The SVG renders four amber digits with a halo.
      // SVG ~(42, 10, 16, 4) → CSS (40, 17%, 20, 9).
      id: 'door-runes',
      x: 40,
      y: 17,
      w: 20,
      h: 9,
      label: 'Runas brillantes',
      icon: 'Sparkles',
      cursor: 'look',
      visibleWhen: { type: 'flag', key: 'temple_cipher' },
      onClick: [
        {
          type: 'dialog',
          text:
            'Las runas talladas en el portón brillan ámbar: 7 · 4 · 2 · 1. Ese es el código de salida.',
          tone: 'success',
        },
      ],
    },
    {
      // Final exit: sealed door — only clickable when all 3 systems are solved.
      // SVG (41, 3, 18, 19) → CSS (41, 5%, 18, 35).
      id: 'temple-exit',
      x: 41,
      y: 5,
      w: 18,
      h: 35,
      label: 'Salir del templo',
      icon: 'LogOut',
      cursor: 'enter',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'temple_rings' },
          { type: 'flag', key: 'temple_cipher' },
          { type: 'flag', key: 'temple_door' },
        ],
      },
      onClick: [{ type: 'openDecision', decisionId: 'temple-final-quiz' }],
    },
  ],
}

const FINAL_QUIZ: Decision = {
  id: 'temple-final-quiz',
  prompt:
    'El portón te detiene. Una voz hueca repite la inscripción: "¿qué palabra estaba grabada en la piedra del templo?".',
  options: [
    {
      id: 'a',
      label: 'ALMA',
      isCorrect: false,
      consequences: [
        { type: 'recordDecision', decisionId: 'temple-final-quiz', optionId: 'a', correct: false },
        { type: 'loseLife' },
        { type: 'dialog', text: 'No era esa.', tone: 'error' },
      ],
      feedback: '4-9-15-19 deletreaba otra palabra.',
    },
    {
      id: 'b',
      label: 'DIOS',
      isCorrect: true,
      consequences: [
        { type: 'recordDecision', decisionId: 'temple-final-quiz', optionId: 'b', correct: true },
        {
          type: 'dialog',
          text:
            'DIOS. El portón cede y subís los escalones hacia la selva.',
          tone: 'success',
        },
        { type: 'winLevel' },
      ],
      feedback: '4=D, 9=I, 15=O, 19=S. DIOS.',
    },
    {
      id: 'c',
      label: 'MAGO',
      isCorrect: false,
      consequences: [
        { type: 'recordDecision', decisionId: 'temple-final-quiz', optionId: 'c', correct: false },
        { type: 'loseLife' },
        { type: 'dialog', text: 'No.', tone: 'error' },
      ],
      feedback: 'El cifrado era 4-9-15-19 con A=1...Z=26.',
    },
    {
      id: 'd',
      label: 'REGO',
      isCorrect: false,
      consequences: [
        { type: 'recordDecision', decisionId: 'temple-final-quiz', optionId: 'd', correct: false },
        { type: 'loseLife' },
        { type: 'dialog', text: 'No es esa.', tone: 'error' },
      ],
      feedback: 'La inscripción decía 4-9-15-19.',
    },
  ],
}

const RINGS_PUZZLE: Puzzle = {
  id: 'temple-rings-puzzle',
  kind: 'rotation',
  prompt: 'Anillos del altar',
  payload: {
    // Three rings, increasing difficulty toward the inner ring (more segments).
    rings: [
      { segments: 6, start: 4, target: 0, label: 'Anillo exterior' },
      { segments: 8, start: 5, target: 0, label: 'Anillo medio' },
      { segments: 10, start: 3, target: 0, label: 'Anillo interior' },
    ],
    glyphs: [
      ['☼', '☾', '★', '☽', '☉', '✦'],
      ['◇', '◈', '◆', '◉', '◊', '◌', '◍', '◎'],
      ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ'],
    ],
  },
  solution: '0,0,0',
  onSolve: [
    { type: 'setFlag', key: 'temple_rings', value: true },
    {
      type: 'dialog',
      text:
        'Los tres anillos se alinean con un click sordo. La gema central se enciende verde.',
      tone: 'success',
    },
  ],
}

const CIPHER_PUZZLE: Puzzle = {
  id: 'temple-cipher-puzzle',
  kind: 'cipher',
  prompt: 'Descifrar la inscripción',
  payload: {
    encrypted: [4, 9, 15, 19],
    hint: 'Cada número es la posición de una letra en el alfabeto. A=1, B=2 … Z=26.',
  },
  solution: 'DIOS',
  onSolve: [
    { type: 'setFlag', key: 'temple_cipher', value: true },
    {
      type: 'dialog',
      text:
        'La palabra grabada es "DIOS". El panel se abre. Sobre el portón principal, en el centro, cuatro runas empiezan a brillar — andá a verlas: tienen el código de salida.',
      tone: 'success',
    },
  ],
  onFail: [
    {
      type: 'dialog',
      text: 'La piedra no se mueve. Esa no es la palabra grabada.',
      tone: 'error',
    },
  ],
}

const DOOR_PUZZLE: Puzzle = {
  id: 'temple-door-puzzle',
  kind: 'code',
  prompt: 'Código del portón',
  payload: { length: 4 },
  solution: '7421',
  onSolve: [
    { type: 'setFlag', key: 'temple_door', value: true },
    {
      type: 'dialog',
      text: 'Los engranajes chasquean. El cerrojo de piedra se libera.',
      tone: 'success',
    },
  ],
  onFail: [
    {
      type: 'dialog',
      text: 'Silencio. El keypad rechaza la combinación.',
      tone: 'error',
    },
  ],
}

export const LEVEL_04_TEMPLE: Level = {
  id: 'level-04-temple',
  title: 'El Templo Olvidado',
  subtitle: 'Tono: aventura · nivel 4',
  tone: 'mystery',
  startRoomId: 'temple',
  rooms: { temple: TEMPLE },
  decisions: { 'temple-final-quiz': FINAL_QUIZ },
  puzzles: {
    'temple-rings-puzzle': RINGS_PUZZLE,
    'temple-cipher-puzzle': CIPHER_PUZZLE,
    'temple-door-puzzle': DOOR_PUZZLE,
  },
  initialInventory: [],
  maxLives: 3,
  winCondition: {
    type: 'and',
    children: [
      { type: 'flag', key: 'temple_rings' },
      { type: 'flag', key: 'temple_cipher' },
      { type: 'flag', key: 'temple_door' },
    ],
  },
  loseCondition: { type: 'not', child: { type: 'livesAtLeast', n: 1 } },
  intro: {
    text:
      'Seguiste un mapa polvoriento hasta este templo. La salida atrás de vos se cerró sola. Tres mecanismos antiguos te separan del exterior: un altar de tres anillos, una inscripción cifrada y un portón de piedra. La estela del alfabeto en la pared puede servirte.',
  },
  outro: {
    good:
      'Los tres mecanismos ceden. El portón se mueve hacia atrás liberando un pasaje. La luz del sol te recibe arriba de los escalones.',
    bad: 'Se te terminaron los intentos. El templo guarda su secreto.',
  },
}
