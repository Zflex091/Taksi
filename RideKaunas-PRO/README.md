# RideKaunas PRO

Privataus pervežimo rezervacijų svetainė, sukurta su React, TypeScript, Vite ir Vercel Serverless Functions.

## Paleidimas kompiuteryje

```powershell
cd RideKaunas-PRO
npm install
vercel dev
```

Pirmą kartą paleidus `vercel dev`, pasirinkite **Create a new project**, o ne seną Vercel projektą. Atidarykite terminale parodytą adresą, paprastai `http://localhost:3000`.

## Funkcijos

- Adresų paieška ir pasirinkimas iš sąrašo
- Maršruto atstumo ir trukmės apskaičiavimas
- 1,90 € už km, minimaliai apmokestinami 7 km
- Maksimaliai 3 keleiviai ir 3 bagažo vienetai
- Rezervacija ne anksčiau nei po 2 valandų
- Vardas, pavardė ir telefono numeris
- Grynieji / kortelė automobilyje
- Stripe Checkout paruošimas
- Mobilus ir kompiuterio dizainas
- Žalias kursas, nauji automobiliai, saugumas
- Atsinaujinantys degalai kaip pagrindinis išskirtinumas
- Orientacinė 30–35 € kaina iki Kauno miesto centro

## Stripe prijungimas

Vercel projekto aplinkos kintamuosiuose pridėkite:

```env
STRIPE_SECRET_KEY=sk_live_...
SITE_URL=https://jusu-domenas.lt
```

Lokaliam testavimui nukopijuokite `.env.example` į `.env.local`.

## Svarbu prieš paleidimą

Pakeiskite telefono numerį `src/App.tsx` faile. `api/reservations.ts` šiuo metu sugeneruoja rezervacijos kodą; realiam naudojimui prijunkite el. pašto siuntimą arba duomenų bazę.
