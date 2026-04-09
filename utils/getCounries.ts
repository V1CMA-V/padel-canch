const API_BASE_URL = "https://api.countrystatecity.in/v1"
const API_KEY =
  process.env.COUNTRY_API_KEY || process.env.NEXT_PUBLIC_COUNTRY_API_KEY || ""
const GEO_DATA_REVALIDATE_SECONDS = 60 * 60 * 24 * 7

export type CountryResponse = {
  iso2: string
  name: string
}

export type StateResponse = {
  iso2: string
  name: string
}

export type CityResponse = {
  name: string
}

async function fetchFromCountryApi<T>(path: string): Promise<T[]> {
  if (!API_KEY) return []

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: {
      "X-CSCAPI-KEY": API_KEY,
    },
    next: { revalidate: GEO_DATA_REVALIDATE_SECONDS },
  })

  if (!response.ok) {
    return []
  }

  const data = await response.json()
  return Array.isArray(data) ? (data as T[]) : []
}

export async function getCountries(): Promise<CountryResponse[]> {
  return fetchFromCountryApi<CountryResponse>("/countries")
}

export async function getStates(countryCode: string): Promise<StateResponse[]> {
  if (!countryCode) return []
  return fetchFromCountryApi<StateResponse>(`/countries/${countryCode}/states`)
}

export async function getCities(
  countryCode: string,
  stateCode: string
): Promise<CityResponse[]> {
  if (!countryCode || !stateCode) return []
  return fetchFromCountryApi<CityResponse>(
    `/countries/${countryCode}/states/${stateCode}/cities`
  )
}
