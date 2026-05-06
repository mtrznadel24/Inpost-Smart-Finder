import {useState, useMemo, useRef, useEffect} from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useTranslation } from "react-i18next";
import { useLockers } from "@/features/lockers/hooks/useLockers";
import type {LockerFiltersState, MapBounds} from "@/features/lockers/types";
import { pinIcon, createCustomClusterIcon } from "../utils/icons";
import { Map as LeafletMap } from "leaflet";
import { MapEvents } from "./MapEvents";
import {useGeolocation} from "@/hooks/useGeolocation.ts";
import {Loader2, LocateFixed} from "lucide-react";

interface MapProps {
  onMarkerClick: (id: number) => void;
  filters: LockerFiltersState;
  flyToLocation: { lat: number, lng: number, zoom: number } | null;
}

export function Map({ onMarkerClick, filters, flyToLocation}: MapProps) {
  const { t } = useTranslation();
  const defaultCenter: [number, number] = [52.2297, 21.0122];

  const [bounds, setBounds] = useState<MapBounds | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number>(13);

  const { data: lockers, isLoading } = useLockers(bounds, filters);
  const isLimitReached = lockers?.length === 500;

  const mapRef = useRef<LeafletMap | null>(null);
  const { location: userLocation, isLoading: isLocating, requestLocation } = useGeolocation();

  useEffect(() => {
    if (userLocation && mapRef.current) {
      mapRef.current.flyTo(userLocation, 15, { duration: 1.5 });
    }
  }, [userLocation]);

  useEffect(() => {
    if (flyToLocation && mapRef.current) {
      mapRef.current.flyTo(
        [flyToLocation.lat, flyToLocation.lng],
        flyToLocation.zoom,
        { duration: 2, easeLinearity: 0.25 }
      );
    }
  }, [flyToLocation]);

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

      <div className="absolute bottom-24 right-4 z-[1000] md:bottom-8 md:right-8">
        <button
          onClick={(e) => {
            e.preventDefault();
            requestLocation();
          }}
          className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg hover:bg-zinc-50 border border-zinc-200 text-zinc-700 transition-all active:scale-95"
          title="find me"
        >
          {isLocating ? (
            <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
          ) : (
            <LocateFixed className="w-5 h-5" />
          )}
        </button>
      </div>

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