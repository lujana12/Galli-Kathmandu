export type Language = 'en' | 'ne';

export const UI_COPY: Record<
  Language,
  {
    appTitle: string;
    appTagline: string;
    welcomeDesc: (name: string) => string;
    adventureMode: string;
    guidedAdventure: string;
    freeExploration: string;
    startAdventure: string;
    realWorldMapBtn: string;
    customizeExplorer: string;
    explorerStyle: string;
    aaravDesc: string;
    lujanaDesc: string;
    tunicColour: string;
    controlsHint: string;
    discoveredCount: (found: number, total: number) => string;
    discoveriesBtn: string;
    guidedModeLabel: string;
    freeModeLabel: string;
    nextTrailStop: string;
    currentLocationLabel: (name: string) => string;
    heritageDiscoveredBadge: string;
    discoveredStatus: string;
    unvisitedStatus: string;
    walkHere: string;
    continueExploring: string;
    navigateOnRealMap: string;
    alsoInArea: string;
    mainGpsComplex: string;
    viewBtn: string;
    backToGame: string;
    proposedRoute: string;
    useMyGps: string;
    locatingGps: string;
    refreshGps: string;
    setStartOnMap: string;
    clickMapToPlaceStart: string;
    exploreInfo: string;
    startNavigation: string;
    stopNavigation: string;
    calculatingRoute: string;
    gpsStopLabel: (order: number) => string;
    arrivedMsg: (name: string) => string;
    rerouteMsg: string;
    helpTitle: string;
    helpMove: string;
    helpDiscover: string;
    helpRealWorld: string;
    helpRouteRule: string;
    backToAdventure: string;
    journalTitle: (name: string) => string;
    journalSubtitle: (found: number, total: number) => string;
    resumeAdventure: string;
    restartAdventure: string;
    walkHereInGame: string;
    lockedText: string;
    trailComplete: string;
    allDiscoveredTitle: (total: number) => string;
    allDiscoveredBody: (name: string) => string;
    openRealWorldMap: string;
    playAgain: string;
    exitSiddhiSign: string;
    gpsDeniedMsg: string;
    gpsUnavailableMsg: string;
    useSorakhutteStart: string;
    namePlaceholder: string;
    styleOneLabel: string;
    styleTwoLabel: string;
    navigateToSiteGps: (siteName: string) => string;
  }
