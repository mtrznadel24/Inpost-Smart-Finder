import { useMapEvents } from "react-leaflet";
import type { MapBounds } from "@/features/lockers/types";

interface MapEventsProps {
  onBoundsChange: (bounds: MapBounds | null) => void;
}

export function MapEvents({ onBoundsChange }: MapEventsProps) {
  const map = useMapEvents({
    moveend: () => updateBounds(),
    zoomend: () => updateBounds(),
  });

  const updateBounds = () => {
    if (map.getZoom() < 11) {
      onBoundsChange(null);
      return;
    }
    const b = map.getBounds();
    onBoundsChange({
      _southWest: { lat: b.getSouthWest().lat, lng: b.getSouthWest().lng },
      _northEast: { lat: b.getNorthEast().lat, lng: b.getNorthEast().lng },
    });
  };

  return null;
}