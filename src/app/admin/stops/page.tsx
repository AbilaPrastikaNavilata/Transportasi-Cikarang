import { getStops } from "./actions"
import { StopsClient } from "./stops-client"

export const dynamic = "force-dynamic"

export default async function StopsPage() {
  const { data } = await getStops()

  return <StopsClient initialData={data || []} />
}
