export interface Locker {
  id: number;
  name: string;
  status: string;
  physical_type?: string;
  longitude: number;
  latitude: number;
}

export interface LockerDetails extends Locker {
  city?: string;
  address?: string;
  description?: string;
  image_url?: string;
  is_24_7: boolean;
  easy_access_zone: boolean;
  payment_available: boolean;
  functions: string[];
}

export interface MapBounds {
  _southWest: { lat: number; lng: number };
  _northEast: { lat: number; lng: number };
}