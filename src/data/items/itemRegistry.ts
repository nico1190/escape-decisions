import type { Condition, GameEffect, Item, ItemId } from '@/types/game'

/**
 * Reusable condition: "we are in the kitchen AND the fire is still burning".
 * Used by extinguishing items to gate whether they actually do something.
 */
const FIRE_IS_ACTIVE: Condition = {
  type: 'and',
  children: [
    { type: 'inRoom', roomId: 'kitchen' },
    { type: 'not', child: { type: 'flag', key: 'fireOut' } },
  ],
}

/** Effects shared by every "extinguish the kitchen fire" use action. */
function extinguishKitchen(success: { text: string }): GameEffect[] {
  return [
    { type: 'setFlag', key: 'fireOut', value: true },
    { type: 'dialog', text: success.text, tone: 'success' },
  ]
}

export const ITEMS: Record<ItemId, Item> = {
  flashlight: {
    id: 'flashlight',
    name: 'Linterna',
    icon: 'Flashlight',
    description:
      'Linterna LED. Sosteniéndola en la mano iluminás lo que mires. Imprescindible en lugares oscuros.',
    // No onUse — it's a passive enabler. Just having it triggers the light cone.
  },
  lid: {
    id: 'lid',
    name: 'Tapa de sartén',
    icon: 'Lid',
    description: 'Una tapa metálica. Sirve para sofocar un incendio cortando el oxígeno.',
    onUse: [
      {
        type: 'applyIf',
        condition: FIRE_IS_ACTIVE,
        then: extinguishKitchen({
          text:
            'Tapaste la sartén con cuidado y cortaste el gas. El fuego se asfixió por falta de oxígeno.',
        }),
        else: [
          {
            type: 'dialog',
            text: 'No hay nada que tapar acá.',
            tone: 'info',
          },
        ],
      },
    ],
  },
  baking_soda: {
    id: 'baking_soda',
    name: 'Bicarbonato',
    icon: 'BakingSoda',
    description: 'Caja de bicarbonato. Útil para sofocar pequeñas llamas en aceite.',
    onUse: [
      {
        type: 'applyIf',
        condition: FIRE_IS_ACTIVE,
        then: [
          ...extinguishKitchen({
            text:
              'Tirás bicarbonato sobre las llamas. Reacciona, libera CO₂ y sofoca el fuego. Funciona en llamas chicas; en una bola grande no alcanza.',
          }),
          { type: 'removeItem', itemId: 'baking_soda' },
        ],
        else: [
          {
            type: 'dialog',
            text: 'Mejor lo guardás para otra ocasión.',
            tone: 'info',
          },
        ],
      },
    ],
  },
  extinguisher_a: {
    id: 'extinguisher_a',
    name: 'Matafuegos Clase A',
    icon: 'ExtinguisherA',
    description: 'Para sólidos: madera, papel, tela. No es ideal para aceite.',
    onUse: [
      {
        type: 'applyIf',
        condition: FIRE_IS_ACTIVE,
        then: [
          { type: 'loseLife', amount: 1 },
          {
            type: 'dialog',
            text:
              'El Clase A es para sólidos. En aceite ardiendo el chorro disperse las llamas — el fuego empeora y te exponés. Buscá un Clase K.',
            tone: 'error',
          },
        ],
        else: [
          {
            type: 'dialog',
            text: 'Mejor guardalo para incendios de sólidos (madera, papel).',
            tone: 'info',
          },
        ],
      },
    ],
  },
  extinguisher_k: {
    id: 'extinguisher_k',
    name: 'Matafuegos Clase K',
    icon: 'ExtinguisherK',
    description: 'Específico para grasas y aceites de cocina. El correcto para sartenes.',
    onUse: [
      {
        type: 'applyIf',
        condition: FIRE_IS_ACTIVE,
        then: [
          ...extinguishKitchen({
            text:
              'Disparás el matafuegos Clase K sobre la sartén. La llama se extingue de inmediato y el agente forma una capa que evita la reignición. Manual de seguridad doméstica, libro cerrado.',
          }),
          { type: 'removeItem', itemId: 'extinguisher_k' },
        ],
        else: [
          {
            type: 'dialog',
            text: 'No hay fuego que apagar acá. Lo guardás.',
            tone: 'info',
          },
        ],
      },
    ],
  },
  keys: {
    id: 'keys',
    name: 'Llaves de la puerta',
    icon: 'Keys',
    description: 'Las llaves para abrir la puerta principal.',
    onUse: [
      {
        type: 'dialog',
        text:
          'Para usar las llaves, acercate a la puerta principal en la cocina.',
        tone: 'info',
      },
    ],
  },
}

export function getItem(id: ItemId): Item | undefined {
  return ITEMS[id]
}
