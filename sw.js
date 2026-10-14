/* TRINCA 360 — atualizador offline v2.7.1 */
const CACHE='trinca360-v2.7.1';
const ASSETS=['./','./index.html','./styles.css','./data.js','./app.js','./manifest.webmanifest','./assets/trinca360-qr.svg','./assets/icon-192.png','./assets/icon-512.png',
  './assets/exercises/legpress.svg','./assets/exercises/chest.svg','./assets/exercises/pulldown.svg','./assets/exercises/bridge.svg','./assets/exercises/plank.svg','./assets/exercises/goblet.svg','./assets/exercises/row.svg','./assets/exercises/shoulder.svg','./assets/exercises/curlleg.svg','./assets/exercises/deadbug.svg','./assets/exercises/step.svg','./assets/exercises/incline.svg','./assets/exercises/biceps.svg','./assets/exercises/triceps.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS.map(url=>new Request(url,{cache:'reload'})))).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('trinca360-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('message',event=>{if(event.data&&event.data.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET'||!req.url.startsWith(self.registration.scope))return;
 if(url.pathname.endsWith('/version.json')){event.respondWith(fetch(req,{cache:'no-store'}));return;}
 if(req.mode==='navigate'){
  event.respondWith(fetch(req,{cache:'no-store'}).then(response=>{
   if(response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put(req,copy));}return response;
  }).catch(async()=>await caches.match(req)||await caches.match('./index.html')||Response.error()));return;
 }
 // Recursos centrais: preferir rede para evitar que uma instalacao antiga esconda a nova ficha.
 const core=/\/(?:app\.js|data\.js|styles\.css|index\.html)$/.test(url.pathname);
 if(core){event.respondWith(fetch(new Request(req,{cache:'no-store'})).then(response=>{
  if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(c=>c.put(req,copy)));}return response;
 }).catch(async()=>await caches.match(req,{ignoreSearch:true})||Response.error()));return;}
 event.respondWith(caches.match(req,{ignoreSearch:true}).then(cached=>cached||fetch(req).then(response=>{
  if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(c=>c.put(req,copy)));}return response;
 })));
});
