/**
 * Karen Adventures — seed script.
 * Populates journeys, destinations, experiences, testimonials and gallery
 * imagery from curated editorial content + verified Unsplash photography.
 *
 * Run with:  npx prisma db seed
 */
import { PrismaClient } from "@prisma/client";
import { marked } from "marked";

// On Vercel the DB URL arrives as Vercel Postgres vars (POSTGRES_PRISMA_URL /
// POSTGRES_URL_NON_POOLING / POSTGRES_URL) rather than DATABASE_URL. Map them
// onto DATABASE_URL before the client resolves the schema's env("DATABASE_URL").
process.env.DATABASE_URL ||=
  process.env.PRISMA_DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_URL;

/* ---------------------------------------------------------------- images */
// Verified live Unsplash CDN photo IDs (checked 200 OK).
const IMG = {
  lion: "1547471080-7cc2caa01a7e",
  lionClose: "1549366021-9f761d450615",
  lionCubs: "1456926631375-92c8ce872def",
  elephant: "1557050543-4d5f4e07ef46",
  elephantsKili: "1516426122078-c23e76319801",
  giraffe: "1547721064-da6cfb341d50",
  savanna: "1534177616072-ef7dc120449d",
  sunset: "1500382017468-9049fed747ef",
  leopard: "1564349683136-77e08dba1ef7",
  leopardTwo: "1518709268805-4e9042af9f23",
  balloons: "1530521954074-e64f6810b32d",
  greenMountains: "1469474968028-56623f02e42e",
  snowMountain: "1506905925346-21bda4d32df4",
  mistyHills: "1470071459604-3b5ec3a7fe05",
  mountainLake: "1454496522488-7a8e488e8606",
  mountainRange: "1464822759023-fed622ff2c3b",
  forest: "1441974231531-c6227db76b6e",
  lakeHouse: "1439066615861-d1af74d74000",
  lakeCanoe: "1505118380757-91f5f5632de0",
  waterfall: "1432405972618-c60b0225b8f9",
  hiker: "1551632811-561732d1e306",
  hikeTrail: "1501785888041-af3ef285b470",
  tentCamp: "1523293182086-7651a899d37f",
  campfire: "1504280390367-361c6d9f38f4",
  sunrise: "1470252649378-9c29740c9fa8",
  beachPalms: "1507525428034-b723cf961d3e",
  beach: "1519046904884-53103b34b206",
  beachAerial: "1544551763-46a013bb70d5",
  poolResort: "1520250497591-112f2f40a3f4",
  hotelRoom: "1582719508461-905c673771fd",
  resort: "1571896349842-33c89424de2d",
  group: "1529156069898-49953e39b3ac",
  groupTwo: "1543269865-cbf427effbad",
  friends: "1511632765486-a01980e01a18",
  travelMap: "1488646953014-85cb44e25828",
  traveler: "1503220317375-aaad61436b1b",
  woman: "1494790108377-be9c29b29330",
  // Verified extra imagery used across the extended destination list.
  escarpment: "1506744038136-46273834b3fb",
  lakesideHill: "1470770841072-f978cf4d019e",
  paleHills: "1500534314209-a25ddb2bd429",
  lions: "1516026672322-bc52d61a55d5",
  savannaDusk: "1540497077202-7c8a3999166f",
  tallForest: "1447752875215-b2761acb3c5d",
  desertPeaks: "1519681393784-d120267933ba",
  highlandRange: "1502134249126-9f3755a50d78",
  snowPeaks: "1465146344425-f00d5f5c8f07",
  dryValley: "1534351590666-13e3e96b5017",
  coastAerial: "1505142468610-359e7d316be0",
  coastShore: "1510414842594-a61c69b5ae57",
  sunriseField: "1472214103451-9374bd1c798e",
};

const u = (id: string) => id; // image field stores the bare Unsplash photo ID; the site builds CDN URLs via lib/utils img()

/* ------------------------------------------------------------ adventures */
type SeedAdventure = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  imageAlt: string;
  duration: string;
  startingPrice: number;
  location: string;
  region: string;
  tripType: string;
  bestSeason: string;
  groupSize: string;
  featured: boolean;
  highlights: string[];
};

const adventures: SeedAdventure[] = [
  {
    slug: "maasai-mara-safari",
    title: "The Maasai Mara Safari",
    tagline: "Big Five country at golden hour",
    description:
      "Four days across the world's most celebrated wildlife reserve — dawn game drives with lions on the move, sundowners on the escarpment, and the rolling savannah glowing amber. Led by guides who grew up on these plains.",
    image: u(IMG.lion),
    imageAlt: "A lion resting in the golden grass of the Maasai Mara",
    duration: "4 Days",
    startingPrice: 2450,
    location: "Maasai Mara National Reserve",
    region: "Maasai Mara",
    tripType: "Safari",
    bestSeason: "June – October & December – February",
    groupSize: "2 – 8 guests",
    featured: true,
    highlights: [
      "Dawn & dusk game drives with Maasai guides",
      "Hot-air balloon safari over the Mara",
      "Big Five encounters",
      "Private bush sundowner on the escarpment",
    ],
  },
  {
    slug: "great-migration-safari",
    title: "The Great Migration Safari",
    tagline: "River crossings on the Mara plains",
    description:
      "Witness the greatest wildlife spectacle on earth — a million wildebeest surging across the Mara River, crocodiles waiting, dust rising for kilometres. Timed precisely with the crossings, planned for years in advance.",
    image: u(IMG.savanna),
    imageAlt: "Wildebeest herds crossing the golden plains of the Mara",
    duration: "5 Days",
    startingPrice: 3200,
    location: "Mara River, Maasai Mara",
    region: "Maasai Mara",
    tripType: "Safari",
    bestSeason: "July – October",
    groupSize: "2 – 6 guests",
    featured: true,
    highlights: [
      "River-crossing watching at prime sites",
      "Expert spotters & trackers",
      "Luxury tented camp on the river",
      "Optional photography guide",
    ],
  },
  {
    slug: "amboseli-elephant-safari",
    title: "Amboseli Elephant Safari",
    tagline: "Herds beneath the shadow of Kilimanjaro",
    description:
      "Amboseli's elephant families are the most studied on earth — and the most photogenic, framed against Africa's highest peak. A short, soul-stirring escape into swamps, dust and sheer presence.",
    image: u(IMG.elephant),
    imageAlt: "An elephant walking through Amboseli's dry plains",
    duration: "3 Days",
    startingPrice: 1150,
    location: "Amboseli National Park",
    region: "Amboseli",
    tripType: "Safari",
    bestSeason: "Year-round; June – October clearest views",
    groupSize: "2 – 7 guests",
    featured: true,
    highlights: [
      "Close encounters with matriarch elephant herds",
      "Kilimanjaro viewpoint at dawn",
      "Maasai community visit",
      "Sundowner at Observation Hill",
    ],
  },
  {
    slug: "mount-kenya-adventure",
    title: "Mount Kenya Adventure",
    tagline: "Africa's second peak, guided by locals",
    description:
      "A five-day climb through bamboo forest, moorland and glacial valleys to Point Lenana — a summit at sunrise with the equator glinting below. Technical routes optional; the mountain is never rushed.",
    image: u(IMG.snowMountain),
    imageAlt: "The snow-capped peak of Mount Kenya above the clouds",
    duration: "5 Days",
    startingPrice: 1890,
    location: "Mount Kenya National Park",
    region: "Mount Kenya",
    tripType: "Adventure",
    bestSeason: "January – March & July – October",
    groupSize: "2 – 10 climbers",
    featured: true,
    highlights: [
      "Summit Point Lenana at 4,985 m",
      "Porters, guides & altitude training",
      "Equatorial glaciers & giant lobelias",
      "Mountain lodge nights before the climb",
    ],
  },
  {
    slug: "hells-gate-expedition",
    title: "Hell's Gate Expedition",
    tagline: "Hike, climb and cycle through a volcanic valley",
    description:
      "The inspiration for Pride Rock — a red gorge of towering cliffs, geothermal steam and zebra at every turn. Walk Fischer's Tower, climb the gorge by hand and cable, then soak in the hot springs.",
    image: u(IMG.hiker),
    imageAlt: "A hiker on a ridgeline above the Rift Valley",
    duration: "2 Days",
    startingPrice: 640,
    location: "Hell's Gate National Park",
    region: "Rift Valley",
    tripType: "Adventure",
    bestSeason: "Year-round",
    groupSize: "2 – 12 guests",
    featured: false,
    highlights: [
      "Guided gorge climb & Fischer's Tower ascent",
      "Cycling through zebra country",
      "Geothermal spa finish",
      "Campfire dinner under the escarpment",
    ],
  },
  {
    slug: "lake-naivasha-escape",
    title: "Lake Naivasha Escape",
    tagline: "Hippos, birdlife and boat cruises on the Rift",
    description:
      "Forty minutes from Nairobi, a different world — glassy water, papyrus, hippos exhaling at dusk. A gentle, restorative pause: boat cruises, Crescent Island walks, and long lunches on the shore.",
    image: u(IMG.lakeHouse),
    imageAlt: "Early morning light on the waters of Lake Naivasha",
    duration: "2 Days",
    startingPrice: 520,
    location: "Lake Naivasha, Rift Valley",
    region: "Rift Valley",
    tripType: "Adventure",
    bestSeason: "Year-round",
    groupSize: "2 – 8 guests",
    featured: false,
    highlights: [
      "Sunset boat cruise past hippo pods",
      "Crescent Island guided walk",
      "Over 400 bird species on site",
      "Lakeside lodge or boutique camp",
    ],
  },
  {
    slug: "suswa-crater-hike",
    title: "Suswa Adventure",
    tagline: "Lava tubes, crater rim and open savannah",
    description:
      "Mount Suswa's twin craters hide the longest lava tubes in Kenya — cathedral spaces of cooled stone where sacred baboon troops shelter. An off-radar hike for travellers who want Kenya without the crowds.",
    image: u(IMG.mistyHills),
    imageAlt: "Misty volcanic hills above the Rift Valley",
    duration: "2 Days",
    startingPrice: 580,
    location: "Mount Suswa",
    region: "Rift Valley",
    tripType: "Adventure",
    bestSeason: "June – October",
    groupSize: "2 – 10 guests",
    featured: false,
    highlights: [
      "Explore cathedral lava tubes by headlamp",
      "Crater rim sunrise hike",
      "Sacred baboon sanctuary",
      "Camp under a sky with no light pollution",
    ],
  },
  {
    slug: "kenyan-coast-retreat",
    title: "The Kenyan Coast Retreat",
    tagline: "Dhow sails, coral reefs and Indian Ocean sands",
    description:
      "Six days from Diani to Watamu — white sand, ancient baobabs, a dhow at sunset, and the world's richest coral gardens just offshore. Luxury beach villas with a Swahili soul.",
    image: u(IMG.beachPalms),
    imageAlt: "Palm trees over white sand on the Kenyan coast",
    duration: "6 Days",
    startingPrice: 1680,
    location: "Diani & Watamu",
    region: "The Coast",
    tripType: "Coastal",
    bestSeason: "December – March & July – October",
    groupSize: "2 – 6 guests",
    featured: true,
    highlights: [
      "Private dhow sailing & snorkelling",
      "Marine park turtle encounters",
      "Boutique beach villas",
      "Swahili cooking class in Lamu tradition",
    ],
  },
  {
    slug: "nairobi-experiences",
    title: "Nairobi Experiences",
    tagline: "Giraffes, elephants and Karen's green suburbs in a day",
    description:
      "The only capital on earth with a national park at its gates. Feed a Rothschild giraffe, watch orphaned elephants at their midday mud bath, and walk the gardens of Karen Blixen's house — all before dinner.",
    image: u(IMG.giraffe),
    imageAlt: "A giraffe reaching into acacia trees at the Giraffe Centre",
    duration: "1 Day",
    startingPrice: 290,
    location: "Nairobi & Karen",
    region: "Nairobi",
    tripType: "Cultural",
    bestSeason: "Year-round",
    groupSize: "1 – 8 guests",
    featured: false,
    highlights: [
      "Giraffe Centre hand-feeding",
      "Sheldrick Wildlife Trust elephant hour",
      "Karen Blixen Museum & gardens",
      "Bomas of Kenya performances",
    ],
  },
  {
    slug: "samburu-safari",
    title: "Samburu Safari",
    tagline: "Rare northern species along the Ewaso Ng'iro",
    description:
      "Samburu's sun-scorched riverine wilderness is home to species found nowhere else in Kenya — reticulated giraffe, Grevy's zebra, beisa oryx. A raw, beautiful land shared with its fierce, gracious people.",
    image: u(IMG.leopard),
    imageAlt: "A leopard resting on a rocky outcrop in Samburu",
    duration: "3 Days",
    startingPrice: 1250,
    location: "Samburu National Reserve",
    region: "Samburu",
    tripType: "Safari",
    bestSeason: "June – October",
    groupSize: "2 – 7 guests",
    featured: false,
    highlights: [
      "The 'Samburu Special Five'",
      "Sangai & Laikipiak cultural evenings",
      "Ewaso Ng'iro river camp",
      "Night drives in the conservancy",
    ],
  },
  {
    slug: "lake-turkana-expedition",
    title: "Lake Turkana Expedition",
    tagline: "The Jade Sea and the cradle of humankind",
    description:
      "The world's largest desert lake, shimmering jade against black volcanic rock. Seven days deep into the far north — fossil sites where humanity was rewritten, Turkana villages, and nights louder with stars than with anything else.",
    image: u(IMG.sunrise),
    imageAlt: "Sunrise over the jade waters of Lake Turkana",
    duration: "7 Days",
    startingPrice: 2450,
    location: "Lake Turkana, Marsabit County",
    region: "The Far North",
    tripType: "Expedition",
    bestSeason: "June – September",
    groupSize: "4 – 8 explorers",
    featured: true,
    highlights: [
      "Koobi Fora fossil sites with a guide",
      "Desert camp under the Milky Way",
      "Turkana boat journeys on the jade waters",
      "Cultural visits to the region's communities",
    ],
  },
  {
    slug: "tsavo-crossing",
    title: "Tsavo Crossing",
    tagline: "Red-earth wilderness and man-eater history",
    description:
      "Kenya's oldest and largest park, where elephants roll in iron-red dust and the ghosts of the man-eaters still stalk the rails. Big skies, Mzima's clear springs, and almost nobody else.",
    image: u(IMG.lionClose),
    imageAlt: "A lion surveying the red plains of Tsavo",
    duration: "3 Days",
    startingPrice: 1100,
    location: "Tsavo East & West",
    region: "Tsavo",
    tripType: "Safari",
    bestSeason: "June – October & January – February",
    groupSize: "2 – 8 guests",
    featured: false,
    highlights: [
      "Red elephants of Tsavo",
      "Mzima Springs hippo hide",
      "Lugard Falls & Aruba Dam",
      "Historic railway tales at the Tsavo station",
    ],
  },
  {
    slug: "lamu-island-escape",
    title: "Lamu Island Escape",
    tagline: "Stone town alleys and Swahili dhow harbours",
    description:
      "A UNESCO-listed island where donkeys outnumber cars and time moves like the tide. Five days of carved doors, rooftop dinners, and sailing into the sunset on a traditional Swahili dhow.",
    image: u(IMG.beachAerial),
    imageAlt: "Aerial view of the white sand and turquoise water off Lamu",
    duration: "5 Days",
    startingPrice: 1590,
    location: "Lamu Archipelago",
    region: "The Coast",
    tripType: "Coastal",
    bestSeason: "December – March",
    groupSize: "2 – 6 guests",
    featured: false,
    highlights: [
      "Guided stone town walking tours",
      "Sunset dhow sailing to Shela",
      "Swahili & Arabic architecture walks",
      "Beach villas with private kitchens",
    ],
  },
  {
    slug: "luxury-highlands-retreat",
    title: "The Highlands Luxury Retreat",
    tagline: "A stay in the shadow of Mount Kenya",
    description:
      "Four days of quiet opulence on a private Laikipia conservancy — bush breakfasts, guided walks with a naturalist, gin and tonic at the equator, and a suite with the mountain in your window.",
    image: u(IMG.poolResort),
    imageAlt: "An infinity pool overlooking the Laikipia highlands",
    duration: "4 Days",
    startingPrice: 2900,
    location: "Laikipia Plateau",
    region: "Laikipia",
    tripType: "Luxury",
    bestSeason: "June – March",
    groupSize: "2 – 6 guests",
    featured: false,
    highlights: [
      "Private suite on a working conservancy",
      "Naturalist-led walks & night drives",
      "Bush dining under ancient cedars",
      "Wildlife that roams freely beyond fences",
    ],
  },
  /* ------------------------------------------- journeys beyond Kenya ---- */
  {
    slug: "zanzibar-dhow-escape",
    title: "The Zanzibar Dhow Escape",
    tagline: "Coral sands, spice air and dhow sails",
    description:
      "Five unhurried days in the Zanzibar archipelago — a spice tour through clove and nutmeg groves, Stone Town's carved alleyways, a dhow crossing to a sandbank, and evenings in a beach villa where the reef is your garden.",
    image: u(IMG.beachAerial),
    imageAlt: "Aerial view of Zanzibar's turquoise coral coast",
    duration: "5 Days",
    startingPrice: 1650,
    location: "Zanzibar Archipelago",
    region: "Zanzibar",
    tripType: "Coastal",
    bestSeason: "June – October & December – March",
    groupSize: "2 – 8 guests",
    featured: true,
    highlights: [
      "Dhow cruise to a private sandbank",
      "Stone Town walking tour with a historian",
      "Spice farm & cooking class",
      "Snorkelling the Mnemba reef",
    ],
  },
  {
    slug: "kilimanjaro-summit-trek",
    title: "Kilimanjaro Summit Trek",
    tagline: "Africa's rooftop, guided with heart",
    description:
      "Seven days on the Lemosho route — through rainforest, heather and alpine desert to the glaciers of Uhuru Peak. Small teams, local mountain crews, and a summit sunrise you will measure every other sunrise against.",
    image: u(IMG.snowPeaks),
    imageAlt: "Glaciers of Kilimanjaro above the clouds at dawn",
    duration: "7 Days",
    startingPrice: 2450,
    location: "Kilimanjaro National Park",
    region: "Kilimanjaro",
    tripType: "Adventure",
    bestSeason: "June – October & January – March",
    groupSize: "2 – 10 trekkers",
    featured: true,
    highlights: [
      "Summit night on Uhuru Peak (5,895 m)",
      "Five vegetation zones in seven days",
      "Experienced Chagga mountain crew",
      "Optional crater walk at dawn",
    ],
  },
  {
    slug: "serengeti-migration-safari",
    title: "The Serengeti Migration Safari",
    tagline: "A million hooves across endless plains",
    description:
      "Six days following the great herds across the Serengeti — river crossings timed by resident guides, lions on the kopjes, and the Ngorongoro Crater for a finale. The migration as it was meant to be seen: slowly.",
    image: u(IMG.savannaDusk),
    imageAlt: "Wildebeest streaming across the Serengeti plains at dusk",
    duration: "6 Days",
    startingPrice: 3200,
    location: "Serengeti National Park & Ngorongoro Crater",
    region: "Serengeti & Ngorongoro",
    tripType: "Safari",
    bestSeason: "June – October (crossings) & December – February (calving)",
    groupSize: "2 – 6 guests",
    featured: true,
    highlights: [
      "River-crossing watching with resident guides",
      "Big cats on the Serengeti kopjes",
      "Sunset balloon safari over the plains",
      "Ngorongoro Crater game drive finale",
    ],
  },
  {
    slug: "gorilla-trek-bwindi",
    title: "The Gorilla Trek — Bwindi & Volcanoes",
    tagline: "Face to face with mountain gorillas",
    description:
      "Five days across Uganda and Rwanda — misty forest treks to habituated gorilla families in Bwindi, volcano views from the Virungas, and the gentle golden monkeys of the bamboo. Permits, trackers and logistics handled entirely by us.",
    image: u(IMG.tallForest),
    imageAlt: "Mist rising over the rainforest of Bwindi Impenetrable Forest",
    duration: "5 Days",
    startingPrice: 4100,
    location: "Bwindi Impenetrable Forest & Volcanoes National Park",
    region: "Bwindi & Virunga",
    tripType: "Adventure",
    bestSeason: "Year-round; June – August & December – February driest",
    groupSize: "2 – 6 guests",
    featured: true,
    highlights: [
      "Mountain gorilla trekking (permits included)",
      "Golden monkey trek in the bamboo",
      "Batwa forest community walk",
      "Lake Bunyonyi canoe evening",
    ],
  },
  {
    slug: "lalibela-rock-churches",
    title: "Lalibela & the Roof of Ethiopia",
    tagline: "Churches carved from living rock",
    description:
      "Six days in northern Ethiopia's highlands — the eleven rock-hewn churches of Lalibela, the castles of Gondar, and the escarpment viewpoints of the Simien Mountains. A journey through the oldest continuous culture in Africa.",
    image: u(IMG.desertPeaks),
    imageAlt: "The rock-hewn churches of Lalibela carved into the highland stone",
    duration: "6 Days",
    startingPrice: 2850,
    location: "Lalibela, Gondar & the Simien Mountains",
    region: "Northern Ethiopia",
    tripType: "Cultural",
    bestSeason: "October – March",
    groupSize: "2 – 8 guests",
    featured: true,
    highlights: [
      "The eleven churches of Lalibela with a local guide",
      "Gondar's seventeenth-century castles",
      "Simien escarpment viewpoints & gelada baboons",
      "Coffee ceremony in a highland village",
    ],
  },
  {
    slug: "ngorongoro-crater-safari",
    title: "Ngorongoro Crater & Tarangire Safari",
    tagline: "The Eden crater and baobab country",
    description:
      "Four days in two of Tanzania's great arenas — the Ngorongoro Crater floor, where the Big Five live in a natural amphitheatre, and Tarangire's baobab forests with elephants beneath ancient trunks.",
    image: u(IMG.elephantsKili),
    imageAlt: "Elephants crossing the grass of the Ngorongoro Crater floor",
    duration: "4 Days",
    startingPrice: 2450,
    location: "Ngorongoro Crater & Tarangire National Park",
    region: "Ngorongoro & Tarangire",
    tripType: "Safari",
    bestSeason: "Year-round; June – October best",
    groupSize: "2 – 7 guests",
    featured: true,
    highlights: [
      "Crater rim to crater floor at first light",
      "Big Five on the caldera grasslands",
      "Baobab forests of Tarangire",
      "Maasai boma visit on the crater rim",
    ],
  },
];

