import React from 'react';
import { CheckCircle2, Compass, MapPin, Signpost } from 'lucide-react';
import {
  EXIT_SIDDHI_POS,
  PHOTO_BASE_PATH,
  WALKABLE_ZONES,
  WORLD_HEIGHT,
  WORLD_WIDTH,
  type HeritageLocation,
} from '../data/locations';
import {
  CharacterSprite,
  type CharacterPersona,
  type OutfitColorTheme,
} from './CharacterSprite';
import { UI_COPY, type Language } from '../data/i18n';

interface KathmanduWorldProps {
  lang: Language;
  worldLayerRef: React.RefObject<HTMLDivElement | null>;
  characterLayerRef: React.RefObject<HTMLDivElement | null>;
  characterBodyRef: React.RefObject<HTMLDivElement | null>;
  characterName: string;
  persona: CharacterPersona;
  outfitTheme: OutfitColorTheme;
  locations: HeritageLocation[];
  discoveredIds: string[];
  activeZoneLocationId: string | null;
  selectedCardId: string | null;
  guidedNextId: string | null;
  walkTarget: { x: number; y: number } | null;
  onWorldClick: (worldX: number, worldY: number) => void;
  onLandmarkClick: (loc: HeritageLocation) => void;
  onLandmarkHover: (loc: HeritageLocation | null) => void;
}

// Traditional Newari brick structures framing the sideways staircases, courtyards, and gallis
const BUILDINGS = [
  // West perimeter beside Siddhi Ganesh
  { x: 30, y: 740, w: 105, h: 360, roof: '#5E2419', wall: '#8B3B2B', windows: 3, vertical: true },
  // Northwest block left of Koncha Dyo sideways climb
  { x: 165, y: 470, w: 170, h: 275, roof: '#6A2B1E', wall: '#944230', windows: 2, vertical: false },
  // Building tucked west of Koncha Dyo upper courtyard
  { x: 245, y: 235, w: 125, h: 215, roof: '#582117', wall: '#823626', windows: 2, vertical: true },
  // North facade behind Koncha Dyo
  { x: 385, y: 120, w: 270, h: 110, roof: '#64281B', wall: '#8F3E2D', windows: 3, vertical: false },

  // SOLID DIVIDING BLOCK between Koncha Dyo and Nanak Math (prevents direct crossing!)
  { x: 670, y: 120, w: 125, h: 465, roof: '#531E15', wall: '#7A3224', windows: 3, vertical: true },

  // Main brick galli buildings (Siddhi Ganesh -> Mhepi Ajima)
  { x: 520, y: 730, w: 395, h: 125, roof: '#6B2B1E', wall: '#944331', windows: 4, vertical: false },
  { x: 540, y: 1012, w: 390, h: 125, roof: '#562016', wall: '#7D3425', windows: 4, vertical: false },

  // East block flanking Nanak Math ridge
  { x: 1175, y: 235, w: 130, h: 350, roof: '#62261A', wall: '#8A3A29', windows: 2, vertical: true },
  // North heritage veranda behind Nanak Math (San Jhya carved triple-bay facade)
  { x: 810, y: 120, w: 315, h: 112, roof: '#4D1D14', wall: '#773223', windows: 4, vertical: false, isSanjhya: true },

  // Alley buildings between Mhepi Ajima & Balaju 22 Dhara
  { x: 1335, y: 735, w: 280, h: 120, roof: '#68291D', wall: '#8E3E2D', windows: 3, vertical: false },
  { x: 1335, y: 1012, w: 295, h: 125, roof: '#5A2218', wall: '#813626', windows: 3, vertical: false },

  // Southern pavilion wall near Balaju 22 Dhara
  { x: 1665, y: 1100, w: 360, h: 115, roof: '#5E2419', wall: '#873A29', windows: 4, vertical: false },
];

