import type { VocabItem } from '../types/content'

// Construction / multifamily property-management vocabulary.
// Hebrew given unvocalized (real-world form); hebrewNikkud added where it
// meaningfully disambiguates a word a learner would otherwise mis-stress.

export const constructionVocab: VocabItem[] = [
  // --- Site safety ---
  { id: 'cs-01', domain: 'site-safety', register: 'direct', kind: 'word', hebrew: 'קסדה', hebrewNikkud: 'קַסְדָּה', transliteration: 'kasda', english: 'helmet', difficulty: 1 },
  { id: 'cs-02', domain: 'site-safety', register: 'direct', kind: 'phrase', hebrew: 'אפוד זוהר', transliteration: 'efod zoher', english: 'safety / reflective vest', difficulty: 1 },
  { id: 'cs-03', domain: 'site-safety', register: 'direct', kind: 'phrase', hebrew: 'משקפי מגן', transliteration: 'mishkefei magen', english: 'safety glasses', difficulty: 2 },
  { id: 'cs-04', domain: 'site-safety', register: 'direct', kind: 'phrase', hebrew: 'כפפות עבודה', transliteration: 'kfafot avoda', english: 'work gloves', difficulty: 1 },
  { id: 'cs-05', domain: 'site-safety', register: 'direct', kind: 'phrase', hebrew: 'נעלי בטיחות', transliteration: "na'alei betichut", english: 'safety boots', difficulty: 2 },
  { id: 'cs-06', domain: 'site-safety', register: 'direct', kind: 'word', hebrew: 'פיגום', transliteration: 'pigum', english: 'scaffolding', difficulty: 2 },
  { id: 'cs-07', domain: 'site-safety', register: 'direct', kind: 'word', hebrew: 'מנוף', transliteration: 'manof', english: 'crane', difficulty: 1 },
  { id: 'cs-08', domain: 'site-safety', register: 'formal', kind: 'phrase', hebrew: 'אזור מסוכן', transliteration: 'ezor mesukan', english: 'hazardous area', difficulty: 2 },
  { id: 'cs-09', domain: 'site-safety', register: 'formal', kind: 'phrase', hebrew: 'תאונת עבודה', transliteration: "te'unat avoda", english: 'workplace accident', difficulty: 2, notes: 'Reportable term — used in incident reports and to Bituach Leumi (National Insurance).' },
  { id: 'cs-10', domain: 'site-safety', register: 'formal', kind: 'phrase', hebrew: 'מטף כיבוי אש', transliteration: 'mataf kibui esh', english: 'fire extinguisher', difficulty: 3 },
  { id: 'cs-11', domain: 'site-safety', register: 'formal', kind: 'phrase', hebrew: 'ציוד מגן אישי', transliteration: 'tziud magen ishi', english: 'personal protective equipment (PPE)', difficulty: 3 },
  { id: 'cs-12', domain: 'site-safety', register: 'direct', kind: 'sentence', hebrew: 'תיזהר!', transliteration: 'tizaher!', english: 'Watch out! / Be careful!', exampleHebrew: 'תיזהר, המנוף זז!', exampleEnglish: 'Watch out, the crane is moving!', difficulty: 1 },
  { id: 'cs-13', domain: 'site-safety', register: 'formal', kind: 'phrase', hebrew: 'אסור להיכנס', transliteration: 'asur lehikanes', english: 'no entry / entry forbidden', difficulty: 2 },
  { id: 'cs-14', domain: 'site-safety', register: 'formal', kind: 'phrase', hebrew: 'סכנת נפילה', transliteration: 'sakanat nefila', english: 'fall hazard', difficulty: 3 },
  { id: 'cs-15', domain: 'site-safety', register: 'formal', kind: 'phrase', hebrew: 'חובה לחבוש קסדה', transliteration: 'chova lachvosh kasda', english: 'helmet mandatory (sign wording)', difficulty: 3 },

  // --- Blueprints & permits ---
  { id: 'cb-01', domain: 'blueprints-permits', register: 'formal', kind: 'phrase', hebrew: 'תוכנית בנייה', transliteration: 'tochnit bniya', english: 'building plan / blueprint', difficulty: 2 },
  { id: 'cb-02', domain: 'blueprints-permits', register: 'formal', kind: 'phrase', hebrew: 'היתר בנייה', transliteration: 'heter bniya', english: 'building permit', difficulty: 2 },
  { id: 'cb-03', domain: 'blueprints-permits', register: 'formal', kind: 'word', hebrew: 'תרשים', transliteration: 'tarshim', english: 'diagram / sketch', difficulty: 2 },
  { id: 'cb-04', domain: 'blueprints-permits', register: 'formal', kind: 'phrase', hebrew: 'קנה מידה', transliteration: 'kane mida', english: 'scale (of a drawing)', difficulty: 3 },
  { id: 'cb-05', domain: 'blueprints-permits', register: 'formal', kind: 'phrase', hebrew: 'מפרט טכני', transliteration: 'mifrat techni', english: 'technical specification', difficulty: 3 },
  { id: 'cb-06', domain: 'blueprints-permits', register: 'formal', kind: 'word', hebrew: 'מהנדס', transliteration: 'mehandes', english: 'engineer', difficulty: 1 },
  { id: 'cb-07', domain: 'blueprints-permits', register: 'formal', kind: 'word', hebrew: 'אדריכל', transliteration: 'adrichal', english: 'architect', difficulty: 1 },
  { id: 'cb-08', domain: 'blueprints-permits', register: 'formal', kind: 'word', hebrew: 'קבלן', transliteration: 'kablan', english: 'contractor', difficulty: 1 },
  { id: 'cb-09', domain: 'blueprints-permits', register: 'formal', kind: 'phrase', hebrew: 'קבלן משנה', transliteration: 'kablan mishne', english: 'subcontractor', difficulty: 2 },
  { id: 'cb-10', domain: 'blueprints-permits', register: 'formal', kind: 'word', hebrew: 'רישוי', transliteration: 'rishuy', english: 'licensing / permitting', difficulty: 3 },
  { id: 'cb-11', domain: 'blueprints-permits', register: 'formal', kind: 'phrase', hebrew: 'ועדה מקומית לתכנון ובנייה', transliteration: 'va\'ada mekomit letichnun uvniya', english: 'local planning and building committee', difficulty: 5, notes: 'The municipal body that approves permits — you will hear this a lot.' },
  { id: 'cb-12', domain: 'blueprints-permits', register: 'formal', kind: 'phrase', hebrew: 'טופס 4', transliteration: "tofes arba", english: '"Form 4" — final occupancy/completion certificate', difficulty: 3, notes: 'Israel-specific term: the certificate that legally allows a building to be occupied. Extremely common in multifamily PM conversation.' },
  { id: 'cb-13', domain: 'blueprints-permits', register: 'formal', kind: 'phrase', hebrew: 'תעודת גמר', transliteration: "te'udat gmar", english: 'completion certificate', difficulty: 3 },
  { id: 'cb-14', domain: 'blueprints-permits', register: 'formal', kind: 'phrase', hebrew: 'חריגת בנייה', transliteration: 'chariggat bniya', english: 'building code violation', difficulty: 4 },

  // --- Subcontractors & vendors ---
  { id: 'cv-01', domain: 'subcontractors', register: 'formal', kind: 'word', hebrew: 'ספק', transliteration: 'sapak', english: 'supplier', difficulty: 1 },
  { id: 'cv-02', domain: 'subcontractors', register: 'formal', kind: 'word', hebrew: 'חשבונית', transliteration: 'cheshbonit', english: 'invoice', difficulty: 2 },
  { id: 'cv-03', domain: 'subcontractors', register: 'formal', kind: 'phrase', hebrew: 'הזמנת עבודה', transliteration: 'hazmanat avoda', english: 'work order', difficulty: 2 },
  { id: 'cv-04', domain: 'subcontractors', register: 'formal', kind: 'phrase', hebrew: 'לוח זמנים', transliteration: 'luach zmanim', english: 'schedule / timetable', difficulty: 2 },
  { id: 'cv-05', domain: 'subcontractors', register: 'formal', kind: 'word', hebrew: 'איחור', transliteration: 'ichur', english: 'delay', difficulty: 1 },
  { id: 'cv-06', domain: 'subcontractors', register: 'formal', kind: 'word', hebrew: 'תשלום', transliteration: 'tashlum', english: 'payment', difficulty: 1 },
  { id: 'cv-07', domain: 'subcontractors', register: 'formal', kind: 'word', hebrew: 'מקדמה', transliteration: 'mikdama', english: 'deposit / advance payment', difficulty: 3 },
  { id: 'cv-08', domain: 'subcontractors', register: 'formal', kind: 'word', hebrew: 'ערבות', transliteration: 'arvut', english: 'guarantee / bond', difficulty: 3 },
  { id: 'cv-09', domain: 'subcontractors', register: 'formal', kind: 'word', hebrew: 'חוזה', transliteration: 'chuze', english: 'contract', difficulty: 1 },
  { id: 'cv-10', domain: 'subcontractors', register: 'formal', kind: 'phrase', hebrew: 'הצעת מחיר', transliteration: 'hatzaat mechir', english: 'price quote', difficulty: 2 },
  { id: 'cv-11', domain: 'subcontractors', register: 'formal', kind: 'word', hebrew: 'אספקה', transliteration: 'aspaka', english: 'delivery / supply', difficulty: 2 },
  { id: 'cv-12', domain: 'subcontractors', register: 'formal', kind: 'phrase', hebrew: 'חומרי גלם', transliteration: 'chomrei gelem', english: 'raw materials', difficulty: 3 },
  { id: 'cv-13', domain: 'subcontractors', register: 'direct', kind: 'sentence', hebrew: 'מתי אתם יכולים להגיע?', transliteration: 'matai atem yecholim lehagia?', english: 'When can you get here?', difficulty: 2 },
  { id: 'cv-14', domain: 'subcontractors', register: 'direct', kind: 'sentence', hebrew: 'למה יש איחור?', transliteration: 'lama yesh ichur?', english: 'Why is there a delay?', difficulty: 2 },
  { id: 'cv-15', domain: 'subcontractors', register: 'formal', kind: 'sentence', hebrew: 'אני צריך הצעת מחיר עד יום חמישי', transliteration: 'ani tzarich hatzaat mechir ad yom chamishi', english: 'I need a price quote by Thursday', difficulty: 3 },

  // --- Budgeting & scheduling ---
  { id: 'cd-01', domain: 'budgeting-scheduling', register: 'formal', kind: 'word', hebrew: 'תקציב', transliteration: 'taktziv', english: 'budget', difficulty: 1 },
  { id: 'cd-02', domain: 'budgeting-scheduling', register: 'formal', kind: 'word', hebrew: 'עלות', transliteration: 'alut', english: 'cost', difficulty: 1 },
  { id: 'cd-03', domain: 'budgeting-scheduling', register: 'formal', kind: 'phrase', hebrew: 'חריגה בתקציב', transliteration: 'chariga betaktziv', english: 'budget overrun', difficulty: 4 },
  { id: 'cd-04', domain: 'budgeting-scheduling', register: 'formal', kind: 'phrase', hebrew: 'אבן דרך', transliteration: 'even derech', english: 'milestone', difficulty: 3 },
  { id: 'cd-05', domain: 'budgeting-scheduling', register: 'formal', kind: 'phrase', hebrew: 'תזרים מזומנים', transliteration: 'tazrim mezumanim', english: 'cash flow', difficulty: 4 },
  { id: 'cd-06', domain: 'budgeting-scheduling', register: 'formal', kind: 'phrase', hebrew: 'דוח התקדמות', transliteration: 'doch hitkadmut', english: 'progress report', difficulty: 3 },
  { id: 'cd-07', domain: 'budgeting-scheduling', register: 'formal', kind: 'word', hebrew: 'יעד', transliteration: "ya'ad", english: 'target / goal', difficulty: 2 },
  { id: 'cd-08', domain: 'budgeting-scheduling', register: 'formal', kind: 'phrase', hebrew: 'זמן אספקה', transliteration: 'zman aspaka', english: 'lead time', difficulty: 3 },
  { id: 'cd-09', domain: 'budgeting-scheduling', register: 'formal', kind: 'sentence', hebrew: 'אנחנו בתוך התקציב', transliteration: 'anachnu betoch hataktziv', english: "We're within budget", difficulty: 2 },
  { id: 'cd-10', domain: 'budgeting-scheduling', register: 'formal', kind: 'sentence', hebrew: 'הפרויקט מתעכב בשבועיים', transliteration: 'haproyekt mit\'akev bishvuayim', english: 'The project is delayed by two weeks', difficulty: 4 },

  // --- Clients & inspectors (formal register) ---
  { id: 'ci-01', domain: 'client-inspector', register: 'formal', kind: 'phrase', hebrew: 'מפקח בנייה', transliteration: "mefake'ach bniya", english: 'building inspector', difficulty: 2 },
  { id: 'ci-02', domain: 'client-inspector', register: 'formal', kind: 'sentence', hebrew: 'אני רוצה לעדכן אתכם לגבי...', transliteration: 'ani rotze le\'adken etchem legabei...', english: 'I want to update you regarding...', difficulty: 3 },
  { id: 'ci-03', domain: 'client-inspector', register: 'formal', kind: 'sentence', hebrew: 'לצערי יש עיכוב ב...', transliteration: "letza'ari yesh ikuv be...", english: 'Unfortunately there is a delay in...', difficulty: 3 },
  { id: 'ci-04', domain: 'client-inspector', register: 'formal', kind: 'sentence', hebrew: 'האם ניתן לתאם פגישה?', transliteration: "ha'im niten letaem pgisha?", english: 'Would it be possible to schedule a meeting?', difficulty: 3 },
  { id: 'ci-05', domain: 'client-inspector', register: 'formal', kind: 'phrase', hebrew: 'תודה על הסבלנות', transliteration: 'toda al hasavlanut', english: 'thank you for your patience', difficulty: 2 },
  { id: 'ci-06', domain: 'client-inspector', register: 'formal', kind: 'phrase', hebrew: 'אשמח לעדכן בהמשך', transliteration: 'esmach le\'adken behemshech', english: "I'd be happy to follow up / update further", difficulty: 3 },
  { id: 'ci-07', domain: 'client-inspector', register: 'formal', kind: 'word', hebrew: 'בברכה', transliteration: 'bevracha', english: 'regards (formal email/letter sign-off)', difficulty: 2 },
  { id: 'ci-08', domain: 'client-inspector', register: 'formal', kind: 'word', hebrew: 'לכבוד', transliteration: 'lichvod', english: '"To" (formal letter header, lit. "in honor of")', difficulty: 3 },
  { id: 'ci-09', domain: 'client-inspector', register: 'formal', kind: 'sentence', hebrew: 'הכול מתקדם לפי התוכנית', transliteration: 'hakol mitkadem lefi hatochnit', english: "Everything is progressing according to plan", difficulty: 3 },
  { id: 'ci-10', domain: 'client-inspector', register: 'formal', kind: 'sentence', hebrew: 'אנחנו נדרשים לתקן את החריגה', transliteration: 'anachnu nidrashim letaken et hachariga', english: 'We are required to correct the violation', difficulty: 4 },

  // --- On-site talk (direct register) ---
  { id: 'st-01', domain: 'site-talk', register: 'direct', kind: 'sentence', hebrew: 'בוא הנה', transliteration: 'bo hena', english: 'come here', difficulty: 1 },
  { id: 'st-02', domain: 'site-talk', register: 'direct', kind: 'word', hebrew: 'זוז', transliteration: 'zuz', english: 'move (imperative)', difficulty: 1 },
  { id: 'st-03', domain: 'site-talk', register: 'direct', kind: 'word', hebrew: 'מהר', transliteration: 'maher', english: 'quickly / hurry', difficulty: 1 },
  { id: 'st-04', domain: 'site-talk', register: 'direct', kind: 'word', hebrew: 'עצור', transliteration: 'atzor', english: 'stop', difficulty: 1 },
  { id: 'st-05', domain: 'site-talk', register: 'direct', kind: 'sentence', hebrew: 'תביא לי את זה', transliteration: 'tavi li et ze', english: 'bring me that', difficulty: 1 },
  { id: 'st-06', domain: 'site-talk', register: 'direct', kind: 'sentence', hebrew: 'תעזור לי עם זה', transliteration: 'ta\'azor li im ze', english: 'help me with this', difficulty: 1 },
  { id: 'st-07', domain: 'site-talk', register: 'direct', kind: 'sentence', hebrew: 'מה קורה פה?', transliteration: 'ma kore po?', english: "what's going on here?", difficulty: 1 },
  { id: 'st-08', domain: 'site-talk', register: 'direct', kind: 'sentence', hebrew: 'זה לא בסדר', transliteration: 'ze lo beseder', english: "this isn't right / this is not okay", difficulty: 1 },
  { id: 'st-09', domain: 'site-talk', register: 'direct', kind: 'sentence', hebrew: 'תסיים את זה היום', transliteration: 'tesayem et ze hayom', english: 'finish this today', difficulty: 2 },
  { id: 'st-10', domain: 'site-talk', register: 'direct', kind: 'word', hebrew: 'יאללה', transliteration: 'yalla', english: "come on / let's go", notes: 'Extremely common on-site — used constantly, not rude here.', difficulty: 1 },
  { id: 'st-11', domain: 'site-talk', register: 'direct', kind: 'word', hebrew: 'סבבה', transliteration: 'sababa', english: 'fine / cool / no problem (slang)', difficulty: 1 },
  { id: 'st-12', domain: 'site-talk', register: 'direct', kind: 'phrase', hebrew: 'אין בעיה', transliteration: "ein be'aya", english: 'no problem', difficulty: 1 },
  { id: 'st-13', domain: 'site-talk', register: 'direct', kind: 'sentence', hebrew: 'תוריד את זה למטה', transliteration: 'torid et ze lemata', english: 'take that down / lower it', difficulty: 2 },
  { id: 'st-14', domain: 'site-talk', register: 'direct', kind: 'sentence', hebrew: 'איפה הפועלים?', transliteration: 'eifo hapoalim?', english: 'where are the workers?', difficulty: 2 },
  { id: 'st-15', domain: 'site-talk', register: 'direct', kind: 'sentence', hebrew: 'תסגור את זה טוב', transliteration: 'tisgor et ze tov', english: 'close/secure that properly', difficulty: 2 },
]
