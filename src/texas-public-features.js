// Reviewed, public-only additions adapted from Texas Cycling Hub. No accounts,
// member records, organizer claims, submissions, or moderation data belong here.
export const texasClubs=[
 {id:'all-ass-no-gas',name:'All Ass No Gas Cycling Club',city:'Austin',focus:'Road & charity',description:'Austin cycling community with weekly group rides and charity-focused events.',meetingPlace:'Austin, Texas',websiteUrl:'https://www.allassnogascyclingclub.com/',checkedAt:'2026-09-25'},
 {id:'austin-ridge-riders',name:'Austin Ridge Riders',city:'Austin',focus:'Mountain bike & trail stewardship',description:'Nonprofit mountain-bike club with Central Texas group rides, skills clinics, and trail work.',meetingPlace:'Central Texas trail systems',websiteUrl:'https://www.austinridgeriders.com/',checkedAt:'2026-09-25'},
 {id:'houston-bicycle-club',name:'Houston Bicycle Club',city:'Houston',focus:'Road & social',description:'Long-running social cycling club offering recurring Houston rides for varied experience levels.',meetingPlace:'Stude Park, Houston Heights',websiteUrl:'https://houstonbicycleclub.wildapricot.org/',checkedAt:'2026-09-25'},
 {id:'northwest-cycling-club',name:'Northwest Cycling Club',city:'Tomball',focus:'Road, mountain & social',description:'Volunteer-run club with rides for different abilities, including no-drop and regional rides.',meetingPlace:'Wildwood Elementary, Tomball',websiteUrl:'https://nwcc.bike/',checkedAt:'2026-09-25'},
 {id:'ghorba',name:'Greater Houston Off-Road Biking Association',city:'Houston',focus:'Mountain bike & trail advocacy',description:'Nonprofit community that builds, maintains, advocates for, and rides Greater Houston off-road trails.',meetingPlace:'Greater Houston trail systems',websiteUrl:'https://ghorba.org/',checkedAt:'2026-09-25'},
 {id:'space-city-cycling',name:'Space City Cycling Club',city:'Houston',focus:'Road & training',description:'Houston-area club with official ride routes and organized group riding.',meetingPlace:'Trek Bicycle Clear Lake, Houston',websiteUrl:'https://spacecitycycling.club/',checkedAt:'2026-09-25'},
 {id:'clutch-city-cruisers',name:'Clutch City Cruisers',city:'Houston',focus:'Social & casual',description:'Weekly slow-paced social ride and community-event organizer.',meetingPlace:'Market Square Park, Houston',websiteUrl:'https://clutchcitycruisers.com/',checkedAt:'2026-09-25'},
 {id:'plano-bicycle-association',name:'Plano Bicycle Association',city:'Plano',focus:'Road & gravel',description:'North Texas cycling club with a live calendar of recurring road and gravel rides.',meetingPlace:'Plano and North Texas ride starts',websiteUrl:'https://planobicycle.org/',checkedAt:'2026-09-25'},
 {id:'greater-dallas-bicyclists',name:'Greater Dallas Bicyclists',city:'Dallas',focus:'Road & social',description:'Dallas club with group rides, community gatherings, and the Bike the Bluebonnets rally.',meetingPlace:'Dallas ride starts',websiteUrl:'https://gdbclub.clubexpress.com/',checkedAt:'2026-09-25'},
 {id:'dorba',name:'Dallas Off-Road Bicycle Association',city:'Dallas',focus:'Mountain bike & trail stewardship',description:'Dallas mountain-bike community supporting local trails and club rides.',meetingPlace:'Dallas-area trail systems',websiteUrl:'https://www.dorba.org/',checkedAt:'2026-09-25'},
 {id:'san-antonio-wheelmen',name:'San Antonio Wheelmen',city:'San Antonio',focus:'Road & Hill Country',description:'San Antonio cycling organization with published Hill Country and local group rides.',meetingPlace:'San Antonio and Hill Country ride starts',websiteUrl:'https://www.sawheelmen.com/',checkedAt:'2026-09-25'},
 {id:'storm-mtb',name:'South Texas Off Road Mountain-Bikers',city:'San Antonio',focus:'Mountain bike & trail advocacy',description:'Volunteer nonprofit with regular San Antonio-area group rides, trail work, and advocacy.',meetingPlace:'San Antonio-area trail systems',websiteUrl:'https://stormmtb.org/',checkedAt:'2026-09-25'},
 {id:'el-paso-bicycle-club',name:'El Paso Bicycle Club',city:'El Paso',focus:'Road & recreational',description:'El Paso cycling club with an official ride calendar and beginner-friendly rides.',meetingPlace:'El Paso ride locations',websiteUrl:'https://elpasobicycleclub.com/',checkedAt:'2026-09-25'},
 {id:'rose-city-cycling',name:'Rose City Cycling',city:'Tyler',focus:'Community & women’s cycling',description:'Nonprofit organization serving Tyler and East Texas with rides, events, and volunteer work.',meetingPlace:'Tyler and East Texas',websiteUrl:'https://rccyclingtyler.com/',checkedAt:'2026-09-25'},
 {id:'major-taylor-san-antonio',name:'Major Taylor Cycling Club of San Antonio',city:'San Antonio',focus:'Community & road',description:'San Antonio cycling club honoring Major Taylor through local rides and community initiatives.',meetingPlace:'San Antonio community rides',websiteUrl:'https://www.mtccsa.org/',checkedAt:'2026-09-25'}
];
export const clubCitySlug=city=>city.toLowerCase().replaceAll(' ','-');
export const texasClubCities=[...new Set(texasClubs.map(club=>club.city))].sort((a,b)=>a.localeCompare(b));

