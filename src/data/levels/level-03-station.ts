import type { Decision, Level, Puzzle, Room } from '@/types/game'

/**
 * Nivel 3 — "Estación Abandonada"
 * Tono: sci-fi / tensión.
 *
 * Premisa: tu nave de servicio quedó atrapada en una estación abandonada.
 * Los 3 sistemas críticos están caídos. Tenés que restaurar:
 *   1. POWER (sliders) — alinear 4 canales a sus valores (clue en display)
 *   2. COMMS (wires)   — reconectar 4 cables al color correcto (clue: los colores se ven en ambos lados)
 *   3. DOOR (code)     — ingresar el código de override en el keypad (clue: poster)
 *
 * Cuando los 3 sistemas están online, la puerta blast se abre y podés salir.
 */

const STATION: Room = {
  id: 'station',
  name: 'Estación Abandonada',
  background: 'bg-gradient-to-b from-slate-950 to-black',
  sceneKey: 'station-v1',
  // The reactor is dead — without an external light source the room is dark.
  // The player must first locate the toolbox in the foreground to retrieve a
  // flashlight, then can navigate the rest of the systems.
  darkness: { lightSourceItem: 'flashlight' },
  hotspots: [
    {
      // The status display on the control desk back panel — slider clue
      // SVG (50, 27) area, screen 18×5 at translate(50 27) → CSS (41, 48%, 18, 11).
      id: 'status-display',
      x: 41,
      y: 48,
      w: 18,
      h: 11,
      label: 'Display de estado',
      icon: 'MonitorSpeaker',
      cursor: 'look',
      onClick: [
        {
          type: 'dialog',
          text:
            'El display titila: "PWR · 7 · 2 · 5 · 8". Son los valores objetivo de los 4 canales de reactor.',
          tone: 'info',
        },
      ],
    },
    {
      // Override poster pinned next to keypad — code clue
      // SVG (78.5, 44.5, 9, 6) → CSS (78, 80%, 10, 13).
      id: 'override-poster',
      x: 78,
      y: 80,
      w: 10,
      h: 13,
      label: 'Poster de mantenimiento',
      icon: 'FileText',
      cursor: 'look',
      onClick: [
        {
          type: 'dialog',
          text:
            'Un poster viejo pegado a la pared dice "OVERRIDE — 9-3-1-6". El código de emergencia para la puerta.',
          tone: 'info',
        },
      ],
    },
    {
      // Toolbox on the floor — provides the flashlight needed to navigate
      // the dark station. Visible (and clickable) even without flashlight,
      // since the player needs SOMETHING to find first.
      // SVG (20, 44, 6, 3.8) → CSS (20, 78%, 6, 7).
      id: 'toolbox',
      x: 20,
      y: 78,
      w: 6,
      h: 7,
      label: 'Caja de herramientas',
      icon: 'Wrench',
      cursor: 'grab',
      visibleWhen: { type: 'lacksItem', itemId: 'flashlight' },
      onClick: [
        { type: 'addItem', itemId: 'flashlight' },
        {
          type: 'dialog',
          text:
            'Abrís la caja roja. Adentro: una linterna de emergencia, todavía con carga. Ahora podés ver bien.',
          tone: 'success',
        },
      ],
    },
    {
      // Pressure valve panel (timing puzzle entry point)
      // SVG (27, 42, 5.5, 5.5) → CSS (27, 75%, 6, 10).
      id: 'pressure-valve',
      x: 27,
      y: 75,
      w: 6,
      h: 10,
      label: 'Válvula de presión',
      icon: 'Gauge',
      cursor: 'use',
      visibleWhen: { type: 'not', child: { type: 'flag', key: 'sys_pressure' } },
      onClick: [{ type: 'startPuzzle', puzzleId: 'station-pressure-timing' }],
    },
    {
      // Wire/comms panel (left wall) — wire puzzle
      // SVG (3, 22, 14, 14) → CSS (3, 39%, 14, 25).
      id: 'comms-panel',
      x: 3,
      y: 39,
      w: 14,
      h: 25,
      label: 'Panel de COMMS',
      icon: 'Cable',
      cursor: 'use',
      visibleWhen: { type: 'not', child: { type: 'flag', key: 'sys_comms' } },
      onClick: [{ type: 'startPuzzle', puzzleId: 'station-comms-wires' }],
    },
    {
      // Control desk with sliders — slider puzzle.
      // SVG (32, 32, 36, 9) → CSS (32, 57%, 36, 16).
      id: 'control-desk',
      x: 32,
      y: 57,
      w: 36,
      h: 16,
      label: 'Consola de reactor',
      icon: 'Sliders',
      cursor: 'use',
      visibleWhen: { type: 'not', child: { type: 'flag', key: 'sys_power' } },
      onClick: [{ type: 'startPuzzle', puzzleId: 'station-reactor-sliders' }],
    },
    {
      // Keypad next to the sealed door — code puzzle
      // SVG (89, 25, 6, 9) → CSS (89, 45%, 7, 16).
      id: 'door-keypad',
      x: 89,
      y: 45,
      w: 7,
      h: 16,
      label: 'Keypad de la puerta',
      icon: 'KeyRound',
      cursor: 'use',
      visibleWhen: { type: 'not', child: { type: 'flag', key: 'sys_door' } },
      onClick: [{ type: 'startPuzzle', puzzleId: 'station-door-code' }],
    },
    {
      // The exit doorway — only clickable when all 3 systems are online.
      // SVG (78, 10, 18, 34) → CSS (78, 18%, 18, 60).
      id: 'exit-door',
      x: 78,
      y: 18,
      w: 18,
      h: 60,
      label: 'Salir por la puerta',
      icon: 'LogOut',
      cursor: 'enter',
      visibleWhen: {
        type: 'and',
        children: [
          { type: 'flag', key: 'sys_power' },
          { type: 'flag', key: 'sys_comms' },
          { type: 'flag', key: 'sys_door' },
          { type: 'flag', key: 'sys_pressure' },
        ],
      },
      onClick: [{ type: 'openDecision', decisionId: 'station-final-quiz' }],
    },
  ],
}

