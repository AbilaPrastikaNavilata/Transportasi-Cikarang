import { getRoutesData } from "./actions"
import { RoutesClient } from "./routes-client"

export default async function RoutesPage() {
  const { routes, transportations, stops } = await getRoutesData()

  return (
    <RoutesClient 
      initialRoutes={routes || []} 
      transportations={transportations || []}
      stops={stops || []}
    />
  )
}
