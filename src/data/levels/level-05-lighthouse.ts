import type { Level, Puzzle, Room } from '@/types/game'

const ROOM: Room = {
  id: 'lighthouse',
  name: 'Faro',
  background: 'bg-gradient-to-b from-slate-900 to-black',
  sceneKey: 'lighthouse-v1',
  hotspots: [
    {
      // Logbook on the desk — single hotspot that BOTH opens the cipher and
      // shows the encrypted numbers (puzzle modal shows them prominently).
      // Visually wraps the logbook + lantern area at SVG (3–25, 29–36) →
      // CSS (3, 52%, 22, 13).
      id: 'journal-cipher',
      x: 3, y: 52, w: 22, h: 14,
      label: 'Descifrar el diario',
      icon: 'ScrollText',
      cursor: 'use',
      visibleWhen: { type: 'not', child: { type: 'flag', key: 'lh_journal' } },
      onClick: [{ type: 'startPuzzle', puzzleId: 'lh-journal-cipher' }],
    },
    {
      // After cipher solved — readable journal entry
      id: 'journal-read',
      x: 3, y: 52, w: 22, h: 14,
      label: 'Diario descifrado',
      icon: 'BookOpen',
      cursor: 'look',
      visibleWhen: { type: 'flag', key: 'lh_journal' },
      onClick: [
        { type: 'dialog', text: 'La última entrada del diario dice "FARO". El farero anterior la repitió toda la noche.', tone: 'info' },
      ],
    },
    {
      // The alphabet stone — visible right of the desk.
      // Scene draws it at SVG (28, 32, 10, 6) → CSS (28, 57%, 10, 11%).
      id: 'alphabet-stone',
      x: 28, y: 57, w: 10, h: 12,
      label: 'Tablilla del alfabeto',
      icon: 'BookOpen',
      cursor: 'look',
      onClick: [
        {
          type: 'dialog',
          text:
            'Grabado en piedra: A = 01, B = 02 … Z = 26. La clave para descifrar los números del diario.',
          tone: 'info',
        },
      ],
    },
    {
      // The lighthouse lamp mechanism — rotation puzzle.
      // Scene: lamp at SVG translate(50 42), rings radii 8/5.5/3 → bbox roughly
      // (42–58, 32–48). CSS (38, 60%, 26, 25%).
      id: 'lamp-mirrors',
      x: 38, y: 60, w: 26, h: 25,
      label: 'Mecanismo de la lámpara',
      icon: 'Compass',
      cursor: 'use',
      visibleWhen: { type: 'not', child: { type: 'flag', key: 'lh_mirrors' } },
      onClick: [{ type: 'startPuzzle', puzzleId: 'lh-mirrors-puzzle' }],
    },
    {
      // Glowing code revealed AFTER cipher is solved. Hovers over the brass
      // door's upper-mid area where the SVG draws the runes.
      // Scene draws glowing 8-2-5-3 at SVG (75–90, 13–14) → CSS (73, 21%, 22, 11%).
      id: 'door-runes',
      x: 73, y: 21, w: 22, h: 11,
      label: 'Cifras brillantes',
      icon: 'Sparkles',
      cursor: 'look',
      visibleWhen: { type: 'flag', key: 'lh_journal' },
      onClick: [
        {
          type: 'dialog',
          text: 'Las cifras embellecidas sobre la puerta laten ámbar: 8 - 2 - 5 - 3. Ese es el código.',
          tone: 'success',
        },
      ],
    },
    {
      // Keypad at the right of the door.
      // Scene at SVG (91, 20, 5, 8) → CSS (90, 33%, 7, 18%).
      id: 'door-keypad',
      x: 90, y: 33, w: 7, h: 18,
      label: 'Keypad de la puerta',
      icon: 'KeyRound',
      cursor: 'use',
      visibleWhen: { type: 'not', child: { type: 'flag', key: 'lh_door' } },
      onClick: [{ type: 'startPuzzle', puzzleId: 'lh-door-code' }],
    },
    {
      // Final exit door — only clickable when all 3 systems solved.
      id: 'exit-door',
      x: 76, y: 15, w: 14, h: 60,
      label: 'Salir',
      icon: 'LogOut',
      cursor: 'enter',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'lh_mirrors' },
          { type: 'flag', key: 'lh_journal' },
          { type: 'flag', key: 'lh_door' },
        ],
      },
      onClick: [
        { type: 'dialog', text: 'El faro queda atrás, la tormenta empuja afuera.', tone: 'success' },
        { type: 'winLevel' },
      ],
    },
  ],
}