const FINAL_QUIZ: Decision = {
  id: 'station-final-quiz',
  prompt:
    'Antes de cruzar la blast door, la AI te exige una confirmación: ¿cuántos sistemas críticos restauraste en la estación?',
  options: [
    {
      id: 'a',
      label: '2',
      isCorrect: false,
      consequences: [
        { type: 'recordDecision', decisionId: 'station-final-quiz', optionId: 'a', correct: false },
        { type: 'loseLife' },
        { type: 'dialog', text: 'Más que eso. La AI no confía en vos.', tone: 'error' },
      ],
      feedback: 'Reactor + comms + presión + puerta. Cuatro.',
    },
    {
      id: 'b',
      label: '3',
      isCorrect: false,
      consequences: [
        { type: 'recordDecision', decisionId: 'station-final-quiz', optionId: 'b', correct: false },
        { type: 'loseLife' },
        { type: 'dialog', text: 'Una luz verde más. Contá de nuevo.', tone: 'error' },
      ],
      feedback: 'Reactor, comms, presión y puerta — son cuatro.',
    },
    {
      id: 'c',
      label: '4',
      isCorrect: true,
      consequences: [
        { type: 'recordDecision', decisionId: 'station-final-quiz', optionId: 'c', correct: true },
        {
          type: 'dialog',
          text:
            'Cuatro sistemas: reactor, comms, presión, puerta. La AI te deja pasar — la blast door siseando.',
          tone: 'success',
        },
        { type: 'winLevel' },
      ],
      feedback: 'Reactor, comms, presión y puerta.',
    },
    {
      id: 'd',
      label: '5',
      isCorrect: false,
      consequences: [
        { type: 'recordDecision', decisionId: 'station-final-quiz', optionId: 'd', correct: false },
        { type: 'loseLife' },
        { type: 'dialog', text: 'Estás contando alguno que no existía.', tone: 'error' },
      ],
      feedback: 'Solo había cuatro paneles activos.',
    },
  ],
}

const SLIDER_PUZZLE: Puzzle = {
  id: 'station-reactor-sliders',
  kind: 'slider',
  prompt: 'Canales del reactor',
  payload: {
    targets: [7, 2, 5, 8],
    range: { min: 0, max: 9 },
    labels: ['Canal A', 'Canal B', 'Canal C', 'Canal D'],
  },
  solution: '7258',
  onSolve: [
    { type: 'setFlag', key: 'sys_power', value: true },
    {
      type: 'dialog',
      text:
        'Los 4 canales se alinean. Las luces de la consola se encienden en verde. Reactor estable.',
      tone: 'success',
    },
  ],
  onFail: [
    {
      type: 'dialog',
      text: 'Algún canal todavía no está alineado. Ajustá hasta que cada uno marque ✓.',
      tone: 'error',
    },
  ],
}

