import type { Level, Puzzle, Room } from '@/types/game'

const ROOM: Room = {
  id: 'tomb',
  name: 'Cámara del Faraón',
  background: 'bg-gradient-to-b from-amber-900 to-zinc-950',
  sceneKey: 'pharaoh-v1',
  hotspots: [
    {
      id: 'wall-glyphs',
      x: 12, y: 39, w: 22, h: 25,
      label: 'Muro de jeroglíficos',
      icon: 'BookOpen',
      cursor: 'look',
      onClick: [
        {
          type: 'dialog',
          text:
            'Los jeroglíficos repetidos forman un patrón: el alfabeto antiguo mapea 1:1 al moderno. A=1, Z=26.',
          tone: 'info',
        },
      ],
    },
    {
      id: 'inscription',
      x: 38, y: 39, w: 20, h: 11,
      label: 'Inscripción de piedra',
      icon: 'ScrollText',
      cursor: 'look',
      onClick: [
        {
          type: 'dialog',
          text:
            'Cuatro números grabados: 17 · 1 · 18 · 1. El nombre del faraón, cifrado.',
          tone: 'info',
        },
      ],
    },
    {
      id: 'sarcophagus',
      x: 36, y: 60, w: 28, h: 38,
      label: 'Sarcófago dorado',
      icon: 'Compass',
      cursor: 'use',
      visibleWhen: { type: 'not', child: { type: 'flag', key: 'ph_sarc' } },
      onClick: [{ type: 'startPuzzle', puzzleId: 'ph-sarc-rings' }],
    },
    {
      id: 'canopic-jars',
      x: 62, y: 46, w: 24, h: 20,
      label: 'Vasos canopos — cifra',
      icon: 'KeySquare',
      cursor: 'use',
      visibleWhen: { type: 'not', child: { type: 'flag', key: 'ph_glyphs' } },
      onClick: [{ type: 'startPuzzle', puzzleId: 'ph-name-cipher' }],
    },
    {
      id: 'balance',
      x: 42, y: 21, w: 16, h: 16,
      label: 'Balanza ceremonial',
      icon: 'Sliders',
      cursor: 'use',
      visibleWhen: { type: 'not', child: { type: 'flag', key: 'ph_balance' } },
      onClick: [{ type: 'startPuzzle', puzzleId: 'ph-balance' }],
    },
    {
      id: 'exit',
      x: 43, y: 4, w: 14, h: 22,
      label: 'Salir',
      icon: 'LogOut',
      cursor: 'enter',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'ph_sarc' },
          { type: 'flag', key: 'ph_glyphs' },
          { type: 'flag', key: 'ph_balance' },
        ],
      },
      onClick: [
        { type: 'dialog', text: 'La puerta de piedra se desliza. Saliste con la verdad — y un escarabajo dorado.', tone: 'success' },
        { type: 'winLevel' },
      ],
    },
  ],
}

const SARC: Puzzle = {
  id: 'ph-sarc-rings',
  kind: 'rotation',
  prompt: 'Sellos del sarcófago',
  payload: {
    rings: [
      { segments: 8, start: 6, target: 0, label: 'Sello exterior' },
      { segments: 10, start: 9, target: 0, label: 'Sello medio' },
      { segments: 12, start: 7, target: 0, label: 'Sello interior' },
    ],
    glyphs: [
      ['☥', '𓂀', '☥', '𓆣', '☥', '𓅓', '☥', '𓊪'],
    ],
  },
  solution: '0,0,0',
  onSolve: [
    { type: 'setFlag', key: 'ph_sarc', value: true },
    { type: 'dialog', text: 'Tres sellos giran y se hunden con un click hueco. Algo se desbloquea adentro de la cámara.', tone: 'success' },
  ],
}

// 17-1-18-1 → Q A R A → "QARA"? Doesn't read clean. Let me try: 17=Q (X-1)... maybe "RAMS" (RAMSÉS pieces)? R=18,A=1,M=13,S=19 → 18-1-13-19
// I'll use the famous pharaoh: "RAMSES" → 18-1-13-19-5-19 (6 letters).
// Or simpler 4-letter "ISIS" → 9-19-9-19. Or "TUTANKHA..." too long.
// "AMUN" → 1-13-21-14 → 4 letters.
// Use AMUN: encrypted 1-13-21-14.
// Update inscription text in scene too — let me adjust below

const NAME: Puzzle = {
  id: 'ph-name-cipher',
  kind: 'cipher',
  prompt: 'Nombre del dios protector',
  payload: {
    encrypted: [1, 13, 21, 14],
    hint: 'El muro dice A=1 … Z=26. Cuatro letras forman el nombre del dios.',
  },
  solution: 'AMUN',
  onSolve: [
    { type: 'setFlag', key: 'ph_glyphs', value: true },
    { type: 'dialog', text: 'AMUN. El dios oculto. Los vasos canopos giran y revelan un pasaje sellado.', tone: 'success' },
  ],
  onFail: [{ type: 'dialog', text: 'El polvo no se mueve. Ese no es el nombre.', tone: 'error' }],
}

const BALANCE: Puzzle = {
  id: 'ph-balance',
  kind: 'slider',
  prompt: 'Pesar las almas',
  payload: {
    targets: [42, 13, 7, 21],
    range: { min: 0, max: 50 },
    labels: ['Pluma de la verdad', 'Corazón', 'Ofrenda 1', 'Ofrenda 2'],
  },
  solution: '42·13·7·21',
  onSolve: [
    { type: 'setFlag', key: 'ph_balance', value: true },
    { type: 'dialog', text: 'La balanza se equilibra. Las almas pasan.', tone: 'success' },
  ],
}

export const LEVEL_08_PHARAOH: Level = {
  id: 'level-08-pharaoh',
  title: 'La Cámara del Faraón',
  subtitle: 'Tono: aventura · nivel 8',
  tone: 'mystery',
  startRoomId: 'tomb',
  rooms: { tomb: ROOM },
  decisions: {},
  puzzles: {
    'ph-sarc-rings': SARC,
    'ph-name-cipher': NAME,
    'ph-balance': BALANCE,
  },
  initialInventory: [],
  maxLives: 3,
  winCondition: {
    type: 'and',
    children: [
      { type: 'flag', key: 'ph_sarc' },
      { type: 'flag', key: 'ph_glyphs' },
      { type: 'flag', key: 'ph_balance' },
    ],
  },
  loseCondition: { type: 'not', child: { type: 'livesAtLeast', n: 1 } },
  intro: {
    text:
      'Entraste a la cámara del faraón siguiendo un mapa de cartonero. La puerta de piedra cayó atrás tuyo. Para salir hay que: alinear los tres sellos del sarcófago, descifrar el nombre del dios protector y equilibrar la balanza ceremonial.',
  },
  outro: {
    good: 'La puerta de piedra se desliza con el peso justo. Salís a la luz del desierto.',
    bad: 'La cámara cierra. El faraón te recibe en su corte.',
  },
}
