import type { Decision, Level, Puzzle, Room } from '@/types/game'

const ROOM: Room = {
  id: 'lab',
  name: 'Laboratorio Σ',
  background: 'bg-gradient-to-b from-slate-950 to-black',
  sceneKey: 'lab-v1',
  darkness: { lightSourceItem: 'flashlight' },
  hotspots: [
    {
      id: 'toolbox',
      x: 22, y: 78, w: 6, h: 8,
      label: 'Caja SAFE',
      icon: 'Wrench',
      cursor: 'grab',
      visibleWhen: { type: 'lacksItem', itemId: 'flashlight' },
      onClick: [
        { type: 'addItem', itemId: 'flashlight' },
        { type: 'dialog', text: 'Linterna industrial. La oscuridad del lab se vuelve manejable.', tone: 'success' },
      ],
    },
    {
      id: 'reset-button',
      x: 38, y: 76, w: 10, h: 11,
      label: 'Botón de reinicio',
      icon: 'Brain',
      cursor: 'use',
      visibleWhen: { type: 'not', child: { type: 'flag', key: 'lab_reset' } },
      onClick: [{ type: 'startPuzzle', puzzleId: 'lab-reset-memory' }],
    },
    {
      id: 'mainframe',
      x: 26, y: 14, w: 24, h: 39,
      label: 'Mainframe Σ',
      icon: 'Cable',
      cursor: 'use',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'lab_reset' },
          { type: 'not', child: { type: 'flag', key: 'lab_power' } },
        ],
      },
      onClick: [{ type: 'startPuzzle', puzzleId: 'lab-power-wires' }],
    },
    {
      id: 'centrifuge',
      x: 52, y: 36, w: 16, h: 26,
      label: 'Centrífuga',
      icon: 'Sliders',
      cursor: 'use',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'lab_power' },
          { type: 'not', child: { type: 'flag', key: 'lab_sample' } },
        ],
      },
      onClick: [{ type: 'startPuzzle', puzzleId: 'lab-sample-sliders' }],
    },
    {
      id: 'whiteboard',
      x: 51, y: 76, w: 14, h: 13,
      label: 'Pizarra del proyecto',
      icon: 'BookOpen',
      cursor: 'look',
      visibleWhen: { type: 'flag', key: 'lab_power' },
      onClick: [
        {
          type: 'dialog',
          text:
            'En la pizarra, escrito a marcador rojo: 19 · 15 · 13 · 1.',
          tone: 'info',
        },
      ],
    },
    {
      id: 'codename-cipher',
      x: 26, y: 28, w: 24, h: 28,
      label: 'Consola Σ — descifrar nombre',
      icon: 'ScrollText',
      cursor: 'use',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'lab_power' },
          { type: 'not', child: { type: 'flag', key: 'lab_codename' } },
        ],
      },
      onClick: [{ type: 'startPuzzle', puzzleId: 'lab-codename-cipher' }],
    },
    {
      id: 'door-keypad',
      x: 76, y: 50, w: 20, h: 22,
      label: 'Keypad de contención',
      icon: 'KeyRound',
      cursor: 'use',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'lab_codename' },
          { type: 'not', child: { type: 'flag', key: 'lab_door' } },
        ],
      },
      onClick: [{ type: 'startPuzzle', puzzleId: 'lab-door-code' }],
    },
    {
      id: 'door-runes',
      x: 76, y: 8, w: 20, h: 8,
      label: 'Código sobre la puerta',
      icon: 'Sparkles',
      cursor: 'look',
      visibleWhen: { type: 'flag', key: 'lab_codename' },
      onClick: [
        { type: 'dialog', text: 'Sobre la puerta brillan, en ámbar: Σ · 4 · 7 · 2 · 8.', tone: 'success' },
      ],
    },
    {
      id: 'exit',
      x: 76, y: 14, w: 20, h: 60,
      label: 'Pasar la contención',
      icon: 'LogOut',
      cursor: 'enter',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'lab_reset' },
          { type: 'flag', key: 'lab_power' },
          { type: 'flag', key: 'lab_sample' },
          { type: 'flag', key: 'lab_codename' },
          { type: 'flag', key: 'lab_door' },
        ],
      },
      onClick: [{ type: 'openDecision', decisionId: 'lab-final-quiz' }],
    },
  ],
}

const FINAL_QUIZ: Decision = {
  id: 'lab-final-quiz',
  prompt:
    'La compuerta no se mueve. La AI de bioseguridad pide la confirmación final: "¿cómo se llamaba el proyecto Σ?".',
  options: [
    {
      id: 'a',
      label: 'ALMA',
      isCorrect: false,
      consequences: [
        { type: 'recordDecision', decisionId: 'lab-final-quiz', optionId: 'a', correct: false },
        { type: 'loseLife' },
        { type: 'dialog', text: 'No es el codename.', tone: 'error' },
      ],
      feedback: 'El cifrado 19-15-13-1 deletreaba otro nombre.',
    },
    {
      id: 'b',
      label: 'SOMA',
      isCorrect: true,
      consequences: [
        { type: 'recordDecision', decisionId: 'lab-final-quiz', optionId: 'b', correct: true },
        { type: 'dialog', text: 'SOMA. La compuerta se descomprime. Salís sin haber liberado nada al exterior. Misión Σ: limpia.', tone: 'success' },
        { type: 'winLevel' },
      ],
      feedback: '19=S, 15=O, 13=M, 1=A.',
    },
    {
      id: 'c',
      label: 'AURA',
      isCorrect: false,
      consequences: [
        { type: 'recordDecision', decisionId: 'lab-final-quiz', optionId: 'c', correct: false },
        { type: 'loseLife' },
        { type: 'dialog', text: 'No coincide.', tone: 'error' },
      ],
      feedback: 'La pizarra mostraba 19-15-13-1.',
    },
    {
      id: 'd',
      label: 'ZETA',
      isCorrect: false,
      consequences: [
        { type: 'recordDecision', decisionId: 'lab-final-quiz', optionId: 'd', correct: false },
        { type: 'loseLife' },
        { type: 'dialog', text: 'La letra griega está en el logo, no en el nombre.', tone: 'error' },
      ],
      feedback: 'El nombre era SOMA.',
    },
  ],
}

