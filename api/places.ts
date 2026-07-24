import type { VercelRequest, VercelResponse } from '@vercel/node'
export default async function handler(req:VercelRequest,res:VercelResponse){
 const q=String(req.query.q||'').trim(); if(q.length<3) return res.status(200).json([])
 try{const url=`https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=6&lang=lt`; const r=await fetch(url,{headers:{'User-Agent':'RideKaunas/1.0'}}); const data=await r.json();
 const out=(data.features||[]).map((f:any)=>{const p=f.properties||{}; return {label:[p.name,p.street,p.city,p.state,p.country].filter(Boolean).filter((v:string,i:number,a:string[])=>a.indexOf(v)===i).join(', '),lat:f.geometry.coordinates[1],lon:f.geometry.coordinates[0]}}).filter((x:any)=>x.label)
 res.setHeader('Cache-Control','s-maxage=300, stale-while-revalidate=600'); return res.status(200).json(out)
 }catch{return res.status(502).json({error:'Vietų paieška laikinai nepasiekiama.'})}
}
