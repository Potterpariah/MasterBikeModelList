import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const folder = new URL('../reports/historical-trim-master/',import.meta.url);
const records = JSON.parse(await fs.readFile(new URL('brand-model-master.json',folder),'utf8'));
const decisions=JSON.parse(await fs.readFile(new URL('master-review-decisions.json',folder),'utf8'));
const norm = s=>s.normalize('NFKC').trim().replace(/\s+/g,' ').toLowerCase();
const groups = new Map(), loose = new Map(), flags=[];
for (const r of records) {
 const key=JSON.stringify([norm(r.brand),norm(r.model)]);
 if(!groups.has(key))groups.set(key,[]);groups.get(key).push(r);
 const lkey=JSON.stringify([norm(r.brand),norm(r.model).replace(/[^\p{L}\p{N}]/gu,'')]);
 if(!loose.has(lkey))loose.set(lkey,[]);loose.get(lkey).push({brand:r.brand,model:r.model});
 const reasons=[];
 const catalogFlag=(decisions.catalog_frame_review_flags||[]).find(f=>norm(f.brand)===norm(r.brand)&&norm(f.model)===norm(r.model));
 if(catalogFlag)reasons.push('Catalog URL/photo suggests frame/module; source review required, not confirmed frame-only');
 if(/frame\s*set|\bframe\b|\bmodule\b/i.test(r.model))reasons.push('Name indicates frame/frameset/module; not a verified complete bicycle');
 if(/\b(fork|wheelset|crankset|handlebar|seatpost)\b/i.test(r.model))reasons.push('Possible component-only entry; contextual review needed');
 if(/\b(custom|replica|limited|ltd)\b/i.test(r.model))reasons.push('Named edition/custom label; distinguish offered factory build from paint or user build');
 if(reasons.length)flags.push({brand:r.brand,model:r.model,reasons,...(catalogFlag?{catalog_evidence:catalogFlag.evidence}:{}),action:'retain reference; do not promote without review'});
}
const exact=[...groups.values()].filter(a=>a.length>1);
const punctuation=[...loose.values()].filter(a=>a.length>1);
const report={checked_on:'2026-10-15',scope:'Entire saved historical master, non-destructive identity screening',records:records.length,exact_normalized_duplicate_groups:exact.length,punctuation_only_collision_groups:punctuation.length,flagged_records:flags.length,name_frame_module_flags:flags.filter(f=>f.reasons.some(r=>r.startsWith('Name indicates'))).length,catalog_frame_clue_flags:flags.filter(f=>f.catalog_evidence).length,possible_frame_module_entries:flags.filter(f=>f.reasons.some(r=>r.startsWith('Name indicates'))||f.catalog_evidence).length,component_flags:flags.filter(f=>f.reasons.some(r=>r.startsWith('Possible'))).length,edition_flags:flags.filter(f=>f.reasons.some(r=>r.startsWith('Named'))).length,exact_duplicates:exact,punctuation_review:punctuation,flags,limits:['Name screening is not source verification','Catalog URL/photo clues are not source confirmation','No fuzzy mergers or deletions','Brands not manufacturer legal entities','Years are not complete production ranges','Distinct similarly named builds preserved','No claim all false leads detected']};
assert.equal(exact.length,0,'Exact duplicates require review');
await fs.writeFile(new URL('identity-audit.json',folder),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(Object.fromEntries(Object.entries(report).filter(([k])=>!['flags','exact_duplicates','punctuation_review','limits'].includes(k)))));
