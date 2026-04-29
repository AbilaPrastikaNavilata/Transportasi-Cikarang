import { getStops } from "./actions"
import { StopsClient } from "./stops-client"

export default async function StopsPage() {
  const { data } = await getStops()

  return <StopsClient initialData={data || []} />
}
