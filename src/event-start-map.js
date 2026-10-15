import {escapeHTML as e,publicPath} from './seo.js';

// Coordinates were geocoded on 2026-09-29 from the exact public street address
// already stored on the matching Bike Portal event record. Events without a
// precise published address are intentionally omitted rather than pinned to a
// city centre or inferred venue.
const startPoints={
 event_2026_10_03_autumn_in_bonham_century_mile_ride:[33.5786755,-96.1910103],
 event_2026_10_10_ray_porter_memorial_6_hour_endurance_race_and_fundraiser:[33.2673169,-97.0602965],
 event_2026_10_17_goodnight_s_grind_gravel:[34.9397605,-100.8862803],
 event_2026_10_24_bikes_and_beers_austin:[30.2085594,-97.729776],
 event_2026_10_24_cooler_n_hell_gravel:[33.9142848,-98.4981725],
 event_2026_10_24_rockstacker_challenge_mountain_bike_race:[31.8996355,-102.2959551],
 event_2026_10_24_trick_it_up_bike_ride_2026:[33.1621767,-96.3594478],
 event_2026_11_07_pedal_in_the_pines:[30.3431566,-95.086822],
 event_2026_11_14_pedaling_for_the_veterans_2026:[29.6376921,-96.0597907],
 event_2026_12_12_rudolph_s_revenge:[33.3018214,-96.9863233],
 event_2027_07_10_peach_pedal_bike_ride_2027:[32.7261884,-97.8079572]
};

export const eventStartPoint=eventId=>startPoints[eventId]||null;

export function eventStartMap(events){
 const mapped=events.filter(event=>startPoints[event.id]).map(event=>({...event,lat:startPoints[event.id][0],lng:startPoints[event.id][1]}));
 if(!mapped.length)return '';
 const lats=mapped.map(event=>event.lat),lngs=mapped.map(event=>event.lng),pad=.09;
 const minLat=Math.min(...lats),maxLat=Math.max(...lats),minLng=Math.min(...lngs),maxLng=Math.max(...lngs);
 const latRange=Math.max(.25,maxLat-minLat),lngRange=Math.max(.25,maxLng-minLng);
 const x=lng=>10+80*((lng-(minLng-lngRange*pad))/(lngRange*(1+pad*2)));
 const y=lat=>90-80*((lat-(minLat-latRange*pad))/(latRange*(1+pad*2)));
 const marker=event=>`<a href="${publicPath('event',event.slug)}" aria-label="Open ${e(event.title)}"><title>${e(event.title)} — ${e(event.city)}, Texas</title><circle class="event-map-pin" cx="${x(event.lng).toFixed(2)}" cy="${y(event.lat).toFixed(2)}" r="2.4"/><text class="event-map-number" x="${x(event.lng).toFixed(2)}" y="${(y(event.lat)+.8).toFixed(2)}">${event.index+1}</text></a>`;
 mapped.forEach((event,index)=>event.index=index);
 const unmapped=events.length-mapped.length;
 return `<section class="event-start-map" aria-labelledby="event-map-title"><div class="event-map-heading"><div><span class="eyebrow">Event locations</span><h2 id="event-map-title">Verified event starts</h2></div><button class="btn outline map-toggle" type="button" data-map-toggle="event-start-map-canvas" aria-expanded="false">Expand map</button></div><p class="event-map-note">This map is framed to show all ${mapped.length} current events with a published precise start address. ${unmapped?`${unmapped} listed event${unmapped===1?'':'s'} remain unpinned until a precise start is published.`:''}</p><div class="event-start-map-canvas" id="event-start-map-canvas"><svg viewBox="0 0 100 100" role="img" aria-label="Relative map of verified Texas cycling event starts; numbered markers link to event pages"><rect x="0" y="0" width="100" height="100" rx="4"/><path class="event-map-grid" d="M10 25H90M10 50H90M10 75H90M30 10V90M50 10V90M70 10V90"/>${mapped.map(marker).join('')}</svg></div><ol class="event-map-legend">${mapped.map(event=>`<li><a href="${publicPath('event',event.slug)}"><b>${event.index+1}</b> ${e(event.title)}</a><span>${e(event.city)}, TX</span></li>`).join('')}</ol></section>`;
}
