export interface Locker {
  id: number; 
  name: string;
  status: string;
  physical_type?: string;
  longitude: number;
  latitude: number;
}

export interface MapBounds {
  _southWest: { lat: number; lng: number };
  _northEast: { lat: number; lng: number };
}