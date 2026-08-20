import type { VocabItem } from '../types/content'

export const lifeVocab: VocabItem[] = [
  // --- Banking & finance ---
  { id: 'lb-01', domain: 'banking-finance', register: 'formal', kind: 'phrase', hebrew: 'חשבון בנק', transliteration: 'cheshbon bank', english: 'bank account', difficulty: 1 },
  { id: 'lb-02', domain: 'banking-finance', register: 'formal', kind: 'phrase', hebrew: 'העברה בנקאית', transliteration: 'ha\'avara bankait', english: 'bank transfer', difficulty: 2 },
  { id: 'lb-03', domain: 'banking-finance', register: 'formal', kind: 'phrase', hebrew: 'כרטיס אשראי', transliteration: 'kartis ashrai', english: 'credit card', difficulty: 1 },
  { id: 'lb-04', domain: 'banking-finance', register: 'formal', kind: 'word', hebrew: 'משכנתא', transliteration: 'mashkanta', english: 'mortgage', difficulty: 3 },
  { id: 'lb-05', domain: 'banking-finance', register: 'formal', kind: 'word', hebrew: 'ריבית', transliteration: 'ribit', english: 'interest (rate)', difficulty: 2 },
  { id: 'lb-06', domain: 'banking-finance', register: 'formal', kind: 'word', hebrew: 'יתרה', transliteration: 'yitra', english: 'balance', difficulty: 2 },
  { id: 'lb-07', domain: 'banking-finance', register: 'formal', kind: 'phrase', hebrew: 'הוראת קבע', transliteration: "hora'at keva", english: 'standing order / direct debit', difficulty: 3 },
  { id: 'lb-08', domain: 'banking-finance', register: 'formal', kind: 'phrase', hebrew: 'תלוש משכורת', transliteration: 'talush maskoret', english: 'pay slip', difficulty: 2 },

  // --- Housing ---
  { id: 'lh-01', domain: 'housing', register: 'formal', kind: 'word', hebrew: 'שכירות', transliteration: 'schirut', english: 'rent', difficulty: 1 },
  { id: 'lh-02', domain: 'housing', register: 'formal', kind: 'phrase', hebrew: 'חוזה שכירות', transliteration: 'chuze schirut', english: 'rental contract / lease', difficulty: 2 },
  { id: 'lh-03', domain: 'housing', register: 'formal', kind: 'word', hebrew: 'ערבות', transliteration: 'arvut', english: 'guarantee (deposit or guarantor arrangement)', difficulty: 2 },
  { id: 'lh-04', domain: 'housing', register: 'formal', kind: 'phrase', hebrew: 'דמי תיווך', transliteration: 'dmei tivuch', english: "broker's fee", difficulty: 3 },
  { id: 'lh-05', domain: 'housing', register: 'formal', kind: 'phrase', hebrew: 'ועד בית', transliteration: 'va\'ad bayit', english: 'building committee / HOA', difficulty: 2 },
  { id: 'lh-06', domain: 'housing', register: 'formal', kind: 'word', hebrew: 'ארנונה', transliteration: 'arnona', english: 'municipal property tax', difficulty: 2 },
  { id: 'lh-07', domain: 'housing', register: 'formal', kind: 'word', hebrew: 'שיפוץ', transliteration: 'shiputz', english: 'renovation', difficulty: 1 },
  { id: 'lh-08', domain: 'housing', register: 'formal', kind: 'phrase', hebrew: 'בעל הבית', transliteration: 'ba\'al habayit', english: 'landlord', difficulty: 1 },
  { id: 'lh-09', domain: 'housing', register: 'casual', kind: 'sentence', hebrew: 'כמה עולה השכירות בחודש?', transliteration: 'kama ole haschirut bachodesh?', english: 'how much is the rent per month?', difficulty: 2 },
  { id: 'lh-10', domain: 'housing', register: 'formal', kind: 'sentence', hebrew: 'מתי אפשר לעבור דירה?', transliteration: "matai efshar la'avor dira?", english: 'when can we move into the apartment?', difficulty: 2 },

  // --- Bureaucracy & government ---
  { id: 'lg-01', domain: 'bureaucracy', register: 'formal', kind: 'phrase', hebrew: 'משרד הפנים', transliteration: 'misrad hapnim', english: 'Ministry of Interior', difficulty: 1 },
  { id: 'lg-02', domain: 'bureaucracy', register: 'formal', kind: 'phrase', hebrew: 'תעודת זהות', transliteration: 'te\'udat zehut', english: 'ID card', difficulty: 1 },
  { id: 'lg-03', domain: 'bureaucracy', register: 'formal', kind: 'phrase', hebrew: 'רישיון נהיגה', transliteration: 'rishayon nehiga', english: "driver's license", difficulty: 2 },
  { id: 'lg-04', domain: 'bureaucracy', register: 'formal', kind: 'phrase', hebrew: 'עולה חדש', transliteration: 'ole chadash', english: 'new immigrant (m.)', notes: 'ole chadasha for f. — a status word you will use constantly for your first year.', difficulty: 2 },
  { id: 'lg-05', domain: 'bureaucracy', register: 'formal', kind: 'phrase', hebrew: 'ביטוח לאומי', transliteration: 'bituach leumi', english: 'National Insurance (social security)', difficulty: 2 },
  { id: 'lg-06', domain: 'bureaucracy', register: 'formal', kind: 'phrase', hebrew: 'קופת חולים', transliteration: 'kupat cholim', english: 'health fund / HMO', difficulty: 2 },
  { id: 'lg-07', domain: 'bureaucracy', register: 'formal', kind: 'word', hebrew: 'תור', transliteration: 'tor', english: 'appointment / turn in line', difficulty: 1 },
  { id: 'lg-08', domain: 'bureaucracy', register: 'formal', kind: 'word', hebrew: 'טופס', transliteration: 'tofes', english: 'form (document)', difficulty: 1 },
  { id: 'lg-09', domain: 'bureaucracy', register: 'formal', kind: 'word', hebrew: 'אישור', transliteration: 'ishur', english: 'approval / confirmation', difficulty: 1 },
  { id: 'lg-10', domain: 'bureaucracy', register: 'formal', kind: 'sentence', hebrew: 'איפה אני לוקח/ת תור?', transliteration: 'eifo ani lokeach/lokachat tor?', english: 'where do I get an appointment/number?', difficulty: 2 },

  // --- Daily life ---
  { id: 'ld-01', domain: 'daily-life', register: 'casual', kind: 'word', hebrew: 'בבקשה', transliteration: 'bevakasha', english: 'please / here you go / you\'re welcome', difficulty: 1 },
  { id: 'ld-02', domain: 'daily-life', register: 'casual', kind: 'phrase', hebrew: 'תודה רבה', transliteration: 'toda raba', english: 'thank you very much', difficulty: 1 },
  { id: 'ld-03', domain: 'daily-life', register: 'casual', kind: 'word', hebrew: 'סליחה', transliteration: 'slicha', english: 'excuse me / sorry', difficulty: 1 },
  { id: 'ld-04', domain: 'daily-life', register: 'casual', kind: 'sentence', hebrew: 'כמה זה עולה?', transliteration: 'kama ze ole?', english: 'how much does this cost?', difficulty: 1 },
  { id: 'ld-05', domain: 'daily-life', register: 'casual', kind: 'sentence', hebrew: 'איפה ה...?', transliteration: 'eifo ha...?', english: 'where is the...?', difficulty: 1 },
  { id: 'ld-06', domain: 'daily-life', register: 'casual', kind: 'sentence', hebrew: 'אני צריך/ה...', transliteration: 'ani tzarich / tzricha...', english: 'I need... (m./f.)', difficulty: 1 },
  { id: 'ld-07', domain: 'daily-life', register: 'casual', kind: 'sentence', hebrew: 'אתה יכול לעזור לי?', transliteration: 'ata yachol la\'azor li?', english: 'can you help me? (to a man)', difficulty: 1 },
  { id: 'ld-08', domain: 'daily-life', register: 'casual', kind: 'sentence', hebrew: 'אני לא מבין/ה', transliteration: 'ani lo mevin / mevina', english: "I don't understand (m./f.)", difficulty: 1 },
  { id: 'ld-09', domain: 'daily-life', register: 'casual', kind: 'sentence', hebrew: 'אפשר לדבר לאט יותר?', transliteration: 'efshar ledaber leat yoter?', english: 'can you speak more slowly?', difficulty: 2 },
  { id: 'ld-10', domain: 'daily-life', register: 'casual', kind: 'sentence', hebrew: 'מה השעה?', transliteration: 'ma hasha\'a?', english: 'what time is it?', difficulty: 1 },
]

