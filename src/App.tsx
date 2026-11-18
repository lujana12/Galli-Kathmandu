/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  Compass,
  HelpCircle,
  Landmark,
  Languages,
  Map as MapIcon,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { UI_COPY, type Language } from './data/i18n';
import {
  LOCATIONS,
  WORLD_HEIGHT,
  WORLD_WIDTH,
  type HeritageLocation,
} from './data/locations';
import { KathmanduWorld } from './components/KathmanduWorld';
import { VirtualJoystick } from './components/VirtualJoystick';
import { HeritageCard } from './components/HeritageCard';
import { MiniMap } from './components/MiniMap';
import { TitleScreen, type ExplorationMode } from './components/TitleScreen';
import {
  HelpModal,
  PauseJournalModal,
  VictoryModal,
} from './components/GameModals';
import { RealWorldMap } from './components/RealWorldMap';
import {
  OUTFIT_THEMES,
  type CharacterPersona,
  type OutfitColorTheme,
} from './components/CharacterSprite';
import {
  computeWalkPath,
  getZoneAtPoint,
  moveWithCollision,
  type Point2D,
} from './utils/navigation';
import { soundEngine } from './utils/sound';

type AppViewState = 'TITLE_MENU' | 'PLAYING' | 'PAUSED' | 'VICTORY' | 'REAL_WORLD_MAP';

const WALK_SPEED = 245;
const INITIAL_SPAWN: Point2D = { x: 235, y: 985 };

