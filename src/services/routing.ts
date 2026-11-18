export interface LatLng {
  lat: number;
  lng: number;
}

export interface RouteStep {
  instruction: string;
  distanceMeters: number;
  durationSeconds: number;
  latLng: LatLng;
}

export interface PedestrianRoute {
  provider: 'GraphHopper' | 'OpenStreetMap OSRM';
  coordinates: [number, number][]; // [lat, lng] for Leaflet Polyline
  distanceMeters: number;
  durationSeconds: number;
  steps: RouteStep[];
}

const EARTH_RADIUS_M = 6371000;

export function haversineDistanceMeters(a: LatLng, b: LatLng): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Computes shortest distance (meters) from a GPS point to a polyline of [lat, lng] vertices.
 */
export function distanceToPolylineMeters(point: LatLng, poly: [number, number][]): number {
  if (poly.length === 0) return Infinity;
  if (poly.length === 1) return haversineDistanceMeters(point, { lat: poly[0][0], lng: poly[0][1] });

  const cosLat = Math.cos((point.lat * Math.PI) / 180);
  const toXY = (lat: number, lng: number) => ({
    x: lng * 111320 * cosLat,
    y: lat * 110540,
  });

  const p = toXY(point.lat, point.lng);
  let minDist = Infinity;

  for (let i = 0; i < poly.length - 1; i++) {
    const a = toXY(poly[i][0], poly[i][1]);
    const b = toXY(poly[i + 1][0], poly[i + 1][1]);
    const abx = b.x - a.x;
    const aby = b.y - a.y;
    const lenSq = abx * abx + aby * aby;
    let t = lenSq === 0 ? 0 : ((p.x - a.x) * abx + (p.y - a.y) * aby) / lenSq;
    t = Math.max(0, Math.min(1, t));
    const projX = a.x + t * abx;
    const projY = a.y + t * aby;
    const d = Math.hypot(p.x - projX, p.y - projY);
    if (d < minDist) minDist = d;
  }
  return minDist;
}

function formatOsrmStep(step: {
  name?: string;
  maneuver?: { type?: string; modifier?: string; location?: [number, number] };
  distance?: number;
  duration?: number;
}): RouteStep {
  const mType = step.maneuver?.type ?? 'continue';
  const mod = step.maneuver?.modifier ? ` ${step.maneuver.modifier}` : '';
  const road = step.name && step.name.trim() ? ` onto ${step.name}` : '';

  let instruction = 'Continue walking';
  if (mType === 'depart') {
    instruction = `Start walking${mod}${road}`;
  } else if (mType === 'arrive') {
    instruction = 'Arrive at your Ward 16 heritage destination';
  } else if (mType === 'turn') {
    instruction = `Turn${mod}${road}`;
  } else if (mType === 'fork' || mType === 'merge') {
    instruction = `Keep${mod}${road}`;
  } else {
    instruction = `Continue${mod}${road}`;
  }

  const loc = step.maneuver?.location ?? [85.308, 27.725];
  return {
    instruction: instruction.charAt(0).toUpperCase() + instruction.slice(1),
    distanceMeters: Math.round(step.distance ?? 0),
    durationSeconds: Math.round(step.duration ?? 0),
    latLng: { lat: loc[1], lng: loc[0] },
  };
}

/**
 * Fetches a genuine street/footpath pedestrian walking route.
 * Uses GraphHopper when VITE_GRAPHHOPPER_API_KEY is configured, otherwise OpenStreetMap OSRM foot routing.
 */
export async function fetchPedestrianRoute(
  origin: LatLng,
  destination: LatLng
): Promise<PedestrianRoute> {
  const ghKey = import.meta.env.VITE_GRAPHHOPPER_API_KEY as string | undefined;

  if (ghKey && ghKey.trim().length > 0) {
    const ghUrl =
      `https://graphhopper.com/api/1/route?point=${origin.lat},${origin.lng}` +
      `&point=${destination.lat},${destination.lng}` +
      `&profile=foot&locale=en&instructions=true&points_encoded=false&key=${encodeURIComponent(ghKey.trim())}`;

    const res = await fetch(ghUrl);
    if (!res.ok) {
      throw new Error(`GraphHopper routing failed (${res.status}). Check your API key or network.`);
    }
    const data = await res.json();
    const path = data?.paths?.[0];
    if (!path?.points?.coordinates) {
      throw new Error('GraphHopper returned no walkable route between these points.');
    }

    const coordinates: [number, number][] = path.points.coordinates.map(
      ([lng, lat]: [number, number]) => [lat, lng]
    );
    const steps: RouteStep[] = (path.instructions ?? []).map(
      (ins: { text?: string; distance?: number; time?: number; interval?: [number, number] }) => {
        const idx = ins.interval?.[0] ?? 0;
        const pt = coordinates[idx] ?? [origin.lat, origin.lng];
        return {
          instruction: ins.text || 'Continue walking',
          distanceMeters: Math.round(ins.distance ?? 0),
          durationSeconds: Math.round((ins.time ?? 0) / 1000),
          latLng: { lat: pt[0], lng: pt[1] },
        };
      }
    );

    return {
      provider: 'GraphHopper',
      coordinates,
      distanceMeters: Math.round(path.distance ?? 0),
      durationSeconds: Math.round((path.time ?? 0) / 1000),
      steps,
    };
  }

  // Genuine OpenStreetMap OSRM pedestrian routing (no API key required)
  const osrmUrl =
    `https://router.project-osrm.org/route/v1/foot/` +
    `${origin.lng},${origin.lat};${destination.lng},${destination.lat}` +
    `?overview=full&geometries=geojson&steps=true`;

  const res = await fetch(osrmUrl);
  if (!res.ok) {
    throw new Error(`Pedestrian routing server unavailable (HTTP ${res.status}).`);
  }
  const data = await res.json();
  if (data.code !== 'Ok' || !data.routes?.[0]) {
    throw new Error(data.message || 'No pedestrian path found between your location and destination.');
  }

  const route = data.routes[0];
  const coordinates: [number, number][] = route.geometry.coordinates.map(
    ([lng, lat]: [number, number]) => [lat, lng]
  );
  const rawSteps = route.legs?.[0]?.steps ?? [];
  const steps: RouteStep[] = rawSteps.map(formatOsrmStep);

  return {
    provider: 'OpenStreetMap OSRM',
    coordinates,
    distanceMeters: Math.round(route.distance ?? 0),
    durationSeconds: Math.round(route.duration ?? 0),
    steps,
  };
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(2)} km`;
}

export function formatDuration(seconds: number): string {
  const mins = Math.max(1, Math.round(seconds / 60));
  if (mins < 60) return `${mins} min walk`;
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  return `${hrs}h ${rem}m walk`;
}