const RESET: Puzzle = {
  id: 'lab-reset-memory',
  kind: 'memory',
  prompt: 'Secuencia de reinicio',
  payload: {
    numbers: [4, 1, 9, 7, 3],
    showMs: 1000,
    reverseDisplay: false,
  },
  solution: '41973',
  onSolve: [
    { type: 'setFlag', key: 'lab_reset', value: true },
    { type: 'dialog', text: 'Reset aceptado. Las luces parpadean. El mainframe queda accesible.', tone: 'success' },
  ],
}

const POWER: Puzzle = {
  id: 'lab-power-wires',
  kind: 'wire',
  prompt: 'Restaurar el mainframe',
  payload: {
    leftColors: ['red', 'blue', 'yellow', 'green', 'purple', 'orange'],
    rightColors: ['orange', 'yellow', 'purple', 'red', 'green', 'blue'],
    matchRule: 'reverse-alphabetical',
  },
  solution: 'wired',
  onSolve: [
    { type: 'setFlag', key: 'lab_power', value: true },
    { type: 'dialog', text: 'El mainframe vuelve. La pizarra del proyecto se ilumina. La centrífuga queda calibrable.', tone: 'success' },
  ],
  onFail: [{ type: 'dialog', text: 'Chispazo. Algún cable está mal — probá otra combinación.', tone: 'error' }],
}

const SAMPLE: Puzzle = {
  id: 'lab-sample-sliders',
  kind: 'slider',
  prompt: 'Calibrar la centrífuga',
  payload: {
    targets: [12, 37, 5, 24],
    range: { min: 0, max: 50 },
    labels: ['RPM I', 'RPM II', 'Temp', 'pH'],
  },
  solution: '12·37·5·24',
  onSolve: [
    { type: 'setFlag', key: 'lab_sample', value: true },
    { type: 'dialog', text: 'La muestra Σ se estabiliza. Los reactivos dejan de hervir.', tone: 'success' },
  ],
}

// 19 15 13 1 → S O M A → "SOMA"
const CODENAME: Puzzle = {
  id: 'lab-codename-cipher',
  kind: 'cipher',
  prompt: 'Nombre del proyecto',
  payload: {
    encrypted: [19, 15, 13, 1],
    hint: 'Mirá la pizarra. Buscá la regla en otra parte.',
  },
  solution: 'SOMA',
  onSolve: [
    { type: 'setFlag', key: 'lab_codename', value: true },
    { type: 'dialog', text: 'Proyecto SOMA. Sobre la puerta de contención aparece el código de salida.', tone: 'success' },
  ],
  onFail: [{ type: 'dialog', text: 'Ese nombre no figura en los registros.', tone: 'error' }],
}

const DOOR: Puzzle = {
  id: 'lab-door-code',
  kind: 'code',
  prompt: 'Compuerta de contención',
  payload: { length: 4 },
  solution: '4728',
  onSolve: [
    { type: 'setFlag', key: 'lab_door', value: true },
    { type: 'dialog', text: 'La esclusa siseando se prepara para descomprimir.', tone: 'success' },
  ],
  onFail: [{ type: 'dialog', text: 'Acceso denegado. Una sirena lejana suena.', tone: 'error' }],
}

export const LEVEL_11_LAB: Level = {
  id: 'level-11-lab',
  title: 'Laboratorio Σ',
  subtitle: 'Tono: sci-horror · nivel 11 · final',
  tone: 'mystery',
  startRoomId: 'lab',
  rooms: { lab: ROOM },
  decisions: { 'lab-final-quiz': FINAL_QUIZ },
  puzzles: {
    'lab-reset-memory': RESET,
    'lab-power-wires': POWER,
    'lab-sample-sliders': SAMPLE,
    'lab-codename-cipher': CODENAME,
    'lab-door-code': DOOR,
  },
  initialInventory: [],
  maxLives: 3,
  winCondition: {
    type: 'and',
    children: [
      { type: 'flag', key: 'lab_reset' },
      { type: 'flag', key: 'lab_power' },
      { type: 'flag', key: 'lab_sample' },
      { type: 'flag', key: 'lab_codename' },
      { type: 'flag', key: 'lab_door' },
    ],
  },
  loseCondition: { type: 'not', child: { type: 'livesAtLeast', n: 1 } },
  intro: {
    text:
      'Final. Laboratorio Σ — un nivel-cuatro de bioseguridad sin energía y a oscuras. Para evitar una catástrofe tenés que, en ORDEN: reiniciar la secuencia, restaurar el mainframe, calibrar la centrífuga, descifrar el nombre del proyecto y atravesar la compuerta de contención. Cinco puzzles encadenados — cada uno desbloquea el siguiente.',
  },
  outro: {
    good: 'Saliste por la esclusa. Detrás tuyo, el laboratorio queda sellado y la muestra Σ contenida. Misión limpia.',
    bad: 'Algo se filtró. El laboratorio queda en cuarentena con vos adentro.',
  },
}
