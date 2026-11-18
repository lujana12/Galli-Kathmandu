import React, { useEffect } from 'react';
import {
  ArrowRight,
  Compass,
  Languages,
  Map as MapIcon,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { IMAGE_BASE_PATH, type HeritageLocation } from '../data/locations';
import {
  CharacterSprite,
  OUTFIT_THEMES,
  type CharacterPersona,
  type OutfitColorTheme,
} from './CharacterSprite';
import { UI_COPY, type Language } from '../data/i18n';

export type ExplorationMode = 'guided' | 'free';

interface TitleScreenProps {
  lang: Language;
  onToggleLang: () => void;
  startingLocation: HeritageLocation;
  characterName: string;
  onChangeName: (name: string) => void;
  persona: CharacterPersona;
  onChangePersona: (p: CharacterPersona) => void;
  outfitTheme: OutfitColorTheme;
  onChangeTheme: (t: OutfitColorTheme) => void;
  explorationMode: ExplorationMode;
  onChangeMode: (m: ExplorationMode) => void;
  onStart: () => void;
  onOpenRealWorldMap: () => void;
  muted: boolean;
  onToggleMute: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  lang,
  onToggleLang,
  startingLocation,
  characterName,
  onChangeName,
  persona,
  onChangePersona,
  outfitTheme,
  onChangeTheme,
  explorationMode,
  onChangeMode,
  onStart,
  onOpenRealWorldMap,
  muted,
  onToggleMute,
}) => {
  const copy = UI_COPY[lang];
  const displayName = characterName.trim() || 'Y/N';

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT') return;
      if (e.key === 'Enter') {
        e.preventDefault();
        onStart();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onStart]);

  return (
    <div className="relative h-screen w-screen overflow-y-auto overflow-x-hidden bg-[#120D0A] text-[#F4EDE2]">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <img
          src={`${IMAGE_BASE_PATH}/${startingLocation.imageFile}`}
          alt={startingLocation.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover animate-gentle-pan opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#120D0A]/95 via-[#120D0A]/78 to-[#120D0A]/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#120D0A] via-transparent to-[#120D0A]/55" />
      </div>

      {/* Top-right Language & Sound Controls */}
      <div className="relative z-20 flex justify-end gap-2 px-6 pt-5">
        <button
          type="button"
          onClick={onToggleLang}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#1E1510]/88 border border-[#C89232]/70 text-xs font-semibold text-[#F7EFE2] hover:bg-[#2A1E17] transition-colors whitespace-nowrap"
        >
          <Languages className="w-4 h-4 text-[#D99B38]" />
          <span>{lang === 'en' ? 'नेपालीमा हेर्नुहोस् (NE)' : 'English (EN)'}</span>
        </button>

        <button
          type="button"
          onClick={onToggleMute}
          aria-label={muted ? 'Unmute ambient audio' : 'Mute ambient audio'}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#1E1510]/85 border border-[#6E4F37]/60 text-xs font-medium text-[#E7DCCB] hover:bg-[#2A1E17] transition-colors whitespace-nowrap"
        >
          {muted ? (
            <VolumeX className="w-4 h-4 text-[#D99B38]" />
          ) : (
            <Volume2 className="w-4 h-4 text-[#D99B38]" />
          )}
          <span>{muted ? 'Sound Off' : 'Sound On'}</span>
        </button>
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 py-6 sm:py-10 flex flex-col justify-center min-h-[calc(100vh-70px)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <div className="mb-4">
              <svg
                viewBox="0 0 380 112"
                className="w-full max-w-[360px] h-auto"
                role="img"
                aria-label={copy.appTitle}
              >
                <path
                  d="M12 22 H136 M244 22 H368"
                  stroke="#C89232"
                  strokeWidth="1.2"
                  strokeOpacity="0.65"
                />
                <path
                  d="M156 24 C168 8, 212 8, 224 24"
                  stroke="#C89232"
                  strokeWidth="1.8"
                  fill="none"
                />
                <circle cx="190" cy="12" r="4" fill="#B83A24" stroke="#E5B869" strokeWidth="1.4" />

                <text
                  x="0"
                  y="68"
                  fill="#F7EFE2"
                  fontFamily="Fraunces, Noto Sans Devanagari, Georgia, serif"
                  fontSize={lang === 'ne' ? '38' : '43'}
                  fontWeight="700"
                  letterSpacing="-0.5"
                >
                  {copy.appTitle}
                </text>

                <text
                  x="2"
                  y="95"
                  fill="#D9B782"
                  fontFamily="Plus Jakarta Sans, Noto Sans Devanagari, sans-serif"
                  fontSize="12"
                  fontWeight="600"
                  letterSpacing="1.2"
                >
                  {copy.appTagline}
                </text>
              </svg>
            </div>

            <p className="text-sm sm:text-base leading-relaxed text-[#E3D5C3] max-w-lg text-balance">
              {copy.welcomeDesc(displayName)}
            </p>

            <div className="mt-5">
              <div className="text-xs font-medium text-[#CBB59B] mb-2">
                {copy.adventureMode}
              </div>
              <div className="inline-flex p-1 rounded-xl bg-[#1A120E]/90 border border-[#5A402D] gap-1">
                <button
                  type="button"
                  onClick={() => onChangeMode('guided')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                    explorationMode === 'guided'
                      ? 'bg-[#B83A24] text-[#FAF3E8]'
                      : 'text-[#CBB59B] hover:text-[#F4EDE2]'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>{copy.guidedAdventure}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onChangeMode('free')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                    explorationMode === 'free'
                      ? 'bg-[#B83A24] text-[#FAF3E8]'
                      : 'text-[#CBB59B] hover:text-[#F4EDE2]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{copy.freeExploration}</span>
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onStart}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#B83A24] hover:bg-[#9E301D] text-[#FAF3E8] text-sm font-semibold shadow-[0_12px_30px_rgba(184,58,36,0.42)] transition-all duration-150 active:scale-[0.98] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4EDE2]"
              >
                <span>{copy.startAdventure}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onOpenRealWorldMap}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#274B37] hover:bg-[#1E3B2B] border border-[#5D8A6E]/55 text-[#F4EDE2] text-sm font-semibold transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5C178]"
              >
                <MapIcon className="w-4 h-4 text-[#E5C178]" />
                <span>{copy.realWorldMapBtn}</span>
              </button>
            </div>

            <p className="mt-5 text-xs text-[#A9937C]">
              {copy.controlsHint}
            </p>
          </div>

          {/* Right Column: Customize Explorer (Y/N) Panel */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-[#1A120E]/92 border border-[#6E4F37]/75 p-5 shadow-2xl space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-[#2B1D15] border border-[#C89232]/70 flex items-center justify-center shrink-0">
                  <CharacterSprite persona={persona} theme={outfitTheme} size={64} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-[#D9B782]">
                    {copy.customizeExplorer}
                  </div>
                  <label htmlFor="explorer-name-input" className="sr-only">
                    Explorer Name
                  </label>
                  <input
                    id="explorer-name-input"
                    type="text"
                    maxLength={18}
                    value={characterName}
                    onChange={(e) => onChangeName(e.target.value)}
                    placeholder={copy.namePlaceholder}
                    className="mt-1.5 w-full px-3 py-1.5 rounded-lg bg-[#120D0A] border border-[#5C422E] text-sm font-semibold text-[#F7EFE2] placeholder:text-[#8E7A65] focus:outline-none focus:border-[#D99B38]"
                  />
                </div>
              </div>

              <div>
                <div className="text-xs font-medium text-[#CBB59B] mb-1.5">
                  {copy.explorerStyle}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'aarav' as CharacterPersona, label: copy.styleOneLabel, desc: copy.aaravDesc },
                    { id: 'lujana' as CharacterPersona, label: copy.styleTwoLabel, desc: copy.lujanaDesc },
                  ].map((opt) => {
                    const active = persona === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => onChangePersona(opt.id)}
                        className={`px-3 py-2 rounded-xl border text-left transition-colors ${
                          active
                            ? 'bg-[#2C1E16] border-[#D99B38]'
                            : 'bg-[#140E0A] border-[#4A3526] hover:border-[#7D5C42]'
                        }`}
                      >
                        <div className="text-xs font-semibold text-[#F7EFE2]">{opt.label}</div>
                        <div className="text-[11px] text-[#B8A592]">{opt.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-xs font-medium text-[#CBB59B] mb-1.5">
                  {copy.tunicColour} · <span className="text-[#E5B869]">{outfitTheme.name}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {OUTFIT_THEMES.map((theme) => {
                    const active = outfitTheme.id === theme.id;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => onChangeTheme(theme)}
                        aria-label={theme.name}
                        className={`h-9 rounded-lg border-2 flex items-center justify-center transition-transform ${
                          active
                            ? 'border-[#F7E6C4] scale-105'
                            : 'border-[#4A3526] hover:scale-105'
                        }`}
                        style={{ backgroundColor: theme.tunic }}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-[#120D0A]/60"
                          style={{ backgroundColor: theme.shawl }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
