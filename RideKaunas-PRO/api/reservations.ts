import type { VercelRequest, VercelResponse } from '@vercel/node'
export default async function handler(req:VercelRequest,res:VercelResponse){
 if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'})
 const b=req.body||{}; if(!b.pickup?.label||!b.destination?.label||!b.firstName||!b.lastName||!b.phone||!Number.isFinite(b.price)) return res.status(400).json({error:'Trūksta rezervacijos duomenų.'})
 // TODO: Save to your database / send SMS or email here.
 const bookingCode=`RK-${Date.now().toString(36).slice(-6).toUpperCase()}`
 return res.status(200).json({ok:true,bookingCode})
}
