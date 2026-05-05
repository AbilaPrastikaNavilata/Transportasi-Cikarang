"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix Leaflet's default icon path issues in Next.js
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapProps {
  stops: any[];
}

function MapUpdater({ stops }: { stops: any[] }) {
  const map = useMap();
  useEffect(() => {
    if (stops.length > 0) {
      const validStops = stops.filter(s => !isNaN(parseFloat(s.latitude)) && !isNaN(parseFloat(s.longitude)));
      if (validStops.length > 0) {
        const bounds = L.latLngBounds(validStops.map(s => [parseFloat(s.latitude), parseFloat(s.longitude)]));
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [stops, map]);
  return null;
}

export default function Map({ stops }: MapProps) {
  // Default center Cikarang
  const defaultCenter: [number, number] = [-6.2615, 107.1444]

  const validStops = stops.filter(s => s && !isNaN(parseFloat(s.latitude)) && !isNaN(parseFloat(s.longitude)));
  const positions: [number, number][] = validStops.map(s => [parseFloat(s.latitude), parseFloat(s.longitude)]);

  return (
    <div style={{ width: "100%", height: "100%", borderRadius: "0.5rem", overflow: "hidden" }}>
      <MapContainer
        center={positions.length > 0 ? positions[0] : defaultCenter}
        zoom={13}
        style={{ height: "100%", width: "100%", zIndex: 1 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapUpdater stops={validStops} />
        
        {positions.length >= 2 && (
          <Polyline positions={positions} color="#0053db" weight={4} dashArray="10, 10" />
        )}

        {validStops.map((stop, i) => {
          return (
            <Marker key={stop.id || i} position={[parseFloat(stop.latitude), parseFloat(stop.longitude)]} icon={customIcon}>
              <Popup>
                <strong>{stop.name}</strong><br />
                {stop.type}
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
