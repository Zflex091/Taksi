export type Place = { label: string; lat: number; lon: number }
export type PaymentMethod = 'driver' | 'stripe'
export type Booking = {
  pickup: Place | null
  destination: Place | null
  date: string
  time: string
  passengers: number
  luggage: number
  firstName: string
  lastName: string
  phone: string
  paymentMethod: PaymentMethod
  distanceKm: number
  durationMin: number
  price: number
}
