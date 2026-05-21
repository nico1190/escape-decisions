import type { PlayerState } from '@/types/game'
import { KitchenScene } from './KitchenScene'
import { PantryScene } from './PantryScene'
import { AtticScene } from './AtticScene'
import { StationScene } from './StationScene'
import { TempleScene } from './TempleScene'
import { LighthouseScene } from './LighthouseScene'
import { SubmarineScene } from './SubmarineScene'
import { TrainScene } from './TrainScene'
import { PharaohScene } from './PharaohScene'
import { CasinoScene } from './CasinoScene'
import { BunkerScene } from './BunkerScene'
import { LabScene } from './LabScene'

export interface SceneProps {
  state: PlayerState
}

export const SCENES: Record<string, React.FC<SceneProps>> = {
  'kitchen-v1': KitchenScene,
  'pantry-v1': PantryScene,
  'attic-v1': AtticScene,
  'station-v1': StationScene,
  'temple-v1': TempleScene,
  'lighthouse-v1': LighthouseScene,
  'submarine-v1': SubmarineScene,
  'train-v1': TrainScene,
  'pharaoh-v1': PharaohScene,
  'casino-v1': CasinoScene,
  'bunker-v1': BunkerScene,
  'lab-v1': LabScene,
}

export function getScene(key: string | undefined): React.FC<SceneProps> | null {
  if (!key) return null
  return SCENES[key] ?? null
}
