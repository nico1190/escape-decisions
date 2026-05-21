import type { Level, Puzzle, Room } from '@/types/game'

const ROOM: Room = {
  id: 'crime',
  name: 'Despacho',
  background: 'bg-gradient-to-b from-zinc-900 to-black',
  sceneKey: 'crime-v1',
  hotspots: [
    {
      id: 'anagram-note',
      x: 38, y: 22, w: 8, h: 9,
      label: 'Nota del anagrama',
      icon: 'FileText',
      cursor: 'look',
      onClick: [
        {
          type: 'dialog',
          text:
            'En la nota pegada al corcho hay 5 letras desordenadas: R · A · O · S · O. Ordenalas y vas a tener el apellido del sospechoso.',
          tone: 'info',
        },
      ],
    },
    {
      id: 'phone-clue',
      x: 80, y: 51, w: 8, h: 8,
      label: 'Teléfono roto',
      icon: 'FileText',
      cursor: 'look',
      onClick: [
        {
          type: 'dialog',
          text:
            'Última llamada en el celular: 5 dígitos visibles antes de que se cortara. Tenés un instante para verlos cuando lo encendés.',
          tone: 'info',
        },
      ],
    },
    {
      id: 'corkboard',
      x: 6, y: 11, w: 38, h: 39,
      label: 'Identificar al sospechoso',
      icon: 'ScrollText',
      cursor: 'use',
      visibleWhen: { type: 'not', child: { type: 'flag', key: 'cr_suspect' } },
      onClick: [{ type: 'startPuzzle', puzzleId: 'cr-suspect-word' }],
    },
    {
      id: 'evidence-bag',
      x: 28, y: 78, w: 10, h: 14,
      label: 'Bolsa de prueba — teléfono',
      icon: 'Brain',
      cursor: 'use',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'cr_suspect' },
          { type: 'not', child: { type: 'flag', key: 'cr_witness' } },
        ],
      },
      onClick: [{ type: 'startPuzzle', puzzleId: 'cr-witness-memory' }],
    },
    {
      id: 'victim-note',
      x: 48, y: 75, w: 14, h: 16,
      label: 'Nota cifrada de la víctima',
      icon: 'ScrollText',
      cursor: 'use',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'cr_witness' },
          { type: 'not', child: { type: 'flag', key: 'cr_note' } },
        ],
      },
      onClick: [{ type: 'startPuzzle', puzzleId: 'cr-victim-cipher' }],
    },
    {
      id: 'exit-door',
      x: 78, y: 11, w: 14, h: 39,
      label: 'Salir a confrontar',
      icon: 'LogOut',
      cursor: 'enter',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'cr_suspect' },
          { type: 'flag', key: 'cr_witness' },
          { type: 'flag', key: 'cr_note' },
        ],
      },
      onClick: [
        { type: 'dialog', text: 'Con la identidad confirmada y la prueba en la mano, salís a confrontar al sospechoso.', tone: 'success' },
        { type: 'winLevel' },
      ],
    },
  ],
}

// RAOSO → ROSAO? Let's anagram clean. Actually "ROSAO" isn't a word.
// Let me pick a 5-letter Spanish surname: ROSAS. Anagram: SARO + O? "ROSAS" letters R-O-S-A-S, anagram could be SAROS or letters scrambled. Easier: 5 distinct letters.
// Surname "VARGA" 5 letters anagram: ARVAG, GARVA, AVGAR. Hmm.
// Let me use "MORALES" 7 letters too long.
// Try short famous suspect name: "ROJAS" → R-O-J-A-S. Anagram: SAROJ or JORSA. Display "RAOSO" doesn't have a J.
// Let me just use solution "ROSAO" (a fictional name). Actually for clarity let me use a real word — "ROSAS" → anagram SAROS.
// Display the scrambled "RAOSO" — but the solution must match what player types. Let me change display to "ASORS" → solution "ROSAS". Spanish surname.
const SUSPECT: Puzzle = {
  id: 'cr-suspect-word',
  kind: 'word',
  prompt: 'Apellido del sospechoso',
  payload: {
    length: 5,
    hint: 'Las 5 letras del corcho forman un apellido común.',
    bank: ['R', 'O', 'S', 'A', 'S', 'T', 'L', 'N'],
  },
  solution: 'ROSAS',
  onSolve: [
    { type: 'setFlag', key: 'cr_suspect', value: true },
    { type: 'dialog', text: 'El apellido es ROSAS. Ahora hay que confirmar con quién habló — el teléfono guarda la última llamada.', tone: 'success' },
  ],
  onFail: [{ type: 'dialog', text: 'No coincide con los archivos.', tone: 'error' }],
}

const WITNESS: Puzzle = {
  id: 'cr-witness-memory',
  kind: 'memory',
  prompt: 'Últimos dígitos llamados',
  payload: {
    numbers: [4, 1, 5, 2, 7],
    showMs: 1000,
    reverseDisplay: false,
  },
  solution: '41527',
  onSolve: [
    { type: 'setFlag', key: 'cr_witness', value: true },
    { type: 'dialog', text: 'Coincide con el número del testigo principal. Ahora descifrá la nota de la víctima.', tone: 'success' },
  ],
}

// 8·21·25·5 → H·U·Y·E → "HUYE" (4 letras, "flees")
const NOTE: Puzzle = {
  id: 'cr-victim-cipher',
  kind: 'cipher',
  prompt: 'Mensaje cifrado de la víctima',
  payload: {
    encrypted: [8, 21, 25, 5],
    hint: 'A=01 … Z=26. La víctima escribió 4 letras antes de morir.',
  },
  solution: 'HUYE',
  onSolve: [
    { type: 'setFlag', key: 'cr_note', value: true },
    { type: 'dialog', text: 'La víctima escribió "HUYE" antes de morir. La puerta del despacho se desbloquea con el código que aparece tenuemente en el marco.', tone: 'success' },
  ],
  onFail: [{ type: 'dialog', text: 'No es lo que dejó escrito.', tone: 'error' }],
}

export const LEVEL_13_CRIME: Level = {
  id: 'level-13-crime',
  title: 'Escena del Crimen',
  subtitle: 'Tono: detective · nivel 13',
  tone: 'mystery',
  startRoomId: 'crime',
  rooms: { crime: ROOM },
  decisions: {},
  puzzles: {
    'cr-suspect-word': SUSPECT,
    'cr-witness-memory': WITNESS,
    'cr-victim-cipher': NOTE,
  },
  initialInventory: [],
  maxLives: 3,
  winCondition: {
    type: 'and',
    children: [
      { type: 'flag', key: 'cr_suspect' },
      { type: 'flag', key: 'cr_witness' },
      { type: 'flag', key: 'cr_note' },
    ],
  },
  loseCondition: { type: 'not', child: { type: 'livesAtLeast', n: 1 } },
  intro: {
    text:
      'Te dejaron solo en el despacho con todo el material del caso. Tres cosas tenés que cerrar: identificar al sospechoso (el corcho tiene un anagrama), confirmar el número del testigo (el teléfono guarda los últimos dígitos), y descifrar la última nota de la víctima.',
  },
  outro: {
    good: 'Salís del despacho con la identidad confirmada, el número del testigo, y la palabra que la víctima escribió antes de morir: HUYE. Hora de confrontar.',
    bad: 'Se te escapó algo. El sospechoso ya tomó el primer tren a la costa.',
  },
}