const MIRRORS: Puzzle = {
  id: 'lh-mirrors-puzzle',
  kind: 'rotation',
  prompt: 'Alinear los espejos',
  payload: {
    rings: [
      { segments: 8, start: 5, target: 0, label: 'Anillo exterior' },
      { segments: 10, start: 7, target: 0, label: 'Anillo medio' },
      { segments: 12, start: 8, target: 0, label: 'Anillo interior' },
    ],
  },
  solution: '0,0,0',
  onSolve: [
    { type: 'setFlag', key: 'lh_mirrors', value: true },
    { type: 'dialog', text: 'Los espejos alinean. El haz de la lámpara apunta otra vez al mar.', tone: 'success' },
  ],
}

const JOURNAL_CIPHER: Puzzle = {
  id: 'lh-journal-cipher',
  kind: 'cipher',
  prompt: 'Última entrada del diario',
  payload: {
    encrypted: [6, 1, 18, 15],
    hint: 'La tablilla en la pared dice A=01 … Z=26. Cuatro letras forman la palabra.',
  },
  solution: 'FARO',
  onSolve: [
    { type: 'setFlag', key: 'lh_journal', value: true },
    {
      type: 'dialog',
      text:
        'La palabra es "FARO". Algo se mueve sobre la puerta de bronce — andá a verla: ahora brillan cuatro cifras nuevas. Ése es el código del cerrojo.',
      tone: 'success',
    },
  ],
  onFail: [
    { type: 'dialog', text: 'Tinta corrida — esa no es la palabra.', tone: 'error' },
  ],
}

const DOOR: Puzzle = {
  id: 'lh-door-code',
  kind: 'code',
  prompt: 'Llave de la puerta de bronce',
  payload: { length: 4 },
  solution: '8253',
  onSolve: [
    { type: 'setFlag', key: 'lh_door', value: true },
    { type: 'dialog', text: 'El cerrojo de bronce gira con un chasquido húmedo.', tone: 'success' },
  ],
  onFail: [{ type: 'dialog', text: 'Nada. El bronce no responde.', tone: 'error' }],
}

export const LEVEL_05_LIGHTHOUSE: Level = {
  id: 'level-05-lighthouse',
  title: 'El Faro Abandonado',
  subtitle: 'Tono: gótico · nivel 5',
  tone: 'mystery',
  startRoomId: 'lighthouse',
  rooms: { lighthouse: ROOM },
  decisions: {},
  puzzles: {
    'lh-mirrors-puzzle': MIRRORS,
    'lh-journal-cipher': JOURNAL_CIPHER,
    'lh-door-code': DOOR,
  },
  initialInventory: [],
  maxLives: 3,
  winCondition: {
    type: 'and',
    children: [
      { type: 'flag', key: 'lh_mirrors' },
      { type: 'flag', key: 'lh_journal' },
      { type: 'flag', key: 'lh_door' },
    ],
  },
  loseCondition: { type: 'not', child: { type: 'livesAtLeast', n: 1 } },
  intro: {
    text:
      'Tormenta sobre la costa. Tu bote se rompió contra las rocas. Subiste al faro buscando refugio y la puerta se cerró tras vos. La lámpara está apagada y el último farero dejó un diario a medio borrar. Tenés que volver a encender el haz, descifrar el diario y abrir la puerta de bronce antes que la tormenta crezca.',
  },
  outro: {
    good: 'El haz vuelve a girar. La puerta de bronce cede. Salís a la tormenta — pero al menos a la costa.',
    bad: 'La marea sube hasta el faro. Te quedaste adentro.',
  },
}
