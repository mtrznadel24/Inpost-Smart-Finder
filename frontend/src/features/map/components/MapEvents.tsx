import { useMapEvents } from "react-leaflet";
import type { MapBounds } from "@/features/lockers/types";

interface MapEventsProps {
  onBoundsChange: (bounds: MapBounds | null) => void;
  onZoomChange: (zoom: number) => void;
}

export function MapEvents({ onBoundsChange, onZoomChange }: MapEventsProps) {
  const map = useMapEvents({
    moveend: () => {
      updateBounds();
      onZoomChange(map.getZoom());
    },
    zoomend: () => {
      updateBounds();
      onZoomChange(map.getZoom());
    },
  });

  const updateBounds = () => {
    if (map.getZoom() < 11) {
      onBoundsChange(null);
      return;
    }
    const b = map.getBounds().pad(0.5);
    onBoundsChange({
      _southWest: { lat: b.getSouthWest().lat, lng: b.getSouthWest().lng },
      _northEast: { lat: b.getNorthEast().lat, lng: b.getNorthEast().lng },
    });
  };

  return null;
}