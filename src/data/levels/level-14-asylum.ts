import type { Level, Puzzle, Room } from '@/types/game'

const ROOM: Room = {
  id: 'asylum',
  name: 'Manicomio',
  background: 'bg-gradient-to-b from-slate-950 to-black',
  sceneKey: 'asylum-v1',
  darkness: { lightSourceItem: 'flashlight' },
  hotspots: [
    {
      id: 'toolbox',
      x: 48, y: 82, w: 6, h: 8,
      label: 'Caja de la enfermería',
      icon: 'Wrench',
      cursor: 'grab',
      visibleWhen: { type: 'lacksItem', itemId: 'flashlight' },
      onClick: [
        { type: 'addItem', itemId: 'flashlight' },
        { type: 'dialog', text: 'Una linterna del enfermero. Ahora podés ver el pabellón.', tone: 'success' },
      ],
    },
    {
      id: 'restraint-chair',
      x: 10, y: 53, w: 18, h: 26,
      label: 'Silla de sujeción',
      icon: 'Compass',
      cursor: 'use',
      visibleWhen: { type: 'not', child: { type: 'flag', key: 'as_chair' } },
      onClick: [{ type: 'startPuzzle', puzzleId: 'as-chair-rotation' }],
    },
    {
      id: 'heart-monitor',
      x: 42, y: 39, w: 16, h: 18,
      label: 'Monitor de pulso',
      icon: 'Target',
      cursor: 'use',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'as_chair' },
          { type: 'not', child: { type: 'flag', key: 'as_heart' } },
        ],
      },
      onClick: [{ type: 'startPuzzle', puzzleId: 'as-heart-timing' }],
    },
    {
      id: 'dr-notes',
      x: 60, y: 12, w: 12, h: 14,
      label: 'Notas del doctor',
      icon: 'BookOpen',
      cursor: 'look',
      visibleWhen: { type: 'flag', key: 'as_chair' },
      onClick: [
        { type: 'dialog', text: 'En la nota del doctor: "Caso 3-7-4-9 — historia clínica del paciente". El número del archivo.', tone: 'info' },
      ],
    },
    {
      id: 'file-cabinet',
      x: 76, y: 35, w: 14, h: 36,
      label: 'Archivero de pacientes',
      icon: 'KeyRound',
      cursor: 'use',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'as_heart' },
          { type: 'not', child: { type: 'flag', key: 'as_file' } },
        ],
      },
      onClick: [{ type: 'startPuzzle', puzzleId: 'as-file-code' }],
    },
    {
      id: 'doctor-cipher',
      x: 30, y: 25, w: 24, h: 12,
      label: 'Diagnóstico cifrado',
      icon: 'ScrollText',
      cursor: 'use',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'as_file' },
          { type: 'not', child: { type: 'flag', key: 'as_door' } },
        ],
      },
      onClick: [{ type: 'startPuzzle', puzzleId: 'as-doctor-cipher' }],
    },
    {
      id: 'exit-door',
      x: 6, y: 32, w: 14, h: 40,
      label: 'Salir del pabellón',
      icon: 'LogOut',
      cursor: 'enter',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'as_chair' },
          { type: 'flag', key: 'as_heart' },
          { type: 'flag', key: 'as_file' },
          { type: 'flag', key: 'as_door' },
        ],
      },
      onClick: [
        { type: 'dialog', text: 'La cerradura cede. Salís corriendo por el pasillo hacia la salida del manicomio.', tone: 'success' },
        { type: 'winLevel' },
      ],
    },
  ],
}

const CHAIR: Puzzle = {
  id: 'as-chair-rotation',
  kind: 'rotation',
  prompt: 'Combinación de la silla',
  payload: {
    rings: [
      { segments: 8, start: 4, target: 0, label: 'Cinta superior' },
      { segments: 10, start: 6, target: 0, label: 'Cinta media' },
      { segments: 12, start: 9, target: 0, label: 'Cinta inferior' },
    ],
  },
  solution: '0,0,0',
  onSolve: [
    { type: 'setFlag', key: 'as_chair', value: true },
    { type: 'dialog', text: 'Las tres cintas se sueltan. Al levantarte ves una nota del doctor pegada en la pared.', tone: 'success' },
  ],
}

