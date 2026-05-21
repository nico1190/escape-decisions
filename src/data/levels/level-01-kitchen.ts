import type { Decision, Level, Puzzle, Room } from '@/types/game'

/**
 * Nivel 1 — "La Cocina en Llamas"
 * Tono: educativo / realista.
 * Premisa: estás cocinando y la sartén con aceite se prende fuego.
 * El jugador debe (1) NO usar agua, (2) elegir la acción correcta para sofocar
 * el fuego, (3) buscar las llaves y salir por la puerta.
 *
 * Mecánicas que valida este nivel:
 *  - Decision con feedback educativo y consecuencia visual (overlay de fuego).
 *  - Hotspots condicionales (la puerta sólo deja salir si fireOut + tiene llaves).
 *  - Combinación: matafuegos correcto (K) vs incorrecto (A).
 *  - Win/lose conditions data-driven.
 */

const KITCHEN: Room = {
  id: 'kitchen',
  name: 'Cocina',
  background: 'bg-gradient-to-b from-amber-950 via-zinc-900 to-zinc-950',
  sceneKey: 'kitchen-v1',
  /**
   * Hotspot coords (% of canvas) match the new KitchenScene layout
   * (viewBox 100×56). Conversion: CSS y% = SVG y × 100/56.
   *
   * Scene layout:
   *  - Exit door (SALIDA, LEFT):    SVG (11, 6, 16, 32)   → CSS (11, 11%, 16, 57%)
   *  - Upper cabinet:                SVG (4, 11, 14, 18)   → CSS (4, 20%, 14, 32%)
   *  - Stove (pan + stovetop area):  SVG (41, 27, 22, 12)  → CSS (41, 48%, 22, 21%)
   *  - Pantry door (DESPENSA, RIGHT):SVG (73, 6, 16, 32)   → CSS (73, 11%, 16, 57%)
   */
  hotspots: [
    {
      id: 'stove',
      x: 41,
      y: 48,
      w: 22,
      h: 21,
      label: 'Sartén en llamas',
      icon: 'Flame',
      cursor: 'use',
      visibleWhen: { type: 'not', child: { type: 'flag', key: 'fireOut' } },
      onClick: [{ type: 'openDecision', decisionId: 'how-to-extinguish' }],
    },
    {
      id: 'stove-calm',
      x: 41,
      y: 48,
      w: 22,
      h: 21,
      label: 'Hornalla apagada',
      icon: 'CircleDot',
      cursor: 'look',
      visibleWhen: { type: 'flag', key: 'fireOut' },
      onClick: [{ type: 'dialog', text: 'La hornalla ya está apagada y enfriándose.', tone: 'success' }],
    },
    {
      id: 'cabinet',
      x: 4,
      y: 20,
      w: 14,
      h: 32,
      label: 'Alacena',
      icon: 'Archive',
      cursor: 'grab',
      visibleWhen: { type: 'lacksItem', itemId: 'flashlight' },
      onClick: [
        { type: 'addItem', itemId: 'flashlight' },
        { type: 'addItem', itemId: 'baking_soda' },
        {
          type: 'dialog',
          text:
            'Adentro de la alacena: una linterna y una caja de bicarbonato. La linterna te va a servir para lugares oscuros.',
          tone: 'success',
        },
      ],
    },
    {
      id: 'wall-note',
      x: 31,
      y: 35,
      w: 6,
      h: 8,
      label: 'Nota en la pared',
      icon: 'StickyNote',
      cursor: 'look',
      onClick: [
        {
          type: 'dialog',
          text:
            'En la nota dice (con letra apurada): "cajón despensa = 3 - 7 - 4". Memorizá.',
          tone: 'info',
        },
      ],
    },
    {
      id: 'wall-clock',
      // Small clock at SVG (66 12) r=3.6 → SVG bbox (62.4, 8.4, 7.2, 7.2).
      // CSS coords: x=62 y=15% w=8 h=13.
      x: 62,
      y: 15,
      w: 8,
      h: 13,
      label: 'Reloj de pared',
      icon: 'Clock',
      cursor: 'look',
      onClick: [
        {
          type: 'dialog',
          text:
            'El reloj de pared marca 10:24. Las agujas están como detenidas — alguien lo dejó así a propósito.',
          tone: 'info',
        },
      ],
    },
    {
      id: 'pantry-door',
      x: 73,
      y: 11,
      w: 16,
      h: 57,
      label: 'Despensa',
      icon: 'DoorOpen',
      cursor: 'enter',
      onClick: [{ type: 'navigate', roomId: 'pantry' }],
    },
    {
      id: 'exit-door',
      x: 11,
      y: 11,
      w: 16,
      h: 57,
      label: 'Salir a la calle',
      icon: 'LogOut',
      cursor: 'enter',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'fireOut' },
          { type: 'hasItem', itemId: 'keys' },
        ],
      },
      onClick: [
        { type: 'dialog', text: 'Abrís la puerta con las llaves. Estás a salvo.', tone: 'success' },
        { type: 'winLevel' },
      ],
    },
    {
      id: 'exit-door-locked',
      x: 11,
      y: 11,
      w: 16,
      h: 57,
      label: 'Puerta cerrada',
      icon: 'Lock',
      cursor: 'use',
      visibleWhen: {
        type: 'or',
        children: [
          { type: 'lacksItem', itemId: 'keys' },
          { type: 'not', child: { type: 'flag', key: 'fireOut' } },
        ],
      },
      onClick: [
        {
          type: 'dialog',
          text: 'No vas a salir corriendo con la cocina prendida fuego. Y necesitás las llaves.',
          tone: 'warning',
        },
      ],
    },
  ],
}

