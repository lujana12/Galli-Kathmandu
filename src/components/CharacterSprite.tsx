import React from 'react';

export type CharacterPersona = 'aarav' | 'lujana';

export interface OutfitColorTheme {
  id: string;
  name: string;
  tunic: string;
  shawl: string;
  accent: string;
}

export const OUTFIT_THEMES: OutfitColorTheme[] = [
  { id: 'vermilion', name: 'Temple Vermilion', tunic: '#9E3122', shawl: '#E5B869', accent: '#8D2C1D' },
  { id: 'saffron', name: 'Marigold Ochre', tunic: '#B86B19', shawl: '#F4E3BC', accent: '#8C4E10' },
  { id: 'pine', name: 'Nagarjun Pine', tunic: '#2E5E40', shawl: '#E4C27D', accent: '#1F442D' },
  { id: 'indigo', name: 'Dusk Indigo', tunic: '#2C4673', shawl: '#E8C589', accent: '#1E3254' },
];

interface CharacterSpriteProps {
  persona: CharacterPersona;
  theme: OutfitColorTheme;
  size?: number;
  className?: string;
}

export const CharacterSprite: React.FC<CharacterSpriteProps> = ({
  persona,
  theme,
  size = 52,
  className = '',
}) => {
  const isLujana = persona === 'lujana';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={`${persona} character sprite`}
    >
      {/* Contact shadow */}
      <ellipse cx="25" cy="46" rx="14" ry="6" fill="#0F0906" fillOpacity="0.48" />
      {/* Boots */}
      <ellipse cx="20" cy="43" rx="3.5" ry="2.6" fill="#2A1B14" />
      <ellipse cx="30" cy="43" rx="3.5" ry="2.6" fill="#2A1B14" />

      {/* Traditional tunic / coat */}
      <path
        d="M14 39 C15 28, 19 24, 25 24 C31 24, 35 28, 36 39 Z"
        fill={theme.tunic}
        stroke="#1C110C"
        strokeWidth="1.5"
      />
      {/* Woven shawl & explorer satchel */}
      <path d="M17 26 Q25 32 33 26" stroke={theme.shawl} strokeWidth="3.2" strokeLinecap="round" />
      <path d="M18 26 L32 37" stroke="#5E3921" strokeWidth="2.4" strokeLinecap="round" />
      <rect x="30" y="33" width="6" height="6" rx="1.5" fill="#7A4C2C" stroke="#1C110C" strokeWidth="1" />

      {/* Head */}
      <circle cx="25" cy="18" r="9.5" fill="#DFAA7E" stroke="#1C110C" strokeWidth="1.5" />

      {/* Hair */}
      <path
        d="M15.5 17 C15.5 10.5, 20.5 7.5, 25 7.5 C29.5 7.5, 34.5 10.5, 34.5 17 C32.5 13.5, 29 12, 25 12 C21 12, 17.5 13.5, 15.5 17 Z"
        fill="#1E1714"
      />
      {isLujana && <circle cx="15.5" cy="21" r="2.6" fill="#1E1714" />}

      {/* Dhaka Topi */}
      <path
        d="M17 12.5 L18.5 6.5 C22 5.2, 28 5.2, 31.5 6.5 L33 12.5 C29 11.2, 21 11.2, 17 12.5 Z"
        fill={theme.accent}
        stroke="#1C110C"
        strokeWidth="1.3"
      />
      <path d="M19 9.5 L22 7.8 L25 9.5 L28 7.8 L31 9.5" stroke="#F0CA7B" strokeWidth="1.1" />

      {/* Eyes & smile */}
      <circle cx="22" cy="18.5" r="1.15" fill="#1C110C" />
      <circle cx="28" cy="18.5" r="1.15" fill="#1C110C" />
      <path d="M23 22.2 Q25 23.6 27 22.2" stroke="#6E3B27" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
};