> = {
  en: {
    appTitle: 'Kathmandu Galli',
    appTagline: 'WARD 16 · HERITAGE ADVENTURE & REAL-WORLD GPS',
    welcomeDesc: (name) =>
      `Explore the historic alleys of Kathmandu Ward 16 as ${name}—discover six living heritage shrines from Siddhi Ganesh to Balaju 22 Dhara, then navigate to the real shrines on foot with live GPS.`,
    adventureMode: 'Adventure Mode',
    guidedAdventure: 'Guided Adventure',
    freeExploration: 'Free Exploration',
    startAdventure: 'Start Adventure',
    realWorldMapBtn: 'Real-World GPS Map',
    customizeExplorer: 'Customize Explorer',
    explorerStyle: 'Explorer Style',
    aaravDesc: 'Dhaka Topi & Satchel',
    lujanaDesc: 'Braided Hair & Shawl',
    tunicColour: 'Tunic & Shawl Colour',
    controlsHint:
      'WASD / Arrows / Joystick or Click Path to Walk · Step Into Glowing Rings to Discover · J Journal · M Sound',
    discoveredCount: (found, total) => `${found}/${total} Discovered`,
    discoveriesBtn: 'Discoveries',
    guidedModeLabel: 'Guided Mode',
    freeModeLabel: 'Free Mode',
    nextTrailStop: 'Next Stop',
    currentLocationLabel: (name) => `${name} · Current Path`,
    heritageDiscoveredBadge: 'Heritage Discovered!',
    discoveredStatus: 'Discovered',
    unvisitedStatus: 'Unvisited',
    walkHere: 'Walk Here',
    continueExploring: 'Continue Exploring',
    navigateOnRealMap: 'Navigate in Real World',
    alsoInArea: 'Also in this area',
    mainGpsComplex: 'Main GPS Complex',
    viewBtn: 'View →',
    backToGame: 'Back to Adventure Game',
    proposedRoute: 'Proposed Ward 16 Route:',
    useMyGps: 'Use My GPS',
    locatingGps: 'Locating GPS...',
    refreshGps: 'Refresh GPS',
    setStartOnMap: 'Set Start on Map',
    clickMapToPlaceStart: 'Click Map to Place Start',
    exploreInfo: 'Explore Information',
    startNavigation: 'Start Navigation',
    stopNavigation: 'Stop Navigation',
    calculatingRoute: 'Calculating Route...',
    gpsStopLabel: (order) => `GPS Stop 0${order} of 04`,
    arrivedMsg: (name) => `You have arrived at ${name}!`,
    rerouteMsg: 'Off-route detected · Recalculating pedestrian path...',
    helpTitle: 'How to Play Kathmandu Galli',
    helpMove:
      'Move Explorer: Use WASD or Arrow Keys, drag the on-screen Joystick, or click any path/shrine on the map.',
    helpDiscover:
      '6 Heritage Discoveries: Step into each glowing courtyard ring to unlock real photographs and research stories.',
    helpRouteRule:
      'Alley Route: Climb from Siddhi Ganesh to Koncha Dyo, then return down to Siddhi Ganesh to walk east to Mhepi Ajima before ascending to Nanak Math.',
    helpRealWorld:
      '4 Real-World GPS Destinations: Switch to Real-World Map anytime—or straight from any discovered site card—for live OpenStreetMap pedestrian navigation.',
    backToAdventure: 'Back to Adventure',
    journalTitle: (name) => `${name}’s Heritage Discoveries`,
    journalSubtitle: (found, total) => `${found}/${total} Ward 16 Heritage Entries Discovered`,
    resumeAdventure: 'Resume Adventure',
    restartAdventure: 'Restart Adventure',
    walkHereInGame: 'Walk Here in Game',
    lockedText: 'Walk through the Newari stone alleys and staircases to discover this shrine.',
    trailComplete: 'Ward 16 Heritage Trail Complete',
    allDiscoveredTitle: (total) => `All ${total} Heritage Sites Discovered!`,
    allDiscoveredBody: (name) =>
      `${name} has explored Siddhi Ganesh, Koncha Dyo, Mhepi Ajima, Nanak Math, Balaju 22 Dhara, and Pyatho Ajima (Sitalamai). Ready to walk the real Ward 16 route?`,
    openRealWorldMap: 'Navigate Real-World Map',
    playAgain: 'Play Again',
    exitSiddhiSign: 'Exit Siddhi Ganesh → Main Galli',
    gpsDeniedMsg:
      'Location permission was denied. Click anywhere on the map or choose "Set Start on Map" to pick a starting point manually.',
    gpsUnavailableMsg:
      'Unable to acquire live GPS signal. Click anywhere on the map to set a manual starting point.',
    useSorakhutteStart: 'Use Sorakhutte Chowk as manual start',
    namePlaceholder: 'Enter your name (Y/N)',
    styleOneLabel: 'Style 1',
    styleTwoLabel: 'Style 2',
    navigateToSiteGps: (siteName) => `Navigate to ${siteName} (GPS)`,
  },
  ne: {
    appTitle: 'काठमाडौं गल्ली',
    appTagline: 'वडा १६ · सम्पदा यात्रा र वास्तविक जीपीएस नेभिगेसन',
    welcomeDesc: (name) =>
      `${name} सँग काठमाडौं वडा १६ का ऐतिहासिक गल्लीहरू घुम्नुहोस्—सिद्धि गणेशदेखि बालाजु २२ धारासम्म ६ वटा जीवित सम्पदा पत्ता लगाउनुहोस् र वास्तविक नक्सामा पैदल यात्रा गर्नुहोस्।`,
    adventureMode: 'यात्राको मोड',
    guidedAdventure: 'निर्देशित यात्रा',
    freeExploration: 'स्वतन्त्र भ्रमण',
    startAdventure: 'यात्रा सुरु गर्नुहोस्',
    realWorldMapBtn: 'वास्तविक जीपीएस नक्सा',
    customizeExplorer: 'पात्र छनोट गर्नुहोस्',
    explorerStyle: 'यात्रीको रूप',
    aaravDesc: 'ढाका टोपी र झोला',
    lujanaDesc: 'चुल्ठो र खास्टो',
    tunicColour: 'पोसाकको रङ',
    controlsHint:
      'WASD / एरो कि / जोयस्टिक वा बाटोमा क्लिक गरी हिँड्नुहोस् · चम्किलो घेराभित्र पस्नुहोस् · J डायरी · M ध्वनि',
    discoveredCount: (found, total) => `${found}/${total} फेला परेको`,
    discoveriesBtn: 'सम्पदा सूची',
    guidedModeLabel: 'निर्देशित मोड',
    freeModeLabel: 'स्वतन्त्र मोड',
    nextTrailStop: 'अर्को गन्तव्य',
    currentLocationLabel: (name) => `${name} · हालको स्थान`,
    heritageDiscoveredBadge: 'सम्पदा फेला पर्‍यो!',
    discoveredStatus: 'खोजिएको',
    unvisitedStatus: 'बाँकी',
    walkHere: 'यहाँ हिँड्नुहोस्',
    continueExploring: 'भ्रमण जारी राख्नुहोस्',
    navigateOnRealMap: 'वास्तविक नक्सामा जानुहोस्',
    alsoInArea: 'यसै क्षेत्रभित्रको सम्पदा',
    mainGpsComplex: 'मुख्य जीपीएस क्षेत्र',
    viewBtn: 'हेर्नुहोस् →',
    backToGame: 'खेलमा फर्कनुहोस्',
    proposedRoute: 'प्रस्तावित वडा १६ मार्ग:',
    useMyGps: 'मेरो जीपीएस प्रयोग गर्नुहोस्',
    locatingGps: 'जीपीएस खोजिँदैछ...',
    refreshGps: 'जीपीएस ताजा गर्नुहोस्',
    setStartOnMap: 'नक्सामा सुरु स्थान छान्नुहोस्',
    clickMapToPlaceStart: 'सुरु स्थान राख्न नक्सामा क्लिक गर्नुहोस्',
    exploreInfo: 'सम्पदा जानकारी हेर्नुहोस्',
    startNavigation: 'नेभिगेसन सुरु गर्नुहोस्',
    stopNavigation: 'नेभिगेसन रोक्नुहोस्',
    calculatingRoute: 'पैदल बाटो खोजिँदैछ...',
    gpsStopLabel: (order) => `जीपीएस गन्तव्य ०${order} / ०४`,
    arrivedMsg: (name) => `तपाईं ${name} मा आइपुग्नुभयो!`,
    rerouteMsg: 'तपाईं बाटोबाट बाहिर जानुभयो · नयाँ पैदल मार्ग खोजिँदैछ...',
    helpTitle: 'काठमाडौं गल्ली कसरी खेल्ने',
    helpMove:
      'पात्र चलाउन: WASD वा एरो कि थिच्नुहोस्, स्क्रिनको जोयस्टिक तान्नुहोस्, वा बाटो र मन्दिरमा क्लिक गर्नुहोस्।',
    helpDiscover:
      '६ सम्पदा खोज: प्रत्येक चम्किलो घेराभित्र प्रवेश गरी वास्तविक तस्बिर र सांस्कृतिक जानकारी अनलक गर्नुहोस्।',
    helpRouteRule:
      'गल्लीको बाटो: सिद्धि गणेशबाट कोन्चा द्यो चढेपछि पुनः सिद्धि गणेश फर्किएर पूर्वतर्फ म्हेपी अजिमा जानुपर्छ, र त्यहाँबाट मात्र नानक मठ उक्लन मिल्छ।',
    helpRealWorld:
      '४ वास्तविक जीपीएस गन्तव्य: कुनै पनि सम्पदा कार्ड वा माथिको बटनबाट वास्तविक OpenStreetMap पैदल नेभिगेसन खोल्न सकिन्छ।',
    backToAdventure: 'यात्रामा फर्कनुहोस्',
    journalTitle: (name) => `${name} को सम्पदा डायरी`,
    journalSubtitle: (found, total) => `वडा १६ का ${found}/${total} सम्पदा फेला परेका छन्`,
    resumeAdventure: 'यात्रा जारी राख्नुहोस्',
    restartAdventure: 'फेरि सुरु गर्नुहोस्',
    walkHereInGame: 'खेलमा यहाँ जानुहोस्',
    lockedText: 'यो सम्पदा अनलक गर्न नेवारी ढुङ्गे गल्ली र सिँढी हुँदै अगाडि बढ्नुहोस्।',
    trailComplete: 'वडा १६ सम्पदा यात्रा पूरा भयो',
    allDiscoveredTitle: (total) => `सबै ${total} सम्पदा स्थलहरू फेला परे!`,
    allDiscoveredBody: (name) =>
      `${name} ले सिद्धि गणेश, कोन्चा द्यो, म्हेपी अजिमा, नानक मठ, बालाजु २२ धारा र प्याथो अजिमा (शीतलामाई) सबैको भ्रमण पूरा गर्नुभयो। अब वास्तविक वडा १६ मार्गमा हिँड्न चाहनुहुन्छ?`,
    openRealWorldMap: 'वास्तविक जीपीएस नक्सा खोल्नुहोस्',
    playAgain: 'फेरि खेल्नुहोस्',
    exitSiddhiSign: 'सिद्धि गणेश निकास → मुख्य गल्ली',
    gpsDeniedMsg:
      'स्थान अनुमति अस्वीकार गरिएको छ। नक्सामा क्लिक गर्नुहोस् वा "नक्सामा सुरु स्थान छान्नुहोस्" प्रयोग गर्नुहोस्।',
    gpsUnavailableMsg:
      'प्रत्यक्ष जीपीएस सिग्नल प्राप्त भएन। नक्सामा क्लिक गरेर सुरु स्थान छान्नुहोस्।',
    useSorakhutteStart: 'सोह्रखुट्टे चोकलाई सुरु स्थान बनाउनुहोस्',
    namePlaceholder: 'तपाईंको नाम लेख्नुहोस् (Y/N)',
    styleOneLabel: 'शैली १',
    styleTwoLabel: 'शैली २',
    navigateToSiteGps: (siteName) => `${siteName} जीपीएस नेभिगेसन`,
  },
};

