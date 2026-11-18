import React from 'react';
import { Compass, ChevronDown, ChevronUp } from 'lucide-react';
import { WORLD_HEIGHT, WORLD_WIDTH, type HeritageLocation } from '../data/locations';
import { UI_COPY, type Language } from '../data/i18n';

interface MiniMapProps {
  lang: Language;
  locations: HeritageLocation[];
  discoveredIds: string[];
  activeZoneLocationId: string | null;
  playerPos: { x: number; y: number };
  collapsed: boolean;
  onToggleCollapse: () => void;
  onSelectSite: (loc: HeritageLocation) => void;
}

export const MiniMap: React.FC<MiniMapProps> = ({
  lang,
  locations,
  discoveredIds,
  activeZoneLocationId,
  playerPos,
  collapsed,
  onToggleCollapse,
  onSelectSite,
}) => {
  const discoveredCount = discoveredIds.length;
  const copy = UI_COPY[lang];

  const toMini = (wx: number, wy: number) => ({
    x: 24 + (wx / WORLD_WIDTH) * 432,
    y: 18 + (wy / WORLD_HEIGHT) * 194,
  });

  const playerMini = toMini(playerPos.x, playerPos.y);

  const edges: { from: HeritageLocation; to: HeritageLocation; key: string }[] = [];
  const seen = new Set<string>();
  locations.forEach((loc) => {
    loc.neighbors.forEach((nId) => {
      const target = locations.find((l) => l.id === nId);
      if (!target) return;
      const pairKey = [loc.id, target.id].sort().join('--');
      if (!seen.has(pairKey)) {
        seen.add(pairKey);
        edges.push({ from: loc, to: target, key: pairKey });
      }
    });
  });

  return (
    <aside
      aria-label="Ward 16 Alley Trail Mini-Map"
      className="pointer-events-auto w-[260px] sm:w-[310px] rounded-xl bg-[#1A120E]/92 border border-[#6E4F37]/65 shadow-2xl overflow-hidden"
    >
      <button
        type="button"
        onClick={onToggleCollapse}
        className="w-full flex items-center justify-between px-3.5 py-2.5 text-left hover:bg-[#271C16]/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D99B38]"
      >
        <div className="flex items-center gap-2 min-w-0">
          <Compass className="w-4 h-4 text-[#D99B38] shrink-0" />
          <span className="text-xs font-semibold tracking-wide text-[#F4EDE2] truncate">
            {lang === 'ne' ? 'खेल मार्ग नक्सा' : 'Game Trail Map'}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono-tabular text-xs font-medium text-[#E5B869]">
            {copy.discoveredCount(discoveredCount, locations.length)}
          </span>
          {collapsed ? (
            <ChevronDown className="w-3.5 h-3.5 text-[#B8A592]" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5 text-[#B8A592]" />
          )}
        </div>
      </button>

      {!collapsed && (
        <div className="px-3 pb-3 pt-1 border-t border-[#4D3626]/55">
          <div className="relative rounded-lg bg-[#EDE0CA] border border-[#9E815D]/60 p-1.5 overflow-hidden">
            <svg
              viewBox="0 0 480 230"
              className="w-full h-auto block"
              role="img"
              aria-label="Live Ward 16 Kathmandu trail map"
            >
              {edges.map(({ from, to, key }) => {
                const p1 = toMini(from.worldPos.x, from.worldPos.y);
                const p2 = toMini(to.worldPos.x, to.worldPos.y);
                const bothDiscovered =
                  discoveredIds.includes(from.id) && discoveredIds.includes(to.id);

                const isSidewaysStair = Math.abs(p1.y - p2.y) > 40;
                const d = isSidewaysStair
                  ? `M ${p1.x} ${p1.y} L ${p1.x} ${(p1.y + p2.y) / 2} L ${p2.x} ${(p1.y + p2.y) / 2} L ${p2.x} ${p2.y}`
                  : `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;

                return (
                  <path
                    key={key}
                    d={d}
                    stroke={bothDiscovered ? '#5E442F' : '#AE987B'}
                    strokeWidth="2.8"
                    strokeDasharray={bothDiscovered ? undefined : '5 4'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                );
              })}

              {locations.map((loc) => {
                const p = toMini(loc.worldPos.x, loc.worldPos.y);
                const isDiscovered = discoveredIds.includes(loc.id);
                const isHere = activeZoneLocationId === loc.id;
                const labelAbove = loc.worldPos.y < 600;
                const labelY = labelAbove ? p.y - 14 : p.y + 20;

                return (
                  <g
                    key={loc.id}
                    onClick={() => onSelectSite(loc)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isHere ? 10 : 7.5}
                      fill={isDiscovered ? '#3D2B1F' : '#D8C7AE'}
                      stroke={isHere ? '#B83A24' : '#4A3425'}
                      strokeWidth="2"
                    />
                    {isDiscovered && (
                      <circle cx={p.x} cy={p.y} r="2.6" fill="#E7C27D" />
                    )}
                    <text
                      x={p.x}
                      y={labelY}
                      textAnchor="middle"
                      fill={isHere ? '#8A2210' : isDiscovered ? '#2B1D14' : '#6A5641'}
                      fontSize="10"
                      fontWeight={isHere ? '700' : '600'}
                      fontFamily="Plus Jakarta Sans, Noto Sans Devanagari, sans-serif"
                    >
                      {lang === 'ne' ? loc.shortNameNe : loc.shortName}
                    </text>
                  </g>
                );
              })}

              <g transform={`translate(${playerMini.x}, ${playerMini.y})`}>
                <circle r="7.5" fill="#B83A24" stroke="#FAF3E8" strokeWidth="2" />
                <circle r="2.5" fill="#F7D27A" />
              </g>
            </svg>
          </div>
          <p className="mt-1.5 text-[11px] text-[#C4B29D] flex items-center justify-between">
            <span>
              {lang === 'ne'
                ? 'कुनै पनि स्थानमा हिँड्न क्लिक गर्नुहोस्'
                : 'Click any shrine node to walk there'}
            </span>
            <span className="font-mono-tabular text-[#E5B869]">
              {Math.round((discoveredCount / locations.length) * 100)}%
            </span>
          </p>
        </div>
      )}
    </aside>
  );
};
