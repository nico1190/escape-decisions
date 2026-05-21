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
import { GreenhouseScene } from './GreenhouseScene'
import { CrimeScene } from './CrimeScene'
import { AsylumScene } from './AsylumScene'
import { PirateScene } from './PirateScene'
import { VolcanoScene } from './VolcanoScene'
import { CryptScene } from './CryptScene'
import { MirScene } from './MirScene'
import { MansionScene } from './MansionScene'
import { HeistScene } from './HeistScene'
import { DetectiveScene } from './DetectiveScene'

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
  'greenhouse-v1': GreenhouseScene,
  'crime-v1': CrimeScene,
  'asylum-v1': AsylumScene,
  'pirate-v1': PirateScene,
  'volcano-v1': VolcanoScene,
  'crypt-v1': CryptScene,
  'mir-v1': MirScene,
  'mansion-v1': MansionScene,
  'heist-v1': HeistScene,
  'detective-v1': DetectiveScene,
}

export function getScene(key: string | undefined): React.FC<SceneProps> | null {
  if (!key) return null
  return SCENES[key] ?? null
}