/* ------------------------------------------------------------------ blog */
type SeedBlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown
  image: string;
  imageAlt: string;
  category: string;
  publishedAt: string; // ISO date
};

export const blogPosts: SeedBlogPost[] = [
  {
    slug: "maasai-mara-best-time-to-visit",
    title: "The Best Time to Visit the Maasai Mara",
    category: "Safari Guide",
    image: u(IMG.lions),
    imageAlt: "Lions dozing in the tall golden grass of the Maasai Mara",
    publishedAt: "2026-01-12",
    excerpt: "The Maasai Mara is extraordinary all year — but when you go changes what you see.",
    content: [
      "The Maasai Mara is extraordinary all year — but *when* you go changes what you see.",
      "",
      "## July – October: The Migration Arrives",
      "The herds cross the Mara River from Tanzania, often several times. River crossings are the headline act, but the drama is quieter too: lions shadow the herds, vultures circle the crossings, and the grass is short enough to see everything.",
      "",
      "## December – February: The Calving Season",
      "The herds regroup on the Mara's southern plains to calve. It is the best season for predators — a newborn wildebeest is a moving feast — and for **excellent light** with long golden mornings.",
      "",
      "## The quiet season (March – June)",
      "Short rains green the landscape and the Mara is gloriously empty. Rates drop, camps feel private, and resident wildlife — cheetah, leopard, elephant — rarely moves far.",
      "",
      "> Our favourite window? Mid-August to early October, when crossings peak and the weather is dry and warm.",
      "",
      "However you time it, **three full days** in the reserve is the minimum to feel the rhythm of the place. Four is better."
    ].join("\n"),
  },
  {
    slug: "great-migration-guide",
    title: "The Great Migration, Explained",
    category: "Safari Guide",
    image: u(IMG.savanna),
    imageAlt: "Wildebeest streaming across the golden savannah",
    publishedAt: "2026-02-02",
    excerpt: "Around 1.5 million wildebeest, 200,000 zebra and 500,000 gazelle move in a clockwise loop between Tanzania and Kenya. Here is how to read it.",
    content: [
      "Around 1.5 million wildebeest, 200,000 zebra and 500,000 gazelle move in a clockwise loop between Tanzania and Kenya. Here is how to read it.",
      "",
      "## The route, simply",
      "- **December – March:** calving on the southern Serengeti plains",
      "- **April – June:** the herds move north through the western corridor",
      "- **July – October:** river crossings in the northern Serengeti and the Maasai Mara",
      "- **November:** the herds roll back south as the short rains return",
      "",
      "## What people get wrong",
      "The migration is not one herd — it is a **continuous stream**, with animals crossing back and forth. Nobody can guarantee a river crossing on a given day; the guides who promise one are guessing.",
      "",
      "## How to see it well",
      "Stay in **mobile or semi-permanent camps** that move with the herds. A fixed lodge two hours from the river will cost you the best hours of the day in a vehicle.",
      "",
      "> Planning tip: book 9–12 months ahead for July–October. The best camps sell out first."
    ].join("\n"),
  },
  {
    slug: "gorilla-trekking-guide",
    title: "Gorilla Trekking 101: What Nobody Tells You",
    category: "Wildlife",
    image: u(IMG.forest),
    imageAlt: "Mist rising through the rainforest canopy of Bwindi",
    publishedAt: "2026-02-16",
    excerpt: "You have seen the photographs. Here is what the trek actually feels like — and how to prepare for it properly.",
    content: [
      "You have seen the photographs. Here is what the trek actually feels like — and how to prepare for it properly.",
      "",
      "## The permits",
      "A gorilla permit costs **$600–$800** and must be booked in advance. Permits are issued per person, per day, and the daily groups are capped. **Book 4–6 months ahead.**",
      "",
      "## The trek itself",
      "- You are assigned a family by lottery in the morning",
      "- Treks run **1–6 hours** through steep, wet rainforest",
      "- Porters (well worth the fee) carry your pack and steady you on the slopes",
      "- When you find the family, you get **one hour** with them — no more",
      "",
      "## The hour",
      "The moment a silverback looks at you — truly looks — is the moment everything changes. Sit still, speak softly, and let the babies come to you. They often do.",
      "",
      "## What to wear",
      "Long trousers, waterproof hiking boots, gardening gloves for stinging nettles, and gaiters. The forest is 90% humidity and the paths are mud — dress for it.",
      "",
      "> Bring a light rain jacket and a spare memory card. You will use both."
    ].join("\n"),
  },
  {
    slug: "kilimanjaro-vs-mount-kenya",
    title: "Kilimanjaro or Mount Kenya? Choosing Your First Summit",
    category: "Adventure",
    image: u(IMG.snowPeaks),
    imageAlt: "Glaciers of a great African peak above the clouds",
    publishedAt: "2026-03-04",
    excerpt: "Africa's two great walk-up mountains are very different expeditions. Here is the honest comparison.",
    content: [
      "Africa's two great walk-up mountains are very different expeditions. Here is the honest comparison.",
      "",
      "## Kilimanjaro (5,895 m)",
      "- **Seven to eight days** on the best routes (Lemosho, Machame)",
      "- A steady, well-engineered trail to the summit",
      "- Huge crowds on the Marangu and Machame routes",
      "- Summiting at night, arriving at **Uhuru Peak at dawn**",
      "",
      "## Mount Kenya (5,199 m)",
      "- **Four to five days** to Point Lenana",
      "- Rock scrambles, tarns and a much wilder, alpine feel",
      "- Almost no one on the mountain",
      "- Summiting at sunrise with **glaciers close enough to touch**",
      "",
      "## The verdict",
      "Climb **Kilimanjaro** for the once-in-a-lifetime achievement and the sense of scale. Climb **Mount Kenya** for the quality of the mountain itself — it is the better technical walk, in a fraction of the time and budget.",
      "",
      "> Many of our guests do both: Mount Kenya first, then Kilimanjaro as the grand finale."
    ].join("\n"),
  },
  {
    slug: "zanzibar-week-itinerary",
    title: "One Perfect Week in Zanzibar",
    category: "Coast",
    image: u(IMG.beach),
    imageAlt: "White sand and turquoise shallows off the Zanzibar coast",
    publishedAt: "2026-03-18",
    excerpt: "Seven days is exactly the right amount of Zanzibar — enough for the island's two personalities.",
    content: [
      "Seven days is exactly the right amount of Zanzibar — enough for the island's two personalities.",
      "",
      "## Days 1–2: Stone Town",
      "Wander the alleyways with a historian, see the carved doors and the old fort, and book the **spice tour** from town. End the first evening with a rooftop sundowner over the harbour.",
      "",
      "## Days 3–5: The northeast coast",
      "Base yourself at Nungwi or Matemwe. Snorkel the **Mnemba reef**, take a dhow to a sandbank at low tide, and do absolutely nothing between 11am and 4pm — the sun demands it.",
      "",
      "## Days 6–7: Paje and the east",
      "The east coast's long, shallow lagoon is kite-surfing country and the quietest sand on the island. Finish with a seafood dinner on the beach, feet in the sand.",
      "",
      "## Good to know",
      "- The **high season** is December–March (hot) and June–October (warm and dry)",
      "- Cash in shillings, cards only at hotels",
      "- Bring reef-safe sunscreen — the reef is fragile and strictly protected",
      "",
      "> Flying in from Nairobi or Arusha? We pair Zanzibar with a short Serengeti safari for a perfect 10-day trip."
    ].join("\n"),
  },
  {
    slug: "lamu-time-forgot",
    title: "Lamu: The Island Where Time Forgot",
    category: "Culture",
    image: u(IMG.coastShore),
    imageAlt: "Traditional dhows resting on a quiet Lamu shore",
    publishedAt: "2026-04-01",
    excerpt: "There are no cars in Lamu Town. The streets are so narrow that goods move by donkey, and the call to prayer drifts over the rooftops like it has for a thousand ",
    content: [
      "There are no cars in Lamu Town. The streets are so narrow that goods move by donkey, and the call to prayer drifts over the rooftops like it has for a thousand years.",
      "",
      "## Why Lamu is different",
      "Lamu Old Town is a **UNESCO World Heritage site** — a living Swahili settlement with carved doors, coral-stone houses and a culture that blends Arab, Persian, Indian and African threads.",
      "",
      "## The rhythm of a Lamu day",
      "- **Morning:** watch the dhows return with the tide at the seafront",
      "- **Midday:** a long lunch of grilled parrotfish at a rooftop bar",
      "- **Late afternoon:** walk to Shela for sunset over the channel",
      "- **Evening:** dhow trip to the sandbanks at low tide, lanterns and silence",
      "",
      "## Getting there",
      "Fly from Nairobi or Mombasa to Manda airport, then a five-minute boat ride. Combine it with a few days on the nearby **Kiwayu** or **Manda Island** beaches for the full northern coast experience.",
      "",
      "> Lamu rewards the unhurried traveler. Give it four days minimum — it is the least rushed place in East Africa, on purpose."
    ].join("\n"),
  },
  {
    slug: "safari-packing-list",
    title: "The Perfect Safari Packing List",
    category: "Travel Guide",
    image: u(IMG.tentCamp),
    imageAlt: "A campfire-lit tented camp under the stars",
    publishedAt: "2026-04-15",
    excerpt: "A safari is one of the easiest trips to overpack for. Here is what you actually need.",
    content: [
      "A safari is one of the easiest trips to overpack for. Here is what you actually need.",
      "",
      "## The non-negotiables",
      "- **Neutral-coloured clothing** — khaki, olive, sand. No camouflage (illegal in Kenya) and no bright white",
      "- A lightweight fleece or down jacket — morning game drives are cold, even in July",
      "- Binoculars (8x42 or similar). The best wildlife photographers also carry them",
      "- A **power bank** and a universal adapter",
      "- Reusable water bottle — camps refill for free",
      "",
      "## Leave at home",
      "- Formal wear (smart-casual is the dress code everywhere)",
      "- More than two pairs of shoes (trainers + sandals covers everything)",
      "- A large hard suitcase — soft duffels fit safari vehicles better",
      "",
      "## The classic mistake",
      "People pack for the beach and forget the **dust**. A buff or scarf for the open vehicles, and a small lens-cleaning kit, will save your trip.",
      "",
      "> Your tour operator should provide a checklist at booking. If they don't, ask — it says something about them."
    ].join("\n"),
  },
  {
    slug: "what-to-wear-on-safari",
    title: "What to Wear on Safari (And What Not To)",
    category: "Travel Guide",
    image: u(IMG.savannaDusk),
    imageAlt: "Golden evening light over an open savannah",
    publishedAt: "2026-04-29",
    excerpt: "The rules of safari dressing are simpler than they look, and they exist for two reasons: comfort and respect.",
    content: [
      "The rules of safari dressing are simpler than they look, and they exist for two reasons: comfort and respect.",
      "",
      "## The three layers",
      "1. **Base:** light, breathable shirt — cotton or technical fabric. Long sleeves keep off sun and tsetse flies",
      "2. **Mid:** a fleece or softshell for the cold, windy hours of the 6am game drive",
      "3. **Top:** a light rain shell — the tropics can turn in twenty minutes",
      "",
      "## Colours that work",
      "Neutrals — khaki, olive, stone, navy. Dark blue is a genuine favourite: it is neutral to animals, hides dust, and photographs beautifully.",
      "",
      "## The \"what not to\"",
      "- **White:** reflects light, stains with red dust instantly",
      "- **Camouflage:** illegal in Kenya and Uganda",
      "- **Denim and nylon tracksuits:** uncomfortable, noisy, and they carry heat",
      "- **Bright colours in the villages:** fine on safari, but modest clothing is expected in towns and markets",
      "",
      "## Footwear",
      "One pair of sturdy walking shoes for game drives, one pair of sandals for camp. That is genuinely all you need.",
      "",
      "> Pro tip: pack a light **swimming costume** even for savannah safaris — most good camps have pools."
    ].join("\n"),
  },
  {
    slug: "nairobi-in-48-hours",
    title: "Nairobi in 48 Hours",
    category: "City Guide",
    image: u(IMG.balloons),
    imageAlt: "Hot-air balloons drifting over the savannah at sunrise",
    publishedAt: "2026-05-06",
    excerpt: "Most travellers treat Nairobi as a stopover. That is a mistake — Africa's greenest capital can give you two genuinely unforgettable days.",
    content: [
      "Most travellers treat Nairobi as a stopover. That is a mistake — Africa's greenest capital can give you two genuinely unforgettable days.",
      "",
      "## Day 1: The wild city",
      "- **Morning:** Nairobi National Park at first light — the world's only capital with wild lions and rhinos on its doorstep",
      "- **Midday:** lunch at the Giraffe Centre's viewing platform, where Rothschild's giraffes eat from your hand",
      "- **Afternoon:** the David Sheldrick Wildlife Trust elephant orphanage at 5pm feeding time",
      "- **Evening:** dinner in Karen — the leafy suburb our company is named for",
      "",
      "## Day 2: The modern capital",
      "- **Morning:** the Nairobi National Museum and the snake park",
      "- **Afternoon:** a coffee cupping at a city roastery — Kenya's AA beans are world famous",
      "- **Evening:** rooftop cocktails in Westlands, then nyama choma — grilled meat — the Nairobi way",
      "",
      "## Logistics",
      "- Traffic peaks 7–9am and 5–7pm; plan drives around it",
      "- Uber and Bolt are reliable and cheap",
      "- The airport is 30–45 minutes from the city in light traffic",
      "",
      "> Need a pick-up, a guide or a table? We plan Nairobi stopovers for nearly every client — just ask."
    ].join("\n"),
  },
  {
    slug: "lake-naivasha-hippos",
    title: "A Morning with Lake Naivasha's Hippos",
    category: "Wildlife",
    image: u(IMG.lakeCanoe),
    imageAlt: "A canoe gliding across the still water of Lake Naivasha",
    publishedAt: "2026-05-20",
    excerpt: "At 7am the lake is glass. The hippos surface in ones and twos, snort, and sink again — a hundred tonnes of animal moving under a metre of water.",
    content: [
      "At 7am the lake is glass. The hippos surface in ones and twos, snort, and sink again — a hundred tonnes of animal moving under a metre of water.",
      "",
      "## Why Naivasha is special",
      "It is Kenya's highest freshwater lake, a **Ramsar wetland** ringed by yellow fever acacia, and home to hippos, fish eagles and more bird species than anywhere else in the Rift Valley.",
      "",
      "## The classic morning",
      "- **6:30am** — coffee at the lodge, then a short drive to the boat jetty",
      "- **7:00am** — a silent boat through the papyrus channels; fish eagles call at the tops of trees",
      "- **8:30am** — walk on Crescent Island, where the wildlife is completely wild and completely calm",
      "- **10:00am** — breakfast at Elsamere, Joy Adamson's lakeside home",
      "",
      "## Hippo etiquette",
      "Hippos kill more people in Africa than any other large animal — but they are strictly vegetarian and simply territorial. Stay in the boat, keep your distance, and let them surface in their own time. They are magnificent to watch and very easy to respect.",
      "",
      "> Naivasha sits perfectly between Nairobi and the Maasai Mara. It makes the first and last nights of a safari — gently, beautifully."
    ].join("\n"),
  },
  {
    slug: "turkana-jade-sea",
    title: "Trekking the Jade Sea: Lake Turkana",
    category: "Adventure",
    image: u(IMG.dryValley),
    imageAlt: "Lunar desert valleys descending toward the jade waters of Turkana",
    publishedAt: "2026-06-03",
    excerpt: "The far north of Kenya feels like another planet. This is the Jade Sea — the largest desert lake on Earth, in a landscape of volcanic rock, fossil rivers and so",
    content: [
      "The far north of Kenya feels like another planet. This is the Jade Sea — the largest desert lake on Earth, in a landscape of volcanic rock, fossil rivers and some of the oldest human remains ever found.",
      "",
      "## What you are in for",
      "- **Five to seven days** of expedition travel: dirt roads, fly camps, and no signal",
      "- The **Turkana people**, whose culture is as striking as the landscape",
      "- **Volcanic badlands** and the Chalbi desert's salt flats",
      "- The fishing villages of El Molo, Kenya's smallest ethnic group",
      "",
      "## The season",
      "June to September and December to February. The lake road is impassable after heavy rain — a good reason to travel with operators who live there.",
      "",
      "## Why go",
      "There are no crowds here. There are barely roads. What you get instead is silence on a scale that is hard to find anywhere else in Africa — and the feeling of standing at the edge of the map.",
      "",
      "> This is expedition territory: not for everyone, but unforgettable for those it suits. We run it as a private, fully-supported journey."
    ].join("\n"),
  },
  {
    slug: "ethiopia-lalibela-story",
    title: "The Rock-Hewn Churches of Lalibela",
    category: "Culture",
    image: u(IMG.paleHills),
    imageAlt: "Ancient rock-hewn churches rising from the highlands",
    publishedAt: "2026-06-17",
    excerpt: "In the 12th century, King Lalibela had a vision: build a New Jerusalem in the Ethiopian highlands. His masons did something nobody else has ever attempted — the",
    content: [
      "In the 12th century, King Lalibela had a vision: build a New Jerusalem in the Ethiopian highlands. His masons did something nobody else has ever attempted — they carved eleven complete churches **downward into the living rock**.",
      "",
      "## What you see",
      "- **Bet Giyorgis** — the cross-shaped church carved as a single block, 13 metres deep",
      "- The **tunnel system** connecting the churches, lit by oil lamps like a candle-lit underworld",
      "- White-robed priests who have kept the liturgy alive for eight hundred years",
      "- **Timkat** in January — Epiphany, when the churches' treasures are carried out in procession",
      "",
      "## The practicalities",
      "Lalibela sits at 2,500 metres — cool, high, and quiet. There is an international airport with direct flights from Addis; from Nairobi the usual route is Addis overnight, then a morning flight.",
      "",
      "## Why it matters",
      "It is one of the great pilgrimage sites on Earth — still a working holy place, not a museum. No photography inside the churches during services, and a local guide is essential to read what you are seeing.",
      "",
      "> We build this into a full **Northern Ethiopia circuit**: Lalibela, Gondar's castles, and the Simien Mountains."
    ].join("\n"),
  },
  {
    slug: "serengeti-river-crossing",
    title: "River Crossings: The Serengeti's Greatest Show",
    category: "Safari Guide",
    image: u(IMG.savannaDusk),
    imageAlt: "Wildebeest massing at the water's edge at dusk",
    publishedAt: "2026-07-01",
    excerpt: "Every river crossing is different, and none of them look like the documentaries. Here is what to expect when the herds reach the Mara River.",
    content: [
      "Every river crossing is different, and none of them look like the documentaries. Here is what to expect when the herds reach the Mara River.",
      "",
      "## The build-up",
      "Hundreds of thousands of wildebeest mass on the bank, drifting forward and turning back for hours. The tension is the show — the waiting, the false starts, the river full of waiting crocodiles.",
      "",
      "## The crossing itself",
      "It happens fast — often in ninety seconds. A few animals take the plunge, the herd follows in a single great press, and then it is over. Dust, spray, bellowing, silence.",
      "",
      "## Where to watch",
      "The crossing points are known territory for resident guides. A **professional guide with a good vehicle** gets you in position early; a self-drive gets you stuck in the queue. The difference is the difference between a postcard and a memory.",
      "",
      "## Timing",
      "Crossings are most likely **July–October**, and mornings are best. Some years the herds cross constantly; some years they sit. Plan three days, not one.",
      "",
      "> Stay in a northern Serengeti camp during the season and you can be at the river before the light is fully up."
    ].join("\n"),
  },
  {
    slug: "nyama-choma-nairobi",
    title: "A Food Lover's Tour of Nairobi",
    category: "Food",
    image: u(IMG.campfire),
    imageAlt: "Flames and smoke over a traditional nyama choma grill",
    publishedAt: "2026-07-15",
    excerpt: "Nairobi eats well, and its food tells its story: a city of highlands, markets and a thousand journeys passing through.",
    content: [
      "Nairobi eats well, and its food tells its story: a city of highlands, markets and a thousand journeys passing through.",
      "",
      "## The essential list",
      "- **Nyama choma** — goat or beef grilled over charcoal, with kachumbari (tomato-onion salad) and ugali. Nairobi's signature ritual, best shared",
      "- **Pilau** — spiced rice with Swahili roots, from the coast up",
      "- **Mukimo** — mashed potatoes, maize and greens, the Kikuyu classic",
      "- **Ugali & sukuma wiki** — the daily plate of most of Kenya, and genuinely delicious with grilled meat",
      "- **Githeri** — beans and maize, the ancestor of the city's comfort food",
      "",
      "## Where",
      "The great choma spots are in **Parklands, Westlands and along the Thika Road strip**. For a fancier evening, Karen's farm-to-table restaurants are among the best in Africa.",
      "",
      "## The coffee",
      "Kenya's AA coffee is a national treasure. Do a cupping at a city roastery — it will change how you drink it forever.",
      "",
      "> Hungry already? We can pair a food tour with a city day in Nairobi — two hours, six tastes, one very full traveller."
    ].join("\n"),
  },
  {
    slug: "safari-photography-tips",
    title: "Safari Photography Without a Big Lens",
    category: "Travel Guide",
    image: u(IMG.leopard),
    imageAlt: "A leopard resting in the branches of a fever tree",
    publishedAt: "2026-07-29",
    excerpt: "You do not need a lens the size of a telescope to come home with photographs you love. Here is how the pros think.",
    content: [
      "You do not need a lens the size of a telescope to come home with photographs you love. Here is how the pros think.",
      "",
      "## The gear that matters",
      "- A **70–200mm zoom** or the kit 100–400mm on a crop-sensor body covers 90% of game drives",
      "- A polarising filter for dusty afternoons",
      "- Two memory cards and two batteries, minimum",
      "",
      "## The hours that matter",
      "The first and last hours of daylight. The golden hour on safari is genuinely golden — dust and low sun combine into something photographers chase for a lifetime.",
      "",
      "## The technique",
      "- **Shoot at eye level** with the animal — from a vehicle, that means letting the animal fill the frame from the window",
      "- **Aperture priority** at f/5.6–f/8, ISO flexible, shutter above 1/500",
      "- Burst mode for movement, single shot for portraits",
      "- **Fill the frame.** A distant animal in a vast landscape is a missed photograph",
      "",
      "## The rule nobody tells you",
      "Put the camera down. Some of the best moments of a safari — a lion cub rolling, a matriarch watching you pass — are better with eyes than with lenses.",
      "",
      "> On private conservancies we can stop the vehicle properly. It makes every photograph easier, and the animals more relaxed."
    ].join("\n"),
  },
  {
    slug: "conservation-rhinos-kenya",
    title: "Bringing the Rhino Back: Conservation in Kenya",
    category: "Conservation",
    image: u(IMG.savanna),
    imageAlt: "Rhinos grazing in the golden grass of a protected conservancy",
    publishedAt: "2026-08-05",
    excerpt: "In the 1970s Kenya had around 20,000 black rhinos. By 1990, poaching had cut that number to barely 400. Today, thanks to a remarkable conservation effort, they ",
    content: [
      "In the 1970s Kenya had around 20,000 black rhinos. By 1990, poaching had cut that number to barely 400. Today, thanks to a remarkable conservation effort, they number more than **1,000 — and the recovery continues**.",
      "",
      "## How it happened",
      "- **Sanctuaries and conservancies** — heavily guarded, community-owned land where rhinos breed in safety",
      "- **De-horning programmes** — removing the horn removes the target",
      "- **Tracking and rapid-response units** — rhinos are monitored 24/7 by rangers with dogs and drones",
      "- **Community benefits** — conservancies pay for schools and clinics, so protecting wildlife pays the village",
      "",
      "## Where to see them",
      "- **Ol Pejeta Conservancy** — Kenya's largest black rhino population, and the last northern white rhinos",
      "- **Nairobi National Park** — a wild rhino population twenty minutes from the airport",
      "- **Lake Nakuru** — the sanctuary that helped turn the tide",
      "",
      "## What travellers should know",
      "Visit conservancies, not circuses. A good conservancy visit funds rangers and community projects — and the rhinos you see there are wild, not tame.",
      "",
      "> We donate a share of every safari to the conservancies we work with. Ask us about it — we are proud to show the receipts."
    ].join("\n"),
  },
  {
    slug: "diani-beach-guide",
    title: "Diani Beach: Everything You Need to Know",
    category: "Coast",
    image: u(IMG.beachPalms),
    imageAlt: "Palm trees leaning over the white sand of Diani Beach",
    publishedAt: "2026-08-12",
    excerpt: "Diani has been voted the best beach in Africa more times than any other — and unlike some award winners, it genuinely delivers.",
    content: [
      "Diani has been voted the best beach in Africa more times than any other — and unlike some award winners, it genuinely delivers.",
      "",
      "## The beach itself",
      "Twelve kilometres of white sand, warm turquoise water, and a reef that holds the waves back. The sand shelves so gently that you can walk out a hundred metres.",
      "",
      "## The things to do",
      "- **Snorkel or dive** the Kisite-Mpunguti marine park — dolphins nearly guaranteed",
      "- **Kite-surf** the afternoon breeze (November–April is the season)",
      "- Visit the **Colobus Conservation** centre — Diani's resident monkey population is a conservation success",
      "- Dine at the beach bars in Diani Beach and Ukunda village",
      "",
      "## The practical stuff",
      "- **December–March** is the classic season: hot, dry, calm",
      "- **June–October** brings the south-east winds — beach weather with a fresh breeze",
      "- Diani is an hour from Mombasa or a short flight from Nairobi (Ukunda airstrip)",
      "",
      "## The pairing",
      "Diani works beautifully after a safari — three days on the beach resets everything. We bundle it as the classic **safari-and-coast** itinerary.",
      "",
      "> Whale sharks pass the reef between November and March. Ask for a boat day in that window — it is one of the best swims on Earth."
    ].join("\n"),
  },
  {
    slug: "five-days-serengti-ngorongoro",
    title: "Five Days: Serengeti & Ngorongoro in One Trip",
    category: "Itinerary",
    image: u(IMG.elephantsKili),
    imageAlt: "Elephants crossing the grassland of the Ngorongoro Crater floor",
    publishedAt: "2026-08-19",
    excerpt: "Five days is the perfect length for the two great arenas of northern Tanzania. Here is how we run it.",
    content: [
      "Five days is the perfect length for the two great arenas of northern Tanzania. Here is how we run it.",
      "",
      "## Day 1 — Arusha to the Serengeti",
      "Fly from Arusha to the Serengeti's airstrips (saving two days of driving), then an afternoon game drive into the plains.",
      "",
      "## Days 2–3 — The Serengeti",
      "Two full days on the plains: big cats on the kopjes, the river crossings (July–October), and one golden-hour sundowner that you will talk about for years.",
      "",
      "## Day 4 — The Crater",
      "Morning drive to Ngorongoro, descending 600 metres to the crater floor after lunch — the Big Five in a natural amphitheatre.",
      "",
      "## Day 5 — The rim to Arusha",
      "A final crater-rim viewpoint over coffee, then back to Arusha or onward to Zanzibar.",
      "",
      "## When to go",
      "- **June–October:** crossings season, best overall",
      "- **December–February:** calving season, quieter camps, superb light",
      "",
      "> This is our most-booked multi-country journey. One planner, one vehicle, one seamless week."
    ].join("\n"),
  },
  {
    slug: "maasai-culture-visit",
    title: "Meeting the Maasai With Respect",
    category: "Culture",
    image: u(IMG.sunrise),
    imageAlt: "Morning light over the open plains of Maasai country",
    publishedAt: "2026-08-26",
    excerpt: "The Maasai are the people of these plains — and travelling through their country well means understanding how their world works.",
    content: [
      "The Maasai are the people of these plains — and travelling through their country well means understanding how their world works.",
      "",
      "## What you are seeing",
      "The Maasai are semi-nomadic pastoralists whose culture centres on cattle, age-grades, and a deep knowledge of the land. The famous red shukas, beadwork and jumping dances are real — not a show — but they are one part of a whole way of life.",
      "",
      "## How to visit well",
      "- **Ask, don't assume.** Villages are open to guests by invitation and arrangement",
      "- **Let your guide negotiate the visit fee** — it supports the community",
      "- **Ask questions** — most Maasai host visitors with genuine warmth and humour",
      "- **Dress modestly** and take photos only with permission (a donation is appreciated)",
      "- **Buy beadwork directly** from the women who make it — it is beautiful and it pays for school",
      "",
      "## The bigger picture",
      "Many of the conservancies we visit are **Maasai-owned and Maasai-led** — lease payments for wildlife protection fund schools, clinics and water. Your safari fee is part of that circle.",
      "",
      "> The best cultural visits are unhurried and two-way. We build them into our itineraries with people we know by name."
    ].join("\n"),
  },
  {
    slug: "booking-your-safari",
    title: "How to Book a Safari (Without Getting Scammed)",
    category: "Travel Guide",
    image: u(IMG.group),
    imageAlt: "A small group gathering at a campfire at dusk",
    publishedAt: "2026-09-02",
    excerpt: "A safari is a big-ticket purchase, and the market is full of middlemen. Here is how to book safely.",
    content: [
      "A safari is a big-ticket purchase, and the market is full of middlemen. Here is how to book safely.",
      "",
      "## The five checks",
      "1. **Book directly with an operator in the destination country** — ideally one that owns or partners with its own vehicles and camps",
      "2. **Verify the licence** — in Kenya, a valid tour operator licence from the Ministry of Tourism",
      "3. **Pay deposits to a company account, not a personal one** — and use cards or wire transfers with paper trails",
      "4. **Get a written itinerary** — nights, camps, drives, meals, park fees, and what is not included",
      "5. **Ask for recent client references** — and actually email them",
      "",
      "## Red flags",
      "- Prices far below the market (lodges publish rates; check them)",
      "- Pressure to pay the full amount in advance",
      "- An operator who can't tell you the exact camp names and dates",
      "- WhatsApp-only contact with no office, website or reviews",
      "",
      "## How it should feel",
      "A good operator answers within a day, sends a clear written quote, explains everything, and treats your questions as part of the job. You should feel informed — never rushed.",
      "",
      "> We book a share of our clients' trips through other operators, and we have seen the whole spectrum. Ask us anything — honest answers are free."
    ].join("\n"),
  },
];
/* ---------------------------------------------------------- destinations */
type SeedDestination = {
  slug: string;
  name: string;
  region: string;
  description: string;
  image: string;
  imageAlt: string;
  latitude: number;
  longitude: number;
  bestExperiences: string[];
  trips: string[]; // adventure slugs
  images?: string[]; // optional extra gallery (first = hero)
};

