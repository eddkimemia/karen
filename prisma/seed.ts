/**
 * Karen Adventures — seed script.
 * Populates journeys, destinations, experiences, testimonials and gallery
 * imagery from curated editorial content + verified Unsplash photography.
 *
 * Run with:  npx prisma db seed
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
};

const destinations: SeedDestination[] = [
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
      "Private villas, tented suites and conservancy lodges where the standard is quiet and the silence is loud. Kenya, in its most polished form.",
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
      "Two days out of the city and a world away — the Rift Valley, the coast, the mountain slopes. Recalibration, Kenyan style.",
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
      "The Mara at dawn, a lion pride on a kopje, and a hot-air balloon drifting over it all — Karen Adventures gave us Kenya the way it should be experienced.",
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
      "We arrived as visitors and left as friends of the land. Karen Adventures curates the journey — but what they really do is teach you to love Kenya.",
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

/* ------------------------------------------------------------------ seed */
async function main() {
  console.log("Seeding Karen Adventures…");

  // Adventures
  for (const a of adventures) {
    await prisma.adventure.upsert({
      where: { slug: a.slug },
      update: a,
      create: a,
    });
  }
  console.log(`✓ ${adventures.length} adventures`);

  // Destinations (connect recommended trips after both exist)
  for (const d of destinations) {
    const { trips, ...data } = d;
    const tripsToLink = await prisma.adventure.findMany({
      where: { slug: { in: trips } },
      select: { id: true },
    });
    await prisma.destination.upsert({
      where: { slug: d.slug },
      update: {
        ...data,
        recommendedTrips: { set: tripsToLink.map((t) => ({ id: t.id })) },
      },
      create: {
        ...data,
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
      travelers: 2,
      startDate: new Date("2026-09-14T00:00:00Z"),
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
      travelers: 6,
      startDate: new Date("2026-08-10T00:00:00Z"),
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