const WIRE_PUZZLE: Puzzle = {
  id: 'station-comms-wires',
  kind: 'wire',
  prompt: 'Reconectar comunicaciones',
  payload: {
    leftColors: ['red', 'blue', 'yellow', 'green'],
    // Right side scrambled — player must connect same color to same color.
    rightColors: ['yellow', 'red', 'green', 'blue'],
  },
  solution: 'red->1,blue->3,yellow->0,green->2',
  onSolve: [
    { type: 'setFlag', key: 'sys_comms', value: true },
    {
      type: 'dialog',
      text:
        'Los 4 cables coinciden de extremo a extremo. La radio de la estación cobra vida.',
      tone: 'success',
    },
  ],
  onFail: [
    {
      type: 'dialog',
      text:
        'Algún cable conecta colores distintos — eso es un cortocircuito. Cambialo y volvé a probar.',
      tone: 'error',
    },
  ],
}

const PRESSURE_TIMING_PUZZLE: Puzzle = {
  id: 'station-pressure-timing',
  kind: 'timing',
  prompt: 'Recalibrar válvula de presión',
  payload: {
    // Each round: narrower green zone, faster needle.
    rounds: [
      { greenSize: 26, greenPos: 50, cycleMs: 2000 },
      { greenSize: 18, greenPos: 50, cycleMs: 1500 },
      { greenSize: 12, greenPos: 50, cycleMs: 1100 },
    ],
  },
  solution: 'timing-ok',
  onSolve: [
    { type: 'setFlag', key: 'sys_pressure', value: true },
    {
      type: 'dialog',
      text:
        'Bloqueás la válvula en los tres pulsos. La aguja se queda fija en verde. Presión estabilizada.',
      tone: 'success',
    },
  ],
}

const DOOR_CODE_PUZZLE: Puzzle = {
  id: 'station-door-code',
  kind: 'code',
  prompt: 'Código de override',
  payload: { length: 4 },
  solution: '9316',
  onSolve: [
    { type: 'setFlag', key: 'sys_door', value: true },
    {
      type: 'dialog',
      text:
        'Click. El bloqueo magnético se libera. Falta el resto de los sistemas para abrir.',
      tone: 'success',
    },
  ],
  onFail: [
    {
      type: 'dialog',
      text: 'Código incorrecto. El keypad emite un pitido seco.',
      tone: 'error',
    },
  ],
}

export const LEVEL_03_STATION: Level = {
  id: 'level-03-station',
  title: 'Estación Abandonada',
  subtitle: 'Tono: sci-fi · nivel 3',
  tone: 'mystery',
  startRoomId: 'station',
  rooms: { station: STATION },
  decisions: { 'station-final-quiz': FINAL_QUIZ },
  puzzles: {
    'station-reactor-sliders': SLIDER_PUZZLE,
    'station-comms-wires': WIRE_PUZZLE,
    'station-door-code': DOOR_CODE_PUZZLE,
    'station-pressure-timing': PRESSURE_TIMING_PUZZLE,
  },
  initialInventory: [],
  maxLives: 3,
  winCondition: {
    type: 'and',
    children: [
      { type: 'flag', key: 'sys_power' },
      { type: 'flag', key: 'sys_comms' },
      { type: 'flag', key: 'sys_door' },
      { type: 'flag', key: 'sys_pressure' },
    ],
  },
  loseCondition: { type: 'not', child: { type: 'livesAtLeast', n: 1 } },
  intro: {
    text:
      'Estación de servicio abandonada en el cinturón de asteroides. Tu nave acopló al puerto 4 y la energía se cortó: la estación está casi a oscuras. Cuatro sistemas críticos offline: reactor, comunicaciones, presión y puerta. Primero buscá algo para iluminar, después restauralos todos.',
  },
  outro: {
    good:
      'Cuatro luces verdes en el panel. Presión, energía, comms y bloqueo en orden. La blast door cede con un siseo neumático y atravesás el corredor hacia el hangar. Misión cumplida.',
    bad: 'Sin energía, sin comms, con la presión cayendo y la puerta sellada. La estación gana esta vez.',
  },
}