export const destinations: SeedDestination[] = [
  {
    slug: "nairobi",
    name: "Nairobi",
    region: "The Capital",
    description:
      "The Green City in the Sun — where skyscrapers meet national park savannah and the spirit of Karen Blixen still drifts through the suburbs. The perfect beginning or end to any journey.",
    image: u(IMG.giraffe),
    imageAlt: "Giraffes feeding in the leafy gardens of the Giraffe Centre",
    latitude: -1.2921,
    longitude: 36.8219,
    bestExperiences: [
      "Giraffe Centre",
      "Karen Blixen Museum",
      "Sheldrick Elephant Orphanage",
      "Nairobi National Park",
    ],
    trips: ["nairobi-experiences", "maasai-mara-safari"],
  },
  {
    slug: "maasai-mara",
    name: "Maasai Mara",
    region: "The Great Rift Valley",
    description:
      "The world's most celebrated wildlife reserve — endless golden plains, the Big Five, and the great wildebeest migration surging across the Mara River. Kenya at its most cinematic.",
    image: u(IMG.lion),
    imageAlt: "A lion in the golden grass of the Maasai Mara",
    latitude: -1.4766,
    longitude: 35.0506,
    bestExperiences: [
      "Big Five game drives",
      "Balloon safari at dawn",
      "Migration river crossings",
      "Maasai village visits",
    ],
    trips: ["maasai-mara-safari", "great-migration-safari"],
  },
  {
    slug: "amboseli",
    name: "Amboseli",
    region: "The Amboseli Basin",
    description:
      "A kingdom of elephants beneath the silhouette of Kilimanjaro — the finest mountain view in Africa, mirrored in the park's seasonal swamps.",
    image: u(IMG.elephant),
    imageAlt: "Elephant herds on the plains of Amboseli",
    latitude: -2.65,
    longitude: 37.2667,
    bestExperiences: [
      "Elephant herds & matriarchs",
      "Kilimanjaro viewpoints",
      "Observation Hill at sunset",
      "Maasai community visits",
    ],
    trips: ["amboseli-elephant-safari"],
  },
  {
    slug: "mount-kenya",
    name: "Mount Kenya",
    region: "The Equatorial Highlands",
    description:
      "Africa's second-highest peak — glaciers on the equator, bamboo forests, and summit sunrises that stay with you for life. Sacred to the Kikuyu, magnificent to everyone.",
    image: u(IMG.snowMountain),
    imageAlt: "Glaciers and snowfields on Mount Kenya's peaks",
    latitude: -0.15,
    longitude: 37.3,
    bestExperiences: [
      "Point Lenana summit",
      "Equatorial glacier views",
      "Bamboo & moorland trekking",
      "Mountain lodge stays",
    ],
    trips: ["mount-kenya-adventure", "luxury-highlands-retreat"],
  },
  {
    slug: "hells-gate",
    name: "Hell's Gate",
    region: "The Rift Valley",
    description:
      "A red-walled volcanic gorge that inspired Pride Rock — hike it, climb it, cycle it. Geothermal steam, towering cliffs and zebra herds along the valley floor.",
    image: u(IMG.hiker),
    imageAlt: "Cliffs and trails of Hell's Gate National Park",
    latitude: -0.9056,
    longitude: 36.3097,
    bestExperiences: [
      "Fischer's Tower ascent",
      "Gorge hiking & climbing",
      "Cycling the valley floor",
      "Geothermal hot springs",
    ],
    trips: ["hells-gate-expedition"],
  },
  {
    slug: "lake-naivasha",
    name: "Lake Naivasha",
    region: "The Rift Valley",
    description:
      "The Rift's freshwater jewel — hippos, pelicans and papyrus at dawn, and more bird species than almost anywhere else in Kenya. Gentle, restorative, unmissable.",
    image: u(IMG.lakeHouse),
    imageAlt: "Sunrise light over Lake Naivasha's calm waters",
    latitude: -0.7594,
    longitude: 36.3894,
    bestExperiences: [
      "Sunset boat cruises",
      "Crescent Island walks",
      "Birdwatching (400+ species)",
      "Lakeside dining",
    ],
    trips: ["lake-naivasha-escape"],
  },
  {
    slug: "suswa",
    name: "Mount Suswa",
    region: "The Rift Valley",
    description:
      "A shield volcano with the longest lava tubes in Kenya — cathedral caves, twin craters, and a sacred baboon sanctuary. Wild, off-radar and unforgettable.",
    image: u(IMG.mistyHills),
    imageAlt: "The volcanic slopes of Mount Suswa in morning mist",
    latitude: -1.1333,
    longitude: 36.35,
    bestExperiences: [
      "Lava tube exploration",
      "Crater rim hikes",
      "Baboon sanctuary visits",
      "Star-gazing camps",
    ],
    trips: ["suswa-crater-hike"],
  },
  {
    slug: "the-coast",
    name: "The Kenyan Coast",
    region: "The Indian Ocean",
    description:
      "Diani's white sands, Watamu's coral gardens, ancient baobabs and Swahili hospitality. Where Africa meets the Indian Ocean in turquoise and gold.",
    image: u(IMG.beachPalms),
    imageAlt: "Palm-fringed white sand on the Kenyan coast",
    latitude: -4.317,
    longitude: 39.58,
    bestExperiences: [
      "Dhow sailing & snorkelling",
      "Marine park turtle encounters",
      "Beach villa stays",
      "Swahili coastal cuisine",
    ],
    trips: ["kenyan-coast-retreat"],
  },
  {
    slug: "lamu",
    name: "Lamu",
    region: "The Lamu Archipelago",
    description:
      "Kenya's timeless Swahili island — a UNESCO stone town of carved doors and narrow alleys, where the only traffic is donkeys and dhows. Slow travel at its finest.",
    image: u(IMG.beachAerial),
    imageAlt: "Turquoise shallows and white sand around Lamu island",
    latitude: -2.2719,
    longitude: 40.9021,
    bestExperiences: [
      "Stone town walking tours",
      "Sunset dhow sails",
      "Swahili architecture walks",
      "Beachfront slow mornings",
    ],
    trips: ["lamu-island-escape"],
  },
  {
    slug: "samburu",
    name: "Samburu",
    region: "The Northern Frontier",
    description:
      "The land of the rare — reticulated giraffe, Grevy's zebra and beisa oryx on a sun-scorched riverine wilderness shared with the proud Samburu people.",
    image: u(IMG.leopard),
    imageAlt: "A leopard on a rocky kopje in Samburu",
    latitude: 0.9167,
    longitude: 37.5833,
    bestExperiences: [
      "The Samburu Special Five",
      "Samburu cultural evenings",
      "Ewaso Ng'iro river camps",
      "Night drives",
    ],
    trips: ["samburu-safari"],
  },
  {
    slug: "lake-turkana",
    name: "Lake Turkana",
    region: "The Far North",
    description:
      "The Jade Sea — the world's largest desert lake and the cradle of humankind, where fossil finds rewrote our origins and the stars burn brighter than anywhere else.",
    image: u(IMG.sunrise),
    imageAlt: "Dawn over the jade waters of Lake Turkana",
    latitude: 3.5,
    longitude: 36.08,
    bestExperiences: [
      "Koobi Fora fossil sites",
      "Desert star camps",
      "Turkana boat journeys",
      "Northern community visits",
    ],
    trips: ["lake-turkana-expedition"],
  },
  {
    slug: "tsavo",
    name: "Tsavo",
    region: "The Southern Wilderness",
    description:
      "Kenya's oldest and largest park — red-dusted elephants, Mzima's clear springs and a wilderness so vast the man-eaters made history here.",
    image: u(IMG.lionClose),
    imageAlt: "Lion on the red plains of Tsavo",
    latitude: -3.2833,
    longitude: 38.45,
    bestExperiences: [
      "Red elephants of Tsavo",
      "Mzima Springs hippo hide",
      "Lugard Falls",
      "Tsavo railway history",
    ],
    trips: ["tsavo-crossing"],
  },
  {
    slug: "lake-nakuru",
    name: "Lake Nakuru",
    region: "The Rift Valley",
    description:
      "The pink lake of a million flamingos — and Kenya's rhino stronghold, where both black and white rhino patrol the lakeshore among hippos, lions and Rothschild's giraffes.",
    image: u(IMG.lakeCanoe),
    imageAlt: "A canoe gliding across calm lake water at dawn",
    latitude: -0.3667,
    longitude: 36.0833,
    bestExperiences: [
      "Flamingo flocks at the lakeshore",
      "Rhino sanctuary game drives",
      "Baboon Cliff viewpoints",
      "Waterbuck & buffalo sightings",
    ],
    trips: [],
  },
  {
    slug: "lake-bogoria",
    name: "Lake Bogoria",
    region: "The Rift Valley",
    description:
      "A geothermal wonderland — geysers hissing along a flamingo-pink shoreline, hot springs at 98°C, and an escarpment that plunges a kilometre into the Rift floor.",
    image: u(IMG.sunrise),
    imageAlt: "Golden sunrise light over a still lake",
    latitude: 0.25,
    longitude: 36.1,
    bestExperiences: [
      "Boiling geysers & hot springs",
      "Flamingo-viewing boardwalks",
      "Kesubo Swamp birdwatching",
      "Escarpment viewpoints",
    ],
    trips: [],
  },
  {
    slug: "lake-baringo",
    name: "Lake Baringo",
    region: "The Rift Valley",
    description:
      "A freshwater oasis where crocodiles bask on island beaches and over 470 bird species wheel overhead — the Njemps guide you by wooden boat through reeds and legends.",
    image: u(IMG.lakeCanoe),
    imageAlt: "Morning mist over a Rift Valley lake",
    latitude: 0.6333,
    longitude: 36.0667,
    bestExperiences: [
      "Njemps-guided boat safaris",
      "Crocodile island visits",
      "470+ bird species birding",
      "Fishing village walks",
    ],
    trips: [],
  },
  {
    slug: "lake-elementaita",
    name: "Lake Elementaita",
    region: "The Rift Valley",
    description:
      "The smallest of the Rift's soda lakes and a UNESCO-listed site — pink flamingo curtains, hot springs at the shore, and the golden savannah of the Soysambu conservancy around it.",
    image: u(IMG.lakesideHill),
    imageAlt: "A calm soda lake beneath the Rift Valley hills",
    latitude: -0.45,
    longitude: 36.25,
    bestExperiences: [
      "Soda lake flamingo views",
      "Soysambu conservancy drives",
      "Kekopey hot springs",
      "UNESCO Rift heritage trail",
    ],
    trips: [],
  },
  {
    slug: "lake-magadi",
    name: "Lake Magadi",
    region: "The Rift Valley",
    description:
      "A blinding white soda lake where salt crystals crunch underfoot and flamingos stand in shallows of pale pink water — otherworldly, silent, and barely an hour and a half from Nairobi.",
    image: u(IMG.savanna),
    imageAlt: "A shimmering expanse of pale savannah at dusk",
    latitude: -1.8833,
    longitude: 36.2833,
    bestExperiences: [
      "Salt flats & crystal pans",
      "Flamingo & pelican shallows",
      "Maasai lake-edge villages",
      "Scenic Rift Valley descent",
    ],
    trips: [],
  },
  {
    slug: "mount-longonot",
    name: "Mount Longonot",
    region: "The Rift Valley",
    description:
      "A perfectly symmetrical volcano rising from the Rift floor — hike the crater rim in a few hours and stand above a green crater floor where zebra and eland graze far below.",
    image: u(IMG.hiker),
    imageAlt: "A hiker on a ridgeline above the Rift Valley",
    latitude: -0.9167,
    longitude: 36.45,
    bestExperiences: [
      "Crater rim summit hike",
      "Volcanic crater floor views",
      "Buffalo & eland sightings",
      "Full-circle Rift panoramas",
    ],
    trips: [],
  },
  {
    slug: "menengai-crater",
    name: "Menengai Crater",
    region: "The Rift Valley",
    description:
      "One of the largest calderas on earth, 12 kilometres across and a kilometre deep — an extinct volcano above Nakuru where the sunrise floods the Rift Valley in liquid gold.",
    image: u(IMG.mountainRange),
    imageAlt: "A vast volcanic crater rim against a mountain landscape",
    latitude: -0.2,
    longitude: 36.0667,
    bestExperiences: [
      "Caldera rim sunrise",
      "Forest drives inside the crater",
      "Nakuru city panoramas",
      "Bird of prey flypasts",
    ],
    trips: [],
  },
  {
    slug: "lake-sonachi",
    name: "Lake Sonachi",
    region: "The Rift Valley",
    description:
      "A hidden emerald-green crater lake wrapped in volcanic forest — a twenty-minute detour from Naivasha where you may have the entire shore to yourself and the flamingos.",
    image: u(IMG.mountainLake),
    imageAlt: "A turquoise lake nestled inside a forested crater",
    latitude: -0.7833,
    longitude: 36.3333,
    bestExperiences: [
      "Green crater lake walk",
      "Crater rim viewpoints",
      "Private lakeside picnic spots",
      "Flamingo & hippo sightings",
    ],
    trips: [],
  },
  {
    slug: "kerio-valley",
    name: "Kerio Valley",
    region: "The Rift Valley",
    description:
      "Kenya's Grand Canyon — a lush, red-walled valley plunging between the Elgeyo Escarpment and the Tugen Hills, dotted with villages, fig forests and the green ribbon of the Kerio River.",
    image: u(IMG.escarpment),
    imageAlt: "A dramatic green valley carved between high escarpments",
    latitude: 0.75,
    longitude: 35.7,
    bestExperiences: [
      "Escarpment viewpoint drives",
      "Kerio River exploration",
      "Fig forest walks",
      "Traditional village visits",
    ],
    trips: [],
  },
  {
    slug: "olorgesailie",
    name: "Olorgesailie",
    region: "The Rift Valley",
    description:
      "One of Africa's most important prehistoric sites — 1.2 million years of hand-axe 'factories' scattered across a dry lake bed, where early humans made tools in the shadow of the Rift.",
    image: u(IMG.sunset),
    imageAlt: "A wide golden landscape under a dramatic evening sky",
    latitude: -1.5667,
    longitude: 36.45,
    bestExperiences: [
      "Stone-age tool sites",
      "National Museum exhibits",
      "Fossil walk trails",
      "Rift Valley panoramas",
    ],
    trips: [],
  },
  {
    slug: "hyrax-hill",
    name: "Hyrax Hill",
    region: "The Rift Valley",
    description:
      "A prehistoric settlement site overlooking Lake Nakuru — Iron Age villages and Stone Age burial mounds that have kept archaeologists busy for nearly a century, with the flamingo lake below.",
    image: u(IMG.lakesideHill),
    imageAlt: "A lakeside hill rising above calm water",
    latitude: -0.2833,
    longitude: 36.05,
    bestExperiences: [
      "Iron Age settlement ruins",
      "Stone Age burial mounds",
      "Lake Nakuru viewpoints",
      "Archaeology museum tour",
    ],
    trips: [],
  },
  {
    slug: "kariandusi",
    name: "Kariandusi",
    region: "The Rift Valley",
    description:
      "An early Stone Age site beside the Gilgil River — hand axes and obsidian blades in a landscape of shimmering diatomite hills, evidence of some of the earliest tool-making in East Africa.",
    image: u(IMG.paleHills),
    imageAlt: "Rolling pale hills under a wide sky",
    latitude: -0.45,
    longitude: 36.2667,
    bestExperiences: [
      "Acheulean hand-axe site",
      "Diatomite hill walks",
      "Rift Valley scenery",
      "Early man heritage trail",
    ],
    trips: [],
  },
  {
    slug: "nairobi-national-park",
    name: "Nairobi National Park",
    region: "The Capital",
    description:
      "The only national park in the world bordering a capital city — lions and black rhino against a skyline of skyscrapers, twenty minutes from downtown Nairobi.",
    image: u(IMG.lions),
    imageAlt: "Lions resting on a grassy plain",
    latitude: -1.3667,
    longitude: 36.85,
    bestExperiences: [
      "Black rhino sanctuary drives",
      "Ivory burning site monument",
      "Lion sightings against the skyline",
      "Walking trails at the edge",
    ],
    trips: ["nairobi-experiences"],
  },
  {
    slug: "ngong-hills",
    name: "Ngong Hills",
    region: "The Capital",
    description:
      "The seven green hills of Karen Blixen's 'Out of Africa' — a long, breezy ridge walk with Nairobi at your back and the Great Rift Valley falling away to the west.",
    image: u(IMG.greenMountains),
    imageAlt: "Green rolling hills under a bright sky",
    latitude: -1.4,
    longitude: 36.65,
    bestExperiences: [
      "Ridge hike across seven hills",
      "Rift Valley rim viewpoints",
      "Out of Africa film locations",
      "Sunrise & sunset walks",
    ],
    trips: [],
  },
  {
    slug: "karura-forest",
    name: "Karura Forest",
    region: "The Capital",
    description:
      "A thousand hectares of indigenous forest inside Nairobi — waterfalls, wild coffee groves and 50 kilometres of cycling and walking trails in the heart of the city.",
    image: u(IMG.forest),
    imageAlt: "Sunlight filtering through tall forest trees",
    latitude: -1.25,
    longitude: 36.8167,
    bestExperiences: [
      "Forest cycling trails",
      "Waterfall picnic spots",
      "Birdwatching & monkey spotting",
      "Mau Mau caves walk",
    ],
    trips: [],
  },
  {
    slug: "meru-national-park",
    name: "Meru National Park",
    region: "The Eastern Frontier",
    description:
      "The untamed wilderness of 'Born Free' — 13 rivers and 13 ecosystems where Elsa the lioness roamed, and elephants, Grevy's zebra and leopards still move through riverine forests.",
    image: u(IMG.leopardTwo),
    imageAlt: "A leopard resting on a rocky outcrop",
    latitude: 0.1667,
    longitude: 38.1667,
    bestExperiences: [
      "Elsa's grave pilgrimage",
      "Riverine forest game drives",
      "George Adamson's camp sites",
      "Big cat sightings",
    ],
    trips: [],
  },
  {
    slug: "ol-pejeta",
    name: "Ol Pejeta Conservancy",
    region: "Laikipia",
    description:
      "East Africa's largest black rhino sanctuary — home to the last two northern white rhinos on earth, a chimpanzee sanctuary, and some of the most abundant game in Laikipia.",
    image: u(IMG.elephant),
    imageAlt: "An elephant walking across open plains",
    latitude: 0.05,
    longitude: 36.9667,
    bestExperiences: [
      "Rare northern white rhinos",
      "Sweetwaters chimpanzee sanctuary",
      "Night game drives",
      "Conservancy nature walks",
    ],
    trips: [],
  },
  {
    slug: "lewa",
    name: "Lewa Wildlife Conservancy",
    region: "Laikipia",
    description:
      "A UNESCO World Heritage site where rhino numbers are the success story of African conservation — fenceless wilderness of Grevy's zebra, wild dogs and Mount Kenya views.",
    image: u(IMG.savannaDusk),
    imageAlt: "Golden savannah light at dusk",
    latitude: 0.1667,
    longitude: 37.4167,
    bestExperiences: [
      "Rhino conservation drives",
      "Grevy's zebra sightings",
      "Wild dog tracking",
      "Mount Kenya backdrops",
    ],
    trips: [],
  },
  {
    slug: "ngare-ndare",
    name: "Ngare Ndare Forest",
    region: "Laikipia",
    description:
      "A 150-year-old forest of towering cedars and podo trees with a canopy walkway suspended 11 metres up — plunge pools, waterfalls and elephant herds beneath Mount Kenya.",
    image: u(IMG.tallForest),
    imageAlt: "A canopy of tall forest trees meeting the sky",
    latitude: 0.2333,
    longitude: 37.3,
    bestExperiences: [
      "Canopy walkway crossing",
      "Natural pool swimming",
      "Waterfall trails",
      "Elephant forest sightings",
    ],
    trips: [],
  },
  {
    slug: "shaba-national-reserve",
    name: "Shaba National Reserve",
    region: "The Northern Frontier",
    description:
      "A starkly beautiful wilderness of gorges, springs and palm oases — where Born Free was filmed and where leopards, lions and the rare gerenuk make their home in the volcanic hills.",
    image: u(IMG.escarpment),
    imageAlt: "Dry volcanic hills in the northern frontier",
    latitude: 0.75,
    longitude: 37.8,
    bestExperiences: [
      "Born Free film locations",
      "Spring & gorge walks",
      "Gerenuk & oryx sightings",
      "Birdlife of the north",
    ],
    trips: [],
  },
  {
    slug: "buffalo-springs",
    name: "Buffalo Springs",
    region: "The Northern Frontier",
    description:
      "The northern twin of Samburu — dry acacia country around a bright spring where elephants wallow, reticulated giraffe and Grevy's zebra graze, and big cats wait in the riverine shade.",
    image: u(IMG.savannaDusk),
    imageAlt: "Acacia savannah at golden hour",
    latitude: 0.6667,
    longitude: 37.55,
    bestExperiences: [
      "Samburu Special Five sightings",
      "Buffalo Springs oasis walks",
      "Big cat riverine drives",
      "Semi-desert scenery",
    ],
    trips: [],
  },
  {
    slug: "marsabit-national-park",
    name: "Marsabit National Park",
    region: "The Northern Frontier",
    description:
      "A misty forested volcano rising from the Chalbi desert — giant-tusked elephants, crater lakes of green jade, and the legendary Ahmed, whose 148-kilo tusks rest in Nairobi's museum.",
    image: u(IMG.desertPeaks),
    imageAlt: "A mountain rising above clouds at night",
    latitude: 2.3167,
    longitude: 37.9833,
    bestExperiences: [
      "Big-tusker elephant sightings",
      "Crater lake hikes",
      "Cloud forest walks",
      "Ahmed the elephant legend",
    ],
    trips: [],
  },
  {
    slug: "sibiloi-national-park",
    name: "Sibiloi National Park",
    region: "The Northern Frontier",
    description:
      "The 'Cradle of Humankind' on the jade shores of Lake Turkana — where the 1.9-million-year-old Turkana Boy was found, among fossil fields that rewrite the story of our origins.",
    image: u(IMG.highlandRange),
    imageAlt: "A remote desert mountain landscape",
    latitude: 4.0,
    longitude: 36.3333,
    bestExperiences: [
      "Koobi Fora fossil beds",
      "Turkana Boy discovery site",
      "Petrified forest walk",
      "Desert-star camping",
    ],
    trips: [],
  },
  {
    slug: "mount-kulal",
    name: "Mount Kulal",
    region: "The Northern Frontier",
    description:
      "A cloud-capped mountain in the north where forest clings to volcanic slopes above a desert — an extraordinary island of green and a sacred home for Gabra herders.",
    image: u(IMG.snowPeaks),
    imageAlt: "Snow-capped peaks above a distant valley",
    latitude: 2.7167,
    longitude: 36.9167,
    bestExperiences: [
      "Cloud forest walks",
      "Desert-to-mountain drives",
      "Gabra cultural visits",
      "Birding & raptor sightings",
    ],
    trips: [],
  },
  {
    slug: "chalbi-desert",
    name: "Chalbi Desert",
    region: "The Northern Frontier",
    description:
      "A vast white clay desert stretching to the Ethiopian border — salt flats, mirage roads, camel caravans and an expanse of silence that feels like the edge of the world.",
    image: u(IMG.escarpment),
    imageAlt: "An endless pale desert under a burning sky",
    latitude: 2.5,
    longitude: 37.3333,
    bestExperiences: [
      "Salt flat crossings",
      "Camel caravan encounters",
      "Desert camping under stars",
      "Mirage & dune scenery",
    ],
    trips: [],
  },
  {
    slug: "suguta-valley",
    name: "Suguta Valley",
    region: "The Northern Frontier",
    description:
      "One of the hottest places on earth and among the most beautiful — a dried-up lake bed of cracked clay and sand dunes between volcanic ranges, utterly empty and utterly immense.",
    image: u(IMG.dryValley),
    imageAlt: "A vast arid valley floor under a hazy sky",
    latitude: 1.8,
    longitude: 36.3833,
    bestExperiences: [
      "Dune & clay flat exploration",
      "Volcanic range viewpoints",
      "Extreme-remote 4x4 routes",
      "Night skies with zero light",
    ],
    trips: [],
  },
  {
    slug: "chyulu-hills",
    name: "Chyulu Hills",
    region: "The Southern Highlands",
    description:
      "A young volcanic range of rolling green ridges and deep lava caves — cheetah and elephant roam the grasslands while Kilimanjaro glows on the southern horizon.",
    image: u(IMG.mistyHills),
    imageAlt: "Misty green volcanic hills at dawn",
    latitude: -2.6,
    longitude: 37.9,
    bestExperiences: [
      "Leviathan cave exploration",
      "Horse & hiking trails",
      "Kilimanjaro viewpoints",
      "Cheetah grassland sightings",
    ],
    trips: [],
  },
  {
    slug: "shimba-hills",
    name: "Shimba Hills",
    region: "The Coast",
    description:
      "A misty coastal rainforest plateau above the sea — sable antelope, elephants, a rainforest boardwalk and Sheldrick Falls, plus views that sweep from the Rift to Mombasa.",
    image: u(IMG.tallForest),
    imageAlt: "Tall rainforest trees in morning mist",
    latitude: -4.25,
    longitude: 39.4,
    bestExperiences: [
      "Sheldrick Falls trek",
      "Sable antelope viewing",
      "Rainforest canopy walk",
      "Elephant herd sightings",
    ],
    trips: [],
  },
  {
    slug: "arabuko-sokoke",
    name: "Arabuko-Sokoke Forest",
    region: "The Coast",
    description:
      "East Africa's largest remnant of coastal dry forest — six endemic species found nowhere else on earth, including the golden-rumped elephant shrew and the Sokoke scops owl.",
    image: u(IMG.forest),
    imageAlt: "Sunlight dappling through dry coastal forest",
    latitude: -3.3333,
    longitude: 39.8333,
    bestExperiences: [
      "Guided forest walks",
      "Sokoke scops owl birding",
      "Moth night safaris",
      "Endemic wildlife trails",
    ],
    trips: [],
  },
  {
    slug: "mombasa",
    name: "Mombasa",
    region: "The Coast",
    description:
      "Kenya's historic island city — Fort Jesus, the spice-scented Old Town, dhows in the harbour and beaches a boat ride away. Four hundred years of trade in a few square kilometres.",
    image: u(IMG.coastAerial),
    imageAlt: "A tropical coast seen from above",
    latitude: -4.0435,
    longitude: 39.6682,
    bestExperiences: [
      "Fort Jesus guided tour",
      "Old Town walking tour",
      "Dhow harbour cruises",
      "Spice market & Swahili food",
    ],
    trips: ["kenyan-coast-retreat"],
  },
  {
    slug: "diani-beach",
    name: "Diani Beach",
    region: "The Coast",
    description:
      "Seven miles of powder-white sand fringed by baobabs and backed by coral — consistently voted one of Africa's best beaches, with diving, kitesurfing and dhow trips at your door.",
    image: u(IMG.beach),
    imageAlt: "White sand meeting turquoise Indian Ocean water",
    latitude: -4.3333,
    longitude: 39.5667,
    bestExperiences: [
      "Dhow sunset cruises",
      "Coral reef snorkelling",
      "Kite & windsurfing",
      "Beachfront seafood dining",
    ],
    trips: ["kenyan-coast-retreat"],
  },
  {
    slug: "malindi",
    name: "Malindi",
    region: "The Coast",
    description:
      "A historic Swahili trading town where Vasco da Gama's coral pillar still stands — Italian cafés, marine parks, Gede's forest ruins and the mouth of the Sabaki River.",
    image: u(IMG.beachPalms),
    imageAlt: "Palm trees leaning over white sand",
    latitude: -3.2167,
    longitude: 40.1167,
    bestExperiences: [
      "Vasco da Gama pillar",
      "Malindi Marine Park boat trips",
      "Gede ruins excursion",
      "Sabaki estuary birding",
    ],
    trips: ["kenyan-coast-retreat"],
  },
  {
    slug: "watamu",
    name: "Watamu",
    region: "The Coast",
    description:
      "A barefoot village between coral reef and creek — green turtles nest on the beaches, Mida Creek fills with birds, and the marine park is a kaleidoscope of reef fish.",
    image: u(IMG.beachAerial),
    imageAlt: "Aerial view of turquoise water and white sand",
    latitude: -3.35,
    longitude: 40.0167,
    bestExperiences: [
      "Watamu Marine Park snorkelling",
      "Mida Creek boardwalk",
      "Turtle nesting & sanctuary",
      "Glass-bottom boat rides",
    ],
    trips: ["kenyan-coast-retreat"],
  },
  {
    slug: "kilifi",
    name: "Kilifi",
    region: "The Coast",
    description:
      "A sleepy creek town with a long history — the 14th-century Mnarani ruins on a cliff, mangroves gliding beneath you, and a growing heartbeat of cafés and beach life.",
    image: u(IMG.coastShore),
    imageAlt: "A quiet beach at golden hour",
    latitude: -3.6333,
    longitude: 39.85,
    bestExperiences: [
      "Mnarani ruins & mosques",
      "Creek boat excursions",
      "Bofa beach walks",
      "Mangrove kayaking",
    ],
    trips: [],
  },
  {
    slug: "gede-ruins",
    name: "Gede Ruins",
    region: "The Coast",
    description:
      "A lost 13th-century Swahili city swallowed by forest — coral walls, pillar tombs and a palace of 40 rooms half-buried in fig roots, with a rare golden-rumped elephant shrew in the undergrowth.",
    image: u(IMG.tallForest),
    imageAlt: "Ancient stone ruins wrapped in forest roots",
    latitude: -3.3167,
    longitude: 40.0167,
    bestExperiences: [
      "Lost city guided tour",
      "Pillar tomb exploration",
      "Forest wildlife walk",
      "Museum & history exhibits",
    ],
    trips: [],
  },
  {
    slug: "wasini-island",
    name: "Wasini Island",
    region: "The Coast",
    description:
      "A tiny Swahili island where the only vehicles are bicycles — take a dhow through the coral gardens of Kisite-Mpunguti Marine Park, swim with dolphins and eat fresh seafood in a shaded village courtyard.",
    image: u(IMG.beachPalms),
    imageAlt: "Palm trees over a tranquil island beach",
    latitude: -4.6667,
    longitude: 39.3667,
    bestExperiences: [
      "Kisite-Mpunguti snorkelling",
      "Dolphin-watching dhow trips",
      "Coral garden reefs",
      "Swahili seafood lunches",
    ],
    trips: [],
  },
  {
    slug: "funzi-island",
    name: "Funzi Island",
    region: "The Coast",
    description:
      "A hidden mangrove-fringed island reached only by boat — narrow creeks, a fishing village that welcomes slow visitors, and nothing but water, sky and silence.",
    image: u(IMG.beachAerial),
    imageAlt: "Turquoise shallows around a small island",
    latitude: -4.55,
    longitude: 39.3833,
    bestExperiences: [
      "Mangrove creek cruises",
      "Village hospitality visits",
      "Dhow island transfers",
      "Seafood beach dinners",
    ],
    trips: [],
  },
  {
    slug: "kiunga-marine",
    name: "Kiunga Marine Reserve",
    region: "The Coast",
    description:
      "Kenya's wild northern reef frontier — a chain of 50 islands and coral gardens near the Somali border, where dugongs graze seagrass beds and turtles nest on untouched shores.",
    image: u(IMG.coastAerial),
    imageAlt: "Coral reefs visible through clear water",
    latitude: -1.75,
    longitude: 41.4833,
    bestExperiences: [
      "Dugong & turtle sightings",
      "Untouched island snorkelling",
      "Seagrass bed exploration",
      "Remote dhow sailing",
    ],
    trips: [],
  },
  {
    slug: "tana-river",
    name: "Tana River Primate Reserve",
    region: "The Coast",
    description:
      "Kenya's longest river meets a gallery of riverine forest sheltering two critically endangered primates found nowhere else — the Tana River mangabey and the red colobus.",
    image: u(IMG.forest),
    imageAlt: "A broad river winding through forest",
    latitude: -1.9167,
    longitude: 40.1333,
    bestExperiences: [
      "Mangabey & colobus tracking",
      "River forest walks",
      "Boat rides on the Tana",
      "Birdlife of the delta",
    ],
    trips: [],
  },
  {
    slug: "saiwa-swamp",
    name: "Saiwa Swamp",
    region: "The Western Highlands",
    description:
      "Kenya's smallest national park hides its rarest secret — the shy, semi-aquatic sitatunga antelope, viewed from elevated boardwalks across papyrus and forest.",
    image: u(IMG.hikeTrail),
    imageAlt: "A boardwalk trail through wetland vegetation",
    latitude: 1.0833,
    longitude: 35.0667,
    bestExperiences: [
      "Sitatunga boardwalk safari",
      "Papyrus swamp birding",
      "Monkey & otter spotting",
      "Guided nature walks",
    ],
    trips: [],
  },
  {
    slug: "ruma-national-park",
    name: "Ruma National Park",
    region: "The Lake Victoria Basin",
    description:
      "Kenya's only home for the roan antelope — a quiet, rarely visited park of red hills and golden grassland on the shores of Lake Victoria, with over 400 bird species.",
    image: u(IMG.sunset),
    imageAlt: "Golden grassland at dusk",
    latitude: -0.6667,
    longitude: 34.3333,
    bestExperiences: [
      "Roan antelope viewing",
      "Lake Victoria birding",
      "Rare game drives",
      "Remote park camping",
    ],
    trips: [],
  },
  {
    slug: "kakamega-forest",
    name: "Kakamega Forest",
    region: "The Western Highlands",
    description:
      "Kenya's only tropical rainforest — a green cathedral of towering trees, waterfalls and 400 bird species, with De Brazza's monkeys and blue turacos in the canopy.",
    image: u(IMG.forest),
    imageAlt: "Rainforest canopy with shafts of sunlight",
    latitude: 0.2833,
    longitude: 34.8667,
    bestExperiences: [
      "Guided forest trails",
      "Blue turaco birding",
      "De Brazza's monkey spotting",
      "Forest waterfall walks",
    ],
    trips: [],
  },
  {
    slug: "mount-elgon",
    name: "Mount Elgon",
    region: "The Western Highlands",
    description:
      "Kenya's oldest extinct volcano — a massive caldera and caves where elephants still dig for salt in the dark, alongside Britain's second-highest mountain across the border.",
    image: u(IMG.snowMountain),
    imageAlt: "A tall volcanic mountain above the clouds",
    latitude: 1.1167,
    longitude: 34.55,
    bestExperiences: [
      "Kitum Cave elephant trails",
      "Caldera rim trekking",
      "Mountain forest birding",
      "Hot springs on the slopes",
    ],
    trips: [],
  },
  {
    slug: "kisumu",
    name: "Kisumu & Lake Victoria",
    region: "The Lake Victoria Basin",
    description:
      "Kenya's lakeside city on the shores of the world's largest tropical lake — sunset dhow rides, buzzing fish markets, and easy access to the islands and ruins of the Victoria basin.",
    image: u(IMG.lakeHouse),
    imageAlt: "A calm lake at golden hour",
    latitude: -0.0917,
    longitude: 34.768,
    bestExperiences: [
      "Sunset dhow cruises",
      "Kisumu fish market tour",
      "Lake Victoria boat trips",
      "Impala Sanctuary walk",
    ],
    trips: [],
  },
  {
    slug: "rusinga-island",
    name: "Rusinga Island",
    region: "The Lake Victoria Basin",
    description:
      "A small island of green hills in Lake Victoria — fossil beds where 18-million-year-old Proconsul apes were found, warm beaches, and a slow, watery way of life.",
    image: u(IMG.lakesideHill),
    imageAlt: "A green island set in calm water",
    latitude: -0.6167,
    longitude: 34.1667,
    bestExperiences: [
      "Fossil site exploration",
      "Lake beaches & swims",
      "Fishing village visits",
      "Sunset lake views",
    ],
    trips: [],
  },
  {
    slug: "ndere-island",
    name: "Ndere Island National Park",
    region: "The Lake Victoria Basin",
    description:
      "A tiny island national park in Lake Victoria — a two-hour loop of grassy hills, hippos in the shallows, crocodiles on the rocks and birdsong from every treetop.",
    image: u(IMG.lakeCanoe),
    imageAlt: "A canoe drifting on a vast lake",
    latitude: -0.2,
    longitude: 34.5,
    bestExperiences: [
      "Island walking loop",
      "Hippo & crocodile viewing",
      "Lake birdlife walks",
      "Boat transfers from the shore",
    ],
    trips: [],
  },
  {
    slug: "kit-mikayi",
    name: "Kit Mikayi",
    region: "The Lake Victoria Basin",
    description:
      "A 40-metre rock monolith with a powerful legend — the Luo say a woman so devoted she turned to stone weeping for her husband. Sacred, strange and unforgettable.",
    image: u(IMG.paleHills),
    imageAlt: "A huge rock formation rising from green fields",
    latitude: -0.0333,
    longitude: 34.7,
    bestExperiences: [
      "Rock monolith climb",
      "Luo legend storytelling",
      "Sacred site visit",
      "Lake Victoria viewpoints",
    ],
    trips: [],
  },
  {
    slug: "thimlich-ohinga",
    name: "Thimlich Ohinga",
    region: "The Lake Victoria Basin",
    description:
      "A UNESCO World Heritage fortress of dry-stone walls built 500 years ago — a haunting prehistoric settlement of labyrinths and enclosures in the red hills near Lake Victoria.",
    image: u(IMG.sunriseField),
    imageAlt: "Ancient stone enclosures in a rolling landscape",
    latitude: -0.8833,
    longitude: 34.3167,
    bestExperiences: [
      "UNESCO heritage site tour",
      "Dry-stone fort exploration",
      "Guided history walks",
      "Lake Victoria views",
    ],
    trips: [],
  },
  {
    slug: "nanyuki",
    name: "Nanyuki & the Equator",
    region: "The Mount Kenya Highlands",
    description:
      "A frontier town at the foot of Mount Kenya — stand astride the equator, sip coffee in airfield cafés, and take the gateway roads up the mountain or out to the Laikipia plains.",
    image: u(IMG.highlandRange),
    imageAlt: "Highland landscape beneath a mountain",
    latitude: 0.0167,
    longitude: 37.0667,
    bestExperiences: [
      "Equator line experience",
      "Mount Kenya base views",
      "Coffee & farm tours",
      "Boutique highland dining",
    ],
    trips: [],
  },
  {
    slug: "aberdare-national-park",
    name: "Aberdare National Park",
    region: "The Mount Kenya Highlands",
    description:
      "A misty range of moorland, forest and waterfalls — watch elephants and bongo from Treetops lodge, hike the moorlands, and stand at the point where the equator splits the mountain.",
    image: u(IMG.mistyHills),
    imageAlt: "Misty moorland ridges at dawn",
    latitude: -0.4167,
    longitude: 36.65,
    bestExperiences: [
      "Treetops night game viewing",
      "Karuru & Gura Falls hikes",
      "Moorland walks",
      "Bongo & buffalo sightings",
    ],
    trips: [],
  },
  /* ---------------------------------------------------------- TANZANIA */
  {
    slug: "kilimanjaro",
    name: "Mount Kilimanjaro",
    region: "Northern Tanzania",
    description:
      "Africa's highest peak, rising 5,895 metres from the savannah — climb through rainforest, moorland and arctic desert to the snows of Uhuru Peak, with a sunrise above the clouds that resets everything.",
    image: u(IMG.elephantsKili),
    imageAlt: "Elephants moving across the plains beneath Kilimanjaro's snows",
    latitude: -3.067,
    longitude: 37.355,
    bestExperiences: [
      "Uhuru Peak summit at 5,895 m",
      "Machame & Lemosho trekking routes",
      "Glacier & crater rim sunrises",
      "Shira Plateau & Barranco Wall",
    ],
    trips: ["kilimanjaro-summit-trek"],
  },
  {
    slug: "serengeti",
    name: "Serengeti National Park",
    region: "Northern Tanzania",
    description:
      "The endless plains of the Great Migration — a million wildebeest and zebra flowing across the savannah, river crossings at the Mara, and lions on the kopjes at golden hour.",
    image: u(IMG.savanna),
    imageAlt: "Endless golden plains of the Serengeti at dusk",
    latitude: -2.333,
    longitude: 34.833,
    bestExperiences: [
      "Great Migration river crossings",
      "Kopje lion sightings",
      "Maasai & Serengeti culture visits",
      "Hot-air balloon safaris",
    ],
    trips: ["serengeti-migration-safari"],
  },
  {
    slug: "ngorongoro",
    name: "Ngorongoro Crater",
    region: "Northern Tanzania",
    description:
      "A 600-metre-deep volcanic caldera sealed like a natural zoo — the Big Five in one morning, flamingo lakes, hippo pools, and Maasai herders moving cattle along the rim.",
    image: u(IMG.sunset),
    imageAlt: "Golden light over the crater rim of Ngorongoro",
    latitude: -3.175,
    longitude: 35.546,
    bestExperiences: [
      "Crater floor game drives",
      "Black rhino sightings",
      "Olduvai Gorge & human origins",
      "Maasai rim villages",
    ],
    trips: ["ngorongoro-crater-safari", "serengeti-migration-safari"],
  },
  {
    slug: "zanzibar",
    name: "Zanzibar",
    region: "The Zanzibar Archipelago",
    description:
      "The Spice Island — Stone Town's carved doors and alleys, dhow sails across turquoise shallows, spice farms in the green interior, and beaches that vanish twice a day with the tide.",
    image: u(IMG.beach),
    imageAlt: "White sand and turquoise water off Zanzibar's coast",
    latitude: -6.165,
    longitude: 39.199,
    bestExperiences: [
      "Stone Town heritage walks",
      "Spice farm tours",
      "Nungwi & Paje beaches",
      "Sandbank dhow excursions",
    ],
    trips: ["zanzibar-dhow-escape"],
  },
  {
    slug: "lake-manyara",
    name: "Lake Manyara",
    region: "Northern Tanzania",
    description:
      "A shimmering soda lake beneath the Rift escarpment — tree-climbing lions draped in acacia branches, flamingo-edged shorelines, and a groundwater forest full of elephants and blue monkeys.",
    image: u(IMG.lakeCanoe),
    imageAlt: "Glass-calm water beneath the Rift Valley escarpment",
    latitude: -3.597,
    longitude: 35.833,
    bestExperiences: [
      "Tree-climbing lion viewing",
      "Flamingo & waterbird flocks",
      "Groundwater forest walks",
      "Canoe safaris at the lake edge",
    ],
    trips: ["ngorongoro-crater-safari"],
  },
  {
    slug: "tarangire",
    name: "Tarangire National Park",
    region: "Northern Tanzania",
    description:
      "Kenya's elephant country, Tanzanian style — ancient baobabs standing sentinel over the Tarangire River, elephants so many you stop counting, and leopards in the fever trees.",
    image: u(IMG.savannaDusk),
    imageAlt: "Baobabs and golden savannah at dusk in Tarangire",
    latitude: -3.833,
    longitude: 36.0,
    bestExperiences: [
      "Baobab-studded game drives",
      "Massive elephant herds",
      "Leopard & tree python sightings",
      "Sundowners over the river",
    ],
    trips: [],
  },
  {
    slug: "arusha",
    name: "Arusha & Mount Meru",
    region: "Northern Tanzania",
    description:
      "The safari capital of the north — climb Mount Meru's perfect cone above the clouds, sip coffee on lush estate tours, and meet the Maasai who brighten the market days of the city.",
    image: u(IMG.greenMountains),
    imageAlt: "Lush green hillsides rising around Arusha",
    latitude: -3.386,
    longitude: 36.683,
    bestExperiences: [
      "Mount Meru summit hike",
      "Coffee & farm estate tours",
      "Cultural heritage museum visits",
      "Gateway to the northern parks",
    ],
    trips: [],
  },
  {
    slug: "ruaha",
    name: "Ruaha National Park",
    region: "Southern Tanzania",
    description:
      "A vast, wild riverine wilderness where the Great Ruaha flows between baobabs and granite kopjes — Africa's largest elephant and wild dog populations, and almost nobody else.",
    image: u(IMG.leopardTwo),
    imageAlt: "A leopard resting on the rocks of the Ruaha river",
    latitude: -7.68,
    longitude: 34.84,
    bestExperiences: [
      "Wild dog & lion encounters",
      "Great Ruaha River drives",
      "Walking safaris with ranger guides",
      "Baobab wilderness camps",
    ],
    trips: [],
  },
  {
    slug: "nyerere-selous",
    name: "Nyerere & Selous",
    region: "Southern Tanzania",
    description:
      "One of Africa's largest protected wildernesses — boat safaris past croc-lined banks, hippo pods in the Rufiji, wild dogs on the move, and a million acres of quiet.",
    image: u(IMG.forest),
    imageAlt: "Riverine forest along the Rufiji river",
    latitude: -9.06,
    longitude: 37.52,
    bestExperiences: [
      "Boat & canoe river safaris",
      "Stiegler's Gorge viewpoints",
      "Wild dog tracking",
      "Fly-camping under the stars",
    ],
    trips: [],
  },
  {
    slug: "gombe",
    name: "Gombe Stream",
    region: "The Western Rift",
    description:
      "The steep, forested shore of Lake Tanganyika made famous by Jane Goodall — trek through vine-hung valleys to chimpanzee families who know the visitors by name.",
    image: u(IMG.tallForest),
    imageAlt: "Dense forest canopy above Lake Tanganyika",
    latitude: -4.67,
    longitude: 29.63,
    bestExperiences: [
      "Chimpanzee trekking",
      "Jane Goodall's research legacy",
      "Kakombe waterfalls",
      "Superb lakeside sunset cruises",
    ],
    trips: [],
  },
  {
    slug: "lake-natron",
    name: "Lake Natron",
    region: "Northern Tanzania",
    description:
      "A blood-red soda lake at the foot of Oldoinyo Lengai — the world's greatest flamingo breeding ground, salt crusts that crackle underfoot, and the volcano that shapes it all.",
    image: u(IMG.paleHills),
    imageAlt: "Pale salt flats of Lake Natron beneath a hazy sky",
    latitude: -2.42,
    longitude: 36.0,
    bestExperiences: [
      "Flamingo breeding colonies",
      "Oldoinyo Lengai volcano views",
      "Maasai-guided lake walks",
      "Salt crust landscapes",
    ],
    trips: [],
  },
  {
    slug: "pemba",
    name: "Pemba Island",
    region: "The Zanzibar Archipelago",
    description:
      "Zanzibar's greener, quieter sister — clove forests, mangroves and the sheer drop of the western wall, where divers drift past coral gardens few have ever seen.",
    image: u(IMG.beachAerial),
    imageAlt: "Turquoise shallows and reef around Pemba island",
    latitude: -5.25,
    longitude: 39.75,
    bestExperiences: [
      "Wall & reef diving",
      "Misali coral sanctuary",
      "Clove plantation walks",
      "Mangrove canoe trails",
    ],
    trips: [],
  },
  /* ----------------------------------------------------------- UGANDA */
  {
    slug: "bwindi",
    name: "Bwindi Impenetrable",
    region: "The Pearl of Africa",
    description:
      "Uganda's misty rainforest and the world's largest mountain gorilla population — a day with a silverback family through giant ferns is an hour you will never stop telling.",
    image: u(IMG.forest),
    imageAlt: "Mist rising through the impenetrable forest of Bwindi",
    latitude: -1.05,
    longitude: 29.62,
    bestExperiences: [
      "Mountain gorilla trekking",
      "Batwa forest heritage walks",
      "Rainforest birding & butterflies",
      "Local community visits",
    ],
    trips: ["gorilla-trek-bwindi"],
  },
  {
    slug: "murchison-falls",
    name: "Murchison Falls",
    region: "The Pearl of Africa",
    description:
      "The Victoria Nile forced through a seven-metre gorge — take the boat upriver past hippos, crocodiles and elephant herds, then stand where a whole river roars through rock.",
    image: u(IMG.waterfall),
    imageAlt: "The Nile thundering through the Murchison gorge",
    latitude: 2.267,
    longitude: 31.5,
    bestExperiences: [
      "Nile boat safari to the falls",
      "Delta cruise & shoebill storks",
      "Big game drives on the Buligi",
      "Top-of-the-falls viewpoints",
    ],
    trips: [],
  },
  {
    slug: "queen-elizabeth",
    name: "Queen Elizabeth",
    region: "The Pearl of Africa",
    description:
      "Rift plains where lions climb trees, the Kazinga Channel churns with the world's densest hippo population, and Kyambura Gorge hides chimps beneath the forest canopy.",
    image: u(IMG.savanna),
    imageAlt: "Savannah plains rolling toward the Kazinga Channel",
    latitude: -0.13,
    longitude: 30.0,
    bestExperiences: [
      "Tree-climbing lion drives",
      "Kazinga Channel cruises",
      "Hippo & elephant concentrations",
      "Kyambura chimps & crater lakes",
    ],
    trips: [],
  },
  {
    slug: "kibale",
    name: "Kibale Forest",
    region: "The Pearl of Africa",
    description:
      "The primate capital of the world — a dozen monkey species, habituated chimpanzee families, and the Bigodi swamp boardwalk that rewards slow walkers with blue-tufted starlings.",
    image: u(IMG.tallForest),
    imageAlt: "High forest canopy above the Kibale trails",
    latitude: 0.466,
    longitude: 30.4,
    bestExperiences: [
      "Chimpanzee habituation trekking",
      "Bigodi swamp boardwalk",
      "Golden monkey sightings",
      "Community-guided forest walks",
    ],
    trips: [],
  },
  {
    slug: "rwenzori",
    name: "Rwenzori Mountains",
    region: "The Pearl of Africa",
    description:
      "The Mountains of the Moon — equatorial snows, giant lobelias and six distinct vegetation zones on the way to Margherita Peak at 5,109 metres.",
    image: u(IMG.snowMountain),
    imageAlt: "Snow-capped peaks of the Rwenzori above the clouds",
    latitude: 0.39,
    longitude: 29.87,
    bestExperiences: [
      "Margherita Peak expedition",
      "Giant lobelia & groundsels",
      "Equatorial alpine trekking",
      "Bakonjo guide villages",
    ],
    trips: [],
  },
  {
    slug: "jinja",
    name: "Jinja & the Nile",
    region: "The Pearl of Africa",
    description:
      "The source of the Nile leaves Lake Victoria at Jinja — raft Grade Five rapids, kayak the Bujagali banks, and claim the bragging rights of the river's birthplace.",
    image: u(IMG.lakeCanoe),
    imageAlt: "The Nile leaving Lake Victoria between green banks",
    latitude: 0.424,
    longitude: 33.203,
    bestExperiences: [
      "Source of the Nile boat trips",
      "White-water rafting",
      "Bujagali kayaking & SUP",
      "Village & riverside cycling",
    ],
    trips: [],
  },
  {
    slug: "kidepo",
    name: "Kidepo Valley",
    region: "The Pearl of Africa",
    description:
      "Uganda's last true frontier — a vast savannah hemmed by the Narus and Morungole mountains, where cheetah sprint, ostriches strut and the Karamojong herd cattle in the shadows.",
    image: u(IMG.escarpment),
    imageAlt: "Vast plains beneath the mountains of Kidepo",
    latitude: 3.617,
    longitude: 34.125,
    bestExperiences: [
      "Cheetah & ostrich sightings",
      "Karamojong cultural evenings",
      "Mountain escarpment viewpoints",
      "Wilderness walking safaris",
    ],
    trips: [],
  },
  {
    slug: "entebbe",
    name: "Entebbe & Lake Victoria",
    region: "The Pearl of Africa",
    description:
      "Uganda's lakeside gateway — botanical gardens by the water, chimpanzees on Ngamba island, and the great lake itself glittering to the horizon exactly as the explorers found it.",
    image: u(IMG.lakeHouse),
    imageAlt: "Calm lakeside light on Lake Victoria at Entebbe",
    latitude: 0.05,
    longitude: 32.45,
    bestExperiences: [
      "Ngamba chimpanzee island",
      "Botanical gardens & birds",
      "Lakeside promenade strolls",
      "Lake Victoria sunset cruises",
    ],
    trips: [],
  },
  {
    slug: "lake-bunyonyi",
    name: "Lake Bunyonyi",
    region: "The Pearl of Africa",
    description:
      "A thousand-metre-deep lake of 29 islands terraced with green — paddle a canoe between them, climb the crater rim for the great panorama, and sleep in floating silence.",
    image: u(IMG.lakesideHill),
    imageAlt: "Terraced green hills around the islands of Bunyonyi",
    latitude: -1.3,
    longitude: 29.8,
    bestExperiences: [
      "Canoe island-hopping",
      "Crater rim viewpoints",
      "Village & terraced hill walks",
      "Lakeside birdwatching",
    ],
    trips: [],
  },
  /* ----------------------------------------------------------- RWANDA */
  {
    slug: "volcanoes",
    name: "Volcanoes National Park",
    region: "The Land of a Thousand Hills",
    description:
      "Rwanda's misty Virunga volcanoes and the gorillas that made Dian Fossey famous — trek bamboo slopes to habituated families and spend a transcendent hour in their company.",
    image: u(IMG.mistyHills),
    imageAlt: "Misty volcanic peaks of the Virunga range",
    latitude: -1.467,
    longitude: 29.49,
    bestExperiences: [
      "Mountain gorilla trekking",
      "Golden monkey tracking",
      "Bisoke & Karisimbi climbs",
      "Dian Fossey legacy walks",
    ],
    trips: ["gorilla-trek-bwindi"],
  },
  {
    slug: "nyungwe",
    name: "Nyungwe Forest",
    region: "The Land of a Thousand Hills",
    description:
      "One of Africa's oldest rainforests — walk a canopy bridge above the treetops, track chimpanzees and 12 other primate species, and follow waterfalls through orchid-covered slopes.",
    image: u(IMG.hikeTrail),
    imageAlt: "A forest trail threading through Nyungwe's canopy",
    latitude: -2.483,
    longitude: 29.187,
    bestExperiences: [
      "Canopy walkway bridge",
      "Chimpanzee & colobus troops",
      "Waterfall & tea estate trails",
      "300+ bird species birding",
    ],
    trips: [],
  },
  {
    slug: "akagera",
    name: "Akagera National Park",
    region: "The Land of a Thousand Hills",
    description:
      "The Big Five, returned to Rwanda — lions and rhinos restocked along grassy lakeside plains, with boat safaris past hippo beaches and the rare shoebill in the papyrus.",
    image: u(IMG.savannaDusk),
    imageAlt: "Savannah and lakes rolling east to the Akagera river",
    latitude: -1.85,
    longitude: 30.7,
    bestExperiences: [
      "Big Five reintroduction drives",
      "Lake Ihema boat safaris",
      "Shoebill & papyrus birding",
      "Malaria-free wilderness camping",
    ],
    trips: [],
  },
  {
    slug: "lake-kivu",
    name: "Lake Kivu",
    region: "The Land of a Thousand Hills",
    description:
      "Rwanda's great inland sea — paddle its jade waters between terraced islands, cycle the shores at Karongi, and let the green hills drop straight into the water all around.",
    image: u(IMG.lakeHouse),
    imageAlt: "Jade waters of Lake Kivu beneath green hills",
    latitude: -1.98,
    longitude: 29.25,
    bestExperiences: [
      "Island kayaking & boat trips",
      "Karongi & Kibuye shores",
      "Lakeside cycling routes",
      "Gorilla-adjacent resort stays",
    ],
    trips: [],
  },
  {
    slug: "kigali",
    name: "Kigali",
    region: "The Land of a Thousand Hills",
    description:
      "Africa's most ordered capital — gentle hills, flowered streets, world-class coffee and the Kigali Genocide Memorial, a place that turns every visit into a meditation on what a nation can become.",
    image: u(IMG.travelMap),
    imageAlt: "Planning next steps over a map in a hilltop café",
    latitude: -1.94,
    longitude: 30.06,
    bestExperiences: [
      "Kigali Genocide Memorial",
      "Inema & local arts centres",
      "Kimironko & craft markets",
      "Hilltop café & gallery culture",
    ],
    trips: [],
  },
  /* ---------------------------------------------------------- BURUNDI */
  {
    slug: "rusizi",
    name: "Rusizi National Park",
    region: "The Heart of Africa",
    description:
      "Where the Rusizi river meets Lake Tanganyika — hippo pods, crocodile beaches, sitatunga in the papyrus and more birds than people on the only lake in the world with its own tide.",
    image: u(IMG.sunriseField),
    imageAlt: "Golden light over the river mouth of Rusizi",
    latitude: -3.367,
    longitude: 29.25,
    bestExperiences: [
      "River mouth boat safaris",
      "Hippo & crocodile viewing",
      "Papyrus birdwatching",
      "Lake Tanganyika shore walks",
    ],
    trips: [],
  },
  {
    slug: "kibira",
    name: "Kibira Forest",
    region: "The Heart of Africa",
    description:
      "A high rainforest draped over the Congo-Nile divide — chimpanzee calls echoing in the mist, black colobus in the canopy, and trails where the tea picked far below is legendary.",
    image: u(IMG.tallForest),
    imageAlt: "Mist among the tall trees of Kibira",
    latitude: -2.886,
    longitude: 29.594,
    bestExperiences: [
      "Chimpanzee & colobus tracking",
      "Waterfall & canopy trails",
      "Tea estate edge walks",
      "Highland birdwatching",
    ],
    trips: [],
  },
  {
    slug: "bujumbura",
    name: "Bujumbura & Lake Tanganyika",
    region: "The Heart of Africa",
    description:
      "The lakeside capital where Stanley and Livingstone met — palm-lined beaches on the deepest lake in the Rift, markets of drums and woven baskets, and the great blue water stretching south.",
    image: u(IMG.coastShore),
    imageAlt: "A quiet lakeshore at golden hour near Bujumbura",
    latitude: -3.383,
    longitude: 29.36,
    bestExperiences: [
      "Saga & beach clubs on the lake",
      "Livingstone–Stanley monument",
      "Craft & drum markets",
      "Rusizi delta boat trips",
    ],
    trips: [],
  },
  /* --------------------------------------------------------- ETHIOPIA */
  {
    slug: "addis-ababa",
    name: "Addis Ababa",
    region: "The Horn of Africa",
    description:
      "Africa's altitude-charmed capital — meet Lucy at the National Museum, watch the city from Entoto hill, inhale coffee ceremony smoke, and walk the pulse of the continent's oldest nation.",
    image: u(IMG.group),
    imageAlt: "Coffee ceremony gathering in Addis Ababa",
    latitude: 9.02,
    longitude: 38.75,
    bestExperiences: [
      "National Museum & Lucy",
      "Entoto hills panoramas",
      "Merkato market wandering",
      "Coffee ceremony experiences",
    ],
    trips: ["lalibela-rock-churches"],
  },
  {
    slug: "lalibela",
    name: "Lalibela",
    region: "The Horn of Africa",
    description:
      "Eleven medieval churches carved downward into volcanic rock — a pilgrimage city of chanting priests, candle-lit tunnels, and the cross-shaped wonder of Bet Giyorgis.",
    image: u(IMG.paleHills),
    imageAlt: "Carved rock churches rising from the highlands of Lalibela",
    latitude: 12.03,
    longitude: 39.04,
    bestExperiences: [
      "Rock-hewn church circuits",
      "Bet Giyorgis & Timkat festivals",
      "Priest-guided history walks",
      "Highland pilgrimage atmosphere",
    ],
    trips: [],
  },
  {
    slug: "simien",
    name: "Simien Mountains",
    region: "The Horn of Africa",
    description:
      "A whale-back range of basalt escarpments called the Roof of Africa — gelada baboons in vast troops, walia ibex on the cliffs, and Ras Dashen glittering at 4,550 metres.",
    image: u(IMG.desertPeaks),
    imageAlt: "A mountain rising above the mist of Simien",
    latitude: 13.2,
    longitude: 38.07,
    bestExperiences: [
      "Gelada baboon encounters",
      "Ras Dashen trekking",
      "Escarpment viewpoint walks",
      "Walia ibex & lammergeiers",
    ],
    trips: [],
  },
  {
    slug: "danakil",
    name: "The Danakil Depression",
    region: "The Horn of Africa",
    description:
      "The harshest and most beautiful place on earth — Erta Ale's boiling lava lake, Dallol's sulfur craters in acid yellow, and camel caravans crossing salt flats shimmering at 50°C.",
    image: u(IMG.sunrise),
    imageAlt: "First light over the mineral pans of Dallol",
    latitude: 14.24,
    longitude: 40.3,
    bestExperiences: [
      "Erta Ale lava lake night hike",
      "Dallol sulfur springs",
      "Afar salt caravan encounters",
      "One of Earth's lowest points",
    ],
    trips: [],
  },
  {
    slug: "omo-valley",
    name: "The Omo Valley",
    region: "The Horn of Africa",
    description:
      "The cultural cradle of Africa — Hamer, Mursi and Karo villages along the Omo river, where body art, lip plates and market days live alongside the oldest human ways on the continent.",
    image: u(IMG.groupTwo),
    imageAlt: "Village ceremony on the banks of the Omo",
    latitude: 5.5,
    longitude: 36.0,
    bestExperiences: [
      "Hamer & Mursi village visits",
      "Karo riverside villages",
      "Tribal market days",
      "Guided cultural interpretation",
    ],
    trips: [],
  },
  {
    slug: "gondar",
    name: "Gondar",
    region: "The Horn of Africa",
    description:
      "The Camelot of Africa — a 17th-century royal city of castles and lion pools, the angel-filled ceiling of Debre Berhan Selassie, and festivals that flood the castle grounds in white.",
    image: u(IMG.highlandRange),
    imageAlt: "Highland plains rolling toward Gondar's castles",
    latitude: 12.6,
    longitude: 37.46,
    bestExperiences: [
      "Royal castle compound tour",
      "Debre Berhan Selassie church",
      "Fasiladas pools & bath",
      "Timkat festival celebrations",
    ],
    trips: [],
  },
  {
    slug: "bale",
    name: "Bale Mountains",
    region: "The Horn of Africa",
    description:
      "The Sanetti Plateau, Africa's second highest — Ethiopian wolves hunting giant mole-rats across flower-filled valleys, 4,377-metre passes, and treks that rarely see another traveller.",
    image: u(IMG.greenMountains),
    imageAlt: "Flower-covered highlands of the Bale plateau",
    latitude: 6.8,
    longitude: 39.8,
    bestExperiences: [
      "Ethiopian wolf sightings",
      "Sanetti Plateau treks",
      "Giant lobelia valleys",
      "Horse & mule safari trails",
    ],
    trips: [],
  },
  /* ----------------------------------------------------- DRC + S. SUDAN */
  {
    slug: "virunga",
    name: "Virunga National Park",
    region: "The Eastern Congo",
    description:
      "Africa's oldest park and its bravest story — mountain gorillas in the misty forests, the lava glow of Nyiragongo's crater at night, and rangers whose work has become legend.",
    image: u(IMG.mountainRange),
    imageAlt: "The Virunga volcanoes rising above the Congo basin",
    latitude: -1.05,
    longitude: 29.55,
    bestExperiences: [
      "Nyiragongo crater summit",
      "Mountain gorilla trekking",
      "Senkwekwe orphanage visits",
      "Ranger-led rainforest walks",
    ],
    trips: [],
  },
  {
    slug: "boma",
    name: "Boma National Park",
    region: "The Sudd & Beyond",
    description:
      "The continent's greatest wildlife secret — a million white-eared kob, tiang and Mongalla gazelle migrating across the plains of South Sudan with almost no one to watch them.",
    image: u(IMG.hiker),
    imageAlt: "A lone hiker on the vast plains of Boma",
    latitude: 6.3,
    longitude: 33.6,
    bestExperiences: [
      "White-eared kob migration",
      "Vast untouched savannah",
      "Community-guided expeditions",
      "Extraordinary birdlife",
    ],
    trips: [],
  },
];

