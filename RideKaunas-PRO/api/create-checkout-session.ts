import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'
export default async function handler(req:VercelRequest,res:VercelResponse){
 if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'})
 if(!process.env.STRIPE_SECRET_KEY) return res.status(503).json({error:'Stripe dar neprijungtas. Įrašykite STRIPE_SECRET_KEY Vercel nustatymuose.'})
 try{const b=req.body||{}; const amount=Math.round(Number(b.price)*100); if(!Number.isFinite(amount)||amount<100) throw new Error('Neteisinga suma')
 const stripe=new Stripe(process.env.STRIPE_SECRET_KEY); const base=process.env.PUBLIC_SITE_URL||`https://${req.headers.host}`
 const session=await stripe.checkout.sessions.create({mode:'payment',line_items:[{quantity:1,price_data:{currency:'eur',unit_amount:amount,product_data:{name:'Privatus pervežimas',description:`${b.pickup.label} → ${b.destination.label}`}}}],success_url:`${base}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,cancel_url:`${base}/?payment=cancelled`,phone_number_collection:{enabled:true},metadata:{firstName:b.firstName,lastName:b.lastName,date:b.date,time:b.time,passengers:String(b.passengers),luggage:String(b.luggage)}})
 return res.status(200).json({url:session.url})}catch(e){return res.status(400).json({error:(e as Error).message||'Stripe klaida'})}
}
