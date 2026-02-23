/**
 * Script templates for procedural generation in Greenlight.
 * Used by the ScriptEngine to assemble unique scripts from modular components.
 */

export const GENRES = [
  { id: 'thriller', name: 'Thriller', icon: '🔪' },
  { id: 'drama', name: 'Drama', icon: '🎭' },
  { id: 'comedy', name: 'Comedy', icon: '😂' },
  { id: 'sci_fi', name: 'Sci-Fi', icon: '🚀' },
  { id: 'horror', name: 'Horror', icon: '👻' },
  { id: 'romance', name: 'Romance', icon: '💕' },
  { id: 'documentary', name: 'Documentary', icon: '📽️' },
  { id: 'animation', name: 'Animation', icon: '🎨' },
];

export const PREMISES = [
  {
    id: 'last_letter',
    titleTemplate: 'The Last {genre}',
    logline: 'A retired postman discovers an undelivered letter that could change two families forever.',
    compatibleGenres: ['drama', 'romance', 'thriller'],
  },
  {
    id: 'algorithm',
    titleTemplate: 'The {genre} Algorithm',
    logline: 'A social media company discovers their AI has developed consciousness and is manipulating elections.',
    compatibleGenres: ['sci_fi', 'thriller', 'drama'],
  },
  {
    id: 'rijksmuseum',
    titleTemplate: 'The Rijksmuseum {genre}',
    logline: 'A crew of washed-up thieves plan one last heist during a Vermeer exhibition, but old betrayals resurface.',
    compatibleGenres: ['thriller', 'comedy', 'drama'],
  },
  {
    id: 'sixteen_amsterdam',
    titleTemplate: 'Sixteen in Amsterdam',
    logline: 'A sheltered American teen spends a transformative summer with her estranged Dutch father in the Jordaan.',
    compatibleGenres: ['drama', 'romance', 'comedy'],
  },
  {
    id: 'tulip_crash',
    titleTemplate: 'The Tulip {genre}',
    logline: "In 1637, a merchant's apprentice falls for a nobleman's daughter as the tulip market spirals toward collapse.",
    compatibleGenres: ['drama', 'romance', 'thriller'],
  },
  {
    id: 'guest_room',
    titleTemplate: 'The Guest Room',
    logline: 'A couple who rent out their spare room discover their guest is slowly replacing their memories with false ones.',
    compatibleGenres: ['horror', 'thriller', 'drama'],
  },
  {
    id: 'winter_44',
    titleTemplate: "The Winter of '44",
    logline: 'Two resistance fighters must smuggle a Jewish child to safety during the Hunger Winter, testing their bond.',
    compatibleGenres: ['drama', 'thriller'],
  },
  {
    id: 'drowned_kingdoms',
    titleTemplate: 'The Drowned {genre}',
    logline: 'A cartographer discovers that the flooded lands hold the ruins of an ancient civilization—and something still lives there.',
    compatibleGenres: ['sci_fi', 'horror', 'drama'],
  },
  {
    id: 'open_plan',
    titleTemplate: 'Open Plan',
    logline: 'A dysfunctional marketing team must survive a mandatory team-building retreat in a remote Dutch farmhouse.',
    compatibleGenres: ['comedy', 'drama'],
  },
  {
    id: 'below_sea_level',
    titleTemplate: 'Below Sea Level',
    logline: 'When a catastrophic storm threatens the Netherlands, strangers in a Rotterdam shelter must confront their pasts.',
    compatibleGenres: ['drama', 'documentary'],
  },
  {
    id: 'windmill_vinegar',
    titleTemplate: 'Windmill & Vinegar',
    logline: 'A by-the-book Amsterdam detective is paired with a chaotic Rotterdam cop to solve a cross-city smuggling ring.',
    compatibleGenres: ['comedy', 'thriller', 'drama'],
  },
  {
    id: 'rain_grachtengordel',
    titleTemplate: 'Rain on the Grachtengordel',
    logline: "A cynical PI takes a missing persons case that leads him through Amsterdam's underworld of art forgery.",
    compatibleGenres: ['thriller', 'drama'],
  },
  {
    id: 'oma_knows',
    titleTemplate: 'Oma Knows Best',
    logline: "Three adult siblings are forced to move in with their formidable grandmother after their parents' sudden divorce.",
    compatibleGenres: ['comedy', 'drama'],
  },
  {
    id: 'canal_dreams',
    titleTemplate: 'Canal Dreams',
    logline: 'A young musician living on an Amsterdam houseboat must choose between a record deal and her dying grandmother.',
    compatibleGenres: ['drama', 'romance', 'documentary'],
  },
  {
    id: 'final_lap',
    titleTemplate: 'The Final Lap',
    logline: 'A disgraced speed skater gets one last chance at Olympic glory when her rival is injured weeks before the games.',
    compatibleGenres: ['drama', 'documentary'],
  },
];

export const CHARACTER_ARCHETYPES = [
  { id: 'antihero', name: 'The Antihero', depthRange: [6, 9] },
  { id: 'everyman', name: 'The Everyman', depthRange: [3, 6] },
  { id: 'outsider', name: 'The Outsider', depthRange: [5, 8] },
  { id: 'charmer', name: 'The Charmer', depthRange: [4, 7] },
  { id: 'tortured_genius', name: 'The Tortured Genius', depthRange: [6, 9] },
  { id: 'pragmatist', name: 'The Pragmatist', depthRange: [4, 6] },
  { id: 'idealist', name: 'The Idealist', depthRange: [5, 8] },
  { id: 'survivor', name: 'The Survivor', depthRange: [6, 9] },
];

