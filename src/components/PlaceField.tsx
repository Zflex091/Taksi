import { useEffect, useRef, useState } from 'react'
import { MapPin, LoaderCircle } from 'lucide-react'
import type { Place } from '../types'

type Props = { label: string; placeholder: string; value: Place | null; onChange: (p: Place | null) => void }

export default function PlaceField({ label, placeholder, value, onChange }: Props) {
  const [query, setQuery] = useState(value?.label ?? '')
  const [items, setItems] = useState<Place[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const controller = useRef<AbortController | null>(null)

  useEffect(() => { if (value?.label !== query) setQuery(value?.label ?? '') }, [value])
  useEffect(() => {
    if (query.trim().length < 3 || value?.label === query) { setItems([]); return }
    const id = setTimeout(async () => {
      controller.current?.abort(); controller.current = new AbortController(); setLoading(true)
      try {
        const r = await fetch(`/api/places?q=${encodeURIComponent(query)}`, { signal: controller.current.signal })
        if (!r.ok) throw new Error('Paieška nepavyko')
        setItems(await r.json()); setOpen(true)
      } catch (e) { if ((e as Error).name !== 'AbortError') setItems([]) }
      finally { setLoading(false) }
    }, 350)
    return () => clearTimeout(id)
  }, [query])

  return <div className="field-wrap">
    <label>{label}</label>
    <div className="input-icon"><MapPin size={19}/><input value={query} placeholder={placeholder} autoComplete="off"
      onChange={e => { setQuery(e.target.value); onChange(null); setOpen(true) }} onFocus={() => setOpen(true)} /></div>
    {loading && <LoaderCircle className="field-loader" size={18}/>} 
    {open && items.length > 0 && <div className="suggestions">
      {items.map((p, i) => <button type="button" key={`${p.lat}-${i}`} onClick={() => { onChange(p); setQuery(p.label); setOpen(false); setItems([]) }}>
        <MapPin size={16}/><span>{p.label}</span>
      </button>)}
    </div>}
  </div>
}