/* ------------------------------------------------------------ experiences */
const experiences = [
  {
    slug: "private-adventures",
    title: "Private Adventures",
    description:
      "A journey designed entirely around you — your dates, your pace, your people. Private guides, private vehicles, and wilderness that has your name on it.",
    icon: "Compass",
    order: 1,
  },
  {
    slug: "group-expeditions",
    title: "Group Expeditions",
    description:
      "Small, hand-picked groups of kindred travellers — shared sunsets, shared stories, and the alchemy of great company in wild places.",
    icon: "Users",
    order: 2,
  },
  {
    slug: "luxury-getaways",
    title: "Luxury Getaways",
    description:
      "Private villas, tented suites and conservancy lodges where the standard is quiet and the silence is loud. East Africa, in its most polished form.",
    icon: "Gem",
    order: 3,
  },
  {
    slug: "corporate-retreats",
    title: "Corporate Retreats",
    description:
      "Boardrooms under acacia trees. Strategy sessions at sunrise, team dinners by campfire — retreats your people will actually talk about.",
    icon: "Briefcase",
    order: 4,
  },
  {
    slug: "weekend-escapes",
    title: "Weekend Escapes",
    description:
      "Two days out of the city and a world away — the Rift Valley, the coast, the mountain slopes. Recalibration, East African style.",
    icon: "CalendarDays",
    order: 5,
  },
  {
    slug: "custom-experiences",
    title: "Custom Experiences",
    description:
      "Tell us the dream. A proposal on a volcano rim, a family reunion on the coast, a film shoot in the Mara — we'll design the impossible.",
    icon: "Wand2",
    order: 6,
  },
];

