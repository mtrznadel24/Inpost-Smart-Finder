import { useState } from "react";
import axios from "axios";

export interface GeocodingResult {
  lat: number;
  lng: number;
  displayName: string;
  zoom: number;
}

export function useGeocoding() {
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchAddress = async (query: string): Promise<GeocodingResult | null> => {
    if (!query) return null;

    setIsSearching(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: {
            q: query,
            format: "json",
            limit: 1,
            addressdetails: 1,
            countrycodes: "pl,gb,fr,it,es,pt,be,nl,lu,de",
          },
        }
      );

      if (response.data && response.data.length > 0) {
        const result = response.data[0];
        const type = result.addresstype || result.type;

        let calculatedZoom = 14;
        if (['country', 'state'].includes(type)) calculatedZoom = 6;
        else if (['city', 'municipality', 'administrative'].includes(type)) calculatedZoom = 12;
        else if (['town', 'village', 'suburb', 'borough'].includes(type)) calculatedZoom = 14;
        else if (['road', 'street', 'path', 'square'].includes(type)) calculatedZoom = 16;
        else if (['building', 'amenity', 'shop', 'house', 'commercial'].includes(type)) calculatedZoom = 18;

        return {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
          displayName: result.display_name,
          zoom: calculatedZoom,
        };
      }

      setError("sidebar.placeNotFound");
      return null;
    } catch (err) {
      setError("sidebar.searchError");
      return null;
    } finally {
      setIsSearching(false);
    }
  };

  return { searchAddress, isSearching, error };
}