export interface WalkableZone {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  kind: 'courtyard' | 'alley' | 'stairs';
}

export interface HeritageLocation {
  id: string;
  order: number;
  name: string;
  nameNe: string;
  shortName: string;
  shortNameNe: string;
  newariName: string;
  subtitle: string;
  subtitleNe: string;
  district: string;
  districtNe: string;
  imageFile: string;
  photoFile: string;
  description: string;
  descriptionNe: string;
  researchNote: string;
  researchNoteNe: string;
  guidedHint: string;
  guidedHintNe: string;
  gpsDestinationId: string;
  companionId?: string;
  parentAreaId?: string;
  worldPos: {
    x: number;
    y: number;
  };
  checkpointRadius: number;
  mapCoords: {
    x: number;
    y: number;
  };
  neighbors: string[];
}

export interface GpsDestination {
  id: string;
  routeOrder: number;
  name: string;
  nameNe: string;
  shortName: string;
  shortNameNe: string;
  address: string;
  addressNe: string;
  lat: number;
  lng: number;
  photoFile: string;
  shortDescription: string;
  shortDescriptionNe: string;
  heritageIds: string[];
}

export const IMAGE_BASE_PATH: string;
export const PHOTO_BASE_PATH: string;
export const WORLD_WIDTH: number;
export const WORLD_HEIGHT: number;
export const WALKABLE_ZONES: WalkableZone[];
export const LOCATIONS: HeritageLocation[];
export const GPS_DESTINATIONS: GpsDestination[];
export const STARTING_LOCATION_ID: string;
export const EXIT_SIDDHI_POS: { x: number; y: number };
