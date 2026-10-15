export const EVENT_TAXONOMY_VERSION='2026-10-05-v2';
// Presentation-only categories. Original source values and event records are never mutated.
// Disciplines describe riding; formats describe participation; purposes are independent.
const groups = {
 disciplines: {
  Road: ['road'], Gravel: ['gravel','gravel ride'], 'Mountain bike': ['mountain','mountain bike','mtb'],
  'Paved trail': ['paved trail']
 },
 formats: {
  Race: ['race','endurance race','interscholastic race'],
  'General / social ride': ['ride','untimed ride','casual ride','noncompetitive ride','community','community ride','car-free social ride','community festival ride'],
  Tour: ['tour','touring','multi-day tour'], Bikepacking: ['bikepacking'],
  Randonneuring: ['randonneuring','brevet','brevets'], 'Gran fondo': ['gran fondo'],
  Challenge: ['challenge','challenge ride','gravel challenge'],
  Rally: ['rally'],
  'Timed ride': ['timed ride'], 'Hill climb': ['hill climb','competitive climb']
 },
 purposes: { Fundraising: ['charity','charity ride','fundraiser'], Education: ['education'], Festival: ['festival'] },
 details: {
  'Generic ride': ['ride'], 'Untimed ride': ['untimed ride'], 'Casual ride': ['casual ride'],
  'Noncompetitive ride': ['noncompetitive ride'], 'Community ride': ['community','community ride'],
  'Car-free social ride': ['car-free social ride'], 'Community festival ride': ['community festival ride'],
  Recreational: ['recreational'], Endurance: ['endurance','endurance race'], 'E-bike': ['e-bike'],
  'Supported ride': ['supported ride','multi-day supported ride'], 'Self-supported ride': ['self-supported ride'],
  'Multi-day': ['multi-day ride','multi-day tour','two-day ride','multi-day supported ride'],
  'One-day': ['one-day ride'], 'Night ride': ['night ride'], 'Century ride': ['century ride'],
  'Heritage ride': ['heritage ride'], Series: ['series','series finale'], 'Series finale': ['series finale'],
  'State championship': ['state championship'], Interscholastic: ['interscholastic race']
 }
};
const key = value => String(value || '').trim().replace(/\s+/g,' ').toLowerCase();
const unique = values => [...new Set(values)];
function array(value) {
 if (Array.isArray(value)) return value.filter(x => typeof x === 'string' && x.trim());
 if (typeof value !== 'string' || !value.trim()) return [];
 try { const parsed=JSON.parse(value); return Array.isArray(parsed) ? array(parsed) : [value]; }
 catch { return [value]; }
}
function classify(value) {
 const result=[];
 for (const [axis, labels] of Object.entries(groups)) for (const [label, aliases] of Object.entries(labels)) {
  if (key(label)===key(value) || aliases.includes(key(value))) result.push([axis,label]);
 }
 return result;
}
export function eventTaxonomy(event) {
 const raw={
  disciplines: unique([...array(event.disciplines_json),...array(event.disciplines),...array(event.discipline)]),
  types: unique([...array(event.event_types_json),...array(event.event_types),...array(event.event_type),...array(event.rideType)])
 };
 const result={disciplines:[],formats:[],purposes:[],details:[],unknown:[],raw};
 for (const original of [...raw.disciplines,...raw.types]) {
  // Curated records use the exact separator " / "; raw strings above stay intact.
  for (const token of original.split(' / ')) {
   const entries=classify(token);
   if (!entries.length) result.unknown.push(token.trim());
   for (const [axis,label] of entries) result[axis].push(label);
  }
 }
 for (const axis of ['disciplines','formats','purposes','details','unknown']) result[axis]=unique(result[axis]);
 return result;
}
export function eventCategoryOptions(events,axis='all') {
 const axes=axis==='all'?['disciplines','formats','purposes']: [axis];
 return unique(events.flatMap(event=>{const categories=eventTaxonomy(event);return axes.flatMap(name=>categories[name]||[]);})).sort((a,b)=>a.localeCompare(b));
}
export function matchesEventCategory(event,value,axis='all') {
 if (!key(value)) return true;
 const categories=eventTaxonomy(event),axes=axis==='all'?['disciplines','formats','purposes','details','unknown']:[axis];
 // Original links stay valid without broadening a narrow raw label to every synonym.
 const raw=[...categories.raw.disciplines,...categories.raw.types].flatMap(x=>[x,...x.split(' / ')]);
 if (raw.some(x=>key(x)===key(value))) return true;
 // Former display-filter URLs retain their narrower meaning after consolidation.
 const legacyFormats={'noncompetitive ride':['untimed ride','casual ride','noncompetitive ride'],'social / community ride':['community','community ride','car-free social ride','community festival ride']};
 if ((axis==='all'||axis==='formats')&&legacyFormats[key(value)]) return raw.some(x=>legacyFormats[key(value)].includes(key(x)));
 if (axes.some(name=>(categories[name]||[]).some(x=>key(x)===key(value)))) return true;
 // Only true lexical discipline aliases cross-match; format details retain specificity.
 return classify(value).some(([name,label])=>name==='disciplines' && axes.includes(name) && categories[name].includes(label));
}
