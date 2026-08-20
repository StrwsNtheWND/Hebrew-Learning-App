import type { LessonUnit } from '../types/content'

export const lessonUnits: LessonUnit[] = [
  { id: 'lu-safety', domain: 'site-safety', title: 'Site Safety Essentials', description: 'PPE, hazard signage, and accident vocabulary you need on day one.', itemIds: ['cs-01','cs-02','cs-03','cs-04','cs-05','cs-06','cs-07','cs-08','cs-09','cs-10','cs-11','cs-12','cs-13','cs-14','cs-15'], order: 1 },
  { id: 'lu-blueprints', domain: 'blueprints-permits', title: 'Blueprints & Permits', description: 'Reading plans, permits, and the Israeli approval process (Tofes 4 and friends).', itemIds: ['cb-01','cb-02','cb-03','cb-04','cb-05','cb-06','cb-07','cb-08','cb-09','cb-10','cb-11','cb-12','cb-13','cb-14'], order: 2 },
  { id: 'lu-subcontractors', domain: 'subcontractors', title: 'Working with Subcontractors & Vendors', description: 'Invoices, orders, delays, and getting a straight answer out of a supplier.', itemIds: ['cv-01','cv-02','cv-03','cv-04','cv-05','cv-06','cv-07','cv-08','cv-09','cv-10','cv-11','cv-12','cv-13','cv-14','cv-15'], order: 3 },
  { id: 'lu-budgeting', domain: 'budgeting-scheduling', title: 'Budget & Scheduling Talk', description: 'The vocabulary of status reports and money conversations.', itemIds: ['cd-01','cd-02','cd-03','cd-04','cd-05','cd-06','cd-07','cd-08','cd-09','cd-10'], order: 4 },
  { id: 'lu-clients', domain: 'client-inspector', title: 'Clients & Inspectors', description: 'Formal register for updates, meetings, and handling violations gracefully.', itemIds: ['ci-01','ci-02','ci-03','ci-04','ci-05','ci-06','ci-07','ci-08','ci-09','ci-10'], order: 5 },
  { id: 'lu-sitetalk', domain: 'site-talk', title: 'On-Site Talk', description: 'The direct, no-frills Hebrew crews actually use — tone matters as much as words.', itemIds: ['st-01','st-02','st-03','st-04','st-05','st-06','st-07','st-08','st-09','st-10','st-11','st-12','st-13','st-14','st-15'], order: 6 },
  { id: 'lu-grammar', domain: 'core-grammar', title: 'Core Patterns for Work', description: 'Reusable sentence frames: need to, must, by when, I will update you.', itemIds: ['gr-01','gr-02','gr-03','gr-04','gr-05','gr-06','gr-07','gr-08','gr-09','gr-10'], order: 7 },
  { id: 'lu-banking', domain: 'banking-finance', title: 'Banking & Finance', description: 'Opening accounts, understanding a payslip, setting up direct debits.', itemIds: ['lb-01','lb-02','lb-03','lb-04','lb-05','lb-06','lb-07','lb-08'], order: 8 },
  { id: 'lu-housing', domain: 'housing', title: 'Housing & Apartments', description: 'Renting, landlords, and the building committee.', itemIds: ['lh-01','lh-02','lh-03','lh-04','lh-05','lh-06','lh-07','lh-08','lh-09','lh-10'], order: 9 },
  { id: 'lu-bureaucracy', domain: 'bureaucracy', title: 'Bureaucracy & Government', description: 'Misrad HaPnim, Bituach Leumi, and the forms every new immigrant needs.', itemIds: ['lg-01','lg-02','lg-03','lg-04','lg-05','lg-06','lg-07','lg-08','lg-09','lg-10'], order: 10 },
  { id: 'lu-daily', domain: 'daily-life', title: 'Daily Life Basics', description: 'Polite essentials and everyday survival phrases.', itemIds: ['ld-01','ld-02','ld-03','ld-04','ld-05','ld-06','ld-07','ld-08','ld-09','ld-10'], order: 11 },
]

/** Milestones are earned automatically from real progress data — not arbitrary badges. */
export interface MilestoneDef {
  id: string
  label: string
  detail: string
  check: (stats: { wordsMastered: number; lessonsCompleted: number; scenariosCompleted: number; longestStreakDays: number; domainsAtStrong: number }) => boolean
}

export const milestoneDefs: MilestoneDef[] = [
  { id: 'words-50', label: '50 Words Learned', detail: "You've reached mastery-track on 50 words and phrases.", check: (s) => s.wordsMastered >= 50 },
  { id: 'words-150', label: '150 Words Learned', detail: 'A real working vocabulary — 150 words in progress or mastered.', check: (s) => s.wordsMastered >= 150 },
  { id: 'words-300', label: '300 Words Learned', detail: 'Full starter deck territory — 300 words in progress or mastered.', check: (s) => s.wordsMastered >= 300 },
  { id: 'lessons-5', label: '5 Lessons Completed', detail: 'Five lesson units finished start to finish.', check: (s) => s.lessonsCompleted >= 5 },
  { id: 'lessons-all', label: 'Full Curriculum Covered', detail: 'Every starter lesson unit completed at least once.', check: (s) => s.lessonsCompleted >= 11 },
  { id: 'scenario-1', label: 'First Mock Conversation', detail: 'Completed your first simulated work conversation.', check: (s) => s.scenariosCompleted >= 1 },
  { id: 'scenario-10', label: '10 Mock Conversations', detail: "Ten simulated conversations down — that's real fluency practice.", check: (s) => s.scenariosCompleted >= 10 },
  { id: 'streak-7', label: '7-Day Streak', detail: 'Seven consecutive days of practice.', check: (s) => s.longestStreakDays >= 7 },
  { id: 'streak-30', label: '30-Day Streak', detail: 'A full month of consistent practice.', check: (s) => s.longestStreakDays >= 30 },
  { id: 'domain-strong-3', label: '3 Domains at "Strong"', detail: 'Rolling accuracy is strong across three topic areas.', check: (s) => s.domainsAtStrong >= 3 },
  { id: 'domain-strong-all', label: 'All Domains at "Strong"', detail: 'Every topic area — work and life — is at strong rolling accuracy.', check: (s) => s.domainsAtStrong >= 11 },
]
