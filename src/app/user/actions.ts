"use server"

import { db } from "@/db"
import { routes, stops, transportations, fares, schedules } from "@/db/schema"
import { eq, like, or, and, inArray, isNotNull } from "drizzle-orm"

export async function searchRoutes(from: string, to: string) {
  try {
    // Find stops matching 'from' and 'to' (by name or type)
    const fromStops = await db.select({ id: stops.id, name: stops.name })
      .from(stops)
      .where(or(like(stops.name, `%${from}%`), like(stops.type, `%${from}%`)));
    
    const toStops = await db.select({ id: stops.id, name: stops.name })
      .from(stops)
      .where(or(like(stops.name, `%${to}%`), like(stops.type, `%${to}%`)));

    if (fromStops.length === 0 || toStops.length === 0) {
      return { success: false, data: [], message: "Titik jemput atau tujuan tidak ditemukan." }
    }

    const fromStopIds = fromStops.map(s => s.id);
    const toStopIds = toStops.map(s => s.id);

    // Helper to enrich routes with relations
    const enrichRoutes = async (routeRows: typeof routes.$inferSelect[]) => {
      return await Promise.all(routeRows.map(async (route) => {
        const [transportation] = route.transportationId
          ? await db.select().from(transportations).where(eq(transportations.id, route.transportationId))
          : [null];
        const [originStop] = route.originStopId
          ? await db.select().from(stops).where(eq(stops.id, route.originStopId))
          : [null];
        const [destinationStop] = route.destinationStopId
          ? await db.select().from(stops).where(eq(stops.id, route.destinationStopId))
          : [null];
        const routeFares = await db.select().from(fares).where(eq(fares.routeId, route.id));
        const routeSchedules = await db.select().from(schedules).where(eq(schedules.routeId, route.id));
        return { ...route, transportation, originStop, destinationStop, fares: routeFares, schedules: routeSchedules };
      }));
    };

    // Find direct routes
    const directRouteRows = await db.select().from(routes).where(
      and(
        isNotNull(routes.originStopId),
        isNotNull(routes.destinationStopId),
        inArray(routes.originStopId, fromStopIds),
        inArray(routes.destinationStopId, toStopIds)
      )
    );

    if (directRouteRows.length > 0) {
      const enriched = await enrichRoutes(directRouteRows);
      return { success: true, data: enriched, message: "Rute ditemukan." };
    }

    // Fallback: routes that go to destination
    const fallbackRows = await db.select().from(routes)
      .where(and(isNotNull(routes.destinationStopId), inArray(routes.destinationStopId, toStopIds)))
      .limit(5);

    const enriched = await enrichRoutes(fallbackRows);
    return {
      success: true,
      data: enriched,
      message: "Tidak ada rute langsung. Menampilkan alternatif rute menuju tujuan Anda."
    };

  } catch (error: any) {
    console.error("Error searching routes:", error);
    return { success: false, data: [], message: "Terjadi kesalahan saat mencari rute." }
  }
}

export async function getStopsForAutocomplete(query: string) {
  if (!query || query.length < 2) return [];
  
  try {
    const matchedStops = await db.query.stops.findMany({
      where: or(like(stops.name, `%${query}%`), like(stops.type, `%${query}%`)),
      columns: { name: true },
      limit: 8,
    });
    const uniqueNames = Array.from(new Set(matchedStops.map((s) => s.name)));
    return uniqueNames;
  } catch (error) {
    console.error("Error fetching stops:", error);
    return [];
  }
}
