import { getSchedulesData } from "./actions"
import { SchedulesClient } from "./schedules-client"

export const dynamic = "force-dynamic"

export default async function SchedulesPage() {
  const { schedules, routes } = await getSchedulesData()

  return (
    <SchedulesClient 
      initialSchedules={schedules || []} 
      routes={routes || []}
    />
  )
}
