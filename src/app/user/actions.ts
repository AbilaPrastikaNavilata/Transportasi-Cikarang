"use server"

import { db } from "@/db"
import { routes, stops, transportations, fares, schedules } from "@/db/schema"
import { eq, like, or, and } from "drizzle-orm"

export async function searchRoutes(from: string, to: string) {
  try {
    // Basic search logic: Find routes where origin matches "from" AND destination matches "to"
    // Since names might not be exact, we use LIKE.
    
    // First, find stops that match 'from' and 'to'
    const fromStops = await db.query.stops.findMany({
      where: like(stops.name, `%${from}%`),
      columns: { id: true, name: true }
    });
    
    const toStops = await db.query.stops.findMany({
      where: like(stops.name, `%${to}%`),
      columns: { id: true, name: true }
    });

    if (fromStops.length === 0 || toStops.length === 0) {
      return { success: false, data: [], message: "Titik jemput atau tujuan tidak ditemukan." }
    }

    const fromStopIds = fromStops.map(s => s.id);
    const toStopIds = toStops.map(s => s.id);

    // Find routes connecting these stops
    // Note: in a real complex system, we'd use a graph algorithm, but here routes are direct or predefined.
    const directRoutes = await db.query.routes.findMany({
      where: (routes, { inArray, and }) => and(
        inArray(routes.originStopId, fromStopIds),
        inArray(routes.destinationStopId, toStopIds)
      ),
      with: {
        originStop: true,
        destinationStop: true,
        transportation: true,
        fares: true,
        schedules: true
      }
    });

    // If no direct routes, maybe just return any routes that contain either one just as a fallback
    if (directRoutes.length > 0) {
      return { success: true, data: directRoutes, message: "Rute ditemukan." }
    } else {
      // Fallback: finding routes that just go to the destination
      const fallbackRoutes = await db.query.routes.findMany({
         where: (routes, { inArray }) => inArray(routes.destinationStopId, toStopIds),
         with: {
            originStop: true,
            destinationStop: true,
            transportation: true,
            fares: true,
            schedules: true
         },
         limit: 5
      });
      return { 
        success: true, 
        data: fallbackRoutes, 
        message: "Tidak ada rute langsung. Menampilkan alternatif rute menuju tujuan Anda." 
      }
    }

  } catch (error: any) {
    console.error("Error searching routes:", error);
    return { success: false, data: [], message: "Terjadi kesalahan saat mencari rute." }
  }
}

export async function getStopsForAutocomplete(query: string) {
  if (!query || query.length < 2) return [];
  
  try {
    const matchedStops = await db.query.stops.findMany({
      where: like(stops.name, `%${query}%`),
      columns: { name: true },
      limit: 5,
    });
    const uniqueNames = Array.from(new Set(matchedStops.map((s) => s.name)));
    return uniqueNames;
  } catch (error) {
    console.error("Error fetching stops:", error);
    return [];
  }
}
