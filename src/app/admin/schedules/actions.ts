"use server"

import { db } from "@/db"
import { schedules, routes } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function getSchedulesData() {
  try {
    const schedulesData = await db.query.schedules.findMany({
      with: {
        route: true
      },
      orderBy: (schedules, { desc }) => [desc(schedules.id)]
    })
    
    const routesData = await db.select().from(routes).orderBy(routes.name)

    return { 
      success: true, 
      schedules: schedulesData, 
      routes: routesData 
    }
  } catch (error: any) {
    console.error("Error fetching schedules data:", error)
    return { success: false, error: error.message }
  }
}

export async function createSchedule(formData: FormData) {
  try {
    const routeIdStr = formData.get("routeId") as string
    const startTime = formData.get("startTime") as string
    const endTime = formData.get("endTime") as string
    const headwayMinutesStr = formData.get("headwayMinutes") as string
    const operationalDays = formData.get("operationalDays") as string

    if (!routeIdStr || !startTime || !endTime || !headwayMinutesStr) {
      return { success: false, error: "Required fields are missing" }
    }

    const routeId = parseInt(routeIdStr)
    const headwayMinutes = parseInt(headwayMinutesStr)

    // Ensure seconds are included if not present (MySQL time format requires HH:MM:SS)
    const formattedStartTime = startTime.length === 5 ? `${startTime}:00` : startTime
    const formattedEndTime = endTime.length === 5 ? `${endTime}:00` : endTime

    await db.insert(schedules).values({
      routeId,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      headwayMinutes,
      operationalDays
    })

    revalidatePath("/admin/schedules")
    return { success: true }
  } catch (error: any) {
    console.error("Error creating schedule:", error)
    return { success: false, error: error.message }
  }
}

export async function updateSchedule(id: number, formData: FormData) {
  try {
    const routeIdStr = formData.get("routeId") as string
    const startTime = formData.get("startTime") as string
    const endTime = formData.get("endTime") as string
    const headwayMinutesStr = formData.get("headwayMinutes") as string
    const operationalDays = formData.get("operationalDays") as string

    if (!routeIdStr || !startTime || !endTime || !headwayMinutesStr) {
      return { success: false, error: "Required fields are missing" }
    }

    const routeId = parseInt(routeIdStr)
    const headwayMinutes = parseInt(headwayMinutesStr)

    const formattedStartTime = startTime.length === 5 ? `${startTime}:00` : startTime
    const formattedEndTime = endTime.length === 5 ? `${endTime}:00` : endTime

    await db.update(schedules).set({
      routeId,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      headwayMinutes,
      operationalDays
    }).where(eq(schedules.id, id))

    revalidatePath("/admin/schedules")
    return { success: true }
  } catch (error: any) {
    console.error("Error updating schedule:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteSchedule(id: number) {
  try {
    await db.delete(schedules).where(eq(schedules.id, id))
    revalidatePath("/admin/schedules")
    return { success: true }
  } catch (error: any) {
    console.error("Error deleting schedule:", error)
    return { success: false, error: error.message }
  }
}
