import {matchesEventCategory} from './event-taxonomy.js';
import pilot from '../data/discovery-pilot.json' with {type:'json'};
export const discoveryPilot=pilot;
export function mergeDiscoveryEvents(original){
 const replacements=new Map(pilot.events.map(event=>[event.slug,event]));
 return [...original.map(event=>replacements.get(event.slug)||event),...pilot.events.filter(event=>!original.some(old=>old.slug===event.slug))];
}
export function filterDiscoveryEvents(events,params,today){
 const q=(params.get('q')||'').trim().toLowerCase(),region=params.get('region')||'',discipline=params.get('discipline')||'',from=params.get('from')||today;
 return events.filter(event=>(event.rideEndDate||event.rideDate)>=today&&!['completed','cancelled','postponed','tbd'].includes(event.status)&&(!region||event.region===region)&&matchesEventCategory(event,discipline,'disciplines')&&matchesEventCategory(event,params.get('format'),'formats')&&matchesEventCategory(event,params.get('purpose'),'purposes')&&(event.rideEndDate||event.rideDate)>=from&&(!q||[event.title,event.city,event.county].join(' ').toLowerCase().includes(q))).sort((a,b)=>a.rideDate.localeCompare(b.rideDate)||a.title.localeCompare(b.title));
}
