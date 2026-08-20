import type { GrammarConcept, VocabItem } from '../types/content'

// The seven binyanim (verb patterns/templates) that every Hebrew verb is
// built from. Knowing them turns "memorize every verb form individually"
// into "recognize the pattern, conjugate anything." Concepts are taught
// (ConceptCard) before their example verbs are ever quizzed.

export const binyanConcepts = {
  paal: {
    title: 'Simple active — the default pattern',
    hebrewName: 'פָּעַל (קַל)',
    meaning: 'Basic, plain actions: write, learn, live, run',
    explanation:
      "Pa'al (also called Kal, \"simple\") is the default, unadorned verb pattern — most common everyday verbs use it. There's no added meaning layered on: the subject just does the action.",
    exampleRoot: 'כ-ת-ב',
    exampleInfinitive: { hebrew: 'לכתוב', transliteration: 'likhtov', english: 'to write' },
    presentTense: [
      { person: 'I / he (m.)', hebrew: 'כותב', transliteration: 'kotev' },
      { person: 'I / she (f.)', hebrew: 'כותבת', transliteration: 'kotevet' },
      { person: 'they (m.)', hebrew: 'כותבים', transliteration: 'kotvim' },
      { person: 'they (f.)', hebrew: 'כותבות', transliteration: 'kotvot' },
    ],
    pastExample: { hebrew: 'כתבתי', transliteration: 'katavti', english: 'I wrote' },
  },
  nifal: {
    title: 'Passive / reflexive of Pa\'al',
    hebrewName: 'נִפְעַל',
    meaning: 'Something happens to the subject, or it happens by itself: break, enter, meet',
    explanation:
      "Nif'al usually marks the passive or reflexive counterpart of a Pa'al action — the subject undergoes the action rather than performing it on something else. \"The glass broke\" (by itself), not \"someone broke the glass.\"",
    exampleRoot: 'ש-ב-ר',
    exampleInfinitive: { hebrew: 'להישבר', transliteration: 'lehishaver', english: 'to break / get broken' },
    presentTense: [
      { person: 'I / he (m.)', hebrew: 'נשבר', transliteration: 'nishbar' },
      { person: 'I / she (f.)', hebrew: 'נשברת', transliteration: 'nishberet' },
      { person: 'they (m.)', hebrew: 'נשברים', transliteration: 'nishbarim' },
      { person: 'they (f.)', hebrew: 'נשברות', transliteration: 'nishbarot' },
    ],
    pastExample: { hebrew: 'נשברתי', transliteration: 'nishbarti', english: 'I broke (down) / was broken' },
  },
  piel: {
    title: 'Intensive active',
    hebrewName: 'פִּיעֵל',
    meaning: 'Repeated, intensive, or effortful actions: speak, request, hike',
    explanation:
      "Pi'el often adds intensity or repetition to a root's basic meaning, or is simply the pattern a verb happens to use — plenty of everyday verbs (speak, request) are Pi'el with no \"extra\" meaning you need to track, you just need to recognize the conjugation shape.",
    exampleRoot: 'ד-ב-ר',
    exampleInfinitive: { hebrew: 'לדבר', transliteration: 'ledaber', english: 'to speak' },
    presentTense: [
      { person: 'I / he (m.)', hebrew: 'מדבר', transliteration: 'medaber' },
      { person: 'I / she (f.)', hebrew: 'מדברת', transliteration: 'medaberet' },
      { person: 'they (m.)', hebrew: 'מדברים', transliteration: 'medabrim' },
      { person: 'they (f.)', hebrew: 'מדברות', transliteration: 'medabrot' },
    ],
    pastExample: { hebrew: 'דיברתי', transliteration: 'dibarti', english: 'I spoke' },
  },
  pual: {
    title: "Passive of Pi'el",
    hebrewName: 'פּוּעַל',
    meaning: 'Something was done to it, Pi\'el-style: cooked, translated, photographed',
    explanation:
      "Pu'al is the passive partner of Pi'el — used to describe something that had a Pi'el action done to it. It's rarely used in first person (you don't usually say \"I am cooked\") — mostly you'll meet it as a description: \"the food is cooked,\" \"the book is translated.\"",
    exampleRoot: 'ב-ש-ל',
    exampleInfinitive: { hebrew: 'מבושל', transliteration: 'mevushal', english: 'cooked (adjective/passive form — no common infinitive)' },
    presentTense: [
      { person: 'm. singular (it/he)', hebrew: 'מבושל', transliteration: 'mevushal' },
      { person: 'f. singular (it/she)', hebrew: 'מבושלת', transliteration: 'mevushelet' },
      { person: 'm. plural', hebrew: 'מבושלים', transliteration: 'mevushalim' },
      { person: 'f. plural', hebrew: 'מבושלות', transliteration: 'mevushalot' },
    ],
    pastExample: { hebrew: 'האוכל בושל', transliteration: 'ha\'ochel bushal', english: 'the food was cooked' },
  },
  hifil: {
    title: 'Causative active',
    hebrewName: 'הִפְעִיל',
    meaning: 'Making something happen, causing an effect: explain, invite, feel',
    explanation:
      'Hif\'il typically adds a "causing" or "making happen" layer to the root — hisbir ("explained") literally means "caused to understand." It\'s extremely common in everyday speech, not just formal contexts.',
    exampleRoot: 'ס-ב-ר',
    exampleInfinitive: { hebrew: 'להסביר', transliteration: 'lehasbir', english: 'to explain' },
    presentTense: [
      { person: 'I / he (m.)', hebrew: 'מסביר', transliteration: 'masbir' },
      { person: 'I / she (f.)', hebrew: 'מסבירה', transliteration: 'masbira' },
      { person: 'they (m.)', hebrew: 'מסבירים', transliteration: 'masbirim' },
      { person: 'they (f.)', hebrew: 'מסבירות', transliteration: 'masbirot' },
    ],
    pastExample: { hebrew: 'הסברתי', transliteration: 'hisbarti', english: 'I explained' },
  },
  hufal: {
    title: "Passive of Hif'il",
    hebrewName: 'הֻפְעַל',
    meaning: 'Something was caused/made to happen to it: explained (to), invited, felt',
    explanation:
      "Huf'al is the passive partner of Hif'il. Like Pu'al, it's mostly used in third person to describe a state something was put into — \"he was invited,\" \"it was explained\" — rather than as something you'd say about yourself.",
    exampleRoot: 'ס-ב-ר',
    exampleInfinitive: { hebrew: 'מוסבר', transliteration: 'musbar', english: 'explained (adjective/passive form — no common infinitive)' },
    presentTense: [
      { person: 'm. singular (it/he)', hebrew: 'מוסבר', transliteration: 'musbar' },
      { person: 'f. singular (it/she)', hebrew: 'מוסברת', transliteration: 'musberet' },
      { person: 'm. plural', hebrew: 'מוסברים', transliteration: 'musbarim' },
      { person: 'f. plural', hebrew: 'מוסברות', transliteration: 'musbarot' },
    ],
    pastExample: { hebrew: 'זה הוסבר לי', transliteration: 'ze husbar li', english: 'it was explained to me' },
  },
  hitpael: {
    title: 'Reflexive / reciprocal active',
    hebrewName: 'הִתְפַּעֵל',
    meaning: 'Doing something to/for yourself, or to each other: get dressed, train, meet up',
    explanation:
      "Hitpa'el marks actions the subject does to themselves (getting dressed, showering) or actions done mutually between people. The telltale sign is the hit- prefix at the start of the root.",
    exampleRoot: 'ל-ב-ש',
    exampleInfinitive: { hebrew: 'להתלבש', transliteration: 'lehitlabesh', english: 'to get dressed' },
    presentTense: [
      { person: 'I / he (m.)', hebrew: 'מתלבש', transliteration: 'mitlabesh' },
      { person: 'I / she (f.)', hebrew: 'מתלבשת', transliteration: 'mitlabeshet' },
      { person: 'they (m.)', hebrew: 'מתלבשים', transliteration: 'mitlabshim' },
      { person: 'they (f.)', hebrew: 'מתלבשות', transliteration: 'mitlabshot' },
    ],
    pastExample: { hebrew: 'התלבשתי', transliteration: 'hitlabashti', english: 'I got dressed' },
  },
} satisfies Record<string, GrammarConcept>

