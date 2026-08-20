import type { VocabItem } from '../types/content'
import { constructionVocab } from './vocab.construction'
import { lifeVocab, grammarVocab } from './vocab.life'
import { binyanVocab } from './binyanim'

export const allVocab: VocabItem[] = [...constructionVocab, ...lifeVocab, ...grammarVocab, ...binyanVocab]

export const vocabById: Record<string, VocabItem> = Object.fromEntries(
  allVocab.map((item) => [item.id, item]),
)

export { lessonUnits, milestoneDefs } from './lessons'
export type { MilestoneDef } from './lessons'
export { scenarios } from './scenarios'
export { binyanConcepts } from './binyanim'
