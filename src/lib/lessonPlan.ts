import type { VocabItem } from '../types/content'
import { shuffle } from './random'

export interface LessonStep {
  type: 'teach' | 'quiz'
  item: VocabItem
  /** Was this item never-reviewed at the start of this session? Drives both
   *  whether it gets a TeachCard and whether its quiz is recognition-only. */
  isNew: boolean
}

// How many new words get taught before any of them are quizzed. Small
// enough to hold in working memory, big enough that a quiz never lands
// right after the same word was just shown — every quiz in a batch has at
// least one, usually several, other words in between it and its teaching.
const TEACH_BATCH_SIZE = 5

/**
 * Turns a flat list of lesson/review items into an ordered plan of
 * teach/quiz steps: new items are taught in batches, then each batch is
 * quizzed back in shuffled order (never the order it was taught in, and
 * never immediately after teaching). Already-known items skip teaching and
 * go straight into their own shuffled quiz round.
 */
export function buildLessonPlan(items: VocabItem[], isNew: (id: string) => boolean): LessonStep[] {
  const newItems = items.filter((i) => isNew(i.id))
  const knownItems = items.filter((i) => !isNew(i.id))

  const steps: LessonStep[] = []

  for (let i = 0; i < newItems.length; i += TEACH_BATCH_SIZE) {
    const batch = newItems.slice(i, i + TEACH_BATCH_SIZE)
    for (const item of batch) steps.push({ type: 'teach', item, isNew: true })

    const quizOrder = shuffle(batch)
    // Guarantee the last word taught isn't also the very first one quizzed
    // — otherwise the shuffle can still (by chance) put a quiz immediately
    // after its own teach card with nothing in between.
    const lastTaught = batch[batch.length - 1]
    if (quizOrder.length > 1 && quizOrder[0].id === lastTaught.id) {
      ;[quizOrder[0], quizOrder[1]] = [quizOrder[1], quizOrder[0]]
    }
    for (const item of quizOrder) steps.push({ type: 'quiz', item, isNew: true })
  }

  if (knownItems.length > 0) {
    for (const item of shuffle(knownItems)) steps.push({ type: 'quiz', item, isNew: false })
  }

  return steps
}

export function countQuizSteps(steps: LessonStep[]): number {
  return steps.filter((s) => s.type === 'quiz').length
}
