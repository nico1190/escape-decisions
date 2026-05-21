import type { Decision, Level, Puzzle, Room } from '@/types/game'

const ROOM: Room = {
  id: 'casino',
  name: 'Bóveda VIP',
  background: 'bg-gradient-to-b from-purple-950 to-black',
  sceneKey: 'casino-v1',
  hotspots: [
    {
      id: 'dealer-card',
      x: 43, y: 83, w: 8, h: 14,
      label: 'Carta del crupier',
      icon: 'FileText',
      cursor: 'look',
      onClick: [
        {
          type: 'dialog',
          text:
            'En la carta caída, garabateado al dorso: "7 · 2 · 5 · 9".',
          tone: 'info',
        },
      ],
    },
    {
      id: 'alarm-panel',
      x: 28, y: 25, w: 14, h: 25,
      label: 'Panel de la alarma',
      icon: 'Cable',
      cursor: 'use',
      visibleWhen: { type: 'not', child: { type: 'flag', key: 'cas_alarm' } },
      onClick: [{ type: 'startPuzzle', puzzleId: 'cas-alarm-wires' }],
    },
    {
      id: 'vault-dial',
      x: 60, y: 28, w: 22, h: 30,
      label: 'Dial de la bóveda',
      icon: 'Sliders',
      cursor: 'use',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'cas_alarm' },
          { type: 'not', child: { type: 'flag', key: 'cas_dial' } },
        ],
      },
      onClick: [{ type: 'startPuzzle', puzzleId: 'cas-vault-dial' }],
    },
    {
      id: 'vault-keypad',
      x: 81, y: 28, w: 8, h: 18,
      label: 'Keypad de la bóveda',
      icon: 'KeyRound',
      cursor: 'use',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'cas_dial' },
          { type: 'not', child: { type: 'flag', key: 'cas_vault' } },
        ],
      },
      onClick: [{ type: 'startPuzzle', puzzleId: 'cas-vault-code' }],
    },
    {
      id: 'vault-runes',
      x: 60, y: 68, w: 22, h: 10,
      label: 'Combinación parpadeante',
      icon: 'Sparkles',
      cursor: 'look',
      visibleWhen: { type: 'flag', key: 'cas_dial' },
      onClick: [
        { type: 'dialog', text: 'En la lectura biométrica titilan cuatro dígitos: 9 - 6 - 3 - 0.', tone: 'success' },
      ],
    },
    {
      id: 'exit',
      x: 56, y: 22, w: 28, h: 56,
      label: 'Entrar a la bóveda',
      icon: 'LogOut',
      cursor: 'enter',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'cas_alarm' },
          { type: 'flag', key: 'cas_dial' },
          { type: 'flag', key: 'cas_vault' },
        ],
      },
      onClick: [{ type: 'openDecision', decisionId: 'casino-final-quiz' }],
    },
  ],
}

const FINAL_QUIZ: Decision = {
  id: 'casino-final-quiz',
  prompt:
    'Tu socio en el auto te grita por radio antes de tocar la bóveda: "decime la hora exacta a la que el casino quedó vacío según el plan, sino me piro".',
  options: [
    {
      id: 'a',
      label: '1 AM',
      isCorrect: false,
      consequences: [
        { type: 'recordDecision', decisionId: 'casino-final-quiz', optionId: 'a', correct: false },
        { type: 'loseLife' },
        { type: 'dialog', text: 'Demasiado temprano. Tu socio cuelga.', tone: 'error' },
      ],
      feedback: 'El intro decía 3 AM.',
    },
    {
      id: 'b',
      label: '3 AM',
      isCorrect: true,
      consequences: [
        { type: 'recordDecision', decisionId: 'casino-final-quiz', optionId: 'b', correct: true },
        { type: 'dialog', text: '3 AM. Bien. Tu socio confirma. Bóveda abierta — lingotes hasta el techo.', tone: 'success' },
        { type: 'winLevel' },
      ],
      feedback: 'Casino vacío salvo por la bóveda VIP. 3 AM.',
    },
    {
      id: 'c',
      label: '5 AM',
      isCorrect: false,
      consequences: [
        { type: 'recordDecision', decisionId: 'casino-final-quiz', optionId: 'c', correct: false },
        { type: 'loseLife' },
        { type: 'dialog', text: 'Para las 5 ya estarías escapando.', tone: 'error' },
      ],
      feedback: 'El intro lo decía: 3 AM.',
    },
    {
      id: 'd',
      label: '7 AM',
      isCorrect: false,
      consequences: [
        { type: 'recordDecision', decisionId: 'casino-final-quiz', optionId: 'd', correct: false },
        { type: 'loseLife' },
        { type: 'dialog', text: 'Eso ya es de día. Te ven.', tone: 'error' },
      ],
      feedback: 'Casino vacío salvo por la bóveda VIP a las 3 AM.',
    },
  ],
}

