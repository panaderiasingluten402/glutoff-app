const V="glutoff-v10";
const CORE=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","favicon-64.png","logo.webp"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
 const r=e.request;
 if(r.method!=="GET")return;
 const u=new URL(r.url);
 const fonts=u.hostname==="fonts.googleapis.com"||u.hostname==="fonts.gstatic.com";
 if(u.origin!==location.origin&&!fonts)return;
 e.respondWith(caches.open(V).then(async c=>{
  const hit=await c.match(r,{ignoreSearch:true});
  const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==="opaque"))c.put(r,res.clone());return res}).catch(()=>null);
  if(hit){e.waitUntil(net);return hit}
  const res=await net;
  if(res)return res;
  if(r.mode==="navigate")return c.match("index.html");
  return new Response("",{status:504,statusText:"Sin conexión"});
 }));
});
