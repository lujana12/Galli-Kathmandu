import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  Footprints,
  HelpCircle,
  Map as MapIcon,
  Navigation,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { PHOTO_BASE_PATH, type HeritageLocation } from '../data/locations';
import { UI_COPY, type Language } from '../data/i18n';

interface PauseJournalModalProps {
  lang: Language;
  characterName: string;
  locations: HeritageLocation[];
  discoveredIds: string[];
  activeZoneLocationId: string | null;
  muted: boolean;
  onToggleMute: () => void;
  onResume: () => void;
  onRestart: () => void;
  onWalkToSite: (loc: HeritageLocation) => void;
  onNavigateRealWorld: (gpsDestinationId: string) => void;
}

export const PauseJournalModal: React.FC<PauseJournalModalProps> = ({
  lang,
  characterName,
  locations,
  discoveredIds,
  activeZoneLocationId,
  muted,
  onToggleMute,
  onResume,
  onRestart,
  onWalkToSite,
  onNavigateRealWorld,
}) => {
  const copy = UI_COPY[lang];
  const isNe = lang === 'ne';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Heritage Discoveries Journal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D0907]/82 p-4 sm:p-6"
    >
      <div className="w-full max-w-2xl max-h-[88vh] flex flex-col rounded-2xl bg-[#1C140F] border border-[#6E4F37] shadow-2xl overflow-hidden text-[#F4EDE2]">
        <div className="px-6 py-4 border-b border-[#3E2C20] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-[#D99B38]" />
            <div>
              <h2 className="font-display text-xl font-bold text-[#F7EFE2]">
                {copy.journalTitle(characterName || 'Y/N')}
              </h2>
              <p className="text-xs text-[#BAA68E] font-mono-tabular">
                {copy.journalSubtitle(discoveredIds.length, locations.length)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleMute}
              className="px-3 py-2 rounded-lg bg-[#2A1E17] hover:bg-[#38281E] border border-[#5A402D] text-xs font-medium flex items-center gap-1.5 whitespace-nowrap"
            >
              {muted ? (
                <VolumeX className="w-3.5 h-3.5 text-[#D99B38]" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-[#D99B38]" />
              )}
              <span>{muted ? 'Unmute' : 'Mute'}</span>
            </button>
            <button
              type="button"
              onClick={onResume}
              className="px-4 py-2 rounded-lg bg-[#B83A24] hover:bg-[#9E301D] text-xs font-semibold text-[#FAF3E8] flex items-center gap-1.5 whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{copy.resumeAdventure}</span>
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-3">
          {locations.map((loc) => {
            const discovered = discoveredIds.includes(loc.id);
            const isHere = loc.id === activeZoneLocationId;
            return (
              <div
                key={loc.id}
                className={`p-4 rounded-xl border transition-colors flex flex-col sm:flex-row gap-4 ${
                  discovered
                    ? 'bg-[#251A13] border-[#5C422E]'
                    : 'bg-[#17100C] border-[#33241A] opacity-80'
                }`}
              >
                <div className="w-full sm:w-32 h-24 rounded-lg bg-[#120D0A] border border-[#4A3425] overflow-hidden shrink-0 flex items-center justify-center">
                  {discovered ? (
                    <img
                      src={`${PHOTO_BASE_PATH}/${loc.photoFile}`}
                      alt={isNe ? loc.nameNe : loc.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[11px] text-[#7D6853] font-medium px-2 text-center">
                      {isNe ? 'खोजेपछि तस्बिर देखिनेछ' : 'Discover to unlock photo'}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-[#C8B29A]">
                        <span className="font-mono-tabular">0{loc.order}</span>
                        <span aria-hidden="true">·</span>
                        <span>{isNe ? loc.districtNe : loc.district}</span>
                        {isHere && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-[#E5B869] font-semibold">
                              {isNe ? 'अहिले यहाँ' : 'Here Now'}
                            </span>
                          </>
                        )}
                      </div>
                      <h3 className="font-display text-lg font-bold text-[#F6EDE0] mt-0.5">
                        {discovered
                          ? isNe
                            ? loc.nameNe
                            : loc.name
                          : `0${loc.order} · ${isNe ? loc.shortNameNe : loc.shortName}`}
                      </h3>
                      {discovered && (
                        <p className="text-xs italic text-[#D9B782]">
                          {isNe ? loc.subtitleNe : loc.subtitle}
                        </p>
                      )}
                    </div>

                    {discovered ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#E5B869] shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                        {copy.discoveredStatus}
                      </span>
                    ) : (
                      <span className="text-xs text-[#8D7864] shrink-0">
                        {copy.unvisitedStatus}
                      </span>
                    )}
                  </div>

                  <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[#CFC0AD]">
                    {discovered
                      ? isNe
                        ? loc.descriptionNe
                        : loc.description
                      : copy.lockedText}
                  </p>

                  <div className="mt-2.5 flex flex-wrap items-center gap-3">
                    {!isHere && (
                      <button
                        type="button"
                        onClick={() => onWalkToSite(loc)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E5B869] hover:text-[#F7D793] transition-colors"
                      >
                        <Footprints className="w-3.5 h-3.5" />
                        <span>{copy.walkHereInGame}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onNavigateRealWorld(loc.gpsDestinationId)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8AD9A4] hover:text-[#B8F0C9] transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>{copy.navigateOnRealMap}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-6 py-3.5 border-t border-[#3E2C20] bg-[#160F0B] flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium text-[#D1C0AD] hover:text-[#F4EDE2] hover:bg-[#2A1E17] transition-colors whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{copy.restartAdventure}</span>
          </button>

          <span className="text-xs text-[#9C8772]">
            {isNe ? 'बन्द गर्न Esc वा J थिच्नुहोस्' : 'Press Esc or J to return'}
          </span>
        </div>
      </div>
    </div>
  );
};

interface HelpModalProps {
  lang: Language;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ lang, onClose }) => {
  const copy = UI_COPY[lang];
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={copy.helpTitle}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D0907]/82 p-4"
    >
      <div className="w-full max-w-lg rounded-2xl bg-[#F5ECDD] text-[#221710] border-2 border-[#C89232] shadow-2xl overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-[#8D2C1D] via-[#C89232] to-[#8D2C1D]" />
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#8D2C1D]" />
              <h2 className="font-display text-xl font-bold text-[#1E130D]">
                {copy.helpTitle}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close help"
              className="p-1.5 rounded-lg hover:bg-[#E7DAC4] text-[#4B3627]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <ul className="space-y-2.5 text-sm text-[#38271B]">
            <li>{copy.helpMove}</li>
            <li>{copy.helpDiscover}</li>
            <li>{copy.helpRouteRule}</li>
            <li>{copy.helpRealWorld}</li>
          </ul>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-[#8D2C1D] hover:bg-[#752316] text-[#FAF3E8] text-xs font-semibold transition-colors"
          >
            {copy.backToAdventure}
          </button>
        </div>
      </div>
    </div>
  );
};

interface VictoryModalProps {
  lang: Language;
  characterName: string;
  totalSites: number;
  onContinueExploring: () => void;
  onOpenRealWorldMap: () => void;
  onPlayAgain: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  lang,
  characterName,
  totalSites,
  onContinueExploring,
  onOpenRealWorldMap,
  onPlayAgain,
}) => {
  const copy = UI_COPY[lang];
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={copy.trailComplete}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D0907]/82 p-4"
    >
      <div className="w-full max-w-md rounded-2xl bg-[#F5ECDD] text-[#221710] border-2 border-[#C89232] shadow-2xl overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-[#8D2C1D] via-[#C89232] to-[#8D2C1D]" />
        <div className="p-6 sm:p-7 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-[#8D2C1D] text-[#F9EFE0] flex items-center justify-center mb-4">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <p className="text-xs font-semibold tracking-wide text-[#8D2C1D]">
            {copy.trailComplete}
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1E130D] mt-1">
            {copy.allDiscoveredTitle(totalSites)}
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-[#4B3627]">
            {copy.allDiscoveredBody(characterName || 'Y/N')}
          </p>

          <div className="mt-6 space-y-2.5">
            <button
              type="button"
              onClick={onOpenRealWorldMap}
              className="w-full py-3 px-4 rounded-xl bg-[#274B37] hover:bg-[#1E3B2B] text-[#FAF3E8] text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shadow-lg"
            >
              <MapIcon className="w-4 h-4 text-[#E5C178]" />
              <span>{copy.openRealWorldMap}</span>
            </button>

            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={onContinueExploring}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl border border-[#8D6F4E] text-[#2B1D14] hover:bg-[#E7DAC4] text-xs font-semibold transition-colors whitespace-nowrap"
              >
                {copy.continueExploring}
              </button>
              <button
                type="button"
                onClick={onPlayAgain}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#8D2C1D] hover:bg-[#752316] text-[#FAF3E8] text-xs font-semibold transition-colors whitespace-nowrap"
              >
                {copy.playAgain}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
