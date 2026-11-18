/**
 * Kathmandu Galli — Ward 16 Heritage Data, Walkable Map Zones & 4 Main GPS Destinations
 *
 * Walkable topology rule:
 *   Siddhi Ganesh <-> Koncha Dyo (sideways stairs up; must return to Siddhi Ganesh to proceed east)
 *   Siddhi Ganesh <-> Mhepi Ajima (main brick galli)
 *   Mhepi Ajima <-> Nanak Math (sideways ridge stairs up; only reachable via Mhepi Ajima)
 *   Mhepi Ajima <-> Balaju 22 Dhara <-> Pyatho Ajima (Sitalamai)
 */

export const IMAGE_BASE_PATH = '/images';
export const PHOTO_BASE_PATH = '/images/photos';

export const WORLD_WIDTH = 2520;
export const WORLD_HEIGHT = 1360;

export const WALKABLE_ZONES = [
  // 1. Siddhi Ganesh Courtyard (Starting Bahal)
  { id: 'zone-siddhi', x: 150, y: 780, w: 360, h: 300, kind: 'courtyard' },

  // Sideways Staircase & Upper Terrace: Siddhi Ganesh -> Koncha Dyo (isolated from Nanak Math)
  { id: 'stairs-koncha-lower', x: 350, y: 585, w: 115, h: 245, kind: 'stairs' },
  { id: 'alley-koncha-landing', x: 350, y: 560, w: 230, h: 105, kind: 'alley' },
  { id: 'stairs-koncha-upper', x: 465, y: 425, w: 115, h: 195, kind: 'stairs' },
  // 2. Koncha Dyo Upper Side Courtyard (x: 385..655 — separated by 155px brick barrier from Nanak Math!)
  { id: 'zone-koncha', x: 385, y: 245, w: 270, h: 240, kind: 'courtyard' },

  // Main Brick Galli: Exit Siddhi Ganesh -> Mhepi Ajima (eastward)
  { id: 'alley-siddhi-mhepi', x: 460, y: 875, w: 560, h: 120, kind: 'alley' },
  // 3. Mhepi Ajima Hilltop Courtyard
  { id: 'zone-mhepi', x: 960, y: 760, w: 350, h: 320, kind: 'courtyard' },

  // Sideways Terraced Ridge Stairs: Mhepi Ajima -> Nanak Math (only reachable from Mhepi Ajima)
  { id: 'stairs-nanak-lower', x: 1045, y: 585, w: 115, h: 230, kind: 'stairs' },
  { id: 'alley-nanak-ridge', x: 890, y: 560, w: 270, h: 105, kind: 'alley' },
  { id: 'stairs-nanak-upper', x: 890, y: 420, w: 115, h: 195, kind: 'stairs' },
  // 4. Nanak Math Elevated Courtyard (x: 810..1115 — cleanly separated from Koncha Dyo!)
  { id: 'zone-nanak-math', x: 810, y: 245, w: 305, h: 240, kind: 'courtyard' },

  // Stone Path: Mhepi Ajima -> Balaju 22 Dhara (eastward)
  { id: 'alley-mhepi-balaju', x: 1250, y: 875, w: 450, h: 120, kind: 'alley' },
  // 5. Balaju 22 Dhara Water Garden Walk
  { id: 'zone-balaju', x: 1640, y: 760, w: 400, h: 320, kind: 'courtyard' },

  // Grove Path: Balaju 22 Dhara -> Pyatho Ajima (Sitalamai)
  { id: 'alley-balaju-sitala', x: 1980, y: 810, w: 200, h: 160, kind: 'alley' },
  // 6. Pyatho Ajima – Sitalamai Grove Sanctum
  { id: 'zone-sitala', x: 2110, y: 700, w: 290, h: 320, kind: 'courtyard' },
];

