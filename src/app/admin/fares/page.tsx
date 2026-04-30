import { getFaresData } from "./actions"
import { FaresClient } from "./fares-client"

export const dynamic = "force-dynamic"

export default async function FaresPage() {
  const { fares, transportations, routes } = await getFaresData()

  return (
    <FaresClient 
      initialFares={fares || []} 
      transportations={transportations || []}
      routes={routes || []}
    />
  )
}
