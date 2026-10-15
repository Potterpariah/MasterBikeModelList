export function mapClient(){
 const dialog=document.getElementById('event-location-map');if(!dialog)return;
 const rows=JSON.parse(document.getElementById('event-map-records').textContent),note=document.getElementById('event-location-note'),status=document.getElementById('event-map-status');let map,opener;
 const config=JSON.parse(document.getElementById('event-map-config').textContent);
 const groups=new Map(),markers=new Map();for(const row of rows){const key=row.lat+','+row.lng;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(row);}
 function init(){if(map)return true;if(!window.L){status.textContent='The interactive map could not load. Use the location link to open your maps service.';return false;}
  map=L.map('interactive-event-map',{scrollWheelZoom:true}).setView([31,-99],6);L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).on('tileerror',()=>{status.textContent='Map background unavailable. Event markers and links still work.';}).addTo(map);
  for(const [key,items] of groups){const el=document.createElement('div');for(const r of items){const p=document.createElement('p'),a=document.createElement('a');a.href=r.url;a.textContent=r.title+' — '+r.date;p.append(a,document.createElement('br'),document.createTextNode(r.venue+' · '+r.label));el.append(p);}
   const color=items.every(r=>r.precision==='venue')?'#24694a':'#a55709';const icon=L.divIcon({className:'event-location-pin',html:'<span style="background:'+color+'">'+items.length+'</span>',iconSize:[44,44],iconAnchor:[22,22]});const marker=L.marker([items[0].lat,items[0].lng],{icon,title:items.map(r=>r.title).join('; '),alt:items.map(r=>r.title).join('; ')}).addTo(map).bindPopup(el,{minWidth:200,maxWidth:280});marker.getElement().setAttribute('aria-label',items.map(r=>r.title).join('; '));for(const r of items)markers.set(r.slug,marker);
  }return true;
 }
 function all(){map.closePopup();if(!rows.length){note.textContent='No event locations are available for this view.';return;}map.fitBounds(rows.map(r=>[r.lat,r.lng]),{padding:[30,30],maxZoom:10});note.textContent=rows.length+' upcoming events. Zoom in or select a marker for details.';}
 function close(){dialog.close();opener?.focus();}
 document.querySelectorAll('[data-event-location]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();opener=link;dialog.showModal();if(!init()){const row=rows.find(r=>r.slug===link.dataset.eventLocation);note.replaceChildren(document.createTextNode(row?row.venue+' - '+row.label+' ':''));if(row){const fallback=document.createElement('a');fallback.href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(row.venue);fallback.textContent='Open location in maps';note.append(fallback);}return;}map.invalidateSize();const row=rows.find(r=>r.slug===link.dataset.eventLocation);if(row){note.replaceChildren(document.createTextNode(row.venue+' — '+row.label+' · '));const directions=document.createElement('a');directions.href='https://www.google.com/maps/search/?api=1&query='+row.lat+','+row.lng;directions.textContent='Open in maps';note.append(directions);map.setView([row.lat,row.lng],row.precision==='venue'?16:12);markers.get(row.slug).openPopup();}else all();}));
 dialog.querySelector('[data-close-event-map]').addEventListener('click',close);dialog.addEventListener('cancel',event=>{event.preventDefault();close();});dialog.querySelector('[data-show-all-events]').addEventListener('click',()=>{if(init())all();});
}


