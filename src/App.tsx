import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Banknote, BriefcaseBusiness, CalendarDays, CarFront, Check, ChevronLeft, Clock3, CreditCard, Fuel, Leaf, LoaderCircle, LockKeyhole, MapPinned, Minus, Phone, Plus, Route, ShieldCheck, Sparkles, UserRound, Zap } from 'lucide-react'
import PlaceField from './components/PlaceField'
import type { Booking, PaymentMethod, Place } from './types'

const today = new Date().toISOString().slice(0, 10)
const initial: Booking = { pickup:null,destination:null,date:today,time:'',passengers:1,luggage:0,firstName:'',lastName:'',phone:'',paymentMethod:'driver',distanceKm:0,durationMin:0,price:0 }

function nextAllowedTime(date:string) {
  if (date !== today) return '00:00'
  const d = new Date(Date.now() + 2*60*60*1000)
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}
function Counter({value,onChange,max,icon,label,min=0}:{value:number;onChange:(v:number)=>void;max:number;icon:React.ReactNode;label:string;min?:number}){
  return <div className="counter"><div className="counter-label">{icon}<span>{label}</span></div><div className="counter-actions"><button type="button" aria-label={`Mažinti ${label}`} onClick={()=>onChange(Math.max(min,value-1))}><Minus/></button><strong>{value}</strong><button type="button" aria-label={`Didinti ${label}`} onClick={()=>onChange(Math.min(max,value+1))}><Plus/></button></div></div>
}

