import { NextResponse } from "next/server"

import { getCities, getCountries, getStates } from "@/utils/getCounries"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const countryCode = searchParams.get("countryCode") ?? ""
  const stateCode = searchParams.get("stateCode") ?? ""

  if (!countryCode) {
    const countries = await getCountries()
    return NextResponse.json(countries)
  }

  if (!stateCode) {
    const states = await getStates(countryCode)
    return NextResponse.json(states)
  }

  const cities = await getCities(countryCode, stateCode)
  return NextResponse.json(cities)
}
