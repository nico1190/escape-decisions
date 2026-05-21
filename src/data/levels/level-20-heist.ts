import type { Decision, Level, Puzzle, Room } from '@/types/game'

/**
 * Nivel 20 — "Asalto de Precisión"
 * Tono: heist millimétrico.
 *
 * Mecánicas:
 *   - TIMING — bypass de láseres (3 pulsos perfectos)
 *   - MASTERMIND — combinación del dial de la bóveda (4 colores, 8 intentos)
 *   - CODE — override del kiosko de seguridad
 *
 * Difficulty knobs: solo 2 vidas; las pistas para el código están
 * repartidas en posters distintos para que el jugador combine.
 */

const ROOM: Room = {
  id: 'heist',
  name: 'Sala de Bóveda',
  background: 'bg-gradient-to-b from-stone-950 to-black',
  sceneKey: 'heist-v1',
  hotspots: [
    {
      id: 'dial-card',
      x: 28, y: 80, w: 10, h: 12,
      label: 'Tarjeta del crupier',
      icon: 'FileText',
      cursor: 'look',
      onClick: [
        {
          type: 'dialog',
          text: 'Manuscrito en la tarjeta: "rojo · amarillo · verde · azul". Cuatro palabras, sin orden indicado.',
          tone: 'info',
        },
      ],
    },
    {
      id: 'scanner-snippet',
      x: 86, y: 80, w: 10, h: 12,
      label: 'Recorte del scanner',
      icon: 'FileText',
      cursor: 'look',
      onClick: [
        {
          type: 'dialog',
          text: 'En el recorte del scanner policial: "Bóveda VIP — override 9-3-1-6".',
          tone: 'info',
        },
      ],
    },
    {
      id: 'lasers',
      x: 3, y: 25, w: 22, h: 54,
      label: 'Corredor de láseres',
      icon: 'Target',
      cursor: 'use',
      visibleWhen: { type: 'not', child: { type: 'flag', key: 'hs_lasers' } },
      onClick: [{ type: 'startPuzzle', puzzleId: 'hs-lasers-timing' }],
    },
    {
      id: 'vault-dial',
      x: 36, y: 25, w: 28, h: 50,
      label: 'Dial de la bóveda',
      icon: 'Target',
      cursor: 'use',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'hs_lasers' },
          { type: 'not', child: { type: 'flag', key: 'hs_vault' } },
        ],
      },
      onClick: [{ type: 'startPuzzle', puzzleId: 'hs-vault-mastermind' }],
    },
    {
      id: 'security-kiosk',
      x: 73, y: 36, w: 22, h: 36,
      label: 'Kiosco de seguridad',
      icon: 'KeyRound',
      cursor: 'use',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'hs_vault' },
          { type: 'not', child: { type: 'flag', key: 'hs_code' } },
        ],
      },
      onClick: [{ type: 'startPuzzle', puzzleId: 'hs-override-code' }],
    },
    {
      id: 'exit',
      x: 36, y: 30, w: 28, h: 40,
      label: 'Entrar a la bóveda',
      icon: 'LogOut',
      cursor: 'enter',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'hs_lasers' },
          { type: 'flag', key: 'hs_vault' },
          { type: 'flag', key: 'hs_code' },
        ],
      },
      onClick: [{ type: 'openDecision', decisionId: 'heist-final-quiz' }],
    },
  ],
}

const FINAL_QUIZ: Decision = {
  id: 'heist-final-quiz',
  prompt:
    'Tu socio por radio: "antes de tocar el oro, decime el color del cuarto rotor del dial — me lo pidió el comprador".',
  options: [
    {
      id: 'a',
      label: 'rojo',
      isCorrect: false,
      consequences: [
        { type: 'recordDecision', decisionId: 'heist-final-quiz', optionId: 'a', correct: false },
        { type: 'loseLife' },
        { type: 'dialog', text: 'No, ese era el primero.', tone: 'error' },
      ],
      feedback: 'Rojo era el rotor 1, no el 4.',
    },
    {
      id: 'b',
      label: 'amarillo',
      isCorrect: false,
      consequences: [
        { type: 'recordDecision', decisionId: 'heist-final-quiz', optionId: 'b', correct: false },
        { type: 'loseLife' },
        { type: 'dialog', text: 'Amarillo fue el segundo.', tone: 'error' },
      ],
      feedback: 'Era el rotor 2.',
    },
    {
      id: 'c',
      label: 'verde',
      isCorrect: false,
      consequences: [
        { type: 'recordDecision', decisionId: 'heist-final-quiz', optionId: 'c', correct: false },
        { type: 'loseLife' },
        { type: 'dialog', text: 'Verde fue tercero.', tone: 'error' },
      ],
      feedback: 'Era el rotor 3.',
    },
    {
      id: 'd',
      label: 'azul',
      isCorrect: true,
      consequences: [
        { type: 'recordDecision', decisionId: 'heist-final-quiz', optionId: 'd', correct: true },
        { type: 'dialog', text: 'Azul. Confirmado. La bóveda se abre. Lingotes hasta el techo.', tone: 'success' },
        { type: 'winLevel' },
      ],
      feedback: 'rojo → amarillo → verde → AZUL.',
    },
  ],
}

