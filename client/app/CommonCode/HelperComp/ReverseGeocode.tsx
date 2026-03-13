// lib/mappls.ts

export interface ReverseGeocodeResult {
  houseNumber: string
  houseName: string
  poi: string
  street: string
  village: string
  district: string
  subDistrict: string
  city: string
  state: string
  pincode: string
  lat: string
  lng: string
  formatted_address: string
}

export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<ReverseGeocodeResult | null> {
  try {
    const token = process.env.MAPPLS_ACCESS_TOKEN

    if (!token) {
      throw new Error('MAPPLS_ACCESS_TOKEN not defined')
    }

    const url = `https://search.mappls.com/search/address/rev-geocode?lat=${lat}&lng=${lng}&access_token=${token}`

    const res = await fetch(url, {
      method: 'GET',
      cache: 'no-store', // important for dynamic data
    })

    if (!res.ok) {
      throw new Error(`Mappls API error: ${res.status}`)
    }

    const data = await res.json()

    if (!data?.results?.length) return null

    return data.results[0] as ReverseGeocodeResult
  } catch (error) {
    console.error('Reverse Geocode Error:', error)
    return null
  }
}