/* ----------------------------------------------------------- testimonials */
const testimonials = [
  {
    name: "Amara & Kwame Ochieng",
    location: "Nairobi",
    tripType: "Honeymoon Safari",
    quote:
      "The Mara at dawn, a lion pride on a kopje, and a hot-air balloon drifting over it all — Karen Adventures gave us East Africa the way it should be experienced.",
    rating: 5,
  },
  {
    name: "Lars Meyer",
    location: "Munich",
    tripType: "Mount Kenya Trek",
    quote:
      "Every detail was handled before we even asked. We stood on Point Lenana at sunrise and still felt looked after from the very first phone call.",
    rating: 5,
  },
  {
    name: "Chloe Dubois",
    location: "Paris",
    tripType: "Coastal Escape",
    quote:
      "A private dhow at sunset off Lamu, then a beach dinner under the stars. This is what luxury travel should feel like — unhurried, personal, and entirely magical.",
    rating: 5,
  },
  {
    name: "Daniel Kamau",
    location: "Nairobi",
    tripType: "Corporate Retreat",
    quote:
      "Our retreat in the highlands was flawless — bush breakfasts, strategy under acacia trees, and a send-off that is still being talked about in the office.",
    rating: 5,
  },
  {
    name: "Jonathan & Emily Whitfield",
    location: "London",
    tripType: "Family Safari",
    quote:
      "We arrived as visitors and left as friends of the land. Karen Adventures curates the journey — but what they really do is teach you to love East Africa.",
    rating: 5,
  },
];

