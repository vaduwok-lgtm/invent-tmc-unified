const CACHE='combined-inventory-v5';
const FILES=['./','./index.html','./audit.html','./inventory.html','./manifest.json'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('combined-inventory-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const q=e.request;if(q.method!=='GET')return;const u=new URL(q.url);if(u.origin!==self.location.origin)return;e.respondWith((async()=>{const cache=await caches.open(CACHE);const hit=await cache.match(q,{ignoreSearch:true});if(hit)return hit;try{const res=await fetch(q);if(res.ok&&res.type==='basic')await cache.put(q,res.clone());return res}catch{return q.mode==='navigate'?(await cache.match('./index.html'))||new Response('Откройте приложение с интернетом, чтобы подготовить его для офлайн-работы.',{status:503}):new Response('',{status:503})}})())});