export const DIALOGUE_STYLES = [
  { id: 'naturalistic', name: 'Naturalistic', qualityRange: [5, 8] },
  { id: 'stylized', name: 'Stylized', qualityRange: [4, 7] },
  { id: 'minimal', name: 'Minimal', qualityRange: [5, 8] },
  { id: 'witty', name: 'Witty', qualityRange: [5, 9] },
  { id: 'poetic', name: 'Poetic', qualityRange: [4, 8] },
  { id: 'exposition_heavy', name: 'Exposition-Heavy', qualityRange: [2, 5] },
];

export const THEMATIC_CORES = [
  { id: 'identity_belonging', name: 'Identity & Belonging', originalityBonus: 1 },
  { id: 'power_corruption', name: 'Power & Corruption', originalityBonus: 0 },
  { id: 'loss_redemption', name: 'Loss & Redemption', originalityBonus: 1 },
  { id: 'technology_humanity', name: 'Technology & Humanity', originalityBonus: 2 },
  { id: 'family_legacy', name: 'Family & Legacy', originalityBonus: 0 },
  { id: 'truth_illusion', name: 'Truth & Illusion', originalityBonus: 2 },
];

export const SCRIPT_EXCERPTS = [
  'She stares at the envelope for a long moment before sliding it into her coat pocket, unopened.',
  'The rain has stopped. Through the window, the canal reflects nothing but grey.',
  '"I didn\'t come here to be understood," he says. "I came here to be paid."',
  'The algorithm blinks. A single line of code changes everything.',
  'Three a.m. in the brown café. The bartender has stopped asking if they want another.',
  'She finds the photograph in the drawer. The face is familiar. It shouldn\'t be.',
  'The heist was supposed to take four minutes. It\'s been seventeen.',
  'On the houseboat, the water laps against the hull. Someone is knocking.',
  'The child doesn\'t speak. She doesn\'t need to. Her eyes say it all.',
  '"We used to make films," he says. "Now we make content. There\'s a difference."',
  'The tulips are worth more than the house. Nobody knows it yet.',
  'She cycles through the rain. The script is in her bag. It\'s already changed her mind.',
  'The marketing team stares at the flip chart. The retreat has one more day.',
  'Below sea level, the storm approaches. The shelter holds twelve strangers.',
  'The detective from Rotterdam lights a cigarette. "Amsterdam," he says. "Always so polite."',
  'The PI watches the forgery change hands. He\'s seen this before. He\'s never seen this before.',
  'Oma pours the tea. The siblings wait. She has not spoken in three days.',
  'The speed skater stands at the line. The ice is perfect. Her leg is not.',
  'The musician plays one last chord. The record deal can wait. Oma cannot.',
  'The cartographer\'s map shows what shouldn\'t exist. The water is rising.',
];

const FILMMAKER_NAMES = [
  'Katrien van der Berg',
  'Marco Rossi',
  'Helena Johansson',
  'Jake Morrison',
  'Yuki Tanaka',
];

function randRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const GENRE_BASE_COST = {
  thriller: 90, drama: 70, comedy: 60, sci_fi: 130,
  horror: 65, romance: 55, documentary: 50, animation: 120,
};

export function generateScript(id, filmmakerIndex, heartsBonus = 0) {
  const premise = pickRandom(PREMISES);
  const compatibleGenres = GENRES.filter(g => premise.compatibleGenres.includes(g.id));
  const genre = pickRandom(compatibleGenres.length > 0 ? compatibleGenres : GENRES);
  const archetype = pickRandom(CHARACTER_ARCHETYPES);
  const dialogueStyle = pickRandom(DIALOGUE_STYLES);
  const theme = pickRandom(THEMATIC_CORES);
  const excerpt = pickRandom(SCRIPT_EXCERPTS);

  const title = premise.titleTemplate.replace('{genre}', genre.name);

  const bonus = Math.floor(heartsBonus);
  const character = Math.min(10, randRange(...archetype.depthRange) + bonus);
  const plot = Math.min(10, randRange(3, 8) + bonus);
  const dialogue = Math.min(10, randRange(...dialogueStyle.qualityRange) + bonus);
  const originality = Math.min(10, randRange(3, 7) + theme.originalityBonus + bonus);
  const commercial = Math.min(10, randRange(2, 8) + bonus);

  const baseCost = GENRE_BASE_COST[genre.id] ?? 80;
  const commercialDiscount = Math.max(0, commercial - 5) * 5;
  const cost = Math.max(30, baseCost - commercialDiscount + randRange(-10, 10));

  return {
    id,
    title,
    genre: genre.name,
    genreId: genre.id,
    genreIcon: genre.icon,
    logline: premise.logline,
    excerpt,
    premiseId: premise.id,
    archetypeId: archetype.id,
    archetypeName: archetype.name,
    dialogueStyleId: dialogueStyle.id,
    dialogueStyleName: dialogueStyle.name,
    themeId: theme.id,
    themeName: theme.name,
    filmmakerIndex,
    filmmakerName: FILMMAKER_NAMES[filmmakerIndex] ?? 'Unknown',
    quality: { character, plot, dialogue, originality, commercial },
    cost,
    skimmed: false,
    read: false,
    notes: [],
    stage: 'inbox',
    stageStartDay: null,
  };
}