export const binyanVocab: VocabItem[] = [
  // Pa'al
  { id: 'bp-01', domain: 'binyanim', register: 'formal', kind: 'word', hebrew: 'לכתוב', transliteration: 'likhtov', english: 'to write', notes: "Pa'al — the default, unadorned pattern.", difficulty: 4 },
  { id: 'bp-02', domain: 'binyanim', register: 'formal', kind: 'word', hebrew: 'לומד', transliteration: 'lomed', english: 'learning / studies (present)', notes: "Pa'al of ל-מ-ד.", difficulty: 4 },
  { id: 'bp-03', domain: 'binyanim', register: 'formal', kind: 'word', hebrew: 'גר', transliteration: 'gar', english: 'lives / resides (present)', notes: "Pa'al of ג-ו-ר.", difficulty: 4 },
  // Nif'al
  { id: 'bn-01', domain: 'binyanim', register: 'formal', kind: 'word', hebrew: 'להישבר', transliteration: 'lehishaver', english: 'to break / get broken', notes: "Nif'al — passive/reflexive of Pa'al.", difficulty: 5 },
  { id: 'bn-02', domain: 'binyanim', register: 'formal', kind: 'word', hebrew: 'נכנס', transliteration: 'nichnas', english: 'enters / is entering', notes: "Nif'al of כ-נ-ס.", difficulty: 5 },
  { id: 'bn-03', domain: 'binyanim', register: 'formal', kind: 'word', hebrew: 'נפגש', transliteration: 'nifgash', english: 'meets (with someone)', notes: "Nif'al of פ-ג-ש — reciprocal meeting.", difficulty: 5 },
  // Pi'el
  { id: 'bi-01', domain: 'binyanim', register: 'formal', kind: 'word', hebrew: 'לדבר', transliteration: 'ledaber', english: 'to speak', notes: "Pi'el.", difficulty: 4 },
  { id: 'bi-02', domain: 'binyanim', register: 'formal', kind: 'word', hebrew: 'מבקש', transliteration: 'mevakesh', english: 'requests / is requesting', notes: "Pi'el of ב-ק-ש.", difficulty: 4 },
  { id: 'bi-03', domain: 'binyanim', register: 'formal', kind: 'word', hebrew: 'מטייל', transliteration: 'metayel', english: 'hikes / travels', notes: "Pi'el of ט-י-ל.", difficulty: 4 },
  // Pu'al
  { id: 'bu-01', domain: 'binyanim', register: 'formal', kind: 'word', hebrew: 'מבושל', transliteration: 'mevushal', english: 'cooked (passive)', notes: "Pu'al — passive of Pi'el.", difficulty: 5 },
  { id: 'bu-02', domain: 'binyanim', register: 'formal', kind: 'word', hebrew: 'מתורגם', transliteration: 'meturgam', english: 'translated (passive)', notes: "Pu'al of ת-ר-ג-ם.", difficulty: 5 },
  { id: 'bu-03', domain: 'binyanim', register: 'formal', kind: 'word', hebrew: 'מצולם', transliteration: 'metzulam', english: 'photographed (passive)', notes: "Pu'al of צ-ל-ם.", difficulty: 5 },
  // Hif'il
  { id: 'bh-01', domain: 'binyanim', register: 'formal', kind: 'word', hebrew: 'להסביר', transliteration: 'lehasbir', english: 'to explain', notes: "Hif'il — causative.", difficulty: 4 },
  { id: 'bh-02', domain: 'binyanim', register: 'formal', kind: 'word', hebrew: 'מזמין', transliteration: 'mazmin', english: 'invites / orders', notes: "Hif'il of ז-מ-ן.", difficulty: 4 },
  { id: 'bh-03', domain: 'binyanim', register: 'formal', kind: 'word', hebrew: 'מרגיש', transliteration: 'margish', english: 'feels', notes: "Hif'il of ר-ג-ש.", difficulty: 4 },
  // Huf'al
  { id: 'bf-01', domain: 'binyanim', register: 'formal', kind: 'word', hebrew: 'מוסבר', transliteration: 'musbar', english: 'explained (passive)', notes: "Huf'al — passive of Hif'il.", difficulty: 5 },
  { id: 'bf-02', domain: 'binyanim', register: 'formal', kind: 'word', hebrew: 'מוזמן', transliteration: 'muzman', english: 'invited (passive)', notes: "Huf'al of ז-מ-ן.", difficulty: 5 },
  { id: 'bf-03', domain: 'binyanim', register: 'formal', kind: 'word', hebrew: 'מורגש', transliteration: 'murgash', english: 'felt / noticeable (passive)', notes: "Huf'al of ר-ג-ש.", difficulty: 5 },
  // Hitpa'el
  { id: 'bt-01', domain: 'binyanim', register: 'formal', kind: 'word', hebrew: 'להתלבש', transliteration: 'lehitlabesh', english: 'to get dressed', notes: "Hitpa'el — reflexive.", difficulty: 4 },
  { id: 'bt-02', domain: 'binyanim', register: 'formal', kind: 'word', hebrew: 'מתרחץ', transliteration: 'mitrachetz', english: 'showers / is showering', notes: "Hitpa'el of ר-ח-ץ.", difficulty: 4 },
  { id: 'bt-03', domain: 'binyanim', register: 'formal', kind: 'word', hebrew: 'מתאמן', transliteration: "mit'amen", english: 'trains / practices', notes: "Hitpa'el of א-מ-ן.", difficulty: 4 },
]
