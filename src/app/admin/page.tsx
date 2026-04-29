import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Bus, 
  MapPin, 
  Route, 
  Users, 
  Calendar,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Megaphone,
  Sun,
  Activity
} from "lucide-react"
import { db } from "@/db"
import { routes, transportations, stops } from "@/db/schema"
import { count } from "drizzle-orm"
import Link from "next/link"

export default async function AdminDashboard() {
  // Fetch real statistics from database
  const routesCount = await db.select({ value: count() }).from(routes)
  const transCount = await db.select({ value: count() }).from(transportations)
  const stopsCount = await db.select({ value: count() }).from(stops)

  const activeRoutes = routesCount[0].value
  const totalVehicles = transCount[0].value
  const totalStops = stopsCount[0].value

  // We can fetch real routes for the list, or keep static ones if we don't have tracking
  // Let's fetch the latest 4 routes just to show something dynamic
  const recentRoutes = await db.query.routes.findMany({
    with: { originStop: true, destinationStop: true },
    limit: 4,
    orderBy: (routes, { desc }) => [desc(routes.id)]
  })

  // Format the date
  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short'
  })

  // Fetch real weather data for Cikarang
  let temp = "31";
  let condition = "Mostly Cloudy";
  let weatherIcon = <Sun className="h-12 w-12" />;

  try {
    const weatherRes = await fetch("https://api.open-meteo.com/v1/forecast?latitude=-6.2615&longitude=107.1444&current_weather=true", { next: { revalidate: 3600 } });
    if (weatherRes.ok) {
      const weatherData = await weatherRes.json();
      temp = Math.round(weatherData.current_weather.temperature).toString();
      const code = weatherData.current_weather.weathercode;
      
      // Simple WMO weather code mapping
      if (code === 0) { condition = "Clear Sky"; weatherIcon = <Sun className="h-12 w-12" />; }
      else if (code >= 1 && code <= 3) { condition = "Partly Cloudy"; weatherIcon = <Sun className="h-12 w-12 opacity-80" />; }
      else if (code >= 45 && code <= 48) { condition = "Foggy"; weatherIcon = <Activity className="h-12 w-12 opacity-50" />; }
      else if (code >= 51 && code <= 67) { condition = "Rainy"; weatherIcon = <AlertCircle className="h-12 w-12 text-blue-500" />; }
      else if (code >= 80 && code <= 82) { condition = "Rain Showers"; weatherIcon = <AlertCircle className="h-12 w-12 text-blue-600" />; }
      else if (code >= 95 && code <= 99) { condition = "Thunderstorm"; weatherIcon = <Megaphone className="h-12 w-12 text-amber-600" />; }
    }
  } catch (e) {
    console.error("Failed to fetch weather", e);
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center text-sm text-slate-500 mb-1">
            <span>Home</span>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span className="font-medium text-[#0F172A]">Dashboard Overview</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">System Overview</h1>
        </div>
        <Button variant="outline" className="rounded-full border-slate-200 text-[#0F172A] font-medium shadow-sm hover:bg-slate-50 pointer-events-none">
          <Calendar className="mr-2 h-4 w-4 text-slate-500" />
          {today}
        </Button>
      </div>

      {/* Top Row: Stat Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Active Routes</CardTitle>
            <div className="bg-[#E3F2FD] p-2 rounded-lg">
              <Route className="h-4 w-4 text-[#0053db]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0F172A]">{activeRoutes}</div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Registered in system
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Fleets</CardTitle>
            <div className="bg-[#E3F2FD] p-2 rounded-lg">
              <Bus className="h-4 w-4 text-[#0053db]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0F172A]">{totalVehicles}</div>
            <p className="text-xs text-slate-500 mt-1">
              Vehicles & Transportations
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Stops</CardTitle>
            <div className="bg-[#E3F2FD] p-2 rounded-lg">
              <MapPin className="h-4 w-4 text-[#0053db]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0F172A]">{totalStops}</div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Halte & Terminals
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-transparent bg-[#0F172A] text-white shadow-md relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-slate-300">System Status</CardTitle>
            <Activity className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              <div className="text-2xl font-bold">Operational</div>
            </div>
            <p className="text-xs text-slate-400">
              Database Sync: Real-time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Middle Section: Grid Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column (span 2): Live Route Status */}
        <Card className="lg:col-span-2 rounded-2xl border-slate-200 shadow-sm">
          <CardHeader className="pb-4 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-[#0F172A]">Recent Routes</CardTitle>
                <CardDescription>Latest routes added to the network</CardDescription>
              </div>
              <Link href="/admin/routes">
                <Button variant="ghost" size="sm" className="text-[#0053db] hover:bg-[#E3F2FD]">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {recentRoutes.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-sm">No routes available yet.</div>
              ) : (
                recentRoutes.map((route) => (
                  <div key={route.id} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="bg-[#E3F2FD] p-2.5 rounded-xl mt-0.5">
                        <Route className="h-5 w-5 text-[#0053db]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#0F172A]">{route.name}</h4>
                        <div className="flex items-center text-xs text-slate-500 mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {route.originStop?.name || "Unknown"} → {route.destinationStop?.name || "Unknown"}
                        </div>
                      </div>
                    </div>
                    <Badge className={`px-2.5 py-1 rounded-full font-semibold border-none shrink-0 bg-emerald-100 text-emerald-700 hover:bg-emerald-100`}>
                      Active
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Utility Cards */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-[#0F172A]">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                <Link href="/admin/stops" className="w-full">
                  <Button className="w-full h-16 justify-start px-4 bg-white border border-slate-200 hover:border-[#0053db] hover:bg-[#E3F2FD] text-[#0F172A] rounded-xl shadow-sm transition-all group">
                    <div className="bg-[#E3F2FD] group-hover:bg-white p-2 rounded-lg mr-3 transition-colors">
                      <MapPin className="h-5 w-5 text-[#0053db]" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-semibold">Manage Stops</span>
                    </div>
                  </Button>
                </Link>
                <Link href="/admin/transportations" className="w-full">
                  <Button className="w-full h-16 justify-start px-4 bg-white border border-slate-200 hover:border-[#0053db] hover:bg-[#E3F2FD] text-[#0F172A] rounded-xl shadow-sm transition-all group">
                    <div className="bg-[#E3F2FD] group-hover:bg-white p-2 rounded-lg mr-3 transition-colors">
                      <Bus className="h-5 w-5 text-[#0053db]" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-semibold">Manage Fleets</span>
                    </div>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Current Conditions */}
          <Card className="rounded-2xl border-none bg-gradient-to-br from-[#E3F2FD] to-[#bbdefb] shadow-sm relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-semibold text-[#0F172A]/70 mb-1">Current Conditions</h3>
                  <div className="text-3xl font-bold text-[#0F172A] mb-2">{temp}°C</div>
                  <p className="text-sm font-medium text-[#0F172A]">{condition}</p>
                  <div className="flex items-center text-xs text-[#0F172A]/70 mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    Cikarang Area
                  </div>
                </div>
                <div className="text-amber-500">
                  {weatherIcon}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
