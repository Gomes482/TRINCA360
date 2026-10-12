const CACHE='trinca360-v2.0.0';
const ASSETS=['./','./index.html','./styles.css','./data.js','./app.js','./manifest.webmanifest','./assets/icon-192.png','./assets/icon-512.png',
  './assets/exercises/legpress.svg','./assets/exercises/chest.svg','./assets/exercises/pulldown.svg','./assets/exercises/bridge.svg','./assets/exercises/plank.svg','./assets/exercises/goblet.svg','./assets/exercises/row.svg','./assets/exercises/shoulder.svg','./assets/exercises/curlleg.svg','./assets/exercises/deadbug.svg','./assets/exercises/step.svg','./assets/exercises/incline.svg','./assets/exercises/biceps.svg','./assets/exercises/triceps.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
  event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put(req,copy));}return response;})));
});
