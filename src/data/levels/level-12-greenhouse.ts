import type { Decision, Level, Puzzle, Room } from '@/types/game'

const ROOM: Room = {
  id: 'greenhouse',
  name: 'Invernadero',
  background: 'bg-gradient-to-b from-emerald-900 to-zinc-950',
  sceneKey: 'greenhouse-v1',
  hotspots: [
    {
      id: 'botanical-book',
      x: 6, y: 56, w: 6, h: 8,
      label: 'Libro de botánica',
      icon: 'BookOpen',
      cursor: 'look',
      onClick: [
        {
          type: 'dialog',
          text:
            'En la última página, anotación apurada y casi ilegible: "22 — 9 — 4 — 1".',
          tone: 'info',
        },
      ],
    },
    {
      id: 'jars-shelf',
      x: 68, y: 36, w: 26, h: 14,
      label: 'Estante con receta',
      icon: 'BookOpen',
      cursor: 'look',
      onClick: [
        {
          type: 'dialog',
          text:
            'En la etiqueta del estante, manuscrita: "2·1·8·3". Sin más detalle.',
          tone: 'info',
        },
      ],
    },
    {
      id: 'plant-cipher',
      x: 5, y: 55, w: 22, h: 22,
      label: 'Identificar la planta',
      icon: 'ScrollText',
      cursor: 'use',
      visibleWhen: { type: 'not', child: { type: 'flag', key: 'gh_plant' } },
      onClick: [{ type: 'startPuzzle', puzzleId: 'gh-plant-cipher' }],
    },
    {
      id: 'mortar',
      x: 5, y: 55, w: 22, h: 22,
      label: 'Mezclar antídoto',
      icon: 'Sliders',
      cursor: 'use',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'gh_plant' },
          { type: 'not', child: { type: 'flag', key: 'gh_antidote' } },
        ],
      },
      onClick: [{ type: 'startPuzzle', puzzleId: 'gh-antidote-mix' }],
    },
    {
      id: 'door-keypad',
      x: 58, y: 23, w: 7, h: 14,
      label: 'Keypad de la puerta',
      icon: 'KeyRound',
      cursor: 'use',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'gh_antidote' },
          { type: 'not', child: { type: 'flag', key: 'gh_exit' } },
        ],
      },
      onClick: [{ type: 'startPuzzle', puzzleId: 'gh-exit-code' }],
    },
    {
      id: 'exit-runes',
      x: 42, y: 8, w: 16, h: 8,
      label: 'Cifras tenues sobre la puerta',
      icon: 'Sparkles',
      cursor: 'look',
      visibleWhen: { type: 'flag', key: 'gh_antidote' },
      onClick: [
        { type: 'dialog', text: 'En el marco de hierro de la puerta hay tallados cuatro dígitos tenues: 5 - 0 - 9 - 3.', tone: 'success' },
      ],
    },
    {
      id: 'exit-door',
      x: 42, y: 5, w: 16, h: 40,
      label: 'Salir',
      icon: 'LogOut',
      cursor: 'enter',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'gh_plant' },
          { type: 'flag', key: 'gh_antidote' },
          { type: 'flag', key: 'gh_exit' },
        ],
      },
      onClick: [{ type: 'openDecision', decisionId: 'greenhouse-final-quiz' }],
    },
  ],
}

const FINAL_QUIZ: Decision = {
  id: 'greenhouse-final-quiz',
  prompt:
    'El jardinero del exterior te detiene en el portal con un trapo en la cara: "decime el nombre del antídoto y te dejo respirar el aire de afuera".',
  options: [
    {
      id: 'a',
      label: 'MENTA',
      isCorrect: false,
      consequences: [
        { type: 'recordDecision', decisionId: 'greenhouse-final-quiz', optionId: 'a', correct: false },
        { type: 'loseLife' },
        { type: 'dialog', text: 'No es esa planta.', tone: 'error' },
      ],
      feedback: '22-9-4-1 deletreaba otra palabra.',
    },
    {
      id: 'b',
      label: 'VIDA',
      isCorrect: true,
      consequences: [
        { type: 'recordDecision', decisionId: 'greenhouse-final-quiz', optionId: 'b', correct: true },
        { type: 'dialog', text: 'VIDA. El jardinero te abre el portal. Salís al jardín exterior, respirando.', tone: 'success' },
        { type: 'winLevel' },
      ],
      feedback: '22=V, 9=I, 4=D, 1=A.',
    },
    {
      id: 'c',
      label: 'MIEL',
      isCorrect: false,
      consequences: [
        { type: 'recordDecision', decisionId: 'greenhouse-final-quiz', optionId: 'c', correct: false },
        { type: 'loseLife' },
        { type: 'dialog', text: 'La miel no era el antídoto.', tone: 'error' },
      ],
      feedback: '22=V. Empieza con V.',
    },
    {
      id: 'd',
      label: 'ALBA',
      isCorrect: false,
      consequences: [
        { type: 'recordDecision', decisionId: 'greenhouse-final-quiz', optionId: 'd', correct: false },
        { type: 'loseLife' },
        { type: 'dialog', text: 'No.', tone: 'error' },
      ],
      feedback: 'Eran 4 letras empezando con V.',
    },
  ],
}

