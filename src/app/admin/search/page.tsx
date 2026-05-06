export const dynamic = "force-dynamic"

import { db } from "@/db"
import { transportations, stops, routes } from "@/db/schema"
import { like, or } from "drizzle-orm"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Bus, MapPin, Route, Search as SearchIcon, ChevronRight, LayoutDashboard, Calendar, Banknote } from "lucide-react"

export default async function SearchPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ q?: string }> | { q?: string } 
}) {
  // Await searchParams before accessing its properties (Next.js 15+ requirement)
  const resolvedParams = await searchParams
  const query = resolvedParams.q || ""
  const searchTerm = `%${query}%`

  let foundTransportations: any[] = []
  let foundRoutes: any[] = []
  let foundStops: any[] = []
  
  const adminPages = [
    { name: "Dashboard", url: "/admin", description: "Main overview and statistics" },
    { name: "Transportations", url: "/admin/transportations", description: "Manage vehicles and fleets" },
    { name: "Stops", url: "/admin/stops", description: "Manage haltes and terminals" },
    { name: "Routes", url: "/admin/routes", description: "Manage routes and paths" },
    { name: "Schedules", url: "/admin/schedules", description: "Manage timetables" },
    { name: "Fares", url: "/admin/fares", description: "Manage tariffs and prices" }
  ]
  
  const foundPages = query ? adminPages.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase())) : []

  if (query) {
    foundTransportations = await db.query.transportations.findMany({
      where: or(like(transportations.name, searchTerm), like(transportations.type, searchTerm)),
      limit: 10
    })

    foundRoutes = await db.query.routes.findMany({
      where: like(routes.name, searchTerm),
      with: { originStop: true, destinationStop: true },
      limit: 10
    })

    foundStops = await db.query.stops.findMany({
      where: or(like(stops.name, searchTerm), like(stops.type, searchTerm)),
      limit: 10
    })
  }

  const totalResults = foundTransportations.length + foundRoutes.length + foundStops.length + foundPages.length

  return (
    <div className="space-y-8 pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center text-sm text-slate-500 mb-1">
            <span>Home</span>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span className="font-medium text-[#0F172A]">Search Results</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">
            Search: "{query}"
          </h1>
          <p className="text-slate-500 mt-2">Found {totalResults} results across the system</p>
        </div>
      </div>

      {!query && (
        <Card className="rounded-2xl border-slate-200 border-dashed bg-slate-50/50 shadow-none text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center justify-center">
              <div className="bg-slate-100 p-4 rounded-full mb-4">
                <SearchIcon className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700">Type something to search</h3>
              <p className="text-slate-500 text-sm max-w-sm mt-2">Use the search bar at the top to find fleets, routes, or stops.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {query && totalResults === 0 && (
        <Card className="rounded-2xl border-slate-200 border-dashed bg-slate-50/50 shadow-none text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center justify-center">
              <div className="bg-slate-100 p-4 rounded-full mb-4">
                <SearchIcon className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700">No results found</h3>
              <p className="text-slate-500 text-sm max-w-sm mt-2">We couldn't find anything matching "{query}". Try checking for spelling errors or using different keywords.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {foundPages.length > 0 && (
        <Card className="rounded-2xl border-slate-200 shadow-sm border-blue-200 ring-1 ring-blue-100">
          <CardHeader className="pb-4 border-b border-slate-100 bg-blue-50/50 rounded-t-2xl">
            <CardTitle className="text-lg font-bold text-[#0F172A] flex items-center">
              <div className="bg-[#0053db] p-1.5 rounded-md mr-2">
                <LayoutDashboard className="h-4 w-4 text-white" />
              </div>
              Menu & Quick Links
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {foundPages.map(p => (
                <Link key={p.name} href={p.url} className="block p-4 hover:bg-slate-50 transition-colors">
                  <div className="font-semibold text-[#0053db]">{p.name}</div>
                  <div className="text-sm text-slate-500 mt-1">{p.description}</div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {foundTransportations.length > 0 && (
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader className="pb-4 border-b border-slate-100 bg-white rounded-t-2xl">
            <CardTitle className="text-lg font-bold text-[#0F172A] flex items-center">
              <div className="bg-[#E3F2FD] p-1.5 rounded-md mr-2">
                <Bus className="h-4 w-4 text-[#0053db]" />
              </div>
              Fleets / Transportations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {foundTransportations.map(t => (
                <Link key={t.id} href="/admin/transportations" className="block p-4 hover:bg-slate-50 transition-colors">
                  <div className="font-semibold text-[#0F172A]">{t.name}</div>
                  <div className="text-sm text-slate-500 mt-1">{t.type} • {t.capacity} seats</div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {foundRoutes.length > 0 && (
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader className="pb-4 border-b border-slate-100 bg-white rounded-t-2xl">
            <CardTitle className="text-lg font-bold text-[#0F172A] flex items-center">
              <div className="bg-[#E3F2FD] p-1.5 rounded-md mr-2">
                <Route className="h-4 w-4 text-[#0053db]" />
              </div>
              Routes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {foundRoutes.map(r => (
                <Link key={r.id} href="/admin/routes" className="block p-4 hover:bg-slate-50 transition-colors">
                  <div className="font-semibold text-[#0F172A]">{r.name}</div>
                  <div className="text-sm text-slate-500 mt-1 flex items-center">
                    <MapPin className="h-3 w-3 mr-1 inline" />
                    {r.originStop?.name || "Unknown"} → {r.destinationStop?.name || "Unknown"}
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {foundStops.length > 0 && (
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader className="pb-4 border-b border-slate-100 bg-white rounded-t-2xl">
            <CardTitle className="text-lg font-bold text-[#0F172A] flex items-center">
              <div className="bg-[#E3F2FD] p-1.5 rounded-md mr-2">
                <MapPin className="h-4 w-4 text-[#0053db]" />
              </div>
              Stops & Terminals
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {foundStops.map(s => (
                <Link key={s.id} href="/admin/stops" className="block p-4 hover:bg-slate-50 transition-colors">
                  <div className="font-semibold text-[#0F172A]">{s.name}</div>
                  <div className="text-sm text-slate-500 mt-1">{s.type}</div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
