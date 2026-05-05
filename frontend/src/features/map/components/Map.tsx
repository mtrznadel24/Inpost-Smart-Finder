import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useLockers } from "@/features/lockers/hooks/useLockers";
import type { MapBounds } from "@/features/lockers/types";

function MapEvents({ onBoundsChange }: { onBoundsChange: (bounds: MapBounds) => void }) {
  const map = useMapEvents({
    moveend: () => updateBounds(),
    zoomend: () => updateBounds(),
  });

  const updateBounds = () => {
    const b = map.getBounds();
    onBoundsChange({
      _southWest: { lat: b.getSouthWest().lat, lng: b.getSouthWest().lng },
      _northEast: { lat: b.getNorthEast().lat, lng: b.getNorthEast().lng },
    });
  };

  return null;
}

export function Map() {
  const defaultCenter: [number, number] = [52.2297, 21.0122];

  const [bounds, setBounds] = useState<MapBounds | null>(null);

  const { data: lockers, isLoading } = useLockers(bounds);

  return (
    <div className="relative w-full h-full z-0">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        className="w-full h-full"
        whenReady={(e) => {
          const b = e.target.getBounds();
          setBounds({
            _southWest: { lat: b.getSouthWest().lat, lng: b.getSouthWest().lng },
            _northEast: { lat: b.getNorthEast().lat, lng: b.getNorthEast().lng },
          });
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapEvents onBoundsChange={setBounds} />

        <MarkerClusterGroup chunkedLoading>
          {lockers?.map((locker) => (
            <Marker key={locker.id} position={[locker.latitude, locker.longitude]}>
              <Popup>
                <div className="p-2 min-w-[150px]">
                  <h3 className="font-bold text-lg">{locker.name}</h3>
                  <p className="text-sm text-zinc-600 mb-2">{locker.status}</p>
                  <p className="text-xs text-zinc-400">ID: {locker.id}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      {isLoading && (
        <div className="absolute top-4 right-4 z-[1000] bg-white px-4 py-2 rounded-md shadow-md text-sm font-medium">
          Pobieranie...
        </div>
      )}
    </div>
  );
}