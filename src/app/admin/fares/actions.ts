"use server"

import { db } from "@/db"
import { fares, transportations, routes } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function getFaresData() {
  try {
    const faresData = await db.query.fares.findMany({
      with: {
        transportation: true,
        route: true
      },
      orderBy: (fares, { desc }) => [desc(fares.id)]
    })
    
    const transportationsData = await db.select().from(transportations).orderBy(transportations.name)
    const routesData = await db.select().from(routes).orderBy(routes.name)

    return { 
      success: true, 
      fares: faresData, 
      transportations: transportationsData,
      routes: routesData
    }
  } catch (error: any) {
    console.error("Error fetching fares data:", error)
    return { success: false, error: error.message }
  }
}

export async function createFare(formData: FormData) {
  try {
    const transportationIdStr = formData.get("transportationId") as string
    const routeIdStr = formData.get("routeId") as string
    const baseFare = formData.get("baseFare") as string
    const farePerKm = formData.get("farePerKm") as string

    if (!transportationIdStr || !baseFare) {
      return { success: false, error: "Transportation and Base Fare are required" }
    }

    const transportationId = parseInt(transportationIdStr)
    const routeId = routeIdStr ? parseInt(routeIdStr) : null

    await db.insert(fares).values({
      transportationId,
      routeId,
      baseFare,
      farePerKm: farePerKm || "0.00"
    })

    revalidatePath("/admin/fares")
    return { success: true }
  } catch (error: any) {
    console.error("Error creating fare:", error)
    return { success: false, error: error.message }
  }
}

export async function updateFare(id: number, formData: FormData) {
  try {
    const transportationIdStr = formData.get("transportationId") as string
    const routeIdStr = formData.get("routeId") as string
    const baseFare = formData.get("baseFare") as string
    const farePerKm = formData.get("farePerKm") as string

    if (!transportationIdStr || !baseFare) {
      return { success: false, error: "Transportation and Base Fare are required" }
    }

    const transportationId = parseInt(transportationIdStr)
    const routeId = routeIdStr ? parseInt(routeIdStr) : null

    await db.update(fares).set({
      transportationId,
      routeId,
      baseFare,
      farePerKm: farePerKm || "0.00"
    }).where(eq(fares.id, id))

    revalidatePath("/admin/fares")
    return { success: true }
  } catch (error: any) {
    console.error("Error updating fare:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteFare(id: number) {
  try {
    await db.delete(fares).where(eq(fares.id, id))
    revalidatePath("/admin/fares")
    return { success: true }
  } catch (error: any) {
    console.error("Error deleting fare:", error)
    return { success: false, error: error.message }
  }
}