export default function App(){
  const [booking,setBooking]=useState(initial)
  const [step,setStep]=useState(1)
  const [routeLoading,setRouteLoading]=useState(false)
  const [submitting,setSubmitting]=useState(false)
  const [error,setError]=useState('')
  const [done,setDone]=useState('')
  const minTime=useMemo(()=>nextAllowedTime(booking.date),[booking.date])
  const update=<K extends keyof Booking>(key:K,value:Booking[K])=>setBooking(b=>({...b,[key]:value}))

  async function calculate(){
    setError('')
    if(!booking.pickup||!booking.destination||!booking.date||!booking.time) return setError('Pasirinkite abu adresus iš pateikto sąrašo ir nurodykite kelionės laiką.')
    if(booking.date===today && booking.time<minTime) return setError(`Artimiausias galimas laikas šiandien yra ${minTime}.`)
    setRouteLoading(true)
    try{
      const q=new URLSearchParams({from:`${booking.pickup.lon},${booking.pickup.lat}`,to:`${booking.destination.lon},${booking.destination.lat}`})
      const r=await fetch(`/api/route?${q}`); const data=await r.json(); if(!r.ok) throw new Error(data.error||'Maršruto apskaičiuoti nepavyko.')
      const billable=Math.max(7,data.distanceKm)
      setBooking(b=>({...b,distanceKm:data.distanceKm,durationMin:data.durationMin,price:Number((billable*1.9).toFixed(2))})); setStep(2)
    }catch(e){setError((e as Error).message)}finally{setRouteLoading(false)}
  }
  function validateContact(){
    setError(''); if(!booking.firstName.trim()||!booking.lastName.trim()||booking.phone.replace(/\D/g,'').length<8) return setError('Įveskite vardą, pavardę ir galiojantį telefono numerį.')
    setStep(3)
  }
  async function submit(){
    setError(''); setSubmitting(true)
    try{
      if(booking.paymentMethod==='stripe'){
        const r=await fetch('/api/create-checkout-session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(booking)})
        const data=await r.json(); if(!r.ok) throw new Error(data.error||'Stripe dar neprijungtas. Įrašykite STRIPE_SECRET_KEY į Vercel aplinkos kintamuosius.'); window.location.href=data.url; return
      }
      const r=await fetch('/api/reservations',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(booking)})
      const data=await r.json(); if(!r.ok) throw new Error(data.error||'Rezervacija nepavyko.'); setDone(data.bookingCode)
    }catch(e){setError((e as Error).message)}finally{setSubmitting(false)}
  }
  const setPlace=(k:'pickup'|'destination',p:Place|null)=>update(k,p)

  return <div className="site-shell">
    <header><a className="brand" href="#top"><img src="/adv-logo.svg" alt="ADV services logotipas"/><b>ADV <em>services</em></b></a><a className="phone" href="tel:+37060000000"><Phone/>+370 600 00000</a></header>
    <main id="top">
      <section className="hero-copy">
        <motion.div initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} className="eyebrow"><Leaf/>Tvaresnė kelionė po Kauną</motion.div>
        <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.08}}>Patogiai. Saugiai.<br/><em>Atsakingiau.</em></motion.h1>
        <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.18}}>Privatus pervežimas naujais automobiliais, naudojant atsinaujinančius degalus. Kainą matote dar prieš rezervaciją.</motion.p>
        <div className="benefits"><div><Check/>1,90 € / km</div><div><Check/>Min. 7 km</div><div><Check/>Iki 3 keleivių</div></div>
        <div className="city-price"><MapPinned/><span><small>Orientacinė kaina</small><b>Kauno oro uostas → miesto centras: 30–35 €</b></span></div>
      </section>
      <motion.section id="booking" className="booking-card" initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} transition={{duration:.55}}>
        <div className="steps">{[1,2,3].map(n=><div key={n} className={step>=n?'active':''}><span>{step>n?<Check/>:n}</span><small>{n===1?'Maršrutas':n===2?'Kontaktai':'Apmokėjimas'}</small></div>)}</div>
        <AnimatePresence mode="wait">
          {done ? <motion.div key="done" className="success" initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}}><div className="success-icon"><Check/></div><h2>Rezervacija priimta</h2><p>Jūsų rezervacijos numeris</p><strong>{done}</strong><span>Su jumis susisieksime nurodytu telefono numeriu.</span></motion.div> :
          step===1 ? <motion.div key="s1" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
            <div className="card-heading"><span>01</span><div><h2>Kur keliausite?</h2><p>Įveskite adresą ir pasirinkite tikslų variantą iš sąrašo.</p></div></div>
            <div className="route-fields"><PlaceField label="Iš kur" placeholder="Adresas, oro uostas ar vieta" value={booking.pickup} onChange={p=>setPlace('pickup',p)}/><div className="route-line"></div><PlaceField label="Kur" placeholder="Kelionės tikslas" value={booking.destination} onChange={p=>setPlace('destination',p)}/></div>
            <div className="grid2"><div className="field-wrap"><label>Data</label><div className="input-icon"><CalendarDays/><input type="date" min={today} value={booking.date} onChange={e=>update('date',e.target.value)}/></div></div><div className="field-wrap"><label>Paėmimo laikas</label><div className="input-icon"><Clock3/><input type="time" min={minTime} value={booking.time} onChange={e=>update('time',e.target.value)}/></div><small className="helper">Rezervacija galima ne anksčiau nei po 2 val.</small></div></div>
            <div className="grid2"><Counter min={1} value={booking.passengers} onChange={v=>update('passengers',v)} max={3} icon={<UserRound/>} label="Keleiviai"/><Counter value={booking.luggage} onChange={v=>update('luggage',v)} max={3} icon={<BriefcaseBusiness/>} label="Bagažas"/></div>
            {error&&<div className="error">{error}</div>}<button className="primary" onClick={calculate} disabled={routeLoading}>{routeLoading?<><LoaderCircle className="spin"/>Skaičiuojama...</>:<>Apskaičiuoti kainą<ArrowRight/></>}</button>
          </motion.div> : step===2 ? <motion.div key="s2" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
            <button className="back" onClick={()=>setStep(1)}><ChevronLeft/>Keisti maršrutą</button><div className="card-heading"><span>02</span><div><h2>Jūsų kontaktai</h2><p>Duomenys reikalingi rezervacijos patvirtinimui.</p></div></div>
            <div className="trip-summary"><div><Route/><span><small>Atstumas</small><b>{booking.distanceKm.toFixed(1)} km</b></span></div><div><Clock3/><span><small>Trukmė</small><b>~{booking.durationMin} min.</b></span></div><strong>{booking.price.toFixed(2)} €</strong></div>
            <div className="grid2"><div className="field-wrap"><label>Vardas</label><input value={booking.firstName} onChange={e=>update('firstName',e.target.value)} placeholder="Vardas"/></div><div className="field-wrap"><label>Pavardė</label><input value={booking.lastName} onChange={e=>update('lastName',e.target.value)} placeholder="Pavardė"/></div></div><div className="field-wrap"><label>Telefono numeris</label><div className="input-icon"><Phone/><input type="tel" value={booking.phone} onChange={e=>update('phone',e.target.value)} placeholder="+370 6xx xxxxx"/></div></div>
            {error&&<div className="error">{error}</div>}<button className="primary" onClick={validateContact}>Tęsti į apmokėjimą<ArrowRight/></button>
          </motion.div> : <motion.div key="s3" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}}>
            <button className="back" onClick={()=>setStep(2)}><ChevronLeft/>Grįžti</button><div className="card-heading"><span>03</span><div><h2>Kaip mokėsite?</h2><p>Galutinė kaina jau apskaičiuota.</p></div></div>
            <div className="final-price"><span>Galutinė kelionės kaina</span><strong>{booking.price.toFixed(2)} €</strong><small>{Math.max(7,booking.distanceKm).toFixed(1)} apmokestinamo km × 1,90 €</small></div>
            <PaymentChoice value="driver" selected={booking.paymentMethod} onClick={v=>update('paymentMethod',v)} icon={<Banknote/>} title="Automobilyje" text="Grynaisiais arba banko kortele vairuotojui"/>
            <PaymentChoice value="stripe" selected={booking.paymentMethod} onClick={v=>update('paymentMethod',v)} icon={<CreditCard/>} title="Apmokėti dabar" text="Saugus internetinis mokėjimas per Stripe" badge="Rekomenduojama"/>
            <div className="secure-note"><LockKeyhole/>Mokėjimo kortelės duomenys svetainėje nėra saugomi.</div>
            {error&&<div className="error">{error}</div>}<button className="primary" onClick={submit} disabled={submitting}>{submitting?<><LoaderCircle className="spin"/>Vykdoma...</>:booking.paymentMethod==='stripe'?<>Pereiti į saugų mokėjimą<ArrowRight/></>:<>Patvirtinti rezervaciją<ArrowRight/></>}</button>
          </motion.div>}
        </AnimatePresence>
      </motion.section>
    </main>

    <section className="promise-bar"><span>Žalias kursas</span><i>•</i><span>Nauji automobiliai</span><i>•</i><span>Saugumas</span></section>

    <section id="green" className="green-section">
      <div className="green-copy"><div className="eyebrow"><Fuel/>Pagrindinis mūsų išskirtinumas</div><h2>Atsinaujinantys degalai.<br/>Mažesnis pėdsakas.</h2><p>Renkamės atsinaujinančius degalus ir efektyvius, naujesnius automobilius, kad kiekviena kelionė būtų ne tik patogi, bet ir atsakingesnė planetai.</p><div className="green-points"><div><Leaf/><span><b>Renewable fuel</b><small>Atsinaujinančių išteklių degalai</small></span></div><div><Zap/><span><b>Efektyvesnis parkas</b><small>Nauji, reguliariai prižiūrimi automobiliai</small></span></div></div></div>
      <div className="eco-orbit"><div className="orbit o1"></div><div className="orbit o2"></div><div className="planet"><Leaf/></div><span className="eco-tag t1">Mažiau emisijų</span><span className="eco-tag t2">Švaresnė kelionė</span><span className="eco-tag t3">Žalias kursas</span></div>
    </section>

    <section id="safety" className="trust-strip"><div><CarFront/><span><b>Nauji automobiliai</b><small>Iki 3 keleivių ir 3 lagaminų</small></span></div><div><MapPinned/><span><b>Skaidri kaina</b><small>Matoma prieš užsakymą</small></span></div><div><ShieldCheck/><span><b>Saugumas</b><small>Patikimas vairuotojas ir prižiūrėtas automobilis</small></span></div></section>
    <footer>© 2026 RideKaunas <span>Žalias kursas · Nauji automobiliai · Saugumas</span></footer>
  </div>
}

function PaymentChoice({value,selected,onClick,icon,title,text,badge}:{value:PaymentMethod;selected:PaymentMethod;onClick:(v:PaymentMethod)=>void;icon:React.ReactNode;title:string;text:string;badge?:string}){
 return <button type="button" className={`pay-choice ${selected===value?'selected':''}`} onClick={()=>onClick(value)}><div className="pay-icon">{icon}</div><span><b>{title}</b><small>{text}</small></span>{badge&&<em>{badge}</em>}<i>{selected===value&&<Check/>}</i></button>
}
