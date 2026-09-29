import {reviewedGuides,reviewedEvents} from './publication-data.js';
// Additive presentation revisions; original seed/database content stays intact.
const replacements={
 'bmx-bike-basics':'Before buying, ask a local track about beginner sessions and equipment requirements. Use the bike directory to compare model families, then confirm fit and intended use with the manufacturer.',
 'bicycle-tire-pressure-fundamentals':'Keep your own front and rear pressure notes in your Bike Garage. Record tire size, surface and load alongside the result so your next adjustment has a useful reference.',
 'bikepacking-basics-first-overnight':'For longer trips, confirm water, resupply, camping rules and seasonal access with current land-manager and route sources. Treat rider reports as context rather than permission to enter a closed route.',
 'ebike-basics-classes-range-charging':'Check the specific event organizer’s equipment rules before entering with an e-bike. Eligibility is event-specific; the bike’s class alone does not establish permission.',
 'how-to-choose-the-right-bike':'Write down your regular terrain, carrying needs, storage constraints and fit questions before comparing bikes. Use those requirements to narrow your shortlist.',
 'first-mountain-bike-race-prep':'Read the event’s category, start-wave, course, equipment and passing rules before entering. Check eligibility directly with the organizer, especially for school or age-restricted competitions.'
};
export function editGuide(g){
 const paragraphs=g.body_markdown.split(/\n\s*\n/);
 const clean=paragraphs.map(p=>/the portal should|the portal can/i.test(p)?(replacements[g.slug]||p.replace(/[^.!?]*(?:the portal should|the portal can)[\s\S]*/i,'').trim()):p).filter(Boolean).join('\n\n');
 const review=reviewedGuides[g.slug];
 const body=review?(review.body_edits||[]).reduce((text,[from,to])=>text.replace(from,to),clean):clean;
 return {...g,body_markdown:body,editorial_updated:'2026-09-18',...(review?{summary:review.summary,source_urls_json:JSON.stringify(review.sources),technical_review:review.review_kind}: {})};
}
export const guideExtras=reviewedGuides;
export const excludedDiscussionIds=new Set(['9b71d725-04da-4527-9c9b-73aefdb17929','89bb629c-0881-416c-93ec-a21c645021ed','710f3d63-ab6f-4e2c-a680-7597b839deca']);
export const eventUpdates={
 'event_2026_09_19_2026_midnight_massacre':{venue_name:'35 & Liberty',address:'4321 I-35',postal_code:'76240',verified_on:'2026-09-18',verification_status:'verified',registration_url:'https://runsignup.com/Race/TX/Gainesville/MidnightMassacre2026',start_time_note:'Organizer lists a 6:00 PM CDT start.',notes:'The 25- and 50-mile courses are marked; the 75-mile option includes unmarked sections. Bring navigation and supplies for at least 25 miles between returns to the staging area.',reviewed_fields:['date','venue','address','distances','registration','route notes'],review_source:'https://runsignup.com/Race/TX/Gainesville/MidnightMassacre2026'},
 'event_2026_09_19_conquer_the_coast':{venue_name:'Whataburger Field',address:'734 E. Port Ave.',verified_on:'2026-09-18',verification_status:'verified_with_conflict',registration_url:'https://conquer.bike/',notes:'Organizer confirms the September 19 date and Whataburger Field start/finish. Its long route is labelled “66” miles and remains subject to approvals; older mileage discrepancies are not resolved here. Confirm the final route before riding.',reviewed_fields:['date','venue','address','registration','route caveat'],review_source:'https://unitedcorpuschristi.org/conquer-the-coast/'},
 'event_2026_09_19_cotton_patch_challenge':{venue_name:'Landon Winery, Greenville',verified_on:'2026-09-18',start_time_note:'Organizer lists check-in at 6:00 AM and a 7:30 AM start, with no late starts after 8:00 AM.',reviewed_fields:['date','venue','schedule'],review_source:'https://cottonpatchchallenge.com/'}
};
export const editEvent=e=>({...e,...eventUpdates[e.id],...reviewedEvents[e.id]});