const ALARM: Puzzle = {
  id: 'cas-alarm-wires',
  kind: 'wire',
  prompt: 'Desactivar alarma',
  payload: {
    leftColors: ['red', 'blue', 'yellow', 'green', 'purple'],
    rightColors: ['green', 'purple', 'red', 'yellow', 'blue'],
    matchRule: 'reverse-alphabetical',
  },
  solution: 'wired',
  onSolve: [
    { type: 'setFlag', key: 'cas_alarm', value: true },
    { type: 'dialog', text: 'Alarma muda. Las luces rojas pasan a violeta.', tone: 'success' },
  ],
  onFail: [{ type: 'dialog', text: 'Un cable corto. La alarma duda — pero sigue armada.', tone: 'error' }],
}

const DIAL: Puzzle = {
  id: 'cas-vault-dial',
  kind: 'slider',
  prompt: 'Calibrar el dial',
  payload: {
    targets: [7, 2, 5, 9],
    range: { min: 0, max: 9 },
    labels: ['Rotor I', 'Rotor II', 'Rotor III', 'Rotor IV'],
  },
  solution: '7259',
  onSolve: [
    { type: 'setFlag', key: 'cas_dial', value: true },
    { type: 'dialog', text: 'Los rotores trabaron. El lector biométrico se enciende.', tone: 'success' },
  ],
}

const VAULT: Puzzle = {
  id: 'cas-vault-code',
  kind: 'code',
  prompt: 'Confirmación de bóveda',
  payload: { length: 4 },
  solution: '9630',
  onSolve: [
    { type: 'setFlag', key: 'cas_vault', value: true },
    { type: 'dialog', text: 'Confirmado. Las puertas hidráulicas se descomprimen.', tone: 'success' },
  ],
  onFail: [{ type: 'dialog', text: 'El lector rechaza la combinación. Una cámara gira.', tone: 'error' }],
}

export const LEVEL_09_CASINO: Level = {
  id: 'level-09-casino',
  title: 'Casino Vault',
  subtitle: 'Tono: heist · nivel 9',
  tone: 'mystery',
  startRoomId: 'casino',
  rooms: { casino: ROOM },
  decisions: { 'casino-final-quiz': FINAL_QUIZ },
  puzzles: {
    'cas-alarm-wires': ALARM,
    'cas-vault-dial': DIAL,
    'cas-vault-code': VAULT,
  },
  initialInventory: [],
  maxLives: 3,
  winCondition: {
    type: 'and',
    children: [
      { type: 'flag', key: 'cas_alarm' },
      { type: 'flag', key: 'cas_dial' },
      { type: 'flag', key: 'cas_vault' },
    ],
  },
  loseCondition: { type: 'not', child: { type: 'livesAtLeast', n: 1 } },
  intro: {
    text:
      '3 AM. El casino está vacío salvo por la bóveda VIP. Antes de tocarla tenés que: cortar la alarma, calibrar el dial mecánico y confirmar el lector. Tres sistemas, en orden — y la cámara del corredor cuenta cada segundo.',
  },
  outro: {
    good: 'Adentro: lingotes apilados hasta el techo. Saliste con todo y sin disparar un tiro.',
    bad: 'La alarma despertó al equipo de seguridad. Manos en la nuca.',
  },
}
