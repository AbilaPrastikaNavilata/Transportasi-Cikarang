import { getRoutesData } from "./actions"
import { RoutesClient } from "./routes-client"

export const dynamic = "force-dynamic"

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
