import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Compass,
  Crosshair,
  Info,
  Languages,
  Loader2,
  MapPin,
  Navigation,
  RefreshCw,
  Route,
  Square,
} from 'lucide-react';
import {
  GPS_DESTINATIONS,
  PHOTO_BASE_PATH,
  type GpsDestination,
} from '../data/locations';
import {
  distanceToPolylineMeters,
  fetchPedestrianRoute,
  formatDistance,
  formatDuration,
  haversineDistanceMeters,
  type LatLng,
  type PedestrianRoute,
} from '../services/routing';
import {
  translateDirectionInstruction,
  UI_COPY,
  type Language,
} from '../data/i18n';

interface RealWorldMapProps {
  lang: Language;
  onToggleLang: () => void;
  initialDestinationId?: string | null;
  autoStartNavigation?: boolean;
  onExploreInformation: (heritageId: string) => void;
  onReturnToGame: () => void;
}

type GpsStatus = 'idle' | 'requesting' | 'active' | 'denied' | 'unavailable';

function createMarkerIcon(order: number, isSelected: boolean): L.DivIcon {
  const bg = isSelected ? '#B83A24' : '#2D1D14';
  const border = isSelected ? '#F7D27A' : '#C89232';
  const size = isSelected ? 38 : 32;

  return L.divIcon({
    className: 'custom-heritage-pin',
    html: `<div style="
      width:${size}px;
      height:${size}px;
      border-radius:9999px;
      background:${bg};
      border:2.5px solid ${border};
      color:#FAF3E8;
      display:flex;
      align-items:center;
      justify-content:center;
      font-family:'JetBrains Mono', monospace;
      font-weight:700;
      font-size:13px;
      box-shadow:0 6px 16px rgba(0,0,0,0.45);
      cursor:pointer;
    ">${order}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function createUserLocationIcon(isManual: boolean): L.DivIcon {
  const color = isManual ? '#C89232' : '#2563EB';
  return L.divIcon({
    className: 'custom-user-gps',
    html: `<div style="
      width:18px;
      height:18px;
      border-radius:9999px;
      background:${color};
      border:3px solid #FFFFFF;
      box-shadow:0 0 0 5px rgba(37,99,235,0.28), 0 4px 10px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

export const RealWorldMap: React.FC<RealWorldMapProps> = ({
  lang,
  onToggleLang,
  initialDestinationId,
  autoStartNavigation = false,
  onExploreInformation,
  onReturnToGame,
}) => {
  const copy = UI_COPY[lang];
  const isNe = lang === 'ne';

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);
  const userLayerRef = useRef<L.LayerGroup | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const lastRerouteTimeRef = useRef<number>(0);
  const autoStartTriggeredRef = useRef<boolean>(false);

  const [selectedDestId, setSelectedDestId] = useState<string>(
    initialDestinationId || GPS_DESTINATIONS[0].id
  );
  const [gpsStatus, setGpsStatus] = useState<GpsStatus>('idle');
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [userPos, setUserPos] = useState<LatLng | null>(null);
  const [isManualStart, setIsManualStart] = useState<boolean>(false);
  const [manualPickMode, setManualPickMode] = useState<boolean>(false);

  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [routeLoading, setRouteLoading] = useState<boolean>(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [activeRoute, setActiveRoute] = useState<PedestrianRoute | null>(null);
  const [rerouteNotice, setRerouteNotice] = useState<string | null>(null);
  const [arrived, setArrived] = useState<boolean>(false);

  const selectedDestination: GpsDestination = useMemo(
    () => GPS_DESTINATIONS.find((d) => d.id === selectedDestId) ?? GPS_DESTINATIONS[0],
    [selectedDestId]
  );

  useEffect(() => {
    if (initialDestinationId) {
      setSelectedDestId(initialDestinationId);
      const target = GPS_DESTINATIONS.find((d) => d.id === initialDestinationId);
      if (target && mapInstanceRef.current) {
        mapInstanceRef.current.setView([target.lat, target.lng], 16, { animate: true });
      }
    }
  }, [initialDestinationId]);

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container || mapInstanceRef.current) return;

    const initialTarget = initialDestinationId
      ? GPS_DESTINATIONS.find((d) => d.id === initialDestinationId)
      : null;
    const center: [number, number] = initialTarget
      ? [initialTarget.lat, initialTarget.lng]
      : [27.7263, 85.307];

    const map = L.map(container, {
      center,
      zoom: initialTarget ? 16 : 15,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    routeLayerRef.current = L.layerGroup().addTo(map);
    userLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (!manualPickMode && gpsStatus !== 'denied' && gpsStatus !== 'unavailable') {
        return;
      }
      const picked = { lat: e.latlng.lat, lng: e.latlng.lng };
      setUserPos(picked);
      setIsManualStart(true);
      setManualPickMode(false);
      setGpsAccuracy(null);
      setGpsError(null);
    };

    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [manualPickMode, gpsStatus]);

  useEffect(() => {
    const layer = markersLayerRef.current;
    const map = mapInstanceRef.current;
    if (!layer || !map) return;

    layer.clearLayers();
    GPS_DESTINATIONS.forEach((dest) => {
      const marker = L.marker([dest.lat, dest.lng], {
        icon: createMarkerIcon(dest.routeOrder, dest.id === selectedDestId),
      });
      marker.on('click', () => {
        setSelectedDestId(dest.id);
        setArrived(false);
        map.panTo([dest.lat, dest.lng], { animate: true });
      });
      marker.addTo(layer);
    });
  }, [selectedDestId]);

  useEffect(() => {
    const layer = userLayerRef.current;
    if (!layer) return;
    layer.clearLayers();
    if (!userPos) return;

    if (!isManualStart && gpsAccuracy && gpsAccuracy > 0) {
      L.circle([userPos.lat, userPos.lng], {
        radius: Math.min(gpsAccuracy, 150),
        color: '#2563EB',
        fillColor: '#3B82F6',
        fillOpacity: 0.14,
        weight: 1.5,
      }).addTo(layer);
    }

    L.marker([userPos.lat, userPos.lng], {
      icon: createUserLocationIcon(isManualStart),
    }).addTo(layer);
  }, [userPos, gpsAccuracy, isManualStart]);

  useEffect(() => {
    const layer = routeLayerRef.current;
    const map = mapInstanceRef.current;
    if (!layer || !map) return;
    layer.clearLayers();

    if (!activeRoute || activeRoute.coordinates.length === 0) return;

    const poly = L.polyline(activeRoute.coordinates, {
      color: '#B83A24',
      weight: 5,
      opacity: 0.9,
      lineJoin: 'round',
    }).addTo(layer);

    L.polyline(activeRoute.coordinates, {
      color: '#F7D27A',
      weight: 2,
      dashArray: '6 8',
      opacity: 0.9,
    }).addTo(layer);

    map.fitBounds(poly.getBounds(), { padding: [70, 70], maxZoom: 17 });
  }, [activeRoute]);

  const calculateAndShowRoute = useCallback(
    async (origin: LatLng, dest: GpsDestination, isReroute = false) => {
      setRouteLoading(true);
      setRouteError(null);
      if (isReroute) {
        setRerouteNotice(copy.rerouteMsg);
      }
      try {
        const route = await fetchPedestrianRoute(origin, { lat: dest.lat, lng: dest.lng });
        setActiveRoute(route);
        if (isReroute) {
          window.setTimeout(() => setRerouteNotice(null), 3500);
        }
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Unable to calculate pedestrian walking route right now.';
        setRouteError(msg);
      } finally {
        setRouteLoading(false);
      }
    },
    [copy.rerouteMsg]
  );

  const requestGpsLocation = useCallback((): Promise<LatLng | null> => {
    return new Promise((resolve) => {
      if (!('geolocation' in navigator)) {
        setGpsStatus('unavailable');
        setGpsError(copy.gpsUnavailableMsg);
        resolve(null);
        return;
      }

      setGpsStatus('requesting');
      setGpsError(null);

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setGpsStatus('active');
          setGpsAccuracy(pos.coords.accuracy);
          setUserPos(coords);
          setIsManualStart(false);
          if (pos.coords.accuracy > 100) {
            setGpsError(
              isNe
                ? `जीपीएस शुद्धता कम छ (~${Math.round(pos.coords.accuracy)} मी.)। खुला ठाउँमा जाँदा शुद्धता बढ्छ।`
                : `GPS signal accuracy is low (~${Math.round(pos.coords.accuracy)} m). Moving outdoors improves turn accuracy.`
            );
          }
          resolve(coords);
        },
        (err) => {
          if (err.code === err.PERMISSION_DENIED) {
            setGpsStatus('denied');
            setGpsError(copy.gpsDeniedMsg);
          } else {
            setGpsStatus('unavailable');
            setGpsError(copy.gpsUnavailableMsg);
          }
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 3000 }
      );
    });
  }, [copy.gpsDeniedMsg, copy.gpsUnavailableMsg, isNe]);

  useEffect(() => {
    requestGpsLocation();
  }, [requestGpsLocation]);

  const handleStopNavigation = useCallback(() => {
    if (watchIdRef.current !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsNavigating(false);
    setActiveRoute(null);
    setRerouteNotice(null);
    setArrived(false);
  }, []);

  const handleStartNavigation = useCallback(
    async (dest: GpsDestination = selectedDestination) => {
      setArrived(false);
      let startOrigin = userPos;

      if (!startOrigin) {
        startOrigin = await requestGpsLocation();
      }

      if (!startOrigin) {
        setManualPickMode(true);
        return;
      }

      setIsNavigating(true);
      await calculateAndShowRoute(startOrigin, dest, false);

      if (!isManualStart && 'geolocation' in navigator) {
        if (watchIdRef.current !== null) {
          navigator.geolocation.clearWatch(watchIdRef.current);
        }
        watchIdRef.current = navigator.geolocation.watchPosition(
          (pos) => {
            const livePos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            setUserPos(livePos);
            setGpsAccuracy(pos.coords.accuracy);
            setGpsStatus('active');

            const distToDest = haversineDistanceMeters(livePos, {
              lat: dest.lat,
              lng: dest.lng,
            });
            if (distToDest <= 30) {
              setArrived(true);
            }
          },
          () => {
            setGpsError(
              isNe
                ? 'प्रत्यक्ष जीपीएस ट्र्याकिङ अस्थायी रूपमा अवरुद्ध भयो।'
                : 'Live GPS tracking interrupted. Route remains visible.'
            );
          },
          { enableHighAccuracy: true, timeout: 12000, maximumAge: 2500 }
        );
      }
    },
    [calculateAndShowRoute, isManualStart, isNe, requestGpsLocation, selectedDestination, userPos]
  );

  // Auto-start pedestrian navigation when opened directly from a specific site (e.g. Mhepi Ajima)
  useEffect(() => {
    if (!autoStartNavigation || autoStartTriggeredRef.current || !userPos) return;
    autoStartTriggeredRef.current = true;
    handleStartNavigation(selectedDestination);
  }, [autoStartNavigation, handleStartNavigation, selectedDestination, userPos]);

  useEffect(() => {
    if (!isNavigating || isManualStart || !userPos || !activeRoute) return;

    const distOffRoute = distanceToPolylineMeters(userPos, activeRoute.coordinates);
    const now = Date.now();
    if (distOffRoute > 45 && now - lastRerouteTimeRef.current > 10000) {
      lastRerouteTimeRef.current = now;
      calculateAndShowRoute(userPos, selectedDestination, true);
    }
  }, [activeRoute, calculateAndShowRoute, isManualStart, isNavigating, selectedDestination, userPos]);

  const remainingDistanceMeters = useMemo(() => {
    if (activeRoute) return activeRoute.distanceMeters;
    if (userPos) {
      return haversineDistanceMeters(userPos, {
        lat: selectedDestination.lat,
        lng: selectedDestination.lng,
      });
    }
    return null;
  }, [activeRoute, selectedDestination, userPos]);

  const destName = isNe ? selectedDestination.nameNe : selectedDestination.name;
  const destAddress = isNe ? selectedDestination.addressNe : selectedDestination.address;
  const destDesc = isNe
    ? selectedDestination.shortDescriptionNe
    : selectedDestination.shortDescription;

  return (
    <div className="relative h-full w-full flex flex-col bg-[#120D0A] text-[#F4EDE2]">
      {/* Top Route Strip & Bilingual Switcher */}
      <div className="z-20 px-4 py-3 bg-[#1A120E] border-b border-[#5A402D] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={onReturnToGame}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2A1E17] hover:bg-[#3A291F] border border-[#6E4F37] text-xs font-semibold text-[#F7EFE2] transition-colors whitespace-nowrap"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#E5B869]" />
            <span>{copy.backToGame}</span>
          </button>

          <button
            type="button"
            onClick={onToggleLang}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#251A13] hover:bg-[#35261C] border border-[#C89232]/60 text-xs font-semibold text-[#F7EFE2] transition-colors whitespace-nowrap"
          >
            <Languages className="w-3.5 h-3.5 text-[#D99B38]" />
            <span>{lang === 'en' ? 'NE' : 'EN'}</span>
          </button>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#D5C3AD]">
            <Compass className="w-4 h-4 text-[#D99B38]" />
            <span className="font-semibold text-[#F7EFE2]">{copy.proposedRoute}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {GPS_DESTINATIONS.map((dest, idx) => {
            const active = dest.id === selectedDestId;
            return (
              <React.Fragment key={dest.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDestId(dest.id);
                    setArrived(false);
                    mapInstanceRef.current?.panTo([dest.lat, dest.lng], { animate: true });
                    if (isNavigating && userPos) {
                      calculateAndShowRoute(userPos, dest, false);
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-[#B83A24] text-[#FAF3E8]'
                      : 'bg-[#251A13] hover:bg-[#35261C] text-[#D8C7B2] border border-[#4E3727]'
                  }`}
                >
                  <span className="font-mono-tabular mr-1">{dest.routeOrder}.</span>
                  {isNe ? dest.shortNameNe : dest.shortName}
                </button>
                {idx < GPS_DESTINATIONS.length - 1 && (
                  <span aria-hidden="true" className="text-[#8C6D4F] text-xs">→</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Map Area */}
      <div className="relative flex-1 min-h-0">
        <div ref={mapContainerRef} className="h-full w-full z-0" />

        <div className="pointer-events-none absolute top-3 left-3 right-3 z-10 flex flex-col sm:flex-row items-start justify-between gap-2.5">
          <div className="pointer-events-auto flex flex-col gap-2 max-w-md">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={requestGpsLocation}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1A120E]/92 hover:bg-[#2A1E17] border border-[#6E4F37] text-xs font-semibold text-[#F4EDE2] shadow-lg whitespace-nowrap"
              >
                <Crosshair className="w-3.5 h-3.5 text-[#60A5FA]" />
                <span>
                  {gpsStatus === 'requesting'
                    ? copy.locatingGps
                    : gpsStatus === 'active'
                      ? copy.refreshGps
                      : copy.useMyGps}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setManualPickMode((p) => !p)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold shadow-lg transition-colors whitespace-nowrap ${
                  manualPickMode
                    ? 'bg-[#C89232] text-[#1A120E] border-[#F7E6C4]'
                    : 'bg-[#1A120E]/92 hover:bg-[#2A1E17] text-[#F4EDE2] border-[#6E4F37]'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{manualPickMode ? copy.clickMapToPlaceStart : copy.setStartOnMap}</span>
              </button>
            </div>

            {gpsError && (
              <div className="px-3.5 py-2.5 rounded-xl bg-[#2A1B14]/95 border border-[#C89232] text-xs text-[#F5E6CC] shadow-xl flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-[#E5B869] shrink-0 mt-0.5" />
                <div className="space-y-1.5">
                  <p>{gpsError}</p>
                  {!userPos && (
                    <button
                      type="button"
                      onClick={() => {
                        setUserPos({ lat: 27.7176, lng: 85.3112 });
                        setIsManualStart(true);
                        setManualPickMode(false);
                        setGpsError(null);
                      }}
                      className="text-[11px] font-semibold text-[#F7D27A] underline"
                    >
                      {copy.useSorakhutteStart}
                    </button>
                  )}
                </div>
              </div>
            )}

            {rerouteNotice && (
              <div className="px-3.5 py-2 rounded-xl bg-[#8D2C1D] text-[#FAF3E8] text-xs font-semibold shadow-lg flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>{rerouteNotice}</span>
              </div>
            )}

            {arrived && (
              <div className="px-3.5 py-2.5 rounded-xl bg-[#1F4B32] border border-[#7CE39B] text-[#F4FBF6] text-xs font-semibold shadow-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#7CE39B]" />
                <span>{copy.arrivedMsg(destName)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom-Left Selected Destination Preview & Turn-by-Turn Pedestrian Panel */}
        <div className="pointer-events-none absolute bottom-4 left-3 right-3 sm:right-auto z-10 w-auto sm:w-[410px] max-h-[60vh] flex flex-col gap-2">
          <div className="pointer-events-auto rounded-2xl bg-[#F5ECDD] text-[#221710] border-2 border-[#A68459] shadow-2xl overflow-hidden flex flex-col max-h-[58vh]">
            <div className="flex items-stretch border-b border-[#D8C6AB]">
              <img
                src={`${PHOTO_BASE_PATH}/${selectedDestination.photoFile}`}
                alt={destName}
                referrerPolicy="no-referrer"
                className="w-28 h-24 object-cover shrink-0 bg-[#271B14]"
              />
              <div className="p-3 flex-1 min-w-0">
                <div className="text-[11px] font-semibold text-[#8D2C1D]">
                  {copy.gpsStopLabel(selectedDestination.routeOrder)}
                </div>
                <h2 className="font-display text-base font-bold text-[#1E130D] leading-tight truncate">
                  {destName}
                </h2>
                <p className="text-[11px] text-[#6B5038] truncate mt-0.5">
                  {destAddress}
                </p>
                <p className="text-xs text-[#38271B] line-clamp-2 mt-1">
                  {destDesc}
                </p>
              </div>
            </div>

            <div className="px-3.5 py-2.5 bg-[#EFE4D1] flex items-center gap-2">
              <button
                type="button"
                onClick={() => onExploreInformation(selectedDestination.heritageIds[0])}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-[#8D6F4E] text-[#2B1D14] hover:bg-[#E5D6BC] text-xs font-semibold transition-colors whitespace-nowrap"
              >
                <Info className="w-3.5 h-3.5 text-[#8D2C1D]" />
                <span>{copy.exploreInfo}</span>
              </button>

              {!isNavigating ? (
                <button
                  type="button"
                  onClick={() => handleStartNavigation(selectedDestination)}
                  disabled={routeLoading}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#8D2C1D] hover:bg-[#752316] disabled:opacity-60 text-[#FAF3E8] text-xs font-semibold transition-colors whitespace-nowrap"
                >
                  {routeLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Navigation className="w-3.5 h-3.5" />
                  )}
                  <span>{routeLoading ? copy.calculatingRoute : copy.startNavigation}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStopNavigation}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#271B14] hover:bg-[#3A291F] text-[#FAF3E8] text-xs font-semibold transition-colors whitespace-nowrap"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>{copy.stopNavigation}</span>
                </button>
              )}
            </div>

            {routeError && (
              <div className="px-3.5 py-2.5 bg-[#FDECEA] border-t border-[#E5A9A2] text-xs text-[#7D1D14] flex items-center justify-between gap-2">
                <span>{routeError}</span>
                {userPos && (
                  <button
                    type="button"
                    onClick={() => calculateAndShowRoute(userPos, selectedDestination, false)}
                    className="font-semibold underline shrink-0"
                  >
                    {isNe ? 'पुनः प्रयास' : 'Retry'}
                  </button>
                )}
              </div>
            )}

            {activeRoute && (
              <div className="p-3.5 border-t border-[#D8C6AB] overflow-y-auto space-y-2.5 bg-[#FAF4EA]">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 font-semibold text-[#1E130D]">
                    <Route className="w-4 h-4 text-[#8D2C1D]" />
                    <span className="font-mono-tabular">
                      {remainingDistanceMeters !== null
                        ? formatDistance(remainingDistanceMeters)
                        : '—'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-tabular text-[#274B37]">
                      {formatDuration(activeRoute.durationSeconds)}
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-[#6B5038]">
                    via {activeRoute.provider}
                  </span>
                </div>

                <ol className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {activeRoute.steps.map((step, sIdx) => (
                    <li
                      key={sIdx}
                      className="flex items-start justify-between gap-2 text-xs py-1 border-b border-[#EAE0CE] last:border-b-0"
                    >
                      <span className="text-[#2B1D14]">
                        <span className="font-mono-tabular font-semibold text-[#8D2C1D] mr-1.5">
                          {sIdx + 1}.
                        </span>
                        {translateDirectionInstruction(step.instruction, lang)}
                      </span>
                      {step.distanceMeters > 0 && (
                        <span className="font-mono-tabular text-[11px] text-[#6B5038] shrink-0">
                          {formatDistance(step.distanceMeters)}
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