// 22-9-4-1 → V·I·D·A → "VIDA" (4 letters, life — irony for poisoned plant)
const PLANT: Puzzle = {
  id: 'gh-plant-cipher',
  kind: 'cipher',
  prompt: 'Nombre de la planta antídoto',
  payload: {
    encrypted: [22, 9, 4, 1],
    hint: 'Cuatro letras. La regla no está en este panel.',
  },
  solution: 'VIDA',
  onSolve: [
    { type: 'setFlag', key: 'gh_plant', value: true },
    { type: 'dialog', text: 'VIDA. La página se ilumina apenas. El mortero queda visible.', tone: 'success' },
  ],
  onFail: [{ type: 'dialog', text: 'No coincide con ningún nombre del herbario.', tone: 'error' }],
}

const ANTIDOTE: Puzzle = {
  id: 'gh-antidote-mix',
  kind: 'slider',
  prompt: 'Preparar el antídoto',
  payload: {
    targets: [2, 1, 8, 3],
    range: { min: 0, max: 9 },
    labels: ['Hojas', 'Raíz', 'Néctar', 'Carbón'],
  },
  solution: '2183',
  onSolve: [
    { type: 'setFlag', key: 'gh_antidote', value: true },
    { type: 'dialog', text: 'La mezcla cambia a verde brillante. La bebés. Las pulsaciones se calman.', tone: 'success' },
  ],
}

const EXIT: Puzzle = {
  id: 'gh-exit-code',
  kind: 'code',
  prompt: 'Cerrojo de la puerta',
  payload: { length: 4 },
  solution: '5093',
  onSolve: [
    { type: 'setFlag', key: 'gh_exit', value: true },
    { type: 'dialog', text: 'El cerrojo de hierro cede.', tone: 'success' },
  ],
  onFail: [{ type: 'dialog', text: 'El cerrojo no se mueve.', tone: 'error' }],
}

export const LEVEL_12_GREENHOUSE: Level = {
  id: 'level-12-greenhouse',
  title: 'Invernadero Envenenado',
  subtitle: 'Tono: misterio botánico · nivel 12',
  tone: 'mystery',
  startRoomId: 'greenhouse',
  rooms: { greenhouse: ROOM },
  decisions: { 'greenhouse-final-quiz': FINAL_QUIZ },
  puzzles: {
    'gh-plant-cipher': PLANT,
    'gh-antidote-mix': ANTIDOTE,
    'gh-exit-code': EXIT,
  },
  initialInventory: [],
  maxLives: 3,
  winCondition: {
    type: 'and',
    children: [
      { type: 'flag', key: 'gh_plant' },
      { type: 'flag', key: 'gh_antidote' },
      { type: 'flag', key: 'gh_exit' },
    ],
  },
  loseCondition: { type: 'not', child: { type: 'livesAtLeast', n: 1 } },
  intro: {
    text:
      'Entraste al invernadero del viejo botánico. Una flor violeta sopló esporas en el aire y las inhalaste. Sentís cómo te marea. El libro de botánica está abierto en una página con un nombre cifrado, y el estante tiene una receta de dosis. Identificá la planta antídoto, mezclala bien, y salí antes que el veneno haga efecto.',
  },
  outro: {
    good: 'La planta VIDA hace honor a su nombre. Salís al jardín exterior, mareado pero respirando.',
    bad: 'El veneno fue más rápido que vos. Las esporas violetas ganaron.',
  },
}