/* ---------------------------------------------------------------- gallery */
const gallery = [
  { image: IMG.lion, alt: "A lion resting in golden grass", category: "Safari", width: 3, height: 2 },
  { image: IMG.balloons, alt: "Hot-air balloons over the Mara at dawn", category: "Landscape", width: 3, height: 2 },
  { image: IMG.giraffe, alt: "A giraffe reaching into acacia trees", category: "Safari", width: 2, height: 3 },
  { image: IMG.beach, alt: "White sand and turquoise water", category: "Coast", width: 3, height: 2 },
  { image: IMG.waterfall, alt: "A waterfall in the highlands", category: "Landscape", width: 2, height: 3 },
  { image: IMG.campfire, alt: "Evening campfire under the stars", category: "Escape", width: 3, height: 2 },
  { image: IMG.mountainLake, alt: "A glacial lake on the mountain", category: "Landscape", width: 2, height: 3 },
  { image: IMG.poolResort, alt: "A conservancy pool at golden hour", category: "Escape", width: 3, height: 2 },
  { image: IMG.group, alt: "Guests sharing a bush dinner", category: "Culture", width: 3, height: 2 },
  { image: IMG.elephantsKili, alt: "Elephants beneath Kilimanjaro", category: "Safari", width: 3, height: 2 },
  { image: IMG.tentCamp, alt: "A tent camp beneath the mountains", category: "Escape", width: 2, height: 3 },
  { image: IMG.hotelRoom, alt: "A suite in a safari lodge", category: "Escape", width: 3, height: 2 },
  { image: IMG.savanna, alt: "Golden savannah at dusk", category: "Landscape", width: 3, height: 2 },
  { image: IMG.forest, alt: "Sun through the mountain forest", category: "Landscape", width: 2, height: 3 },
  { image: IMG.woman, alt: "A guest on a guided walk", category: "Culture", width: 3, height: 2 },
  { image: IMG.travelMap, alt: "Plotting the next journey", category: "Culture", width: 3, height: 2 },
];