export const grammarVocab: VocabItem[] = [
  { id: 'gr-01', domain: 'core-grammar', register: 'formal', kind: 'sentence', hebrew: 'אני צריך ל...', transliteration: 'ani tzarich le...', english: 'I need to... (m.)', notes: 'Core modal — attach any verb infinitive after "le-".', difficulty: 1 },
  { id: 'gr-02', domain: 'core-grammar', register: 'formal', kind: 'sentence', hebrew: 'אפשר...?', transliteration: 'efshar...?', english: 'is it possible to... / may I...?', difficulty: 1 },
  { id: 'gr-03', domain: 'core-grammar', register: 'formal', kind: 'sentence', hebrew: 'אתה חייב ל...', transliteration: 'ata chayav le...', english: 'you must... (to a man)', difficulty: 2 },
  { id: 'gr-04', domain: 'core-grammar', register: 'formal', kind: 'sentence', hebrew: 'אני אעדכן אתכם', transliteration: 'ani a\'adken etchem', english: 'I will update you (future tense, formal plural "you")', notes: 'Future-tense first person — the backbone of status updates.', difficulty: 3 },
  { id: 'gr-05', domain: 'core-grammar', register: 'formal', kind: 'sentence', hebrew: 'עד מתי?', transliteration: 'ad matai?', english: 'by when? / until when?', difficulty: 1 },
  { id: 'gr-06', domain: 'core-grammar', register: 'formal', kind: 'sentence', hebrew: 'כמה זמן זה ייקח?', transliteration: 'kama zman ze yikach?', english: 'how long will this take?', difficulty: 2 },
  { id: 'gr-07', domain: 'core-grammar', register: 'direct', kind: 'sentence', hebrew: 'תעשה את זה עכשיו', transliteration: 'ta\'ase et ze achshav', english: 'do this now (imperative, to a man)', difficulty: 2 },
  { id: 'gr-08', domain: 'core-grammar', register: 'formal', kind: 'sentence', hebrew: 'אם אפשר, אני מבקש/ת ש...', transliteration: 'im efshar, ani mevakesh / mevakeshet she...', english: 'if possible, I would like to request that... (m./f.)', difficulty: 3 },
  { id: 'gr-09', domain: 'core-grammar', register: 'formal', kind: 'sentence', hebrew: 'זה יקרה בעוד...', transliteration: 'ze yikre be\'od...', english: 'this will happen in... (a duration)', difficulty: 3 },
  { id: 'gr-10', domain: 'core-grammar', register: 'formal', kind: 'sentence', hebrew: 'למי אני צריך לפנות?', transliteration: 'lemi ani tzarich lifnot?', english: 'who do I need to contact/turn to?', difficulty: 2 },
]
