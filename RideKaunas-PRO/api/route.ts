import type { VercelRequest, VercelResponse } from '@vercel/node'
export default async function handler(req:VercelRequest,res:VercelResponse){
 const from=String(req.query.from||''),to=String(req.query.to||''); if(!/^[-\d.]+,[-\d.]+$/.test(from)||!/^[-\d.]+,[-\d.]+$/.test(to)) return res.status(400).json({error:'Neteisingos koordinatės.'})
 try{const r=await fetch(`https://router.project-osrm.org/route/v1/driving/${from};${to}?overview=false`); const data=await r.json(); const route=data.routes?.[0]; if(!route) throw new Error(); return res.status(200).json({distanceKm:Number((route.distance/1000).toFixed(1)),durationMin:Math.max(1,Math.round(route.duration/60))})}catch{return res.status(502).json({error:'Maršruto apskaičiuoti nepavyko.'})}
}