export const LOCATIONS = [
  {
    id: 'siddhi-ganesh',
    order: 1,
    name: 'Siddhi Ganesh Temple – Sorakhutte',
    nameNe: 'सिद्धि गणेश मन्दिर – सोह्रखुट्टे',
    shortName: 'Siddhi Ganesh',
    shortNameNe: 'सिद्धि गणेश',
    newariName: 'सिद्धि गणेश',
    subtitle: 'A shrine of faith and new beginnings',
    subtitleNe: 'आस्था र शुभ सुरुवातको मन्दिर',
    district: 'Ward 16 · Sorakhutte Courtyard',
    districtNe: 'वडा १६ · सोह्रखुट्टे चोक',
    imageFile: 'siddhi-ganesh.jpg',
    photoFile: 'siddhi-ganesh-photo.jpg',
    description:
      'Dedicated to Lord Ganesha, this neighbourhood shrine is a place where devotees seek blessings for wisdom, prosperity and the removal of obstacles. It remains part of the everyday religious life of the area.',
    descriptionNe:
      'भगवान् गणेशलाई समर्पित यो टोलको मन्दिरमा भक्तजनहरूले बुद्धि, समृद्धि र विघ्नबाधा निवारणको कामना गर्दै पूजाआजा गर्छन्। यो स्थान स्थानीय दैनिक धार्मिक जीवनको अभिन्न अङ्ग बनेको छ।',
    researchNote: 'Primary GPS area also includes the nearby shrine of Koncha Dyo.',
    researchNoteNe: 'यो मुख्य जीपीएस क्षेत्रभित्र नजिकैको कोन्चा द्यो पनि पर्दछ।',
    guidedHint: 'Step into Siddhi Ganesh courtyard to begin, or climb sideways stairs to Koncha Dyo.',
    guidedHintNe: 'सुरु गर्न सिद्धि गणेश परिसरमा जानुहोस्, वा सिँढी हुँदै कोन्चा द्यो चढ्नुहोस्।',
    gpsDestinationId: 'gps-siddhi-ganesh',
    companionId: 'koncha-dyo',
    worldPos: { x: 320, y: 925 },
    checkpointRadius: 74,
    mapCoords: { x: 64, y: 175 },
    neighbors: ['koncha-dyo', 'mhepi-ajima'],
  },
  {
    id: 'koncha-dyo',
    order: 2,
    name: 'Koncha Dyo',
    nameNe: 'कोन्चा द्यो',
    shortName: 'Koncha Dyo',
    shortNameNe: 'कोन्चा द्यो',
    newariName: 'कोन्चा द्यो',
    subtitle: 'A tradition linked with prosperity and married life',
    subtitleNe: 'समृद्धि र वैवाहिक जीवनसँग जोडिएको परम्परा',
    district: 'Ward 16 · Siddhi Ganesh Area',
    districtNe: 'वडा १६ · सिद्धि गणेश क्षेत्र',
    imageFile: 'koncha-dyo.jpg',
    photoFile: 'koncha-dyo-photo.jpg',
    description:
      "According to the local account shared for this report, an offering of alcohol is kept at the shrine and is believed to ensure that a household's prosperity never runs empty. The site is also said to hold special significance for married couples.",
    descriptionNe:
      'स्थानीय जनविश्वासअनुसार यहाँ मदिरा चढाउनाले घरपरिवारको समृद्धि कहिल्यै रित्तिँदैन भन्ने मान्यता छ। विवाहित जोडीहरूका लागि पनि यस स्थानको विशेष धार्मिक महत्व रहेको बताइन्छ।',
    researchNote:
      'These beliefs make local oral history important to understanding Koncha Dyo. Return down to Siddhi Ganesh to continue toward Mhepi Ajima.',
    researchNoteNe:
      'स्थानीय मौखिक इतिहासले कोन्चा द्योको महत्व झल्काउँछ। म्हेपी अजिमा जान सिँढीबाट सिद्धि गणेश फर्कनुहोस्।',
    guidedHint: 'Climb the sideways stairs from Siddhi Ganesh to discover Koncha Dyo.',
    guidedHintNe: 'कोन्चा द्यो हेर्न सिद्धि गणेशबाट सिँढी हुँदै माथि जानुहोस्।',
    gpsDestinationId: 'gps-siddhi-ganesh',
    parentAreaId: 'siddhi-ganesh',
    worldPos: { x: 520, y: 365 },
    checkpointRadius: 74,
    mapCoords: { x: 104, y: 56 },
    neighbors: ['siddhi-ganesh'],
  },
  {
    id: 'mhepi-ajima',
    order: 3,
    name: 'Mhepi Ajima – Mhepi Mandir',
    nameNe: 'म्हेपी अजिमा – म्हेपी मन्दिर',
    shortName: 'Mhepi Ajima',
    shortNameNe: 'म्हेपी अजिमा',
    newariName: 'म्हेपी अजिमा',
    subtitle: 'A sacred hill where traditions meet',
    subtitleNe: 'परम्पराहरूको संगम भएको पवित्र थुम्को',
    district: 'Ward 16 · Mhepi Hilltop',
    districtNe: 'वडा १६ · म्हेपी थुम्को',
    imageFile: 'mhepi-ajima.jpg',
    photoFile: 'mhepi-ajima-photo.jpg',
    description:
      'This hilltop goddess shrine reflects the close relationship between Hindu and Buddhist traditions in Newar religious life. Its annual khat jatra keeps neighbourhood ties and ritual customs alive.',
    descriptionNe:
      'थुम्कोमा रहेको यो अजिमा मन्दिरले नेवार धार्मिक जीवनमा हिन्दू र बौद्ध परम्पराबीचको घनिष्ठ सम्बन्ध झल्काउँछ। यहाँको वार्षिक खट जात्राले टोलछिमेकको एकता र रीतिरिवाजलाई जीवन्त राखेको छ।',
    researchNote: 'From Mhepi Ajima, climb the ridge stairs to Nanak Math or head east to Balaju.',
    researchNoteNe: 'म्हेपी अजिमाबाट नानक मठ उक्लन वा पूर्वतर्फ बालाजु २२ धारा जान सकिन्छ।',
    guidedHint: 'Return to Siddhi Ganesh, then walk east through the brick galli to Mhepi Ajima.',
    guidedHintNe: 'सिद्धि गणेश फर्किएर पूर्वतर्फको इँटा गल्ली हुँदै म्हेपी अजिमा जानुहोस्।',
    gpsDestinationId: 'gps-mhepi-ajima',
    worldPos: { x: 1135, y: 925 },
    checkpointRadius: 74,
    mapCoords: { x: 224, y: 175 },
    neighbors: ['siddhi-ganesh', 'guru-nanak-math', 'balaju-22-dhara'],
  },
  {
    id: 'guru-nanak-math',
    order: 4,
    name: 'Nanak Math – Balaju',
    nameNe: 'नानक मठ – बालाजु',
    shortName: 'Nanak Math',
    shortNameNe: 'नानक मठ',
    newariName: 'नानक मठ',
    subtitle: 'A living connection to Sikh heritage',
    subtitleNe: 'सिख सम्पदासँगको जीवित सम्बन्ध',
    district: 'Ward 16 · Balaju / Nayabazar Ridge',
    districtNe: 'वडा १६ · बालाजु / नयाँबजार क्षेत्र',
    imageFile: 'guru-nanak-math.jpg',
    photoFile: 'nanak-math-photo.jpg',
    description:
      "Sikh tradition associates this sacred site with Guru Nanak's visit to Nepal. The Math is an important reminder of Kathmandu's religious diversity and the history of Sikh and Udasi devotional traditions.",
    descriptionNe:
      'सिख परम्पराले यो पवित्र स्थललाई गुरु नानकको नेपाल भ्रमणसँग जोड्दछ। यो मठ काठमाडौंको धार्मिक विविधता र सिख तथा उदासी भक्ति परम्पराको महत्वपूर्ण प्रमाण हो।',
    researchNote: 'Only reachable via the terraced ridge stairs from Mhepi Ajima.',
    researchNoteNe: 'यो मठमा म्हेपी अजिमाबाट मात्र सिँढी उक्लिएर पुग्न सकिन्छ।',
    guidedHint: 'From Mhepi Ajima, ascend the sideways ridge stairs to Nanak Math.',
    guidedHintNe: 'म्हेपी अजिमाबाट सिँढी उक्लिएर नानक मठ पुग्नुहोस्।',
    gpsDestinationId: 'gps-nanak-math',
    worldPos: { x: 945, y: 365 },
    checkpointRadius: 74,
    mapCoords: { x: 184, y: 56 },
    neighbors: ['mhepi-ajima'],
  },
  {
    id: 'balaju-22-dhara',
    order: 5,
    name: 'Balaju 22 Dhara – Baisdhara',
    nameNe: 'बालाजु २२ धारा – बाइसधारा',
    shortName: 'Balaju 22 Dhara',
    shortNameNe: 'बालाजु २२ धारा',
    newariName: 'बाइस धारा · बालाजु',
    subtitle: 'Where water, history and devotion come together',
    subtitleNe: 'पानी, इतिहास र आस्थाको संगम',
    district: 'Ward 16 · Baisdhara Complex',
    districtNe: 'वडा १६ · बाइसधारा परिसर',
    imageFile: 'balaju-22-dhara.jpg',
    photoFile: 'balaju-22-dhara-photo.jpg',
    description:
      'The 22 traditional stone spouts are commonly associated with the late Malla and early Shah periods. Their water heritage and the annual Baisdhara Mela make this a landmark of traditional engineering and living pilgrimage.',
    descriptionNe:
      'यी २२ वटा परम्परागत ढुङ्गेधाराहरू उत्तर मल्ल र प्रारम्भिक शाह कालसँग सम्बन्धित मानिन्छन्। यहाँको जल सम्पदा र वार्षिक बाइसधारा मेलाले यसलाई परम्परागत इन्जिनियरिङ र जीवित तीर्थस्थल बनाएको छ।',
    researchNote: 'Primary GPS complex also encompasses Pyatho Ajima – Sitalamai.',
    researchNoteNe: 'यसै बाइसधारा परिसरभित्र प्याथो अजिमा (शीतलामाई) मन्दिर पनि रहेको छ।',
    guidedHint: 'Head down from Nanak Math to Mhepi Ajima, then walk east to Balaju 22 Dhara.',
    guidedHintNe: 'नानक मठबाट म्हेपी अजिमा झरेर पूर्वतर्फ बालाजु २२ धारा जानुहोस्।',
    gpsDestinationId: 'gps-balaju-22-dhara',
    companionId: 'sitala-ajima',
    worldPos: { x: 1840, y: 925 },
    checkpointRadius: 78,
    mapCoords: { x: 356, y: 175 },
    neighbors: ['mhepi-ajima', 'sitala-ajima'],
  },
  {
    id: 'sitala-ajima',
    order: 6,
    name: 'Pyatho Ajima – Sitalamai',
    nameNe: 'प्याथो अजिमा – शीतलामाई',
    shortName: 'Pyatho Ajima',
    shortNameNe: 'प्याथो अजिमा',
    newariName: 'प्याथो अजिमा · शीतलामाई',
    subtitle: 'A mother goddess associated with protection',
    subtitleNe: 'संरक्षणसँग जोडिएकी मातृदेवी',
    district: 'Ward 16 · Baisdhara Complex',
    districtNe: 'वडा १६ · बाइसधारा परिसर',
    imageFile: 'sitala-ajima.jpg',
    photoFile: 'sitalamai-photo.jpg',
    description:
      'Located within the Baisdhara complex, Sitalamai is worshipped in Newar tradition for the well-being and protection of children. The shrine becomes especially significant during the annual Baisdhara Mela.',
    descriptionNe:
      'बाइसधारा परिसरभित्र रहेको शीतलामाई मन्दिरमा नेवार परम्पराअनुसार बालबालिकाको सुस्वास्थ्य र रक्षाको लागि पूजा गरिन्छ। वार्षिक बाइसधारा मेलाको समयमा यहाँ विशेष भीड लाग्छ।',
    researchNote: 'Located inside the Baisdhara complex; shares the Balaju 22 Dhara GPS destination.',
    researchNoteNe: 'बाइसधारा परिसरभित्रै रहेकोले यसको जीपीएस गन्तव्य बालाजु २२ धारा नै हो।',
    guidedHint: 'Step into the sacred grove right next to Balaju 22 Dhara to visit Pyatho Ajima.',
    guidedHintNe: 'बालाजु २२ धाराको छेवैको बगैंचामा रहेको प्याथो अजिमा (शीतलामाई) जानुहोस्।',
    gpsDestinationId: 'gps-balaju-22-dhara',
    parentAreaId: 'balaju-22-dhara',
    worldPos: { x: 2255, y: 860 },
    checkpointRadius: 74,
    mapCoords: { x: 434, y: 160 },
    neighbors: ['balaju-22-dhara'],
  },
];