const HEART: Puzzle = {
  id: 'as-heart-timing',
  kind: 'timing',
  prompt: 'Calmar el pulso',
  payload: {
    rounds: [
      { greenSize: 20, greenPos: 50, cycleMs: 1300 },
      { greenSize: 14, greenPos: 50, cycleMs: 900 },
      { greenSize: 10, greenPos: 50, cycleMs: 700 },
    ],
  },
  solution: 'timing-ok',
  onSolve: [
    { type: 'setFlag', key: 'as_heart', value: true },
    { type: 'dialog', text: 'Tres pulsos en sincronía. El monitor pasa a verde. Ya no estás en pánico — podés concentrarte en el archivero.', tone: 'success' },
  ],
}

const FILE: Puzzle = {
  id: 'as-file-code',
  kind: 'code',
  prompt: 'Cerradura del archivero',
  payload: { length: 4 },
  solution: '3749',
  onSolve: [
    { type: 'setFlag', key: 'as_file', value: true },
    { type: 'dialog', text: 'El cajón se abre. Adentro: tu historia clínica con una página marcada y un diagnóstico escrito en código.', tone: 'success' },
  ],
  onFail: [{ type: 'dialog', text: 'El cajón no cede.', tone: 'error' }],
}

// 12-15-3-15 → L·O·C·O → "LOCO"
const DOCTOR: Puzzle = {
  id: 'as-doctor-cipher',
  kind: 'cipher',
  prompt: 'Diagnóstico del doctor',
  payload: {
    encrypted: [12, 15, 3, 15],
    hint: 'A=01 … Z=26. Cuatro letras forman la palabra que el doctor usó.',
  },
  solution: 'LOCO',
  onSolve: [
    { type: 'setFlag', key: 'as_door', value: true },
    { type: 'dialog', text: '"LOCO". Eso te diagnosticaron. Pero ahora tenés todo lo que necesitás para salir — la cerradura de la puerta cede.', tone: 'success' },
  ],
  onFail: [{ type: 'dialog', text: 'Esa no es la palabra del expediente.', tone: 'error' }],
}

export const LEVEL_14_ASYLUM: Level = {
  id: 'level-14-asylum',
  title: 'Manicomio Abandonado',
  subtitle: 'Tono: terror psicológico · nivel 14',
  tone: 'mystery',
  startRoomId: 'asylum',
  rooms: { asylum: ROOM },
  decisions: {},
  puzzles: {
    'as-chair-rotation': CHAIR,
    'as-heart-timing': HEART,
    'as-file-code': FILE,
    'as-doctor-cipher': DOCTOR,
  },
  initialInventory: [],
  maxLives: 3,
  winCondition: {
    type: 'and',
    children: [
      { type: 'flag', key: 'as_chair' },
      { type: 'flag', key: 'as_heart' },
      { type: 'flag', key: 'as_file' },
      { type: 'flag', key: 'as_door' },
    ],
  },
  loseCondition: { type: 'not', child: { type: 'livesAtLeast', n: 1 } },
  intro: {
    text:
      'Te despertaste atado a una silla de sujeción en un manicomio abandonado. Las luces fallan. Vas a tener que: soltar las tres cintas, calmar tu pulso (tres pulsaciones seguidas), abrir tu propia historia clínica, descifrar el diagnóstico, y salir. La linterna está en una caja de enfermería del piso.',
  },
  outro: {
    good: 'Saliste del pabellón a la madrugada. La palabra LOCO te persigue, pero por ahora estás libre.',
    bad: 'No pudiste calmarte. El doctor entra al pabellón con una jeringa.',
  },
}
