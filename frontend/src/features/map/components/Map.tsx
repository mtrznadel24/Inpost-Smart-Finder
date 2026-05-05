import {useState, useMemo, useRef} from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useTranslation } from "react-i18next";
import { useLockers } from "@/features/lockers/hooks/useLockers";
import type {LockerFiltersState, MapBounds} from "@/features/lockers/types";
import { pinIcon, createCustomClusterIcon } from "../utils/icons";
import { Map as LeafletMap } from "leaflet";
import { MapEvents } from "./MapEvents";

interface MapProps {
  onMarkerClick: (id: number) => void;
  filters: LockerFiltersState;
}

export function Map({ onMarkerClick, filters}: MapProps) {
  const { t } = useTranslation();
  const defaultCenter: [number, number] = [52.2297, 21.0122];

  const [bounds, setBounds] = useState<MapBounds | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number>(13);

  const { data: lockers, isLoading } = useLockers(bounds, filters);
  const isLimitReached = lockers?.length === 500;

  const mapRef = useRef<LeafletMap | null>(null);

  const handleMapReady = () => {
    if (mapRef.current) {
      const map = mapRef.current;
      const b = map.getBounds().pad(0.5);
      setBounds({
        _southWest: { lat: b.getSouthWest().lat, lng: b.getSouthWest().lng },
        _northEast: { lat: b.getNorthEast().lat, lng: b.getNorthEast().lng },
      });
      setCurrentZoom(map.getZoom());
    }
  };

  const markers = useMemo(() => {
    return lockers?.map((locker) => (
      <Marker
        key={locker.id}
        position={[locker.latitude, locker.longitude]}
        icon={pinIcon}
        eventHandlers={{ click: () => onMarkerClick(locker.id) }}
      />
    ));
  }, [lockers, onMarkerClick]);

  return (
    <div className="relative w-full h-full z-0">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        className="w-full h-full"
        ref={mapRef}
        whenReady={handleMapReady}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <MapEvents onBoundsChange={setBounds} onZoomChange={setCurrentZoom} />

        {bounds && !isLimitReached && (
          <>
            {currentZoom > 14 ? (
              <>{markers}</>
            ) : (
              <MarkerClusterGroup
                maxClusterRadius={60}
                iconCreateFunction={createCustomClusterIcon}
                animate={false}
              >
                {markers}
              </MarkerClusterGroup>
            )}
          </>
        )}
      </MapContainer>

      {!bounds && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-zinc-900 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium">
          {t("map.zoomInPrompt")}
        </div>
      )}

      {isLimitReached && bounds && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-zinc-900/90 backdrop-blur-sm text-white px-5 py-2.5 rounded-full shadow-2xl text-sm font-medium border border-zinc-700">
          {t("map.tooManyResults")}
        </div>
      )}

      {isLoading && bounds && !isLimitReached && (
        <div className="absolute top-4 right-4 z-[1000] bg-white px-4 py-2 rounded-md shadow-md text-sm font-medium">
          {t("map.loading")}
        </div>
      )}
    </div>
  );
}