const PANTRY: Room = {
  id: 'pantry',
  name: 'Despensa',
  background: 'bg-gradient-to-b from-zinc-800 via-zinc-900 to-zinc-950',
  sceneKey: 'pantry-v1',
  darkness: { lightSourceItem: 'flashlight' },
  hotspots: [
    /**
     * Pantry hotspots — tight on each small item, distributed across shelves
     * so the player has to scan instead of clicking the only obvious thing.
     *
     *  - Door left:        SVG (4, 8, 14, 30)     → CSS (4, 14%, 14, 54%)
     *  - Extinguisher A:   SVG (28, 23.5, 3, 6)   → CSS (28, 42%, 3, 11%)
     *  - Extinguisher K:   SVG (76, 16.5, 3, 6.5) → CSS (76, 29%, 3, 12%)
     *  - Keys (hook):      SVG (87.5, 11, 3, 5)   → CSS (87.5, 20%, 3.5, 9%)
     */
    {
      id: 'back-to-kitchen',
      x: 4,
      y: 14,
      w: 14,
      h: 54,
      label: 'Volver a la cocina',
      icon: 'ArrowLeftCircle',
      cursor: 'enter',
      onClick: [{ type: 'navigate', roomId: 'kitchen' }],
    },
    {
      id: 'extinguisher-a',
      x: 28,
      y: 42,
      w: 3,
      h: 11,
      label: 'Matafuegos rojo (A)',
      icon: 'Flame',
      cursor: 'grab',
      visibleWhen: { type: 'lacksItem', itemId: 'extinguisher_a' },
      onClick: [
        { type: 'addItem', itemId: 'extinguisher_a' },
        {
          type: 'dialog',
          text: 'Matafuegos Clase A. Sirve para sólidos: papel, madera, tela.',
          tone: 'info',
        },
      ],
    },
    {
      id: 'drawer-locked',
      // Drawer sits on the pantry floor, x=25–39 y=46–55 in SVG = 25%–39% / 82%–98% in CSS.
      x: 25,
      y: 82,
      w: 14,
      h: 16,
      label: 'Cajón con candado',
      icon: 'Lock',
      cursor: 'use',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'not', child: { type: 'flag', key: 'drawer_open' } },
          { type: 'lacksItem', itemId: 'extinguisher_k' },
        ],
      },
      onClick: [{ type: 'startPuzzle', puzzleId: 'pantry-drawer-code' }],
    },
    {
      id: 'drawer-open',
      x: 25,
      y: 82,
      w: 14,
      h: 16,
      label: 'Cajón abierto',
      icon: 'CheckCircle2',
      cursor: 'look',
      visibleWhen: { type: 'flag', key: 'drawer_open' },
      onClick: [
        { type: 'dialog', text: 'El cajón está vacío. Ya retiraste lo que había.', tone: 'info' },
      ],
    },
    {
      id: 'wall-safe',
      // Safe SVG drawn at translate(82, 1.5) size 10×6 → bbox (82, 1.5, 10, 6).
      // CSS coords: x=82 y=2.7% w=10 h=11.
      x: 82,
      y: 2.5,
      w: 10,
      h: 11,
      label: 'Caja fuerte',
      icon: 'Lock',
      cursor: 'use',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'not', child: { type: 'flag', key: 'safe_open' } },
          { type: 'lacksItem', itemId: 'keys' },
        ],
      },
      onClick: [{ type: 'startPuzzle', puzzleId: 'pantry-safe-code' }],
    },
    {
      id: 'wall-safe-open',
      x: 82,
      y: 2.5,
      w: 10,
      h: 11,
      label: 'Caja fuerte vacía',
      icon: 'Unlock',
      cursor: 'look',
      visibleWhen: { type: 'flag', key: 'safe_open' },
      onClick: [
        { type: 'dialog', text: 'La caja fuerte está vacía. Ya retiraste lo que había.', tone: 'info' },
      ],
    },
  ],
}