const ZONE_LABELS: Record<Language, Record<string, string>> = {
  en: {
    'zone-siddhi': 'Siddhi Ganesh Courtyard',
    'stairs-koncha-lower': 'Steps Toward Koncha Dyo',
    'alley-koncha-landing': 'Upper Brick Landing',
    'stairs-koncha-upper': 'Stairs to Koncha Dyo',
    'zone-koncha': 'Koncha Dyo Courtyard',
    'alley-siddhi-mhepi': 'Main Ward 16 Brick Galli',
    'zone-mhepi': 'Mhepi Ajima Hilltop',
    'stairs-nanak-lower': 'Ridge Steps from Mhepi',
    'alley-nanak-ridge': 'Nanak Math Ridge Walk',
    'stairs-nanak-upper': 'Stairs to Nanak Math',
    'zone-nanak-math': 'Nanak Math Courtyard',
    'alley-mhepi-balaju': 'Stone Path to Balaju',
    'zone-balaju': 'Balaju 22 Dhara Complex',
    'alley-balaju-sitala': 'Baisdhara Grove Path',
    'zone-sitala': 'Pyatho Ajima – Sitalamai',
  },
  ne: {
    'zone-siddhi': 'सिद्धि गणेश परिसर',
    'stairs-koncha-lower': 'कोन्चा द्यो जाने सिँढी',
    'alley-koncha-landing': 'माथिल्लो इँटाको चौतारा',
    'stairs-koncha-upper': 'कोन्चा द्यो को सिँढी',
    'zone-koncha': 'कोन्चा द्यो परिसर',
    'alley-siddhi-mhepi': 'मुख्य वडा १६ इँटाको गल्ली',
    'zone-mhepi': 'म्हेपी अजिमा डाँडा',
    'stairs-nanak-lower': 'म्हेपीबाट उक्लने सिँढी',
    'alley-nanak-ridge': 'नानक मठ डाँडाको बाटो',
    'stairs-nanak-upper': 'नानक मठ जाने सिँढी',
    'zone-nanak-math': 'नानक मठ परिसर',
    'alley-mhepi-balaju': 'बालाजु जाने ढुङ्गे बाटो',
    'zone-balaju': 'बालाजु २२ धारा परिसर',
    'alley-balaju-sitala': 'बाइसधारा वन मार्ग',
    'zone-sitala': 'प्याथो अजिमा – शीतलामाई',
  },
};

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [viewState, setViewState] = useState<AppViewState>('TITLE_MENU');
  const [characterName, setCharacterName] = useState<string>('');
  const [persona, setPersona] = useState<CharacterPersona>('aarav');
  const [outfitTheme, setOutfitTheme] = useState<OutfitColorTheme>(OUTFIT_THEMES[0]);
  const [explorationMode, setExplorationMode] = useState<ExplorationMode>('guided');

  const [discoveredIds, setDiscoveredIds] = useState<string[]>([]);
  const [newlyDiscoveredId, setNewlyDiscoveredId] = useState<string | null>(null);
  const [activeZoneLocationId, setActiveZoneLocationId] = useState<string | null>(null);
  const [lastVisitedLocationId, setLastVisitedLocationId] = useState<string | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [hoveredLandmarkId, setHoveredLandmarkId] = useState<string | null>(null);
  const [walkTarget, setWalkTarget] = useState<Point2D | null>(null);
  const [playerUiPos, setPlayerUiPos] = useState<Point2D>(INITIAL_SPAWN);
  const [currentZoneId, setCurrentZoneId] = useState<string>('zone-siddhi');

  const [selectedGpsDestId, setSelectedGpsDestId] = useState<string | null>(null);
  const [autoStartMapNav, setAutoStartMapNav] = useState<boolean>(false);
  const [helpOpen, setHelpOpen] = useState<boolean>(false);
  const [mapCollapsed, setMapCollapsed] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(false);
  const [hasShownVictory, setHasShownVictory] = useState<boolean>(false);
  const [discoveryToastId, setDiscoveryToastId] = useState<string | null>(null);

  // Refs for 60fps simulation without React re-render overhead
  const worldLayerRef = useRef<HTMLDivElement | null>(null);
  const characterLayerRef = useRef<HTMLDivElement | null>(null);
  const characterBodyRef = useRef<HTMLDivElement | null>(null);

  const playerPosRef = useRef<Point2D>({ ...INITIAL_SPAWN });
  const cameraPosRef = useRef<Point2D>({ x: 0, y: 400 });
  const heldKeysRef = useRef<Set<string>>(new Set());
  const joystickVecRef = useRef<{ vx: number; vy: number }>({ vx: 0, vy: 0 });
  const walkQueueRef = useRef<Point2D[]>([]);
  const walkPhaseRef = useRef<number>(0);

  const activeZoneRef = useRef<string | null>(null);
  const suppressedProximityIdRef = useRef<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const victoryTimerRef = useRef<number | null>(null);
  const lastUiSyncRef = useRef<number>(0);

  const locationMap = useMemo(() => {
    const map = new Map<string, HeritageLocation>();
    LOCATIONS.forEach((loc) => map.set(loc.id, loc));
    return map;
  }, []);

  const guidedNextLocation = useMemo(() => {
    if (explorationMode !== 'guided') return null;
    return LOCATIONS.find((loc) => !discoveredIds.includes(loc.id)) ?? null;
  }, [discoveredIds, explorationMode]);

  const copy = UI_COPY[lang];
  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'en' ? 'ne' : 'en'));
  }, []);

  const triggerToast = useCallback((siteId: string) => {
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
    setDiscoveryToastId(siteId);
    toastTimerRef.current = window.setTimeout(() => {
      setDiscoveryToastId(null);
    }, 3200);
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      soundEngine.muted = next;
      return next;
    });
  }, []);

  const startAutoWalkTo = useCallback((worldX: number, worldY: number) => {
    const path = computeWalkPath(
      playerPosRef.current.x,
      playerPosRef.current.y,
      worldX,
      worldY
    );
    walkQueueRef.current = path;
    setWalkTarget(path[path.length - 1] ?? null);
  }, []);

  const handleWalkToSite = useCallback(
    (loc: HeritageLocation) => {
      setViewState('PLAYING');
      suppressedProximityIdRef.current = null;
      startAutoWalkTo(loc.worldPos.x, loc.worldPos.y);
    },
    [startAutoWalkTo]
  );

  const handleLandmarkClick = useCallback(
    (loc: HeritageLocation) => {
      suppressedProximityIdRef.current = null;
      setNewlyDiscoveredId(null);
      setSelectedCardId(loc.id);
      setLastVisitedLocationId(loc.id);
      soundEngine.playInspectSound();

      const dist = Math.hypot(
        playerPosRef.current.x - loc.worldPos.x,
        playerPosRef.current.y - loc.worldPos.y
      );
      if (dist > loc.checkpointRadius * 0.85) {
        startAutoWalkTo(loc.worldPos.x, loc.worldPos.y);
      }
    },
    [startAutoWalkTo]
  );

  const handleWorldClick = useCallback(
    (worldX: number, worldY: number) => {
      if (viewState !== 'PLAYING') return;
      startAutoWalkTo(worldX, worldY);
    },
    [viewState, startAutoWalkTo]
  );

  const handleJoystickVector = useCallback((vx: number, vy: number) => {
    joystickVecRef.current = { vx, vy };
    if (Math.abs(vx) > 0.05 || Math.abs(vy) > 0.05) {
      walkQueueRef.current = [];
      setWalkTarget(null);
    }
  }, []);

  const handleStartAdventure = useCallback(() => {
    soundEngine.playTempleBell();
    setViewState('PLAYING');
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    cameraPosRef.current = {
      x: Math.max(0, Math.min(WORLD_WIDTH - vw, playerPosRef.current.x - vw / 2)),
      y: Math.max(0, Math.min(WORLD_HEIGHT - vh, playerPosRef.current.y - vh / 2)),
    };
  }, []);

  const handleRestart = useCallback(() => {
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
    if (victoryTimerRef.current !== null) window.clearTimeout(victoryTimerRef.current);

    playerPosRef.current = { ...INITIAL_SPAWN };
    walkQueueRef.current = [];
    heldKeysRef.current.clear();
    joystickVecRef.current = { vx: 0, vy: 0 };
    activeZoneRef.current = null;
    suppressedProximityIdRef.current = null;

    setPlayerUiPos({ ...INITIAL_SPAWN });
    setWalkTarget(null);
    setDiscoveredIds([]);
    setNewlyDiscoveredId(null);
    setActiveZoneLocationId(null);
    setLastVisitedLocationId(null);
    setSelectedCardId(null);
    setHoveredLandmarkId(null);
    setHasShownVictory(false);
    setDiscoveryToastId(null);
    setCurrentZoneId('zone-siddhi');
    setViewState('PLAYING');
    soundEngine.playTempleBell();
  }, []);

  const handleNavigateRealWorld = useCallback(
    (gpsDestId: string, autoStart = true) => {
      setSelectedGpsDestId(gpsDestId);
      setAutoStartMapNav(autoStart);
      setViewState('REAL_WORLD_MAP');
    },
    []
  );

  const handleExploreFromMap = useCallback(
    (heritageId: string) => {
      const loc = locationMap.get(heritageId);
      setViewState('PLAYING');
      if (loc) {
        setSelectedCardId(loc.id);
        setLastVisitedLocationId(loc.id);
        setNewlyDiscoveredId(null);
      }
    },
    [locationMap]
  );

  // Keyboard bindings & window blur cleanup
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (viewState === 'TITLE_MENU') return;

      const key = e.key.toLowerCase();
      if (key === 'm') {
        e.preventDefault();
        toggleMute();
        return;
      }

      if (key === 'j' && viewState !== 'REAL_WORLD_MAP') {
        e.preventDefault();
        setViewState((prev) =>
          prev === 'PLAYING' ? 'PAUSED' : prev === 'PAUSED' ? 'PLAYING' : prev
        );
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        if (helpOpen) {
          setHelpOpen(false);
        } else if (selectedCardId) {
          suppressedProximityIdRef.current = activeZoneRef.current;
          setSelectedCardId(null);
          setNewlyDiscoveredId(null);
        } else if (viewState === 'PLAYING') {
          setViewState('PAUSED');
        } else if (viewState === 'PAUSED') {
          setViewState('PLAYING');
        }
        return;
      }

      if (viewState !== 'PLAYING' || helpOpen) return;

      if (
        ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(
          key
        )
      ) {
        e.preventDefault();
        heldKeysRef.current.add(key);
        walkQueueRef.current = [];
        setWalkTarget(null);
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      heldKeysRef.current.delete(e.key.toLowerCase());
    };

    const onBlur = () => {
      heldKeysRef.current.clear();
      joystickVecRef.current = { vx: 0, vy: 0 };
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, [helpOpen, selectedCardId, toggleMute, viewState]);

  // 60fps Top-Down RPG Movement & Smooth Camera Follow Loop
  useEffect(() => {
    if (viewState !== 'PLAYING') return;

    let rafId = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const rawDt = (now - lastTime) / 1000;
      lastTime = now;
      const dt = Math.min(rawDt, 0.05);

      const keys = heldKeysRef.current;
      let vx = 0;
      let vy = 0;

      if (keys.has('arrowleft') || keys.has('a')) vx -= 1;
      if (keys.has('arrowright') || keys.has('d')) vx += 1;
      if (keys.has('arrowup') || keys.has('w')) vy -= 1;
      if (keys.has('arrowdown') || keys.has('s')) vy += 1;

      if (vx === 0 && vy === 0) {
        vx = joystickVecRef.current.vx;
        vy = joystickVecRef.current.vy;
      }

      const inputMag = Math.hypot(vx, vy);
      if (inputMag > 1) {
        vx /= inputMag;
        vy /= inputMag;
      }

      if (inputMag < 0.05 && walkQueueRef.current.length > 0) {
        const nextWp = walkQueueRef.current[0];
        const dx = nextWp.x - playerPosRef.current.x;
        const dy = nextWp.y - playerPosRef.current.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 10) {
          walkQueueRef.current.shift();
          if (walkQueueRef.current.length === 0) {
            setWalkTarget(null);
          }
        } else {
          vx = dx / dist;
          vy = dy / dist;
        }
      }

      const isMoving = Math.hypot(vx, vy) > 0.05;
      if (isMoving) {
        const stepX = vx * WALK_SPEED * dt;
        const stepY = vy * WALK_SPEED * dt;
        const moved = moveWithCollision(
          playerPosRef.current.x,
          playerPosRef.current.y,
          stepX,
          stepY
        );

        const actualMoved = Math.hypot(
          moved.x - playerPosRef.current.x,
          moved.y - playerPosRef.current.y
        );

        playerPosRef.current = moved;
        walkPhaseRef.current += dt * 13;

        if (actualMoved > 0.4) {
          const z = getZoneAtPoint(moved.x, moved.y);
          soundEngine.playFootstepTick(z?.kind === 'stairs');
        }
      } else {
        walkPhaseRef.current = 0;
      }

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const maxCamX = Math.max(0, WORLD_WIDTH - vw);
      const maxCamY = Math.max(0, WORLD_HEIGHT - vh);

      const targetCamX =
        WORLD_WIDTH <= vw
          ? -(vw - WORLD_WIDTH) / 2
          : Math.max(0, Math.min(maxCamX, playerPosRef.current.x - vw / 2));
      const targetCamY =
        WORLD_HEIGHT <= vh
          ? -(vh - WORLD_HEIGHT) / 2
          : Math.max(0, Math.min(maxCamY, playerPosRef.current.y - vh / 2));

      const lerp = 1 - Math.exp(-8.5 * dt);
      cameraPosRef.current.x += (targetCamX - cameraPosRef.current.x) * lerp;
      cameraPosRef.current.y += (targetCamY - cameraPosRef.current.y) * lerp;

      if (worldLayerRef.current) {
        worldLayerRef.current.style.transform = `translate3d(${-cameraPosRef.current.x.toFixed(1)}px, ${-cameraPosRef.current.y.toFixed(1)}px, 0)`;
      }
      if (characterLayerRef.current) {
        characterLayerRef.current.style.transform = `translate3d(${playerPosRef.current.x.toFixed(1)}px, ${playerPosRef.current.y.toFixed(1)}px, 0)`;
      }
      if (characterBodyRef.current) {
        const bobY = isMoving ? Math.abs(Math.sin(walkPhaseRef.current)) * -4.5 : 0;
        const tilt = isMoving ? Math.sin(walkPhaseRef.current) * 5 : 0;
        const flipX = vx < -0.15 ? -1 : 1;
        characterBodyRef.current.style.transform = `translate3d(0, ${bobY.toFixed(1)}px, 0) rotate(${tilt.toFixed(1)}deg) scaleX(${flipX})`;
      }

      // Proximity checkpoint detection
      let insideLoc: HeritageLocation | null = null;
      for (const loc of LOCATIONS) {
        const d = Math.hypot(
          playerPosRef.current.x - loc.worldPos.x,
          playerPosRef.current.y - loc.worldPos.y
        );
        if (d <= loc.checkpointRadius) {
          insideLoc = loc;
          break;
        }
      }

      const insideId = insideLoc?.id ?? null;
      if (insideId !== activeZoneRef.current) {
        const prevInsideId = activeZoneRef.current;
        activeZoneRef.current = insideId;
        setActiveZoneLocationId(insideId);

        if (insideLoc) {
          setLastVisitedLocationId(insideLoc.id);
          if (suppressedProximityIdRef.current !== insideLoc.id) {
            setSelectedCardId(insideLoc.id);
          }

          setDiscoveredIds((prev) => {
            if (prev.includes(insideLoc!.id)) {
              setNewlyDiscoveredId(null);
              return prev;
            }
            const next = [...prev, insideLoc!.id];
            setNewlyDiscoveredId(insideLoc!.id);
            soundEngine.playTempleBell();
            triggerToast(insideLoc!.id);

            if (next.length === LOCATIONS.length && !hasShownVictory) {
              if (victoryTimerRef.current !== null) window.clearTimeout(victoryTimerRef.current);
              victoryTimerRef.current = window.setTimeout(() => {
                soundEngine.playCompletionChord();
                setHasShownVictory(true);
                setViewState('VICTORY');
              }, 1300);
            }
            return next;
          });
        } else {
          suppressedProximityIdRef.current = null;
          setSelectedCardId((prev) => (prev === prevInsideId ? null : prev));
          setNewlyDiscoveredId(null);
        }
      }

      if (now - lastUiSyncRef.current > 110) {
        lastUiSyncRef.current = now;
        setPlayerUiPos({ ...playerPosRef.current });
        const z = getZoneAtPoint(playerPosRef.current.x, playerPosRef.current.y);
        if (z) {
          setCurrentZoneId(z.id);
        }
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [hasShownVictory, triggerToast, viewState]);

  if (viewState === 'TITLE_MENU') {
    return (
      <TitleScreen
        lang={lang}
        onToggleLang={toggleLang}
        startingLocation={LOCATIONS[0]}
        characterName={characterName}
        onChangeName={setCharacterName}
        persona={persona}
        onChangePersona={setPersona}
        outfitTheme={outfitTheme}
        onChangeTheme={setOutfitTheme}
        explorationMode={explorationMode}
        onChangeMode={setExplorationMode}
        onStart={handleStartAdventure}
        onOpenRealWorldMap={() => {
          setAutoStartMapNav(false);
          setViewState('REAL_WORLD_MAP');
        }}
        muted={muted}
        onToggleMute={toggleMute}
      />
    );
  }

  if (viewState === 'REAL_WORLD_MAP') {
    return (
      <div className="h-screen w-screen overflow-hidden">
        <RealWorldMap
          lang={lang}
          onToggleLang={toggleLang}
          initialDestinationId={selectedGpsDestId}
          autoStartNavigation={autoStartMapNav}
          onExploreInformation={handleExploreFromMap}
          onReturnToGame={() => setViewState('PLAYING')}
        />
      </div>
    );
  }

  const cardLocationId = selectedCardId ?? hoveredLandmarkId;
  const cardLocation = cardLocationId ? locationMap.get(cardLocationId) ?? null : null;
  const companionLocation = cardLocation?.companionId
    ? locationMap.get(cardLocation.companionId) ?? null
    : null;
  const parentLocation = cardLocation?.parentAreaId
    ? locationMap.get(cardLocation.parentAreaId) ?? null
    : null;
  const discoveryToastLoc = discoveryToastId ? locationMap.get(discoveryToastId) ?? null : null;
  const currentAreaLabel =
    ZONE_LABELS[lang][currentZoneId] ??
    (lang === 'ne' ? 'वडा १६ गल्ली' : 'Ward 16 Alley');
  const displayName = characterName.trim() || 'Y/N';
  const contextualSiteLocation =
    (activeZoneLocationId ? locationMap.get(activeZoneLocationId) : null) ??
    (lastVisitedLocationId ? locationMap.get(lastVisitedLocationId) : null) ??
    null;

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#1D140E] text-[#F4EDE2] select-none">
      {/* 1. Walkable 2D Kathmandu Ward 16 RPG Map Viewport */}
      <KathmanduWorld
        lang={lang}
        worldLayerRef={worldLayerRef}
        characterLayerRef={characterLayerRef}
        characterBodyRef={characterBodyRef}
        characterName={displayName}
        persona={persona}
        outfitTheme={outfitTheme}
        locations={LOCATIONS}
        discoveredIds={discoveredIds}
        activeZoneLocationId={activeZoneLocationId}
        selectedCardId={cardLocationId}
        guidedNextId={guidedNextLocation?.id ?? null}
        walkTarget={walkTarget}
        onWorldClick={handleWorldClick}
        onLandmarkClick={handleLandmarkClick}
        onLandmarkHover={(loc) => setHoveredLandmarkId(loc?.id ?? null)}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_58%,rgba(14,9,6,0.52)_100%)]"
      />

      {/* 2. Clean Perimeter HUD Wrapper */}
      <div className="pointer-events-none fixed inset-0 z-40 flex flex-col justify-between p-4 sm:p-5">
        {/* Top Row: Unified Mode Switcher + Progress + Mini-Map */}
        <div className="flex items-start justify-between gap-4">
          <div className="pointer-events-auto flex flex-wrap items-center gap-2">
            {/* Progress & Title Chip */}
            <div className="px-3.5 py-2 rounded-xl bg-[#1A120E]/92 border border-[#6E4F37]/70 shadow-xl flex items-center gap-2.5 text-xs">
              <Compass className="w-4 h-4 text-[#D99B38] shrink-0" />
              <span className="font-display font-bold text-sm text-[#F7EFE2] whitespace-nowrap">
                {copy.appTitle}
              </span>
              <span aria-hidden="true" className="text-[#6E5641]">·</span>
              <span className="font-mono-tabular font-semibold text-[#E5B869] whitespace-nowrap">
                {copy.discoveredCount(discoveredIds.length, LOCATIONS.length)}
              </span>
            </div>

            {/* Unified Mode Switcher: Real-World Map & Heritage Discoveries */}
            <button
              type="button"
              onClick={() =>
                handleNavigateRealWorld(
                  contextualSiteLocation?.gpsDestinationId ?? 'gps-siddhi-ganesh',
                  false
                )
              }
              className="px-3.5 py-2 rounded-xl bg-[#274B37]/95 hover:bg-[#1E3B2B] border border-[#5D8A6E]/60 text-xs font-semibold text-[#F4EDE2] flex items-center gap-1.5 shadow-xl transition-colors whitespace-nowrap"
            >
              <MapIcon className="w-3.5 h-3.5 text-[#E5C178]" />
              <span>{copy.realWorldMapBtn}</span>
            </button>

            <button
              type="button"
              onClick={() => setViewState('PAUSED')}
              className="px-3.5 py-2 rounded-xl bg-[#1A120E]/92 hover:bg-[#2A1E17] border border-[#6E4F37]/70 text-xs font-semibold text-[#F4EDE2] flex items-center gap-1.5 shadow-xl transition-colors whitespace-nowrap"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#D99B38]" />
              <span>{copy.discoveriesBtn}</span>
            </button>

            {/* Guided / Free Mode Toggle */}
            <button
              type="button"
              onClick={() =>
                setExplorationMode((m) => (m === 'guided' ? 'free' : 'guided'))
              }
              className="hidden md:inline-flex px-3 py-2 rounded-xl bg-[#1A120E]/92 hover:bg-[#2A1E17] border border-[#6E4F37]/70 text-xs font-medium text-[#E5D4BE] items-center gap-1.5 shadow-xl transition-colors whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E5B869]" />
              <span>
                {explorationMode === 'guided' ? copy.guidedModeLabel : copy.freeModeLabel}
              </span>
            </button>

            {/* Language Switcher (English / नेपाली) */}
            <button
              type="button"
              onClick={toggleLang}
              aria-label="Switch language"
              className="px-2.5 py-2 rounded-xl bg-[#1A120E]/92 hover:bg-[#2A1E17] border border-[#6E4F37]/70 text-xs font-semibold text-[#F7E6C4] flex items-center gap-1.5 shadow-xl transition-colors whitespace-nowrap"
            >
              <Languages className="w-3.5 h-3.5 text-[#D99B38]" />
              <span>{lang === 'en' ? 'नेपाली' : 'EN'}</span>
            </button>

            <button
              type="button"
              onClick={() => setHelpOpen(true)}
              aria-label="Help and controls"
              className="p-2 rounded-xl bg-[#1A120E]/92 hover:bg-[#2A1E17] border border-[#6E4F37]/70 text-[#F4EDE2] shadow-xl transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-[#D99B38]" />
            </button>

            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? 'Unmute sound' : 'Mute sound'}
              className="p-2 rounded-xl bg-[#1A120E]/92 hover:bg-[#2A1E17] border border-[#6E4F37]/70 text-[#F4EDE2] shadow-xl transition-colors"
            >
              {muted ? (
                <VolumeX className="w-4 h-4 text-[#C4A886]" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#D99B38]" />
              )}
            </button>
          </div>

          {discoveryToastLoc && (
            <div
              role="status"
              className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F5ECDD] text-[#221710] border border-[#C89232] shadow-2xl text-xs font-semibold"
            >
              <Landmark className="w-4 h-4 text-[#8D2C1D]" />
              <span>
                {copy.heritageDiscoveredBadge} ·{' '}
                {lang === 'ne' ? discoveryToastLoc.shortNameNe : discoveryToastLoc.shortName}
              </span>
            </div>
          )}

          <MiniMap
            lang={lang}
            locations={LOCATIONS}
            discoveredIds={discoveredIds}
            activeZoneLocationId={activeZoneLocationId}
            playerPos={playerUiPos}
            collapsed={mapCollapsed}
            onToggleCollapse={() => setMapCollapsed((p) => !p)}
            onSelectSite={handleWalkToSite}
          />
        </div>

        {/* Middle-Right Floating Heritage Card (non-overlapping layer) */}
        {cardLocation && (
          <div className="pointer-events-none fixed inset-y-0 right-4 sm:right-5 z-50 flex items-center py-16">
            <HeritageCard
              lang={lang}
              location={cardLocation}
              companionLocation={companionLocation}
              parentLocation={parentLocation}
              isDiscovered={discoveredIds.includes(cardLocation.id)}
              isNewDiscovery={newlyDiscoveredId === cardLocation.id}
              isPlayerInside={activeZoneLocationId === cardLocation.id}
              onClose={() => {
                if (activeZoneLocationId === cardLocation.id) {
                  suppressedProximityIdRef.current = cardLocation.id;
                }
                setSelectedCardId(null);
                setHoveredLandmarkId(null);
                setNewlyDiscoveredId(null);
              }}
              onWalkToSite={handleWalkToSite}
              onSelectLocation={(loc) => {
                setNewlyDiscoveredId(null);
                setSelectedCardId(loc.id);
                setLastVisitedLocationId(loc.id);
              }}
              onNavigateRealWorld={handleNavigateRealWorld}
            />
          </div>
        )}

        {/* Bottom Row: On-Screen Joystick + Zone Chip + Guided Next-Stop Helper */}
        <div className="flex items-end justify-between gap-4">
          <div className="flex items-end gap-3.5">
            <VirtualJoystick lang={lang} onVectorChange={handleJoystickVector} />

            <div className="pointer-events-auto hidden sm:block px-3.5 py-2 rounded-xl bg-[#1A120E]/90 border border-[#6E4F37]/65 shadow-xl">
              <div className="text-[11px] font-medium text-[#CBB59B]">
                {copy.currentLocationLabel(displayName)}
              </div>
              <div className="font-display text-sm font-bold text-[#F7EFE2]">
                {currentAreaLabel}
              </div>
            </div>
          </div>

          <div className="pointer-events-auto flex flex-col items-end gap-2 max-w-sm">
            {guidedNextLocation && (
              <>
                <div className="hidden md:block px-3 py-1.5 rounded-lg bg-[#1A120E]/90 border border-[#6E4F37]/65 text-[11px] text-[#E5D4BE] text-right shadow-lg">
                  {lang === 'ne'
                    ? guidedNextLocation.guidedHintNe
                    : guidedNextLocation.guidedHint}
                </div>
                <button
                  type="button"
                  onClick={() => handleWalkToSite(guidedNextLocation)}
                  className="px-3.5 py-2 rounded-xl bg-[#B83A24]/92 hover:bg-[#9E301D] border border-[#E5B869]/75 text-xs font-semibold text-[#FAF3E8] shadow-xl flex items-center gap-2 transition-colors whitespace-nowrap"
                >
                  <Compass className="w-3.5 h-3.5 text-[#F7D27A]" />
                  <span>
                    {copy.nextTrailStop}:{' '}
                    {lang === 'ne'
                      ? guidedNextLocation.shortNameNe
                      : guidedNextLocation.shortName}
                  </span>
                </button>
              </>
            )}

            {contextualSiteLocation && (
              <button
                type="button"
                onClick={() =>
                  handleNavigateRealWorld(contextualSiteLocation.gpsDestinationId, true)
                }
                className="px-3.5 py-2 rounded-xl bg-[#274B37]/95 hover:bg-[#1E3B2B] border border-[#5D8A6E]/75 text-xs font-semibold text-[#FAF3E8] shadow-xl flex items-center gap-2 transition-colors whitespace-nowrap"
              >
                <MapIcon className="w-3.5 h-3.5 text-[#E5C178]" />
                <span>
                  {copy.navigateToSiteGps(
                    lang === 'ne'
                      ? contextualSiteLocation.shortNameNe
                      : contextualSiteLocation.shortName
                  )}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Heritage Discoveries Journal Modal */}
      {viewState === 'PAUSED' && (
        <PauseJournalModal
          lang={lang}
          characterName={displayName}
          locations={LOCATIONS}
          discoveredIds={discoveredIds}
          activeZoneLocationId={activeZoneLocationId}
          muted={muted}
          onToggleMute={toggleMute}
          onResume={() => setViewState('PLAYING')}
          onRestart={handleRestart}
          onWalkToSite={handleWalkToSite}
          onNavigateRealWorld={(gpsId) => handleNavigateRealWorld(gpsId, true)}
        />
      )}

      {/* 4. Help & Controls Modal */}
      {helpOpen && <HelpModal lang={lang} onClose={() => setHelpOpen(false)} />}

      {/* 5. All 6 Heritage Discoveries Complete Modal */}
      {viewState === 'VICTORY' && (
        <VictoryModal
          lang={lang}
          characterName={displayName}
          totalSites={LOCATIONS.length}
          onContinueExploring={() => setViewState('PLAYING')}
          onOpenRealWorldMap={() =>
            handleNavigateRealWorld(
              contextualSiteLocation?.gpsDestinationId ?? 'gps-siddhi-ganesh',
              false
            )
          }
          onPlayAgain={handleRestart}
        />
      )}
    </div>
  );
}
