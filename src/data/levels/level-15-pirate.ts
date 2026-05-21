import type { Level, Puzzle, Room } from '@/types/game'

const ROOM: Room = {
  id: 'pirate',
  name: 'Camarote del Capitán',
  background: 'bg-gradient-to-b from-amber-950 to-zinc-950',
  sceneKey: 'pirate-v1',
  hotspots: [
    {
      id: 'treasure-map',
      x: 30, y: 11, w: 40, h: 36,
      label: 'Mapa del tesoro',
      icon: 'ScrollText',
      cursor: 'look',
      onClick: [
        {
          type: 'dialog',
          text:
            'El mapa marca una "X" sobre una isla, y en el borde inferior hay 5 números tallados: 8 · 21 · 18 · 20 · 15. Cifra del rumbo, parece.',
          tone: 'info',
        },
      ],
    },
    {
      id: 'compass',
      x: 4, y: 50, w: 14, h: 24,
      label: 'Brújula de bronce',
      icon: 'Compass',
      cursor: 'use',
      visibleWhen: { type: 'not', child: { type: 'flag', key: 'pi_compass' } },
      onClick: [{ type: 'startPuzzle', puzzleId: 'pi-compass-rotation' }],
    },
    {
      id: 'map-cipher',
      x: 30, y: 60, w: 40, h: 22,
      label: 'Descifrar el rumbo',
      icon: 'ScrollText',
      cursor: 'use',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'pi_compass' },
          { type: 'not', child: { type: 'flag', key: 'pi_map' } },
        ],
      },
      onClick: [{ type: 'startPuzzle', puzzleId: 'pi-map-cipher' }],
    },
    {
      id: 'gunpowder',
      x: 73, y: 58, w: 12, h: 18,
      label: 'Pólvora del cañón',
      icon: 'Sliders',
      cursor: 'use',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'pi_map' },
          { type: 'not', child: { type: 'flag', key: 'pi_powder' } },
        ],
      },
      onClick: [{ type: 'startPuzzle', puzzleId: 'pi-powder-slider' }],
    },
    {
      id: 'cannon-fuse',
      x: 86, y: 58, w: 12, h: 18,
      label: 'Mecha del cañón',
      icon: 'Target',
      cursor: 'use',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'pi_powder' },
          { type: 'not', child: { type: 'flag', key: 'pi_cannon' } },
        ],
      },
      onClick: [{ type: 'startPuzzle', puzzleId: 'pi-cannon-timing' }],
    },
    {
      id: 'treasure-chest',
      x: 42, y: 80, w: 16, h: 17,
      label: 'Abrir el cofre',
      icon: 'LogOut',
      cursor: 'enter',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'pi_compass' },
          { type: 'flag', key: 'pi_map' },
          { type: 'flag', key: 'pi_powder' },
          { type: 'flag', key: 'pi_cannon' },
        ],
      },
      onClick: [
        { type: 'dialog', text: 'Disparaste el cerrojo del cofre. Adentro: oro español, una corona, y mapas a otras islas.', tone: 'success' },
        { type: 'winLevel' },
      ],
    },
  ],
}

const COMPASS: Puzzle = {
  id: 'pi-compass-rotation',
  kind: 'rotation',
  prompt: 'Estabilizar la brújula',
  payload: {
    rings: [
      { segments: 8, start: 3, target: 0, label: 'Rosa exterior' },
      { segments: 6, start: 4, target: 0, label: 'Aguja' },
      { segments: 4, start: 2, target: 0, label: 'Base' },
    ],
    glyphs: [
      ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'],
    ],
  },
  solution: '0,0,0',
  onSolve: [
    { type: 'setFlag', key: 'pi_compass', value: true },
    { type: 'dialog', text: 'La brújula apunta firme al norte. Ahora podés leer el rumbo del mapa.', tone: 'success' },
  ],
}

// 8·21·18·20·15 → H·U·R·T·O → "HURTO" (robbery/heist)
const MAP: Puzzle = {
  id: 'pi-map-cipher',
  kind: 'cipher',
  prompt: 'Descifrar el rumbo del mapa',
  payload: {
    encrypted: [8, 21, 18, 20, 15],
    hint: 'A=01 … Z=26. Cinco letras forman la palabra grabada por el viejo pirata.',
  },
  solution: 'HURTO',
  onSolve: [
    { type: 'setFlag', key: 'pi_map', value: true },
    { type: 'dialog', text: '"HURTO". La palabra clave que el viejo pirata dejó marcando el cofre. Ahora a preparar la pólvora.', tone: 'success' },
  ],
  onFail: [{ type: 'dialog', text: 'Esa no es la palabra del pirata. Probá otras letras.', tone: 'error' }],
}

const POWDER: Puzzle = {
  id: 'pi-powder-slider',
  kind: 'slider',
  prompt: 'Cargar la pólvora',
  payload: {
    targets: [3, 7, 1, 5],
    range: { min: 0, max: 9 },
    labels: ['Salitre', 'Carbón', 'Azufre', 'Mecha'],
  },
  solution: '3715',
  onSolve: [
    { type: 'setFlag', key: 'pi_powder', value: true },
    { type: 'dialog', text: 'La proporción es la justa. Ahora encendé la mecha en el momento exacto — el cofre se abre con un disparo seco.', tone: 'success' },
  ],
}

const CANNON: Puzzle = {
  id: 'pi-cannon-timing',
  kind: 'timing',
  prompt: 'Encender la mecha',
  payload: {
    rounds: [
      { greenSize: 16, greenPos: 50, cycleMs: 1100 },
      { greenSize: 10, greenPos: 50, cycleMs: 800 },
      { greenSize: 7, greenPos: 50, cycleMs: 600 },
    ],
  },
  solution: 'timing-ok',
  onSolve: [
    { type: 'setFlag', key: 'pi_cannon', value: true },
    { type: 'dialog', text: 'Tres mechazos perfectos. El cañón dispara. El cerrojo del cofre vuela en pedazos.', tone: 'success' },
  ],
}

export const LEVEL_15_PIRATE: Level = {
  id: 'level-15-pirate',
  title: 'Camarote del Capitán',
  subtitle: 'Tono: aventura pirata · nivel 15',
  tone: 'mystery',
  startRoomId: 'pirate',
  rooms: { pirate: ROOM },
  decisions: {},
  puzzles: {
    'pi-compass-rotation': COMPASS,
    'pi-map-cipher': MAP,
    'pi-powder-slider': POWDER,
    'pi-cannon-timing': CANNON,
  },
  initialInventory: [],
  maxLives: 3,
  winCondition: {
    type: 'and',
    children: [
      { type: 'flag', key: 'pi_compass' },
      { type: 'flag', key: 'pi_map' },
      { type: 'flag', key: 'pi_powder' },
      { type: 'flag', key: 'pi_cannon' },
    ],
  },
  loseCondition: { type: 'not', child: { type: 'livesAtLeast', n: 1 } },
  intro: {
    text:
      'El capitán dejó el camarote y se llevó la llave del cofre. Pero el viejo dejó las cosas a la vista: una brújula que necesita calibración, un mapa con un nombre cifrado, una pólvora que hay que medir y un cañón listo para volar el cerrojo. Procedé en orden y abrí el cofre antes que vuelva.',
  },
  outro: {
    good: 'El cofre explotó al disparo del cañón. Oro español, joyas, mapas. Tu nuevo capitán es vos.',
    bad: 'El capitán volvió. La tabla espera.',
  },
}
