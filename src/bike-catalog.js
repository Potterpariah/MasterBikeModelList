import pilot from '../data/bike-catalog-pilot.json' with {type:'json'};

export const slugify=value=>String(value||'').trim().toLowerCase().normalize('NFKD')
  .replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export const canonicalId=record=>['bike',slugify(record.manufacturer),slugify(record.model_family),record.model_year??'unknown-year',slugify(record.model)].join(':');
const required=['manufacturer','category','model_family','model','source_url','source_type','verification_status'];
const specFields=['frame_material','frame_sizes','wheel_size','tire_size','drivetrain','gears_speeds','brakes','suspension','weight','original_msrp'];
const contentHash=value=>{let hash=2166136261;for(const char of JSON.stringify(value)){hash^=char.codePointAt(0);hash=Math.imul(hash,16777619);}return 'fnv1a-32:'+((hash>>>0).toString(16).padStart(8,'0'));};
export function validateRecord(record){
 const errors=required.filter(field=>!record[field]).map(field=>`missing ${field}`);
 if(!['verified','review','rejected'].includes(record.verification_status))errors.push('invalid verification_status');
 if(!/^https:\/\//.test(record.source_url||''))errors.push('source_url must be https');
 if(typeof record.is_electric!=='boolean')errors.push('is_electric must be boolean');
 if(record.is_electric&&!record.electric)errors.push('electric records need an electric object');
 if(!record.is_electric&&record.electric!==null)errors.push('non-electric records need electric null');
 if(record.electric)for(const field of ['ebike_class','motor_manufacturer','motor_model','nominal_motor_power_w','torque_nm','battery_capacity_wh','throttle','assist_speed_limit','manufacturer_claimed_range'])if(!(field in record.electric))errors.push(`electric missing ${field}`);
 for(const field of specFields)if(!(field in record))errors.push(`missing spec field ${field}`);
 return errors;
}
function normalize(record){
 const canonical_id=canonicalId(record);
 const raw_hash=contentHash(record);
 return {...record,canonical_id,manufacturer_slug:slugify(record.manufacturer),category_slug:slugify(record.category),model_family_slug:slugify(record.model_family),model_slug:slugify(record.model),retrieval_date:pilot.retrieved_on,content_source_hash:raw_hash,change_history:[{at:pilot.retrieved_on,action:'pilot_ingested',source_url:record.source_url}]};
}
export function buildCatalog(records=pilot.records){
 const candidates=records.map(normalize), canonical=[], conflicts=[];
 for(const candidate of candidates){
  const errors=validateRecord(candidate); if(errors.length)throw new Error(`Invalid ${candidate.canonical_id}: ${errors.join(', ')}`);
  const existing=canonical.find(item=>item.canonical_id===candidate.canonical_id);
  if(!existing){if(candidate.verification_status==='verified')canonical.push(candidate);continue;}
  const changed=['drivetrain','frame_material','gears_speeds'].filter(field=>existing[field]!==candidate[field]);
  conflicts.push({canonical_id:candidate.canonical_id,status:'review',fields:changed,kept_source:existing.source_url,candidate_source:candidate.source_url,note:'Conflicting or ambiguous candidate is retained for review and is not public canonical data.'});
 }
 return {schema_version:pilot.schema_version,records:canonical,conflicts,candidates};
}
export const bikeCatalog=buildCatalog();
export const catalogRows=()=>bikeCatalog.records.map(record=>({source:record.source_url,normalized:{manufacturer:record.manufacturer,model_family:record.model_family,year:record.model_year,model:record.model,is_electric:record.is_electric},canonical_id:record.canonical_id,public_path:`/bikes/${record.manufacturer_slug}/${record.model_family_slug}/${record.model_year}/${record.model_slug}`}));
export function hierarchyFor(parts){
 const [manufacturer,categoryOrFamily,year,model]=parts.map(part=>part===undefined?undefined:decodeURIComponent(part));
 return bikeCatalog.records.filter(item=>item.manufacturer_slug===manufacturer && (!categoryOrFamily||(item.category_slug===categoryOrFamily||item.model_family_slug===categoryOrFamily)) && (!year||String(item.model_year)===year) && (!model||item.model_slug===model));
}