export const GPS_DESTINATIONS = [
  {
    id: 'gps-siddhi-ganesh',
    routeOrder: 1,
    name: 'Siddhi Ganesh Temple – Sorakhutte',
    nameNe: 'सिद्धि गणेश मन्दिर – सोह्रखुट्टे',
    shortName: 'Siddhi Ganesh',
    shortNameNe: 'सिद्धि गणेश',
    address: 'Naya Bazaar Marg, Sorakhutte, Ward 16, Kathmandu',
    addressNe: 'नयाँबजार मार्ग, सोह्रखुट्टे, वडा १६, काठमाडौं',
    lat: 27.7188696,
    lng: 85.3104511,
    photoFile: 'siddhi-ganesh-photo.jpg',
    shortDescription:
      'Neighbourhood Ganesha shrine at Sorakhutte marking the start of the Ward 16 trail. Koncha Dyo is discovered nearby within this area.',
    shortDescriptionNe:
      'वडा १६ यात्राको सुरुवाती विन्दु सोह्रखुट्टेस्थित सिद्धि गणेश मन्दिर। कोन्चा द्यो पनि यसै क्षेत्रभित्र पर्दछ।',
    heritageIds: ['siddhi-ganesh', 'koncha-dyo'],
  },
  {
    id: 'gps-mhepi-ajima',
    routeOrder: 2,
    name: 'Mhepi Ajima – Mhepi Mandir',
    nameNe: 'म्हेपी अजिमा – म्हेपी मन्दिर',
    shortName: 'Mhepi Ajima',
    shortNameNe: 'म्हेपी अजिमा',
    address: 'Mhepi Marg, Ward 16, Kathmandu',
    addressNe: 'म्हेपी मार्ग, वडा १६, काठमाडौं',
    lat: 27.7274733,
    lng: 85.3085223,
    photoFile: 'mhepi-ajima-photo.jpg',
    shortDescription:
      'Sacred hilltop mother-goddess temple reflecting Newar Hindu and Buddhist traditions and the annual khat jatra.',
    shortDescriptionNe:
      'हिन्दू र बौद्ध नेवार परम्पराको संगम तथा वार्षिक खट जात्रा हुने पवित्र म्हेपी अजिमा मन्दिर।',
    heritageIds: ['mhepi-ajima'],
  },
  {
    id: 'gps-balaju-22-dhara',
    routeOrder: 3,
    name: 'Balaju 22 Dhara – Baisdhara',
    nameNe: 'बालाजु २२ धारा – बाइसधारा',
    shortName: 'Balaju 22 Dhara',
    shortNameNe: 'बालाजु २२ धारा',
    address: 'Baisdhara Park, Balaju, Ward 16, Kathmandu',
    addressNe: 'बाइसधारा उद्यान, बालाजु, वडा १६, काठमाडौं',
    lat: 27.7338701,
    lng: 85.3022279,
    photoFile: 'balaju-22-dhara-photo.jpg',
    shortDescription:
      'Historic 22 stone spouts from the late Malla and early Shah periods. Pyatho Ajima (Sitalamai) rests within this complex.',
    shortDescriptionNe:
      'ऐतिहासिक २२ ढुङ्गेधारा र बाइसधारा मेला लाग्ने स्थल। प्याथो अजिमा (शीतलामाई) यसै परिसरभित्र पर्दछ।',
    heritageIds: ['balaju-22-dhara', 'sitala-ajima'],
  },
  {
    id: 'gps-nanak-math',
    routeOrder: 4,
    name: 'Nanak Math – Balaju',
    nameNe: 'नानक मठ – बालाजु',
    shortName: 'Nanak Math',
    shortNameNe: 'नानक मठ',
    address: 'Balaju / Nayabazar Area, Ward 16, Kathmandu',
    addressNe: 'बालाजु / नयाँबजार क्षेत्र, वडा १६, काठमाडौं',
    lat: 27.7257958,
    lng: 85.306675,
    photoFile: 'nanak-math-photo.jpg',
    shortDescription:
      'Historic Sikh and Udasi heritage sanctuary commemorating Guru Nanak Dev’s visit to Nepal.',
    shortDescriptionNe:
      'गुरु नानक देवको नेपाल भ्रमणसँग सम्बन्धित ऐतिहासिक सिख तथा उदासी आस्थाको पवित्र स्थल।',
    heritageIds: ['guru-nanak-math'],
  },
];

export const STARTING_LOCATION_ID = 'siddhi-ganesh';
export const EXIT_SIDDHI_POS = { x: 470, y: 935 };