const LASERS: Puzzle = {
  id: 'hs-lasers-timing',
  kind: 'timing',
  prompt: 'Bypass de láseres',
  payload: {
    rounds: [
      { greenSize: 14, greenPos: 50, cycleMs: 1000 },
      { greenSize: 9, greenPos: 50, cycleMs: 750 },
      { greenSize: 6, greenPos: 50, cycleMs: 550 },
    ],
  },
  solution: 'timing-ok',
  onSolve: [
    { type: 'setFlag', key: 'hs_lasers', value: true },
    { type: 'dialog', text: 'Los láseres pasan a verde. Te deslizás bajo el último.', tone: 'success' },
  ],
}

// Mastermind: 4-color sequence. Player has 8 attempts.
// Solution: red, yellow, green, blue (matches the dial card order from level data).
const VAULT: Puzzle = {
  id: 'hs-vault-mastermind',
  kind: 'mastermind',
  prompt: 'Combinación del dial',
  payload: {
    colors: ['red', 'blue', 'yellow', 'green', 'orange', 'purple'],
    codeLength: 4,
    maxAttempts: 8,
  },
  solution: 'red,yellow,green,blue',
  onSolve: [
    { type: 'setFlag', key: 'hs_vault', value: true },
    { type: 'dialog', text: 'Click. El dial gira y se traba. La bóveda está armada.', tone: 'success' },
  ],
}

const OVERRIDE: Puzzle = {
  id: 'hs-override-code',
  kind: 'code',
  prompt: 'Override del kiosco',
  payload: { length: 4 },
  solution: '9316',
  onSolve: [
    { type: 'setFlag', key: 'hs_code', value: true },
    { type: 'dialog', text: 'AUTORIZADO. La puerta hidráulica empieza a abrir.', tone: 'success' },
  ],
  onFail: [{ type: 'dialog', text: 'Rechazado. Una cámara gira hacia vos.', tone: 'error' }],
}

export const LEVEL_20_HEIST: Level = {
  id: 'level-20-heist',
  title: 'Asalto de Precisión',
  subtitle: 'Tono: heist · nivel 20',
  tone: 'mystery',
  startRoomId: 'heist',
  rooms: { heist: ROOM },
  decisions: { 'heist-final-quiz': FINAL_QUIZ },
  puzzles: {
    'hs-lasers-timing': LASERS,
    'hs-vault-mastermind': VAULT,
    'hs-override-code': OVERRIDE,
  },
  initialInventory: [],
  maxLives: 2,
  winCondition: {
    type: 'and',
    children: [
      { type: 'flag', key: 'hs_lasers' },
      { type: 'flag', key: 'hs_vault' },
      { type: 'flag', key: 'hs_code' },
    ],
  },
  loseCondition: { type: 'not', child: { type: 'livesAtLeast', n: 1 } },
  intro: {
    text:
      'Tres minutos antes del cambio de turno. Tres barreras: el corredor de láseres (tres pulsos justos), el dial mecánico de la bóveda (Mastermind: cuatro colores en orden con 8 intentos) y el override del kiosco. Las pistas no están juntas — buscá en distintos rincones. Solo 2 vidas.',
  },
  outro: {
    good: 'Bóveda abierta. Lingotes y joyas hasta el techo. Salís con un bolso pesado.',
    bad: 'La alarma despertó al equipo de respuesta. Manos arriba.',
  },
}