/* ------------------------------------------------- destination galleries */
// A second photo for popular destinations so invoices can show two images.
/* ------------------------------------------------- destination countries */
// Seed destinations outside Kenya — everything else defaults to Kenya.
const DEST_COUNTRY: Record<string, string> = {
  // Tanzania
  "kilimanjaro": "Tanzania",
  "serengeti": "Tanzania",
  "ngorongoro": "Tanzania",
  "zanzibar": "Tanzania",
  "lake-manyara": "Tanzania",
  "tarangire": "Tanzania",
  "arusha": "Tanzania",
  "ruaha": "Tanzania",
  "nyerere-selous": "Tanzania",
  "gombe": "Tanzania",
  "lake-natron": "Tanzania",
  "pemba": "Tanzania",
  // Uganda
  "bwindi": "Uganda",
  "murchison-falls": "Uganda",
  "queen-elizabeth": "Uganda",
  "kibale": "Uganda",
  "rwenzori": "Uganda",
  "jinja": "Uganda",
  "kidepo": "Uganda",
  "entebbe": "Uganda",
  "lake-bunyonyi": "Uganda",
  // Rwanda
  "volcanoes": "Rwanda",
  "nyungwe": "Rwanda",
  "akagera": "Rwanda",
  "lake-kivu": "Rwanda",
  "kigali": "Rwanda",
  // Burundi
  "rusizi": "Burundi",
  "kibira": "Burundi",
  "bujumbura": "Burundi",
  // Ethiopia
  "addis-ababa": "Ethiopia",
  "lalibela": "Ethiopia",
  "simien": "Ethiopia",
  "danakil": "Ethiopia",
  "omo-valley": "Ethiopia",
  "gondar": "Ethiopia",
  "bale": "Ethiopia",
  // DRC / South Sudan
  "virunga": "DRC",
  "boma": "South Sudan",
};

