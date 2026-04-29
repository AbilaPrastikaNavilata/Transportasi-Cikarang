import { getTransportations } from "./actions"
import { TransportationClient } from "./transportation-client"

export default async function TransportationsPage() {
  const { data } = await getTransportations()

  return <TransportationClient initialData={data || []} />
}
