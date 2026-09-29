import dataset from '../data/model-enrichment.json' with {type:'json'};
export const modelEnrichment=dataset.models;
const byId=new Map(modelEnrichment.map(row=>[row.model_id,row]));
// Add reviewed facts without changing the recovered model identity or seed data.
export function enrichModel(row){
 const details=byId.get(row.id);
 return details?{...row,enrichment:details}:row;
}
