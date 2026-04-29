"use server"

import { db } from "@/db"
import { stops } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function getStops() {
  try {
    const data = await db.select().from(stops).orderBy(stops.id)
    return { success: true, data }
  } catch (error: any) {
    console.error("Error fetching stops:", error)
    return { success: false, error: error.message }
  }
}

export async function createStop(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const type = formData.get("type") as string
    const latitude = formData.get("latitude") as string
    const longitude = formData.get("longitude") as string

    if (!name || !type || !latitude || !longitude) {
      return { success: false, error: "All fields are required" }
    }

    await db.insert(stops).values({
      name,
      type,
      latitude,
      longitude
    })

    revalidatePath("/admin/stops")
    return { success: true }
  } catch (error: any) {
    console.error("Error creating stop:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteStop(id: number) {
  try {
    await db.delete(stops).where(eq(stops.id, id))
    revalidatePath("/admin/stops")
    return { success: true }
  } catch (error: any) {
    console.error("Error deleting stop:", error)
    return { success: false, error: error.message }
  }
}

export async function updateStop(id: number, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const type = formData.get("type") as string
    const latitude = formData.get("latitude") as string
    const longitude = formData.get("longitude") as string

    if (!name || !type || !latitude || !longitude) {
      return { success: false, error: "All fields are required" }
    }

    await db.update(stops).set({
      name,
      type,
      latitude,
      longitude
    }).where(eq(stops.id, id))

    revalidatePath("/admin/stops")
    return { success: true }
  } catch (error: any) {
    console.error("Error updating stop:", error)
    return { success: false, error: error.message }
  }
}