export const KathmanduWorld: React.FC<KathmanduWorldProps> = ({
  lang,
  worldLayerRef,
  characterLayerRef,
  characterBodyRef,
  characterName,
  persona,
  outfitTheme,
  locations,
  discoveredIds,
  activeZoneLocationId,
  selectedCardId,
  guidedNextId,
  walkTarget,
  onWorldClick,
  onLandmarkClick,
  onLandmarkHover,
}) => {
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const worldX = e.clientX - rect.left;
    const worldY = e.clientY - rect.top;
    onWorldClick(worldX, worldY);
  };

  return (
    <div
      ref={worldLayerRef}
      onClick={handleMapClick}
      style={{
        width: `${WORLD_WIDTH}px`,
        height: `${WORLD_HEIGHT}px`,
      }}
      className="absolute top-0 left-0 will-change-transform cursor-crosshair"
    >
      {/* 1. Base SVG Kathmandu Architectural Map Layer */}
      <svg
        width={WORLD_WIDTH}
        height={WORLD_HEIGHT}
        viewBox={`0 0 ${WORLD_WIDTH} ${WORLD_HEIGHT}`}
        className="block select-none"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="valley-ground" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#463628" />
            <stop offset="65%" stopColor="#35281D" />
            <stop offset="100%" stopColor="#261C14" />
          </radialGradient>

          <pattern id="stone-paving" width="44" height="44" patternUnits="userSpaceOnUse">
            <rect width="44" height="44" fill="#9A8975" />
            <rect x="1" y="1" width="20" height="19" rx="2" fill="#A69581" stroke="#6F6050" strokeWidth="1" />
            <rect x="23" y="1" width="20" height="19" rx="2" fill="#94836F" stroke="#6F6050" strokeWidth="1" />
            <rect x="1" y="22" width="12" height="21" rx="2" fill="#988773" stroke="#6F6050" strokeWidth="1" />
            <rect x="15" y="22" width="28" height="21" rx="2" fill="#A2907C" stroke="#6F6050" strokeWidth="1" />
          </pattern>

          <pattern id="brick-alley" width="32" height="32" patternUnits="userSpaceOnUse">
            <rect width="32" height="32" fill="#8B5843" />
            <rect x="1" y="1" width="14" height="14" rx="1" fill="#99614B" stroke="#663B2B" strokeWidth="1" />
            <rect x="17" y="1" width="14" height="14" rx="1" fill="#84523E" stroke="#663B2B" strokeWidth="1" />
            <rect x="9" y="17" width="14" height="14" rx="1" fill="#935C47" stroke="#663B2B" strokeWidth="1" />
            <rect x="-7" y="17" width="14" height="14" rx="1" fill="#895541" stroke="#663B2B" strokeWidth="1" />
            <rect x="25" y="17" width="14" height="14" rx="1" fill="#895541" stroke="#663B2B" strokeWidth="1" />
          </pattern>

          <pattern id="clay-roof" width="16" height="16" patternUnits="userSpaceOnUse">
            <rect width="16" height="16" fill="#64271B" />
            <line x1="0" y1="0" x2="0" y2="16" stroke="#471810" strokeWidth="2" />
            <line x1="8" y1="0" x2="8" y2="16" stroke="#7A3324" strokeWidth="1.2" />
            <line x1="0" y1="8" x2="16" y2="8" stroke="#4F1B12" strokeWidth="1" />
          </pattern>

          <pattern id="hiti-water" width="36" height="24" patternUnits="userSpaceOnUse">
            <rect width="36" height="24" fill="#2E7582" />
            <path d="M2 8 Q10 4 18 8 T34 8" stroke="#66B9C4" strokeWidth="1.3" fill="none" strokeOpacity="0.65" />
            <path d="M4 18 Q12 14 20 18 T36 18" stroke="#8AD5DF" strokeWidth="1" fill="none" strokeOpacity="0.45" />
          </pattern>
        </defs>

        <rect width={WORLD_WIDTH} height={WORLD_HEIGHT} fill="url(#valley-ground)" />

        {/* Terraced Kathmandu hillside contours */}
        <path
          d="M0 540 Q520 495 1020 530 T1920 500 T2520 545 L2520 0 L0 0 Z"
          fill="#3C2F24"
          opacity="0.58"
        />
        <path
          d="M1580 580 Q1960 540 2520 570 L2520 1360 L1540 1360 Z"
          fill="#2D3A29"
          opacity="0.46"
        />

        {/* Walkable Stone Courtyards & Brick Galli Borders */}
        {WALKABLE_ZONES.map((z) => (
          <g key={`curb-${z.id}`}>
            <rect
              x={z.x - 10}
              y={z.y - 10}
              width={z.w + 20}
              height={z.h + 20}
              rx={z.kind === 'courtyard' ? 16 : 6}
              fill="#5A4636"
            />
            <rect
              x={z.x}
              y={z.y}
              width={z.w}
              height={z.h}
              rx={z.kind === 'courtyard' ? 10 : 3}
              fill={z.kind === 'alley' ? 'url(#brick-alley)' : 'url(#stone-paving)'}
            />
          </g>
        ))}

        {/* Sideways Terraced Stone Staircases */}
        {[
          { x: 356, y: 665, w: 103, h: 125, steps: 6 },
          { x: 471, y: 475, w: 103, h: 95, steps: 5 },
          { x: 1051, y: 665, w: 103, h: 110, steps: 6 },
          { x: 896, y: 475, w: 103, h: 95, steps: 5 },
        ].map((stair, sIdx) => {
          const stepH = stair.h / stair.steps;
          return (
            <g key={`stairs-${sIdx}`}>
              <rect x={stair.x - 8} y={stair.y} width={10} height={stair.h} rx="3" fill="#6F5E4E" stroke="#3F3226" strokeWidth="1.4" />
              <rect x={stair.x + stair.w - 2} y={stair.y} width={10} height={stair.h} rx="3" fill="#6F5E4E" stroke="#3F3226" strokeWidth="1.4" />
              {Array.from({ length: stair.steps }).map((_, i) => (
                <g key={i}>
                  <rect
                    x={stair.x + 2}
                    y={stair.y + i * stepH}
                    width={stair.w - 4}
                    height={stepH - 2}
                    fill={i % 2 === 0 ? '#B5A38D' : '#A6937D'}
                    stroke="#5C4D3E"
                    strokeWidth="1"
                  />
                  <line
                    x1={stair.x + 2}
                    y1={stair.y + (i + 1) * stepH - 2}
                    x2={stair.x + stair.w - 2}
                    y2={stair.y + (i + 1) * stepH - 2}
                    stroke="#3C3025"
                    strokeWidth="2.4"
                    strokeOpacity="0.45"
                  />
                </g>
              ))}
              <circle cx={stair.x - 3} cy={stair.y + stair.h - 4} r="7" fill="#8C7B69" stroke="#3C3025" strokeWidth="1.4" />
              <circle cx={stair.x + stair.w + 3} cy={stair.y + stair.h - 4} r="7" fill="#8C7B69" stroke="#3C3025" strokeWidth="1.4" />
            </g>
          );
        })}

        {/* Balaju 22 Dhara — Sunken Stone Hiti Pool & 22 Carved Stone Makara Waterspouts */}
        <g transform="translate(1665, 745)">
          <rect x="0" y="-12" width="350" height="22" rx="4" fill="#8C7C6B" stroke="#4D3D2E" strokeWidth="2" />
          <rect x="12" y="10" width="326" height="58" rx="4" fill="url(#hiti-water)" stroke="#4A3E33" strokeWidth="2.5" />
          {Array.from({ length: 22 }).map((_, i) => {
            const sx = 20 + i * 14.5;
            return (
              <g key={`dhara-${i}`}>
                <rect x={sx - 3} y="2" width="6" height="12" rx="1.5" fill="#A99985" stroke="#4B3B2D" strokeWidth="0.9" />
                <line x1={sx} y1="14" x2={sx} y2="27" stroke="#BCEEF5" strokeWidth="1.6" strokeLinecap="round" />
                <ellipse cx={sx} cy="29" rx="3.8" ry="1.8" fill="none" stroke="#BCEEF5" strokeWidth="0.9" strokeOpacity="0.85" />
              </g>
            );
          })}
        </g>

        {/* Traditional Newari Brick Houses, Clay Roofs & Carved Windows */}
        {BUILDINGS.map((b, idx) => (
          <g key={`bldg-${idx}`}>
            <rect x={b.x + 8} y={b.y + 10} width={b.w} height={b.h} rx="4" fill="#18100C" opacity="0.45" />
            <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="3" fill={b.wall} stroke="#471C13" strokeWidth="2" />
            <rect
              x={b.x + 6}
              y={b.y + 6}
              width={b.w - 12}
              height={b.h - 16}
              rx="2"
              fill="url(#clay-roof)"
              stroke="#3B150E"
              strokeWidth="1.5"
            />
            {b.vertical ? (
              <line
                x1={b.x + b.w / 2}
                y1={b.y + 12}
                x2={b.x + b.w / 2}
                y2={b.y + b.h - 18}
                stroke="#B88346"
                strokeWidth="3"
                strokeLinecap="round"
              />
            ) : (
              <line
                x1={b.x + 12}
                y1={b.y + b.h / 2 - 2}
                x2={b.x + b.w - 12}
                y2={b.y + b.h / 2 - 2}
                stroke="#B88346"
                strokeWidth="3"
                strokeLinecap="round"
              />
            )}

            {!b.vertical &&
              Array.from({ length: b.windows }).map((_, wi) => {
                const wx = b.x + 28 + wi * ((b.w - 56) / Math.max(1, b.windows - 1 || 1)) - (b.isSanjhya ? 18 : 12);
                const wy = b.y + b.h - 13;
                return (
                  <g key={`win-${wi}`}>
                    <rect
                      x={wx}
                      y={wy}
                      width={b.isSanjhya ? 38 : 26}
                      height="11"
                      rx="1.5"
                      fill="#4B2817"
                      stroke="#C49048"
                      strokeWidth="1.2"
                    />
                    <line x1={wx + 6} y1={wy} x2={wx + 6} y2={wy + 11} stroke="#8E5D33" strokeWidth="1" />
                    <line x1={wx + 13} y1={wy} x2={wx + 13} y2={wy + 11} stroke="#8E5D33" strokeWidth="1" />
                    <line x1={wx + 20} y1={wy} x2={wx + 20} y2={wy + 11} stroke="#8E5D33" strokeWidth="1" />
                  </g>
                );
              })}

            {b.vertical &&
              Array.from({ length: b.windows }).map((_, wi) => {
                const wy = b.y + 38 + wi * ((b.h - 76) / Math.max(1, b.windows - 1 || 1));
                const wx = b.x + b.w - 11;
                return (
                  <g key={`winv-${wi}`}>
                    <rect x={wx} y={wy} width="10" height="24" rx="1.5" fill="#4B2817" stroke="#C49048" strokeWidth="1.2" />
                    <line x1={wx} y1={wy + 8} x2={wx + 10} y2={wy + 8} stroke="#8E5D33" strokeWidth="1" />
                    <line x1={wx} y1={wy + 16} x2={wx + 10} y2={wy + 16} stroke="#8E5D33" strokeWidth="1" />
                  </g>
                );
              })}
          </g>
        ))}

        {/* Neighborhood Tea Stall (Chiya Pasal) along the main brick galli */}
        <g transform="translate(680, 825)">
          <rect x="0" y="0" width="94" height="46" rx="4" fill="#5D3722" stroke="#2D190E" strokeWidth="1.8" />
          <rect x="4" y="4" width="86" height="24" rx="2" fill="#A63A24" />
          <path d="M18 4 V28 M34 4 V28 M50 4 V28 M66 4 V28 M82 4 V28" stroke="#E8C27A" strokeWidth="3" strokeOpacity="0.7" />
          <rect x="10" y="30" width="74" height="10" rx="2" fill="#8C5934" />
          <circle cx="28" cy="34" r="5" fill="#D4A24E" stroke="#4D2F15" strokeWidth="1" />
          <circle cx="46" cy="35" r="2.5" fill="#F2E4CE" />
          <circle cx="56" cy="35" r="2.5" fill="#F2E4CE" />
          <rect x="14" y="44" width="66" height="8" rx="2" fill="#784B2A" stroke="#362011" strokeWidth="1" />
        </g>

        {/* Courtyard Chaityas & Standing Brass Bells */}
        {[
          { x: 215, y: 970, type: 'chaitya' },
          { x: 1015, y: 845, type: 'bell' },
          { x: 1235, y: 980, type: 'chaitya' },
          { x: 1715, y: 985, type: 'bell' },
        ].map((prop, pIdx) => (
          <g key={`prop-${pIdx}`} transform={`translate(${prop.x}, ${prop.y})`}>
            <circle cx="2" cy="4" r="14" fill="#18100C" opacity="0.35" />
            {prop.type === 'chaitya' ? (
              <>
                <rect x="-12" y="-12" width="24" height="24" rx="4" fill="#8C7E70" stroke="#42362B" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="8" fill="#D5C8B8" stroke="#5A4B3E" strokeWidth="1.2" />
                <circle cx="0" cy="0" r="3" fill="#D49B38" />
              </>
            ) : (
              <>
                <rect x="-10" y="-4" width="20" height="8" rx="2" fill="#4D3523" />
                <circle cx="0" cy="0" r="6" fill="#D49B38" stroke="#5C3D14" strokeWidth="1.4" />
              </>
            )}
          </g>
        ))}

        {/* Prayer Flags Strung Across Alleys & Sideways Stairs */}
        {[
          { x1: 525, y1: 870, x2: 635, y2: 1000 },
          { x1: 815, y1: 870, x2: 910, y2: 1000 },
          { x1: 350, y1: 690, x2: 465, y2: 670 },
          { x1: 500, y1: 515, x2: 615, y2: 495 },
          { x1: 1020, y1: 690, x2: 1135, y2: 670 },
          { x1: 805, y1: 515, x2: 920, y2: 495 },
          { x1: 1370, y1: 870, x2: 1495, y2: 1000 },
          { x1: 2010, y1: 810, x2: 2120, y2: 950 },
        ].map((rope, rIdx) => {
          const flagColors = ['#2C6CB0', '#F4EDE2', '#C43824', '#2F855A', '#E2A832'];
          return (
            <g key={`flags-${rIdx}`}>
              <line x1={rope.x1} y1={rope.y1} x2={rope.x2} y2={rope.y2} stroke="#473325" strokeWidth="1.4" />
              {Array.from({ length: 7 }).map((_, fi) => {
                const t = (fi + 1) / 8;
                const fx = rope.x1 + (rope.x2 - rope.x1) * t;
                const fy = rope.y1 + (rope.y2 - rope.y1) * t;
                return (
                  <polygon
                    key={fi}
                    points={`${fx - 4},${fy} ${fx + 4},${fy} ${fx},${fy + 9}`}
                    fill={flagColors[fi % flagColors.length]}
                    stroke="#2A1C12"
                    strokeWidth="0.5"
                  />
                );
              })}
            </g>
          );
        })}

        {/* Sacred Pipal, Banyan & Crimson Foliage Canopies */}
        {[
          { x: 990, y: 780, r: 42, c1: '#8D3324', c2: '#B24933' },
          { x: 1300, y: 785, r: 38, c1: '#355D37', c2: '#4B7C4B' },
          { x: 2095, y: 715, r: 52, c1: '#2A4E2F', c2: '#3D6E43' },
          { x: 2375, y: 720, r: 54, c1: '#2A4E2F', c2: '#407447' },
          { x: 2375, y: 985, r: 48, c1: '#335B36', c2: '#4A7A4A' },
          { x: 2125, y: 1005, r: 42, c1: '#2D5232', c2: '#426F45' },
          { x: 1625, y: 775, r: 38, c1: '#355D37', c2: '#4E804E' },
        ].map((tree, tIdx) => (
          <g key={`tree-${tIdx}`} transform={`translate(${tree.x}, ${tree.y})`}>
            <circle cx="8" cy="12" r={tree.r} fill="#14100C" opacity="0.35" />
            <circle cx="0" cy="0" r={tree.r} fill={tree.c1} stroke="#1D331E" strokeWidth="2" />
            <circle cx={-tree.r * 0.28} cy={-tree.r * 0.2} r={tree.r * 0.68} fill={tree.c2} opacity="0.85" />
            <circle cx={tree.r * 0.25} cy={tree.r * 0.15} r={tree.r * 0.45} fill="#669A5D" opacity="0.45" />
          </g>
        ))}

        {/* Marigold Planters */}
        {[
          { x: 210, y: 830 },
          { x: 460, y: 1020 },
          { x: 445, y: 315 },
          { x: 980, y: 315 },
          { x: 2180, y: 800 },
        ].map((pot, idx) => (
          <g key={`pot-${idx}`} transform={`translate(${pot.x}, ${pot.y})`}>
            <circle cx="0" cy="0" r="8" fill="#8B3A23" stroke="#3D1A10" strokeWidth="1.2" />
            <circle cx="-2" cy="-2" r="3" fill="#E8A225" />
            <circle cx="3" cy="-1" r="3" fill="#F2B838" />
            <circle cx="0" cy="3" r="3" fill="#DE831D" />
          </g>
        ))}

        {walkTarget && (
          <g transform={`translate(${walkTarget.x}, ${walkTarget.y})`}>
            <circle r="14" fill="none" stroke="#F7D27A" strokeWidth="2" strokeDasharray="4 3" />
            <circle r="4" fill="#F7D27A" />
          </g>
        )}
      </svg>

      {/* Internal Transition Signpost: Exit Siddhi Ganesh (does not count as a heritage site) */}
      <div
        style={{ left: `${EXIT_SIDDHI_POS.x}px`, top: `${EXIT_SIDDHI_POS.y - 54}px` }}
        className="absolute -translate-x-1/2 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#2A1D14]/90 border border-[#9E7848]/70 text-[10px] font-medium text-[#EFE0C7] shadow-md whitespace-nowrap"
      >
        <Signpost className="w-3 h-3 text-[#E5B869]" />
        <span>{UI_COPY[lang].exitSiddhiSign}</span>
      </div>

      {/* 2. On-Map Real Photo Landmarks & Glowing Checkpoint Rings */}
      {locations.map((loc) => {
        const isDiscovered = discoveredIds.includes(loc.id);
        const isInside = activeZoneLocationId === loc.id;
        const isSelected = selectedCardId === loc.id;
        const isGuidedTarget = guidedNextId === loc.id;
        const displayName = lang === 'ne' ? loc.shortNameNe : loc.shortName;

        return (
          <div
            key={loc.id}
            style={{
              left: `${loc.worldPos.x}px`,
              top: `${loc.worldPos.y}px`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          >
            {/* Glowing Ground Checkpoint Ring */}
            <div
              style={{
                width: `${loc.checkpointRadius * 2}px`,
                height: `${loc.checkpointRadius * 2}px`,
              }}
              className={`rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                isInside || isSelected
                  ? 'border-[#F7D27A] bg-[#D99B38]/28 shadow-[0_0_34px_rgba(235,179,76,0.6)] scale-105'
                  : isGuidedTarget
                    ? 'border-[#F5C562] bg-[#E5A93B]/20 shadow-[0_0_30px_rgba(245,197,98,0.55)] animate-pulse'
                    : isDiscovered
                      ? 'border-[#C89232]/75 bg-[#C89232]/12 shadow-[0_0_20px_rgba(200,146,50,0.28)]'
                      : 'border-[#E65D3B]/85 bg-[#E65D3B]/15 shadow-[0_0_26px_rgba(230,93,59,0.45)] animate-pulse'
              }`}
            >
              <div className="w-3 h-3 rounded-full bg-[#FAF0DE] border-2 border-[#8D2C1D]" />
            </div>

            {/* Guided Adventure Marker Tag */}
            {isGuidedTarget && (
              <div className="absolute left-1/2 -translate-x-1/2 -top-[132px] px-2 py-0.5 rounded bg-[#C89232] text-[#1A120E] text-[10px] font-bold shadow-md flex items-center gap-1 whitespace-nowrap">
                <Compass className="w-3 h-3" />
                <span>{UI_COPY[lang].nextTrailStop}</span>
              </div>
            )}

            {/* Framed Real Heritage Photograph Marker */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onLandmarkClick(loc);
              }}
              onMouseEnter={() => onLandmarkHover(loc)}
              onMouseLeave={() => onLandmarkHover(null)}
              aria-label={`Inspect or walk to ${displayName}`}
              className="pointer-events-auto group absolute left-1/2 -translate-x-1/2 -top-[106px] w-[148px] rounded-xl bg-[#1E140E]/95 border-2 border-[#C89232] hover:border-[#F7D793] shadow-[0_14px_30px_rgba(0,0,0,0.65)] overflow-hidden text-left transition-transform duration-150 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FAF0DE]"
            >
              <div className="relative h-[74px] w-full bg-[#2C1E16] overflow-hidden">
                <img
                  src={`${PHOTO_BASE_PATH}/${loc.photoFile}`}
                  alt={displayName}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 h-7 bg-gradient-to-t from-[#160F0B]/90 to-transparent" />
                <span className="absolute top-1.5 left-1.5 font-mono-tabular text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#160F0B]/85 text-[#F5D693]">
                  0{loc.order}
                </span>
                {isDiscovered ? (
                  <span className="absolute top-1.5 right-1.5 text-[#7CE39B]" title="Discovered">
                    <CheckCircle2 className="w-4 h-4 fill-[#160F0B]" />
                  </span>
                ) : (
                  <span className="absolute top-1.5 right-1.5 text-[#F3956C]" title="Undiscovered">
                    <MapPin className="w-4 h-4 fill-[#160F0B]" />
                  </span>
                )}
              </div>

              <div className="px-2.5 py-1.5 flex items-center justify-between gap-1 bg-[#1E140E]">
                <span className="font-display text-xs font-bold text-[#F7EFE2] truncate">
                  {displayName}
                </span>
              </div>
            </button>
          </div>
        );
      })}

      {/* 3. Walkable Explorer Character (Aarav / Lujana, GPU-transformed at 60fps) */}
      <div
        ref={characterLayerRef}
        style={{
          transform: 'translate3d(320px, 985px, 0)',
        }}
        className="absolute top-0 left-0 -ml-7 -mt-9 pointer-events-none will-change-transform z-30"
      >
        <div className="mb-0.5 text-center">
          <span className="px-1.5 py-0.5 rounded bg-[#160F0B]/85 border border-[#C89232]/65 text-[10px] font-semibold text-[#FAF0DE] shadow whitespace-nowrap">
            {characterName}
          </span>
        </div>

        <div ref={characterBodyRef} className="w-14 h-14 flex items-center justify-center">
          <CharacterSprite persona={persona} theme={outfitTheme} size={50} />
        </div>
      </div>
    </div>
  );
};
