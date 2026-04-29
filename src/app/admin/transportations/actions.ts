"use server"

import { db } from "@/db"
import { transportations } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function getTransportations() {
  try {
    const data = await db.select().from(transportations).orderBy(transportations.id)
    return { success: true, data }
  } catch (error: any) {
    console.error("Error fetching transportations:", error)
    return { success: false, error: error.message }
  }
}

export async function createTransportation(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const type = formData.get("type") as string
    const capacityStr = formData.get("capacity") as string
    const facilities = formData.get("facilities") as string

    if (!name || !type) {
      return { success: false, error: "Name and type are required" }
    }

    const capacity = capacityStr ? parseInt(capacityStr) : null

    await db.insert(transportations).values({
      name,
      type,
      capacity,
      facilities
    })

    revalidatePath("/admin/transportations")
    return { success: true }
  } catch (error: any) {
    console.error("Error creating transportation:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteTransportation(id: number) {
  try {
    await db.delete(transportations).where(eq(transportations.id, id))
    revalidatePath("/admin/transportations")
    return { success: true }
  } catch (error: any) {
    console.error("Error deleting transportation:", error)
    return { success: false, error: error.message }
  }
}

export async function updateTransportation(id: number, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const type = formData.get("type") as string
    const capacityStr = formData.get("capacity") as string
    const facilities = formData.get("facilities") as string

    if (!name || !type) {
      return { success: false, error: "Name and type are required" }
    }

    const capacity = capacityStr ? parseInt(capacityStr) : null

    await db.update(transportations).set({
      name,
      type,
      capacity,
      facilities
    }).where(eq(transportations.id, id))

    revalidatePath("/admin/transportations")
    return { success: true }
  } catch (error: any) {
    console.error("Error updating transportation:", error)
    return { success: false, error: error.message }
  }
}
