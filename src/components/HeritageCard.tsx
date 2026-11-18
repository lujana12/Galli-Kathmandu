import React, { useState } from 'react';
import {
  BookmarkCheck,
  Footprints,
  Landmark,
  Navigation,
  Sparkles,
  X,
} from 'lucide-react';
import { PHOTO_BASE_PATH, type HeritageLocation } from '../data/locations';
import { UI_COPY, type Language } from '../data/i18n';

interface HeritageCardProps {
  lang: Language;
  location: HeritageLocation;
  companionLocation?: HeritageLocation | null;
  parentLocation?: HeritageLocation | null;
  isDiscovered: boolean;
  isNewDiscovery?: boolean;
  isPlayerInside: boolean;
  onClose: () => void;
  onWalkToSite: (loc: HeritageLocation) => void;
  onSelectLocation: (loc: HeritageLocation) => void;
  onNavigateRealWorld: (gpsDestinationId: string) => void;
}

export const HeritageCard: React.FC<HeritageCardProps> = ({
  lang,
  location,
  companionLocation,
  parentLocation,
  isDiscovered,
  isNewDiscovery = false,
  isPlayerInside,
  onClose,
  onWalkToSite,
  onSelectLocation,
  onNavigateRealWorld,
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const copy = UI_COPY[lang];
  const isNe = lang === 'ne';

  const title = isNe ? location.nameNe : location.name;
  const subtitle = isNe ? location.subtitleNe : location.subtitle;
  const district = isNe ? location.districtNe : location.district;
  const description = isNe ? location.descriptionNe : location.description;
  const researchNote = isNe ? location.researchNoteNe : location.researchNote;

  return (
    <section
      aria-label={`${title} Heritage Discovery`}
      className={`pointer-events-auto w-full max-w-[400px] sm:max-w-[430px] max-h-[calc(100vh-148px)] flex flex-col rounded-2xl bg-[#F5ECDD] text-[#221710] border-2 shadow-[0_24px_60px_rgba(8,5,3,0.75)] overflow-hidden transition-all duration-200 ease-out ${
        isNewDiscovery
          ? 'border-[#D99B38] ring-4 ring-[#E5B869]/35 scale-[1.01]'
          : 'border-[#A68459]'
      }`}
    >
      <div className="h-1.5 w-full shrink-0 bg-gradient-to-r from-[#8D2C1D] via-[#C89232] to-[#8D2C1D]" />

      {/* Real photograph from Ward 16 Heritage Research */}
      <div className="relative h-48 sm:h-52 w-full shrink-0 bg-[#271B14] overflow-hidden">
        {!imgFailed ? (
          <img
            key={location.id}
            src={`${PHOTO_BASE_PATH}/${location.photoFile}`}
            alt={title}
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center text-[#E5D4BD] px-4 text-center">
            <Landmark className="w-8 h-8 text-[#D99B38] mb-2" />
            <span className="text-xs">Photo: /public/images/photos/{location.photoFile}</span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#19110C]/90 via-[#19110C]/40 to-transparent" />

        {isNewDiscovery && (
          <div className="absolute top-2.5 left-3 px-2.5 py-1 rounded-lg bg-[#B83A24] text-[#FAF3E8] text-[11px] font-semibold flex items-center gap-1.5 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-[#F7D27A]" />
            <span>{copy.heritageDiscoveredBadge}</span>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          aria-label="Close heritage card"
          className="absolute top-2.5 right-2.5 p-2 rounded-lg bg-[#1A120E]/82 hover:bg-[#8D2C1D] text-[#FAF0DE] border border-[#C89232]/65 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FAF0DE]"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="absolute bottom-2.5 left-3.5 right-3.5 text-[#FAF0DE]">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="font-display text-lg sm:text-xl font-bold tracking-tight drop-shadow">
              {title}
            </h2>
            {!isNe && (
              <span className="text-xs font-medium text-[#F5D693] shrink-0 drop-shadow">
                {location.newariName}
              </span>
            )}
          </div>
          <p className="text-xs italic text-[#EDE0CA] drop-shadow">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Heritage information & direct Real-World Map navigation */}
      <div className="p-4 sm:p-5 overflow-y-auto space-y-3">
        <div className="flex items-center justify-between gap-2 text-xs text-[#6B5038]">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="font-mono-tabular">0{location.order}</span>
            <span aria-hidden="true">·</span>
            <span>{district}</span>
          </div>
          <span
            className={`inline-flex items-center gap-1 font-semibold shrink-0 ${
              isDiscovered ? 'text-[#8D2C1D]' : 'text-[#6B5038]'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            {isDiscovered ? copy.discoveredStatus : copy.unvisitedStatus}
          </span>
        </div>

        <p className="text-sm leading-relaxed text-[#2C1E14]">
          {description}
        </p>

        <p className="text-xs leading-relaxed text-[#5C432F] bg-[#EAE0CE] px-3 py-2 rounded-lg border border-[#D4C0A1]">
          {researchNote}
        </p>

        {companionLocation && (
          <div className="pt-1">
            <button
              type="button"
              onClick={() => onSelectLocation(companionLocation)}
              className="w-full text-left px-3 py-2 rounded-lg border border-[#C8A677] bg-[#EFE4D1] hover:bg-[#E7D8BE] transition-colors flex items-center justify-between gap-2 text-xs"
            >
              <div>
                <span className="font-semibold text-[#7A3321]">
                  {copy.alsoInArea}: {isNe ? companionLocation.nameNe : companionLocation.name}
                </span>
                <div className="text-[11px] text-[#5C432F]">
                  {isNe ? companionLocation.subtitleNe : companionLocation.subtitle}
                </div>
              </div>
              <span className="font-semibold text-[#8D2C1D] shrink-0">{copy.viewBtn}</span>
            </button>
          </div>
        )}

        {parentLocation && (
          <div className="pt-1">
            <button
              type="button"
              onClick={() => onSelectLocation(parentLocation)}
              className="w-full text-left px-3 py-2 rounded-lg border border-[#C8A677] bg-[#EFE4D1] hover:bg-[#E7D8BE] transition-colors flex items-center justify-between gap-2 text-xs"
            >
              <span className="font-semibold text-[#7A3321]">
                {copy.mainGpsComplex}: {isNe ? parentLocation.nameNe : parentLocation.name}
              </span>
              <span className="font-semibold text-[#8D2C1D] shrink-0">{copy.viewBtn}</span>
            </button>
          </div>
        )}

        {/* Action Buttons right below discovered info */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2">
          {!isPlayerInside ? (
            <button
              type="button"
              onClick={() => onWalkToSite(location)}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#8D2C1D] hover:bg-[#752316] text-[#FAF3E8] text-xs font-semibold transition-colors whitespace-nowrap"
            >
              <Footprints className="w-4 h-4" />
              <span>{copy.walkHere}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#8D6F4E] text-[#2B1D14] hover:bg-[#E7DAC4] text-xs font-semibold transition-colors whitespace-nowrap"
            >
              <span>{copy.continueExploring}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onNavigateRealWorld(location.gpsDestinationId)}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#274B37] hover:bg-[#1E3B2B] text-[#F5EFE4] text-xs font-semibold transition-colors whitespace-nowrap"
          >
            <Navigation className="w-3.5 h-3.5 text-[#E5C178]" />
            <span>{copy.navigateOnRealMap}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