const DEST_SECONDARY_IMAGE: Record<string, string> = {
  "maasai-mara": "1500382017468-9049fed747ef", // savannah sunset
  "the-coast": "1519046904884-53103b34b206", // beach
  "diani-beach": "1507525428034-b723cf961d3e", // beach palms
  "watamu": "1544551763-46a013bb70d5", // aerial coast
  "mombasa": "1510414842594-a61c69b5ae57", // coastal shore
  "lamu": "1518709268805-4e9042af9f23", // dhow
  "amboseli": "1516426122078-c23e76319801", // elephants + Kilimanjaro
  "mount-kenya": "1469474968028-56623f02e42e", // green highlands
  "lake-naivasha": "1505118380757-91f5f5632de0", // lake canoe
  "lake-nakuru": "1506744038136-46273834b3fb", // escarpment
  "samburu": "1516026672322-bc52d61a55d5", // lions
  "nairobi": "1472214103451-9374bd1c798e", // sunrise field
  "hells-gate": "1534177616072-ef7dc120449d", // savanna
  "saiwa-swamp": "1501785888041-af3ef285b470", // hike trail
  "kilimanjaro": "1506905925346-21bda4d32df4", // snow peak
  "serengeti": "1516026672322-bc52d61a55d5", // lions
  "ngorongoro": "1557050543-4d5f4e07ef46", // elephant
  "zanzibar": "1507525428034-b723cf961d3e", // beach palms
  "bwindi": "1501785888041-af3ef285b470", // forest trail
  "lalibela": "1519681393784-d120267933ba", // desert peaks
};

/* ------------------------------------------------------- journey extras */
// Per-trip-type inclusions/exclusions/accommodation/transport used on the
// invoice and generated day-by-day itineraries from the journey's duration.
const TRIP_CONFIG: Record<
  string,
  { inclusions: string[]; exclusions: string[]; accommodation: string; transport: string }
> = {
  Safari: {
    inclusions: [
      "All park & conservancy entry fees",
      "Daily game drives in a private 4×4 with pop-up roof",
      "Professional guide & spotter",
      "Full-board lodge or tented camp accommodation",
      "All meals & soft drinks",
      "Airport & inter-park transfers",
      "Emergency evacuation cover",
    ],
    exclusions: [
      "International flights",
      "Visas & travel insurance",
      "Premium spirits & cellar wines",
      "Tips & gratuities",
      "Optional activities not listed",
    ],
    accommodation: "Hand-picked safari lodge or tented camp — private ensuite",
    transport: "Private 4×4 Land Cruiser with pop-up roof",
  },
  Adventure: {
    inclusions: [
      "Professional guides, porters & cooks",
      "All park & mountain entry fees",
      "Lodge, hut or camp accommodation as per plan",
      "All meals & drinking water",
      "Group safety & first-aid kit",
      "Transfers from the meeting point",
    ],
    exclusions: [
      "International flights",
      "Visas & travel insurance",
      "Rentals of technical gear (sleeping bags, poles)",
      "Tips & gratuities",
      "Personal expenses",
    ],
    accommodation: "Mountain lodge, eco-camp or trekking hut as per plan",
    transport: "Private 4×4 plus supported trekking logistics",
  },
  Coastal: {
    inclusions: [
      "Beach villa or boutique hotel accommodation",
      "Daily breakfast & select meals",
      "Dhow, boat & marine-park excursions as listed",
      "Snorkelling gear",
      "Airport & hotel transfers",
      "Marine park entry fees",
    ],
    exclusions: [
      "International flights",
      "Visas & travel insurance",
      "Diving courses & equipment hire",
      "Alcoholic beverages",
      "Tips & gratuities",
    ],
    accommodation: "Beach villa, resort or boutique Swahili hotel",
    transport: "Private vehicle plus dhow & boat transfers",
  },
  Cultural: {
    inclusions: [
      "All guided tours, entry & conservancy fees",
      "Private chauffeur-vehicle & driver",
      "Hand-picked boutique accommodation",
      "Select meals as listed",
      "Community & cultural visit contributions",
    ],
    exclusions: [
      "International flights",
      "Visas & travel insurance",
      "Alcoholic beverages",
      "Tips & gratuities",
      "Personal shopping",
    ],
    accommodation: "Boutique hotel, guesthouse or garden villa",
    transport: "Private chauffeur-driven vehicle",
  },
  Luxury: {
    inclusions: [
      "Private suite or conservancy lodge accommodation",
      "Private guide, vehicle & dedicated butler service",
      "All meals, house wines & premium spirits",
      "All park & conservancy fees",
      "Airstrip transfers & light-aircraft flights",
      "Laundry & sundowner setups",
    ],
    exclusions: [
      "International flights",
      "Visas & travel insurance",
      "Champagne & cellar rarities beyond the house list",
      "Spa treatments & optional excursions",
      "Tips & gratuities",
    ],
    accommodation: "Private suite on a working conservancy or luxury lodge",
    transport: "Private 4×4 plus optional light-aircraft transfers",
  },
  Expedition: {
    inclusions: [
      "Expedition 4WD vehicles & experienced drivers",
      "Full camping kit (tents, beds, mess, cook)",
      "All meals & drinking water",
      "Local community & site fees",
      "Fossil-site guiding where applicable",
      "Group safety & evacuation planning",
    ],
    exclusions: [
      "International flights",
      "Visas & travel insurance",
      "Alcoholic beverages",
      "Tips & gratuities",
      "Personal expenses",
    ],
    accommodation: "Mobile expedition camp or local bandas",
    transport: "Purpose-built 4WD expedition vehicles",
  },
};

/** Build a realistic day-by-day plan from the journey's duration & highlights. */
function buildItinerary(a: SeedAdventure) {
  const days = Math.max(1, Number.parseInt(a.duration) || 3);
  const plan: { day: number; title: string; description: string }[] = [];
  for (let i = 0; i < days; i++) {
    if (i === 0) {
      plan.push({
        day: i + 1,
        title: "Arrival & welcome",
        description: `Arrive and settle in — met by your Karen Adventures host near ${a.location}. Evening welcome briefing and the first taste of the journey ahead.`,
      });
    } else if (i === days - 1) {
      plan.push({
        day: i + 1,
        title: "Final day & departure",
        description: `Morning activities at a relaxed pace, then transfers for departure — or extend your stay with a hand-crafted add-on.`,
      });
    } else {
      const h =
        a.highlights[(i - 1) % a.highlights.length] ?? "Guided exploration";
      plan.push({
        day: i + 1,
        title: h,
        description: `A full day in ${a.location} — ${h.toLowerCase()}, guided by people who know the land intimately, with a picnic lunch and golden-hour stops.`,
      });
    }
  }
  return plan;
}

/* ------------------------------------------------------------------ seed */
/**
 * Populate the database. Exportable so the admin console can re-seed on demand
 * (fixes empty destinations on Vercel without waiting for a redeploy).
 */
export async function runSeed() {
  const prisma = new PrismaClient();
  try {
    return await seedWith(prisma);
  } finally {
    // Always release the connection — whether called from the CLI or the
    // admin seed route.
    await prisma.$disconnect().catch(() => {});
  }
}

async function seedWith(prisma: PrismaClient) {
  console.log("Seeding Karen Adventures…");

  // Seed when the curated destination set isn't fully present. This lets the
  // Vercel build populate a fresh production DB (or fill in any missing seeded
  // locations after manual adds/deletes). Fully-seeded DBs are left untouched,
  // so admin edits on seeded rows survive redeploys. Force a full re-seed with:
  //   SEED_FORCE=true npx prisma db seed
  const seedSlugs = destinations.map((d) => d.slug);
  const postSlugs = blogPosts.map((p) => p.slug);
  const [present, presentPosts] = await Promise.all([
    prisma.destination.count({
      where: { slug: { in: seedSlugs } },
    }),
    prisma.blogPost.count({
      where: { slug: { in: postSlugs } },
    }),
  ]);
  if (
    present === seedSlugs.length &&
    presentPosts === postSlugs.length &&
    process.env.SEED_FORCE !== "true"
  ) {
    console.log(
      `✓ All ${seedSlugs.length} seed destinations and ${postSlugs.length} blog posts already present — skipping seed (set SEED_FORCE=true to re-seed).`,
    );
    return { seeded: false, reason: "already-present" };
  }

  // Adventures (enrich with invoice extras). Unless forced, an existing row is
  // left untouched so admin edits survive — the seed only fills in missing
  // records. SEED_FORCE=true refreshes everything.
  const force = process.env.SEED_FORCE === "true";
  for (const a of adventures) {
    const cfg = TRIP_CONFIG[a.tripType] ?? TRIP_CONFIG.Safari;
    const data = {
      ...a,
      itinerary: buildItinerary(a),
      inclusions: cfg.inclusions,
      exclusions: cfg.exclusions,
      accommodation: cfg.accommodation,
      transport: cfg.transport,
    };
    await prisma.adventure.upsert({
      where: { slug: a.slug },
      update: force ? data : {},
      create: data,
    });
  }
  console.log(`✓ ${adventures.length} adventures`);

  // Destinations (connect recommended trips after both exist).
  for (const d of destinations) {
    const { trips, ...data } = d;
    const country = DEST_COUNTRY[d.slug] ?? "Kenya";
    const tripsToLink = await prisma.adventure.findMany({
      where: { slug: { in: trips } },
      select: { id: true },
    });
    const extra = DEST_SECONDARY_IMAGE[d.slug];
    const gallery = (data as { images?: string[] }).images?.length
      ? (data as { images?: string[] }).images!
      : extra
        ? [data.image, extra]
        : [data.image];
    await prisma.destination.upsert({
      where: { slug: d.slug },
      update: force
        ? {
            ...data,
            country,
            images: gallery,
            recommendedTrips: { set: tripsToLink.map((t) => ({ id: t.id })) },
          }
        : {},
      create: {
        ...data,
        country,
        images: gallery,
        recommendedTrips: { connect: tripsToLink.map((t) => ({ id: t.id })) },
      },
    });
  }
  console.log(`✓ ${destinations.length} destinations`);

  // Experiences
  for (const e of experiences) {
    await prisma.experience.upsert({
      where: { slug: e.slug },
      update: e,
      create: e,
    });
  }
  console.log(`✓ ${experiences.length} experiences`);

  // Testimonials
  for (const t of testimonials) {
    await prisma.testimonial.upsert({
      where: { id: `seed-${t.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}` },
      update: t,
      create: { id: `seed-${t.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, ...t },
    });
  }
  console.log(`✓ ${testimonials.length} testimonials`);

  // Gallery
  for (let i = 0; i < gallery.length; i++) {
    const g = gallery[i];
    const id = `seed-gallery-${i}`;
    await prisma.galleryItem.upsert({
      where: { id },
      update: { ...g, order: i },
      create: { id, ...g, order: i },
    });
  }
  console.log(`✓ ${gallery.length} gallery items`);

  // Journal / blog posts (20 signature articles, Markdown content)
  for (const b of blogPosts) {
    const { slug, publishedAt, ...data } = b;
    const html = { ...data, content: marked.parse(data.content) as string };
    await prisma.blogPost.upsert({
      where: { slug },
      update: { ...html, publishedAt: new Date(publishedAt), updatedAt: new Date() },
      create: { slug, ...html, publishedAt: new Date(publishedAt) },
    });
  }
  console.log(`✓ ${blogPosts.length} blog posts`);

  // Demo inquiries (for the admin workflow)
  const demoInquiries = [
    {
      id: "seed-inq-1",
      name: "Sarah & Tom Bennett",
      email: "sarah.bennett@example.com",
      phone: "+44 7700 900123",
      destination: "Maasai Mara",
      tripType: "The Maasai Mara Safari",
      travelers: "2",
      travelDate: "2026-09",
      message:
        "We'd love a private honeymoon safari in the Mara — two weeks in September, tented camp preferred.",
      status: "planned",
      notes: "Sent itinerary v1 + lodge shortlist. Awaiting the couple's reply.",
    },
    {
      id: "seed-inq-2",
      name: "David Njoroge",
      email: "d.njoroge@example.com",
      phone: "+254 712 345 678",
      destination: "Mount Kenya",
      tripType: "Mount Kenya Adventure",
      travelers: "5 – 8",
      travelDate: "2026-08",
      message:
        "Corporate team of 6 looking to climb Point Lenana in August. Need full logistics including training notes.",
      status: "confirmed",
      notes: "Deposit via M-Pesa received. Booked park fees and mountain guides.",
    },
    {
      id: "seed-inq-3",
      name: "Maria Keller",
      email: "maria.keller@example.com",
      destination: "Lamu",
      tripType: "Lamu Island Escape",
      travelers: "1 – 2",
      travelDate: "2027-01",
      message:
        "Interested in the Lamu escape in January — solo female traveler, would prefer a private guide.",
      status: "new",
      notes: null,
    },
    {
      id: "seed-inq-4",
      name: "James Otieno",
      email: "j.otieno@example.com",
      phone: "+254 733 221 100",
      destination: "Lake Naivasha",
      tripType: "Weekend Escapes",
      travelers: "3 – 4",
      travelDate: "2026-07",
      message:
        "Weekend escape for a group of 4 with a toddler — gentle activities preferred.",
      status: "archived",
      notes: "Client chose a different operator. Filed for future reference.",
    },
  ];
  for (const i of demoInquiries) {
    const { id, ...data } = i;
    await prisma.inquiry.upsert({ where: { id }, update: data, create: i });
  }
  console.log(`✓ ${demoInquiries.length} demo inquiries`);

  // Demo bookings (for the admin dashboard + booking workflow)
  const demoBookings = [
    {
      id: "seed-booking-1",
      reference: "KAR-2026-MARA01",
      name: "Sarah & Tom Bennett",
      email: "sarah.bennett@example.com",
      phone: "+44 7700 900123",
      adventureSlug: "maasai-mara-safari",
      adventureTitle: "The Maasai Mara Safari",
      destination: "Maasai Mara",
      destinations: ["Maasai Mara", "Lake Naivasha"],
      travelers: 2,
      adults: 2,
      children: 0,
      startDate: new Date("2026-09-14T00:00:00Z"),
      endDate: new Date("2026-09-17T00:00:00Z"),
      pickupLocation: "Jomo Kenyatta International Airport (NBO)",
      pickupTime: "09:00",
      dropoffLocation: "Wilson Airport, Nairobi",
      dropoffTime: "16:30",
      accommodation: "Luxury tented camp",
      transport: "Private 4×4 Land Cruiser",
      depositPaidKes: 260000,
      priceEstimate: 4900,
      status: "pending",
      notes: null,
    },
    {
      id: "seed-booking-2",
      reference: "KAR-2026-KENYA02",
      name: "David Njoroge",
      email: "d.njoroge@example.com",
      phone: "+254 712 345 678",
      adventureSlug: "mount-kenya-adventure",
      adventureTitle: "Mount Kenya Adventure",
      destination: "Mount Kenya",
      destinations: ["Mount Kenya", "Ol Pejeta Conservancy"],
      travelers: 6,
      adults: 4,
      children: 2,
      startDate: new Date("2026-08-10T00:00:00Z"),
      endDate: new Date("2026-08-14T00:00:00Z"),
      pickupLocation: "Nairobi Serena Hotel, Nairobi",
      pickupTime: "06:30",
      dropoffLocation: "Nanyuki airstrip",
      dropoffTime: "12:00",
      accommodation: "Mountain lodge & trekking huts",
      transport: "Private 4×4 with climbing support",
      depositPaidKes: 0,
      priceEstimate: 11340,
      status: "confirmed",
      notes: "Deposit paid. Pre-trek pack sent by email.",
    },
  ];
  for (const b of demoBookings) {
    const { id, ...data } = b;
    await prisma.booking.upsert({ where: { id }, update: data, create: b });
  }
  console.log(`✓ ${demoBookings.length} demo bookings`);

  console.log("Seed complete.");
  return {
    seeded: true,
    adventures: adventures.length,
    destinations: destinations.length,
    experiences: experiences.length,
    testimonials: testimonials.length,
    gallery: gallery.length,
    demoBookings: demoBookings.length,
  };
}

// Run automatically when executed directly (tsx prisma/seed.ts); when imported
// (e.g. the admin seed route) callers invoke runSeed() themselves.
const isDirect = process.argv[1] && process.argv[1].replace(/\\/g, "/").endsWith("seed.ts");
if (isDirect) {
  runSeed().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
