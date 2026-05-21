import type { Level, LevelId } from '@/types/game'
import { LEVEL_01_KITCHEN } from './level-01-kitchen'
import { LEVEL_02_ATTIC } from './level-02-attic'
import { LEVEL_03_STATION } from './level-03-station'
import { LEVEL_04_TEMPLE } from './level-04-temple'
import { LEVEL_05_LIGHTHOUSE } from './level-05-lighthouse'
import { LEVEL_06_SUBMARINE } from './level-06-submarine'
import { LEVEL_07_TRAIN } from './level-07-train'
import { LEVEL_08_PHARAOH } from './level-08-pharaoh'
import { LEVEL_09_CASINO } from './level-09-casino'
import { LEVEL_10_BUNKER } from './level-10-bunker'
import { LEVEL_11_LAB } from './level-11-lab'
import { LEVEL_12_GREENHOUSE } from './level-12-greenhouse'
import { LEVEL_13_CRIME } from './level-13-crime'
import { LEVEL_14_ASYLUM } from './level-14-asylum'
import { LEVEL_15_PIRATE } from './level-15-pirate'
import { LEVEL_16_VOLCANO } from './level-16-volcano'
import { LEVEL_17_CRYPT } from './level-17-crypt'

export const LEVELS: Level[] = [
  LEVEL_01_KITCHEN,
  LEVEL_02_ATTIC,
  LEVEL_03_STATION,
  LEVEL_04_TEMPLE,
  LEVEL_05_LIGHTHOUSE,
  LEVEL_06_SUBMARINE,
  LEVEL_07_TRAIN,
  LEVEL_08_PHARAOH,
  LEVEL_09_CASINO,
  LEVEL_10_BUNKER,
  LEVEL_11_LAB,
  LEVEL_12_GREENHOUSE,
  LEVEL_13_CRIME,
  LEVEL_14_ASYLUM,
  LEVEL_15_PIRATE,
  LEVEL_16_VOLCANO,
  LEVEL_17_CRYPT,
]

export const LEVELS_BY_ID: Record<LevelId, Level> = Object.fromEntries(
  LEVELS.map((l) => [l.id, l]),
)

export function getLevel(id: LevelId): Level | undefined {
  return LEVELS_BY_ID[id]
}

export function getFirstLevel(): Level {
  return LEVELS[0]
}

export function getNextLevel(currentId: LevelId): Level | null {
  const idx = LEVELS.findIndex((l) => l.id === currentId)
  if (idx === -1 || idx === LEVELS.length - 1) return null
  return LEVELS[idx + 1]
}