export function translateDirectionInstruction(instruction: string, lang: Language): string {
  if (lang === 'en') return instruction;
  const lower = instruction.toLowerCase();
  if (lower.includes('arrive')) return 'तपाईं वडा १६ को सम्पदा गन्तव्यमा आइपुग्नुभयो';
  if (lower.includes('turn sharp left')) return instruction.replace(/turn sharp left/i, 'बायाँ तीव्र मोड लिनुहोस्');
  if (lower.includes('turn slight left') || lower.includes('keep left'))
    return instruction.replace(/(turn slight left|keep left)/i, 'बायाँतर्फ लाग्नुहोस्');
  if (lower.includes('turn left')) return instruction.replace(/turn left/i, 'बायाँ मोड्नुहोस्');
  if (lower.includes('turn sharp right')) return instruction.replace(/turn sharp right/i, 'दायाँ तीव्र मोड लिनुहोस्');
  if (lower.includes('turn slight right') || lower.includes('keep right'))
    return instruction.replace(/(turn slight right|keep right)/i, 'दायाँतर्फ लाग्नुहोस्');
  if (lower.includes('turn right')) return instruction.replace(/turn right/i, 'दायाँ मोड्नुहोस्');
  if (lower.includes('start walking')) return instruction.replace(/start walking/i, 'पैदल यात्रा सुरु गर्नुहोस्');
  if (lower.includes('continue')) return instruction.replace(/continue/i, 'सिधा अगाडि बढ्नुहोस्');
  return instruction;
}
