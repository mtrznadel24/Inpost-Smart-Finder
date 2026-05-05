import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

const MOCK_LOCKERS = [
  { id: 1, name: "WAW123", position: [52.2297, 21.0122] as [number, number], address: "ul. Prosta 1" },
  { id: 2, name: "WAW456", position: [52.2310, 21.0150] as [number, number], address: "ul. Jasna 10" },
  { id: 3, name: "WAW789", position: [52.2280, 21.0200] as [number, number], address: "ul. Cicha 5" },
];

export function Map() {
  const defaultCenter: [number, number] = [52.2297, 21.0122];

  return (
    <MapContainer
      center={defaultCenter}
      zoom={13}
      className="w-full h-full z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MarkerClusterGroup chunkedLoading>
        {MOCK_LOCKERS.map((locker) => (
          <Marker key={locker.id} position={locker.position}>
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg">{locker.name}</h3>
                <p className="text-sm text-zinc-600">{locker.address}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}