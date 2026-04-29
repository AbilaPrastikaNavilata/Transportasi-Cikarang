"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
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

export default function Map({ stops }: MapProps) {
  // Default center Cikarang
  const defaultCenter: [number, number] = [-6.2615, 107.1444]

  return (
    <MapContainer
      center={stops.length > 0 ? [parseFloat(stops[0].latitude), parseFloat(stops[0].longitude)] : defaultCenter}
      zoom={13}
      style={{ height: "400px", width: "100%", borderRadius: "0.5rem" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {stops.map((stop) => {
        const lat = parseFloat(stop.latitude);
        const lng = parseFloat(stop.longitude);
        if (isNaN(lat) || isNaN(lng)) return null;

        return (
          <Marker key={stop.id} position={[lat, lng]} icon={customIcon}>
            <Popup>
              <strong>{stop.name}</strong><br />
              {stop.type}
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}
