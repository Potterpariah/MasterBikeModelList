// Fixed editorial help only: no URL or user-controlled content is interpolated.
const content={
 events:['Confirm dates, eligibility and changes with the organizer before travelling.',[
  'Discipline describes riding terrain or style; format describes the kind of event; purpose can include fundraising. An event can have several labels.',
  'Road means primarily paved-road riding; Gravel means unpaved-road riding; Mountain bike means off-road trail riding. Check the organizer for actual surfaces and difficulty.',
  'General / social ride combines generic, casual, untimed and community ride labels. A generic Ride label alone does not confirm pace or competitive status; original labels stay on event pages.',
  'Randonneuring is long-distance riding with checkpoints; bikepacking involves carrying gear on a ride. Tour, Challenge and Gran fondo do not by themselves establish whether an event is a race.',
  'Choose filters, then select Filter events. The map shows matching events with known locations; a missing pin does not mean an event is absent. Clear filters to start again.',
  'An event date is not its registration deadline. Source checked records a past review, not a guarantee that details remain current.',
  'Pins show venues, not a course or turn-by-turn directions, and can be approximate. Open the organizer link for the confirmed starting point and entry requirements.'
 ]],
 curated:['Confirm dates, eligibility and changes with the organizer before travelling.',[
  'Discipline describes riding terrain or style; format describes the kind of event; purpose can include fundraising. Some source records do not identify every category.',
  'Road means primarily paved-road riding; Gravel means unpaved-road riding; Mountain bike means off-road trail riding. Check the organizer for actual surfaces and difficulty.',
  'General / social ride combines generic, casual, untimed and community ride labels. A generic Ride label alone does not confirm pace or competitive status; original labels stay on event pages.',
  'Randonneuring is long-distance riding with checkpoints; bikepacking involves carrying gear on a ride. Tour, Challenge and Gran fondo do not by themselves establish whether an event is a race.',
  'Choose filters, then select Filter events. The map shows matching events with known locations. Clear filters to start again; approximate venue pins are not a course or turn-by-turn directions.',
  'The event start date is not the registration deadline. Source checked records a past review, not a guarantee of current details.',
  'Calendar downloads use all-day event dates, not a confirmed start time. Check the organizer for times and later changes; a downloaded file does not update itself.'
 ]],
 bikes:['A model family is not a confirmed exact-year build or a stock listing.',[
  'Start with a brand or model family, then check the stated year, market and build before comparing specifications.',
  'Unknown or missing means the detail has not been established here; it does not mean the feature is absent.',
  'Source dates apply to the listed facts. Manufacturer specifications can differ across versions; follow the source link for the exact bicycle.',
  'This directory does not establish current inventory, availability or price.'
 ]],
 routes:['Maps and GPX files are planning references, not a guarantee of a safe or open route.',[
  'City and region labels help locate a route or trail; they do not describe every part of its course.',
  'Check the stated surface and distance for suitability. Approximate lines, changing conditions and detours can affect navigation.',
  'Confirm access, closures, weather and permitted bicycle types with the land manager. Follow current signs and carry suitable navigation.',
  'Do not share a private home address or another rider’s location when discussing routes.'
 ]],
 clubs:['Confirm meeting places, ride rules and current schedules with the club.',[
  'A city label describes the listing’s location; a club may ride beyond that city.',
  'A listing does not guarantee a suitable pace, no-drop support or acceptance of every bicycle type.',
  'Use the club’s source link to check the next ride and joining requirements. Avoid posting private meeting addresses or other riders’ personal details.'
 ]],
 guides:['These AI-assisted guides are references; check the instructions for your exact equipment.',[
  'Read the scope and source links before applying a procedure. A source review is not a hands-on mechanic inspection.',
  'Use the manufacturer’s current instructions, torque values and compatibility requirements for your exact component.',
  'Stop if a procedure is unclear or the bicycle appears unsafe, and seek qualified help. Do not treat a general guide as a named expert’s assessment.'
 ]],
 texas:['This directory brings together different resources; each has its own source and review scope.',[
  'Events describe dated rides. Routes and trails describe places to ride; clubs describe groups you can contact.',
  'Reviewed ride selections are a smaller selection, not the complete event calendar.',
  'Open a detail page for sources, dates and limitations. Check the organizer or land manager before making plans.'
 ]],
 home:['Browse public information freely; account actions require you to log in.',[
  'Use search to explore site content and the event calendar to narrow rides by date, location and category.',
  'Bike Garage records your bicycles. Your profile and garage are public; avoid sensitive personal information.',
  'Save bookmarks an item; Follow records your interest. Saved contains saved and followed items. Helpful is feedback on a discussion or comment.',
  'Notifications show account activity inside the site. Check them while signed in; do not assume email reminders or automatic event-change alerts.'
 ]],
 account:['Log in to manage your own account actions; your profile and garage are public.',[
  'Garage records bicycles; Saved lists saved and followed content. These are different lists.',
  'Save bookmarks an item and Follow records interest. Helpful is feedback on a discussion or comment.',
  'Check Notifications for in-site activity. Keep private addresses and sensitive details out of public profile and garage fields.'
 ]]
};
export function sectionHelp(path='/') {
 const route=String(path).split('?')[0].replace(/\/$/,'')||'/';
 let section;
 if (/^\/(?:#)?(?:garage|saved|profile|notifications|login|signup)(?:\/|$)/.test(route)) section='account';
 else if (route==='/') section='home';
 else if (/^\/texas\/events(?:\/|$)/.test(route)) section='curated';
 else if (/^\/events(?:\/|$)/.test(route)) section='events';
 else if (/^\/(bikes|brands)(?:\/|$)/.test(route)) section='bikes';
 else if (/^\/(?:texas\/)?clubs(?:\/|$)/.test(route)) section='clubs';
 else if (/^\/(?:texas\/)?(?:trails|routes)(?:\/|$)/.test(route)) section='routes';
 else if (/^\/guides(?:\/|$)/.test(route)) section='guides';
 else if (/^\/(?:texas|texas-rides)(?:\/|$)/.test(route)) section='texas';
 if (!section) return '';
 const [caveat,bullets]=content[section];
 return `<aside class="section-help"><p class="section-help-essential">${caveat}</p><details class="section-help-details"><summary>How to use this section</summary><ul>${bullets.map(text=>`<li>${text}</li>`).join('')}</ul></details></aside>`;
}
