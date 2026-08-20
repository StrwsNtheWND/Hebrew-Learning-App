import type { Domain } from '../types/content'
import type { DifficultyBand, DomainSkill } from '../types/progress'

const EMA_ALPHA = 0.25 // weight given to each new attempt in the rolling accuracy
const PROMOTE_THRESHOLD = 0.85
const DEMOTE_THRESHOLD = 0.55
const MIN_ATTEMPTS_TO_ADAPT = 5

export function createInitialDomainSkill(domain: Domain): DomainSkill {
  return {
    domain,
    rollingAccuracy: 0.7, // neutral prior so day-one lessons aren't artificially easy or hard
    attemptsConsidered: 0,
    currentBand: 'standard',
    updatedAt: Date.now(),
  }
}

export function updateDomainSkill(skill: DomainSkill, correct: boolean, score: number): DomainSkill {
  const observed = correct ? Math.max(0.6, score) : score * 0.5
  const attemptsConsidered = skill.attemptsConsidered + 1
  const rollingAccuracy =
    attemptsConsidered <= 3
      ? (skill.rollingAccuracy * skill.attemptsConsidered + observed) / attemptsConsidered
      : skill.rollingAccuracy * (1 - EMA_ALPHA) + observed * EMA_ALPHA

  let currentBand: DifficultyBand = skill.currentBand
  if (attemptsConsidered >= MIN_ATTEMPTS_TO_ADAPT) {
    if (rollingAccuracy >= PROMOTE_THRESHOLD) currentBand = 'stretch'
    else if (rollingAccuracy <= DEMOTE_THRESHOLD) currentBand = 'foundation'
    else currentBand = 'standard'
  }

  return { ...skill, rollingAccuracy, attemptsConsidered, currentBand, updatedAt: Date.now() }
}

/** Difficulty (1-5) range to prefer when selecting new items/lessons for a band. */
export function difficultyRangeForBand(band: DifficultyBand): [number, number] {
  switch (band) {
    case 'foundation':
      return [1, 2]
    case 'stretch':
      return [3, 5]
    default:
      return [1, 4]
  }
}

export const BAND_LABELS: Record<DifficultyBand, string> = {
  foundation: 'Building the foundation',
  standard: 'On track',
  stretch: 'Ready for a challenge',
}
