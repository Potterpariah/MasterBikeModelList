import urllib.request,urllib.error,urllib.parse,json,re,time,pathlib,concurrent.futures
from html.parser import HTMLParser
BASE='https://bike-portal-stage4.m25-f6b.workers.dev'
OUT=pathlib.Path('route-audit-evidence');OUT.mkdir(exist_ok=True)
class P(HTMLParser):
 def __init__(self):super().__init__();self.links=[];self.assets=[]
 def handle_starttag(self,t,a):
  d=dict(a)
  if t=='a' and d.get('href'):self.links.append(d['href'])
  if t in ('script','img','link'):
   u=d.get('src') or d.get('href')
   if u:self.assets.append(u)
def get(path):
 try:
  with urllib.request.urlopen(urllib.request.Request(BASE+path,headers={'User-Agent':'BikePortal-ReadOnly-Audit/1.0'}),timeout=25) as r: body=r.read().decode('utf-8','replace');status=r.status;ct=r.headers.get('Content-Type','');robots=r.headers.get('X-Robots-Tag','')
 except urllib.error.HTTPError as e:body=e.read().decode('utf-8','replace');status=e.code;ct=e.headers.get('Content-Type','');robots=''
 except Exception as e:return {'path':path,'error':str(e),'links':[]}
 p=P();p.feed(body);header=re.search(r'<header\b.*?</header>',body,re.S)
 title=re.search(r'<title>(.*?)</title>',body,re.S)
 (OUT/(re.sub(r'[^a-zA-Z0-9_-]','_',path)[:180]or'home')).with_suffix('.html').write_text(body,encoding='utf-8')
 return {'path':path,'status':status,'contentType':ct,'robots':robots,'title':title.group(1) if title else '', 'header':header.group(0) if header else '', 'links':p.links,'assets':p.assets,'svgCount':body.count('<svg'),'leaflet': 'leaflet' in body.lower(),'bytes':len(body)}
seen=set();queue=['/','/texas','/events','/guides','/brands','/bikes','/texas/events','/texas/cities','/texas/clubs','/trails','/texas-rides'];rows=[]
while queue and len(seen)<1200:
 batch=[]
 for path in queue:
  if path not in seen:seen.add(path);batch.append(path)
 queue=[]
 with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
  for row in pool.map(get,batch):
   rows.append(row)
   for link in row.get('links',[]):
    u=urllib.parse.urlsplit(urllib.parse.urljoin(BASE+row['path'],link))
    if u.netloc==urllib.parse.urlsplit(BASE).netloc and not u.path.startswith(('/api/','/media/')) and not u.path.endswith(('.ics','.gpx')) and u.path not in seen:queue.append(u.path or '/')
 print('checked',len(rows),'remaining',len(set(queue)),flush=True)
 (OUT/'routes.json').write_text(json.dumps(rows,indent=2),encoding='utf-8')
print(json.dumps({'count':len(rows),'bad':[{'path':r['path'],'status':r.get('status'),'error':r.get('error')} for r in rows if r.get('status')!=200],'headers':len(set(r.get('header','') for r in rows))}))
