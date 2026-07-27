import productMainImg from '../assets/Product-image.png';
import extraitImg from '../assets/chanel_n19_extrait.png';
import edpImg from '../assets/chanel_n19_edp.png';
import bodyOilImg from '../assets/chanel_n19_body_oil.png';
import poudreImg from '../assets/chanel_n19_poudre.png';
import brandCraftImg from '../assets/brand_heritage_craft.png';
import sensoryBgImg from '../assets/sensory_ritual_bg.png';
import storyBgImg from '../assets/brand_heritage_story.png';
import luminousBgImg from '../assets/lune_luminous_hero_bg.png';

export const BOUTIQUE_PRODUCTS = [
  {
    id: 'n19-extrait',
    name: "LUNE EXTRAIT DE PARFUM",
    frenchName: "L'Extrait Flacon Baudruchage",
    category: 'EXTRAIT',
    subtitle: 'FLORENTINE IRIS & GALBANUM ESSENCE',
    price: 340.00,
    priceFormatted: '$ 340',
    inStock: true,
    badge: 'HAUTE COUTURE',
    rating: '5.0',
    reviewsCount: 191,
    image: productMainImg,
    galleryImages: [
      productMainImg,
      extraitImg,
      brandCraftImg,
      sensoryBgImg,
      storyBgImg,
      luminousBgImg
    ],
    engravingAvailable: true,
    giftBoxIncluded: true,
    sizes: [
      { size: '15 ml', price: 240.00, label: '15 ml / 0.5 FL. OZ.' },
      { size: '30 ml', price: 340.00, label: '30 ml / 1.0 FL. OZ.' },
      { size: '50 ml', price: 480.00, label: '50 ml / 1.7 FL. OZ.' },
    ],
    scentFamily: 'Florentine Iris Pallida & Rare Galbanum Accord',
    greatFor: 'Connoisseurs, gala evenings, intimate luxury & signature scent wearers',
    theFeel: 'Velvety, radiantly lingering aura with gold-thread hand-sealed Baudruchage',
    notes: {
      top: 'Iranian Galbanum, Neroli de Grasse',
      heart: 'Florentine Iris Pallida, May Rose',
      base: 'Haitian Vetiver, Cedarwood, Oakmoss'
    },
    scentProfile: 'Green Floral • Velvet Powdery Iris • Earthy Amber',
    performance: {
      longevity: '12+ Hours',
      sillage: 'Intimate & Radiantly Refined',
      concentration: '32% Pure Parfum Extrait'
    },
    sensory: {
      smellsLike: 'A crisp morning dew over Florentine iris fields transitioning into warm, velvety suede notes.',
      whoItsFor: 'Designed for individuals who demand uncompromising craftsmanship and timeless personal elegance.',
      howItEvolves: 'Opens with sharp green galbanum brightness, blooms into velvety Iris Pallida within 15 minutes, and lingers as soft oakmoss and amber.'
    },
    description: 'The pinnacle of Haute Parfumerie. Formulated with rare Iris Pallida butter cultivated over 6 years in Florence and hand-sealed in Grasse using traditional gold-thread baudruchage membrane techniques.',
    reviews: [
      {
        id: 'r1',
        author: 'Eleanor Vance',
        rating: 5,
        date: 'July 18, 2026',
        title: 'An absolute masterpiece of Haute Parfumerie',
        comment: 'The depth of the Florentine Iris in this Extrait is beyond anything I have experienced. It stays on my skin all day with the most sophisticated trail. Worth every dollar.',
        verified: true,
        helpfulCount: 42
      },
      {
        id: 'r2',
        author: 'Julian Thorne',
        rating: 5,
        date: 'July 02, 2026',
        title: 'Unrivaled quality and presentation',
        comment: 'The baudruchage hand-sealing on the bottle is a rare artisanal detail. The fragrance itself opens with incredible galbanum greenness before melting into rich iris suede.',
        verified: true,
        helpfulCount: 29
      },
      {
        id: 'r3',
        author: 'Camille Laurent',
        rating: 5,
        date: 'June 24, 2026',
        title: 'My forever signature scent',
        comment: 'Compliments every time I wear this. It feels mysterious, chic, and deeply luxurious without ever overpowering.',
        verified: true,
        helpfulCount: 18
      }
    ]
  },
  {
    id: 'n19-edp',
    name: 'LUNE EAU DE PARFUM',
    frenchName: 'Vaporisateur de Parfum',
    category: 'EAU DE PARFUM',
    subtitle: 'BOLD GREEN FLORAL SPRAY',
    price: 185.00,
    priceFormatted: '$ 185',
    inStock: true,
    badge: 'SIGNATURE BOUTIQUE',
    rating: '4.9',
    reviewsCount: 148,
    image: edpImg,
    galleryImages: [
      edpImg,
      productMainImg,
      storyBgImg,
      sensoryBgImg,
      brandCraftImg,
      luminousBgImg
    ],
    engravingAvailable: true,
    giftBoxIncluded: true,
    sizes: [
      { size: '50 ml', price: 145.00, label: '50 ml / 1.7 FL. OZ.' },
      { size: '100 ml', price: 185.00, label: '100 ml / 3.4 FL. OZ.' },
    ],
    scentFamily: 'Bold Galbanum Green & Luminous Grasse Jasmine',
    greatFor: 'Day-to-night transitions, executive meetings, springtime walks',
    theFeel: 'Luminous, crisp green spray with smooth sandalwood drydown',
    notes: {
      top: 'Galbanum, Bergamot, Green Accord',
      heart: 'Iris, Ylang-Ylang, Grasse Jasmine',
      base: 'Vetiver, Leather Accord, Sandalwood'
    },
    scentProfile: 'Bold Green Accord • Luminous Jasmine • Leather Sandalwood',
    performance: {
      longevity: '8 - 10 Hours',
      sillage: 'Moderate & Captivating',
      concentration: '20% Eau de Parfum'
    },
    sensory: {
      smellsLike: 'Freshly cut green stems, sunlit bergamot peel, and soft leather gloves.',
      whoItsFor: 'For the daring, confident individual looking for a modern green floral signature.',
      howItEvolves: 'Initial burst of vibrant galbanum and bergamot, softening into jasmin and iris hearts, settling into creamy sandalwood.'
    },
    description: 'A striking interplay between sharp green Galbanum and velvety Iris. Maison Lune’s signature fragrance, designed for the daring and uncompromising.',
    reviews: [
      {
        id: 'r4',
        author: 'Sophia Chen',
        rating: 5,
        date: 'July 14, 2026',
        title: 'Stunning green floral composition',
        comment: 'Very fresh yet deeply complex. The leather and sandalwood background grounds the green galbanum beautifully.',
        verified: true,
        helpfulCount: 19
      },
      {
        id: 'r5',
        author: 'Marcella Blanc',
        rating: 4,
        date: 'June 30, 2026',
        title: 'Elegant and long-lasting',
        comment: 'The atomizer spray is ultra-fine. The bottle looks statuesque on my vanity.',
        verified: true,
        helpfulCount: 12
      }
    ]
  },
  {
    id: 'n19-body-oil',
    name: 'LE RITUAL DE SOIN & HUILE',
    frenchName: 'Huile Precieuse pour le Corps',
    category: 'BODY & RITUALS',
    subtitle: 'SATIN HYDRATING BODY ELIXIR',
    price: 125.00,
    priceFormatted: '$ 125',
    inStock: true,
    badge: 'EXCLUSIVE RITUAL',
    rating: '4.9',
    reviewsCount: 96,
    image: bodyOilImg,
    galleryImages: [
      bodyOilImg,
      sensoryBgImg,
      brandCraftImg,
      productMainImg,
      storyBgImg,
      luminousBgImg
    ],
    engravingAvailable: false,
    giftBoxIncluded: true,
    sizes: [
      { size: '100 ml', price: 125.00, label: '100 ml / 3.4 FL. OZ.' },
      { size: '200 ml', price: 195.00, label: '200 ml / 6.8 FL. OZ.' },
    ],
    scentFamily: 'Satin Botanical Oils & Subtle Iris Accords',
    greatFor: 'Post-bath self-care rituals, body glowing & fragrance layering',
    theFeel: 'Non-greasy dry oil sheen that leaves skin satin-soft and scented',
    notes: {
      top: 'Galbanum Leaf Infusion',
      heart: 'Rosehip & Iris Botanical Oils',
      base: 'Velvet Musk, Amber'
    },
    scentProfile: 'Silky Botanical Oils • Delicate Iris • Warm Velvet Musk',
    performance: {
      longevity: '6 - 8 Hours of Skin Hydration',
      sillage: 'Subtle Intimate Glow',
      concentration: 'Nutrient-Rich Botanical Elixir'
    },
    sensory: {
      smellsLike: 'A comforting bath infused with rosehip, iris petals, and warm musk.',
      whoItsFor: 'Anyone seeking luminous, deeply hydrated skin with a delicate veil of scent.',
      howItEvolves: 'Glides on warm, instantly softening skin while releasing gentle galbanum and rosehip aromatics.'
    },
    description: 'Infused with nourishing natural oils and subtle Lune fragrance accords. Leaves the body luminous, deeply hydrated, and delicately scented with Iris notes.',
    reviews: [
      {
        id: 'r6',
        author: 'Isabelle Moreau',
        rating: 5,
        date: 'July 10, 2026',
        title: 'Pure indulgence after a shower',
        comment: 'Absorbs instantly without feeling greasy. Leaves skin glowing and subtly scented all day.',
        verified: true,
        helpfulCount: 31
      }
    ]
  },
  {
    id: 'n19-poudre',
    name: 'LUNE POUDRE DE SOIE',
    frenchName: 'Eau de Parfum Poudrée',
    category: 'EAU DE PARFUM',
    subtitle: 'COCOONING WHITE MUSKS & IRIS',
    price: 210.00,
    priceFormatted: '$ 210',
    inStock: true,
    badge: 'BESTSELLER',
    rating: '4.95',
    reviewsCount: 164,
    image: poudreImg,
    galleryImages: [
      poudreImg,
      productMainImg,
      storyBgImg,
      brandCraftImg,
      sensoryBgImg,
      luminousBgImg
    ],
    engravingAvailable: true,
    giftBoxIncluded: true,
    sizes: [
      { size: '50 ml', price: 165.00, label: '50 ml / 1.7 FL. OZ.' },
      { size: '100 ml', price: 210.00, label: '100 ml / 3.4 FL. OZ.' },
    ],
    scentFamily: 'Cocooning White Musks, Grasse Neroli & Creamy Tonka',
    greatFor: 'Cosy cashmere days, intimate dates & bedtime luxury',
    theFeel: 'Soft, powdery, silk-like cocooning fragrance wrap',
    notes: {
      top: 'Mandarin, Grasse Neroli',
      heart: 'Iris Pallida, Jasmine Absolute',
      base: 'White Musks, Tonka Bean, Vanilla'
    },
    scentProfile: 'Powdery Silk • Creamy Tonka • Velvet White Musks',
    performance: {
      longevity: '10+ Hours',
      sillage: 'Soft & Enveloping',
      concentration: '22% Eau de Parfum Poudrée'
    },
    sensory: {
      smellsLike: 'Cashmere sweaters, refined white musks, and warm tonka bean cream.',
      whoItsFor: 'For lovers of soft, powdery, comforting yet sophisticated scents.',
      howItEvolves: 'Opens with sparkling mandarin and neroli, settling quickly into creamy iris and dreamy white musk.'
    },
    description: 'A soft, caressing interpretation of Lune. Wraps the vibrant green Galbanum signature in a veil of delicate White Musks and creamy Tonka Bean.',
    reviews: [
      {
        id: 'r7',
        author: 'Victoria Sterling',
        rating: 5,
        date: 'July 21, 2026',
        title: 'Like wearing soft silk cashmere',
        comment: 'So addicting! The white musk and vanilla drydown is intoxicating. Absolutely my favorite fragrance in the lineup.',
        verified: true,
        helpfulCount: 27
      }
    ]
  }
];

export const COMPLIMENTARY_SAMPLES = [
  { id: 'sample-n5', name: 'N°5 Extrait de Parfum (1.5ml)' },
  { id: 'sample-coco', name: 'Coco Mademoiselle Intense (1.5ml)' },
  { id: 'sample-sycomore', name: 'Les Exclusifs - Sycomore (1.5ml)' },
  { id: 'sample-coromandel', name: 'Les Exclusifs - Coromandel (1.5ml)' },
];
