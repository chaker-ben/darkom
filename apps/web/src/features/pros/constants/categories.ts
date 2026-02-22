export const PRO_CATEGORIES = [
  { value: 'plumber', labelFr: 'Plombier', labelAr: '\u0633\u0628\u0627\u0643', labelEn: 'Plumber' },
  { value: 'electrician', labelFr: '\u00c9lectricien', labelAr: '\u0643\u0647\u0631\u0628\u0627\u0626\u064a', labelEn: 'Electrician' },
  { value: 'painter', labelFr: 'Peintre', labelAr: '\u062f\u0647\u0627\u0646', labelEn: 'Painter' },
  { value: 'carpenter', labelFr: 'Menuisier', labelAr: '\u0646\u062c\u0627\u0631', labelEn: 'Carpenter' },
  { value: 'mason', labelFr: 'Ma\u00e7on', labelAr: '\u0628\u0646\u0651\u0627\u0621', labelEn: 'Mason' },
  { value: 'cleaner', labelFr: 'Nettoyage', labelAr: '\u062a\u0646\u0638\u064a\u0641', labelEn: 'Cleaner' },
  { value: 'mover', labelFr: 'D\u00e9m\u00e9nagement', labelAr: '\u0646\u0642\u0644', labelEn: 'Mover' },
  { value: 'ac', labelFr: 'Climatisation', labelAr: '\u062a\u0643\u064a\u064a\u0641', labelEn: 'AC Technician' },
  { value: 'gardener', labelFr: 'Jardinier', labelAr: '\u0628\u0633\u062a\u0627\u0646\u064a', labelEn: 'Gardener' },
  { value: 'other', labelFr: 'Autre', labelAr: '\u0623\u062e\u0631\u0649', labelEn: 'Other' },
] as const;

export type ProCategoryValue = (typeof PRO_CATEGORIES)[number]['value'];