const PANTRY_SAFE_CODE: Puzzle = {
  id: 'pantry-safe-code',
  kind: 'code',
  prompt: 'Combinación de la caja fuerte',
  payload: { length: 4 },
  solution: '1024',
  onSolve: [
    { type: 'setFlag', key: 'safe_open', value: true },
    { type: 'addItem', itemId: 'keys' },
    {
      type: 'dialog',
      text:
        'El dial gira hasta el último número y la puerta de la caja fuerte se abre con un clic. Adentro: las llaves de la puerta principal.',
      tone: 'success',
    },
  ],
  onFail: [
    {
      type: 'dialog',
      text: 'Tirás del picaporte — la caja sigue cerrada. Combinación incorrecta.',
      tone: 'error',
    },
  ],
}

const PANTRY_DRAWER_CODE: Puzzle = {
  id: 'pantry-drawer-code',
  kind: 'code',
  prompt: 'Combinación del cajón',
  payload: { length: 3 },
  solution: '374',
  onSolve: [
    { type: 'setFlag', key: 'drawer_open', value: true },
    { type: 'addItem', itemId: 'extinguisher_k' },
    {
      type: 'dialog',
      text:
        'Clic. El candado cede. Adentro del cajón: un matafuegos Clase K para aceites.',
      tone: 'success',
    },
  ],
  onFail: [
    {
      type: 'dialog',
      text: 'Click. Combinación incorrecta. Probá otra.',
      tone: 'error',
    },
  ],
}