// Only these eight event locations had reviewed, explicit map-search inputs.
export const texasEventMapQueries={
 'tour-de-cure-texas-2026':'Community Beer Co, 3110 Commonwealth Dr, Dallas, TX 75247',
 'park-to-port-bike-ride-2026':'Bayou Parkland, 6532 Almeda Rd, Houston, TX',
 'rideataxia-dallas-2026':'Railroad Park, Lewisville, TX',
 'pedal-in-the-pines-2026':'203 N College Ave, Cleveland, TX 77327',
 'denton-turkey-roll-2026':'Denton High School, 3001 Bronco Way, Denton, TX',
 'texas-chainring-massacre-2027':'4321 I-35, Gainesville, TX',
 'rattlesnake-gravel-grind-2027':'Lake Sweetwater Municipal Campground, County Road 264, Sweetwater, TX 79556',
 'east-texas-showdown-2027':'Bullet Grill, Point Blank, TX'
};

// Candidate identities only. A canonical Bike Portal record remains authoritative;
// field-level evidence attachment is deferred until non-conflict review is complete.
export const texasEventCrosswalk=[
 ['bike-around-the-bay-2026','event_2026_10_17_bike_around_the_bay','hold_location_conflict'],
 ['tour-de-cure-texas-2026','event_2026_10_24_tour_de_cure_texas','review_required'],
 ['park-to-port-bike-ride-2026','event_2026_10_24_park_to_port_bike_ride','review_required'],
 ['rideataxia-dallas-2026','event_2026_11_07_rideataxia_dallas_2026','review_required'],
 ['pedal-in-the-pines-2026','event_2026_11_07_pedal_in_the_pines','review_required'],
 ['denton-turkey-roll-2026','event_2026_11_21_turkey_roll_bicycle_rally','review_required'],
 ['texas-chainring-massacre-2027','event_2027_01_23_2027_texas_chainring_massacre','review_required'],
 ['valley-of-tears-gravel-2027','event_2027_03_05_valley_of_tears_gravel','review_required'],
 ['rattlesnake-gravel-grind-2027','event_2027_03_18_rattlesnake_gravel_grind_and_xcmtb','hold_date_conflict'],
 ['east-texas-showdown-2027',null,'hold_no_canonical_candidate'],
 ['castell-grind-2027','event_2027_04_10_castell_grind_2027','review_required']
].map(([texasSlug,bikePortalId,status])=>({texasSlug,bikePortalId,status}));