const HOW_TO_EXTINGUISH: Decision = {
  id: 'how-to-extinguish',
  prompt: 'El aceite de la sartén está prendido fuego. ¿Qué hacés?',
  timerMs: 12000,
  options: [
    {
      id: 'water',
      label: 'Tirarle agua de la canilla',
      isCorrect: false,
      consequences: [
        { type: 'recordDecision', decisionId: 'how-to-extinguish', optionId: 'water', correct: false },
        { type: 'loseLife', amount: 2 },
        {
          type: 'dialog',
          text: 'NUNCA agua en fuego de aceite: explota en vapor y esparce el aceite ardiendo. Casi te quemás la cara.',
          tone: 'error',
        },
      ],
      feedback:
        'El agua en aceite caliente se vaporiza al instante y proyecta gotas de aceite ardiendo en todas direcciones.',
    },
    {
      id: 'lid',
      label: 'Tapar con la tapa y cortar el gas',
      isCorrect: true,
      consequences: [
        { type: 'recordDecision', decisionId: 'how-to-extinguish', optionId: 'lid', correct: true },
        { type: 'setFlag', key: 'fireOut', value: true },
        {
          type: 'dialog',
          text: 'Tapaste la sartén, cortaste el gas y el fuego se asfixió por falta de oxígeno. Manual, eficaz, casi sin daño.',
          tone: 'success',
        },
      ],
      feedback:
        'Sofocar (cortar el oxígeno) y cortar el combustible son los dos vectores correctos para incendio de aceite.',
    },
    {
      id: 'flour',
      label: 'Tirar harina encima',
      isCorrect: false,
      consequences: [
        { type: 'recordDecision', decisionId: 'how-to-extinguish', optionId: 'flour', correct: false },
        { type: 'loseLife', amount: 1 },
        {
          type: 'dialog',
          text: 'La harina pulverizada en el aire es combustible y puede deflagrar. Mala idea.',
          tone: 'error',
        },
      ],
      feedback:
        'Polvos finos en suspensión (harina, almidón) pueden inflamarse de forma explosiva en contacto con llama abierta.',
    },
    {
      id: 'extinguisher',
      label: 'Usar un matafuegos',
      isCorrect: true,
      consequences: [
        { type: 'recordDecision', decisionId: 'how-to-extinguish', optionId: 'extinguisher', correct: true },
        {
          type: 'dialog',
          text: 'Bien pensado. Tenés que buscar el correcto: Clase K para aceite. Andá a la despensa.',
          tone: 'info',
        },
        { type: 'setFlag', key: 'looking_for_extinguisher', value: true },
      ],
      feedback:
        'Para grasas/aceites: Clase K. Para sólidos comunes: Clase A. El color y la etiqueta indican la clase.',
    },
  ],
}

export const LEVEL_01_KITCHEN: Level = {
  id: 'level-01-kitchen',
  title: 'La Cocina en Llamas',
  subtitle: 'Tono: educativo · primer nivel',
  tone: 'educational',
  startRoomId: 'kitchen',
  rooms: { kitchen: KITCHEN, pantry: PANTRY },
  decisions: { 'how-to-extinguish': HOW_TO_EXTINGUISH },
  puzzles: {
    'pantry-drawer-code': PANTRY_DRAWER_CODE,
    'pantry-safe-code': PANTRY_SAFE_CODE,
  },
  initialInventory: [],
  maxLives: 3,
  // Win is triggered by the exit-door's onClick (`winLevel` effect).
  // This declarative copy mirrors the door's visibleWhen so the engine could
  // auto-detect it too (used by gameLoop for safety).
  winCondition: {
    type: 'and',
    children: [
      { type: 'flag', key: 'fireOut' },
      { type: 'hasItem', itemId: 'keys' },
    ],
  },
  // Player loses when lives reach zero.
  loseCondition: { type: 'not', child: { type: 'livesAtLeast', n: 1 } },
  intro: {
    text: 'Estás cocinando milanesas. Mirás el celular dos minutos. Cuando levantás la vista, el aceite de la sartén está prendido fuego. Tenés que actuar rápido — y bien.',
  },
  outro: {
    good:
      'Sofocaste el fuego sin daños mayores, agarraste las llaves y saliste a la calle. En la vida real: tapa + cortar gas, o matafuegos Clase K. Nunca agua.',
    bad: 'El fuego se descontroló. En la vida real, una decisión apurada en cocina puede causar quemaduras graves o incendios estructurales.',
  },
}
