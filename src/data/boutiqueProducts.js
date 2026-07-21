import extraitImg from '../assets/chanel_n19_extrait.png';
import edpImg from '../assets/chanel_n19_edp.png';
import bodyOilImg from '../assets/chanel_n19_body_oil.png';
import poudreImg from '../assets/chanel_n19_poudre.png';

export const BOUTIQUE_PRODUCTS = [
  {
    id: 'n19-extrait',
    name: "N°19 EXTRAIT DE PARFUM",
    frenchName: "L'Extrait Flacon Baudruchage",
    category: 'EXTRAIT',
    subtitle: 'FLORENTINE IRIS & GALBANUM ESSENCE',
    price: 340.00,
    priceFormatted: '$ 340',
    inStock: true,
    badge: 'HAUTE COUTURE',
    rating: '5.0',
    image: extraitImg,
    engravingAvailable: true,
    giftBoxIncluded: true,
    sizes: [
      { size: '15 ml', price: 240.00, label: '15 ml / 0.5 FL. OZ.' },
      { size: '30 ml', price: 340.00, label: '30 ml / 1.0 FL. OZ.' },
      { size: '50 ml', price: 480.00, label: '50 ml / 1.7 FL. OZ.' },
    ],
    notes: {
      top: 'Iranian Galbanum, Neroli de Grasse',
      heart: 'Florentine Iris Pallida, May Rose',
      base: 'Haitian Vetiver, Cedarwood, Oakmoss'
    },
    description: 'The pinnacle of Haute Parfumerie. Formulated with rare Iris Pallida butter cultivated over 6 years in Florence and hand-sealed in Grasse using traditional gold-thread baudruchage membrane techniques.'
  },
  {
    id: 'n19-edp',
    name: 'N°19 EAU DE PARFUM',
    frenchName: 'Vaporisateur de Parfum',
    category: 'EAU DE PARFUM',
    subtitle: 'BOLD GREEN FLORAL SPRAY',
    price: 185.00,
    priceFormatted: '$ 185',
    inStock: true,
    badge: 'SIGNATURE BOUTIQUE',
    rating: '4.9',
    image: edpImg,
    engravingAvailable: true,
    giftBoxIncluded: true,
    sizes: [
      { size: '50 ml', price: 145.00, label: '50 ml / 1.7 FL. OZ.' },
      { size: '100 ml', price: 185.00, label: '100 ml / 3.4 FL. OZ.' },
    ],
    notes: {
      top: 'Galbanum, Bergamot, Green Accord',
      heart: 'Iris, Ylang-Ylang, Grasse Jasmine',
      base: 'Vetiver, Leather Accord, Sandalwood'
    },
    description: 'A striking interplay between sharp green Galbanum and velvety Iris. Coco Chanel’s final personal signature fragrance, designed for the daring and uncompromising.'
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
    image: bodyOilImg,
    engravingAvailable: false,
    giftBoxIncluded: true,
    sizes: [
      { size: '100 ml', price: 125.00, label: '100 ml / 3.4 FL. OZ.' },
      { size: '200 ml', price: 195.00, label: '200 ml / 6.8 FL. OZ.' },
    ],
    notes: {
      top: 'Galbanum Leaf Infusion',
      heart: 'Rosehip & Iris Botanical Oils',
      base: 'Velvet Musk, Amber'
    },
    description: 'Infused with nourishing natural oils and subtle N°19 fragrance accords. Leaves the body luminous, deeply hydrated, and delicately scented with Iris notes.'
  },
  {
    id: 'n19-poudre',
    name: 'N°19 POUDRE DE SOIE',
    frenchName: 'Eau de Parfum Poudrée',
    category: 'EAU DE PARFUM',
    subtitle: 'COCOONING WHITE MUSKS & IRIS',
    price: 210.00,
    priceFormatted: '$ 210',
    inStock: true,
    badge: 'BESTSELLER',
    rating: '4.95',
    image: poudreImg,
    engravingAvailable: true,
    giftBoxIncluded: true,
    sizes: [
      { size: '50 ml', price: 165.00, label: '50 ml / 1.7 FL. OZ.' },
      { size: '100 ml', price: 210.00, label: '100 ml / 3.4 FL. OZ.' },
    ],
    notes: {
      top: 'Mandarin, Grasse Neroli',
      heart: 'Iris Pallida, Jasmine Absolute',
      base: 'White Musks, Tonka Bean, Vanilla'
    },
    description: 'A soft, caressing interpretation of N°19. Wraps the vibrant green Galbanum signature in a veil of delicate White Musks and creamy Tonka Bean.'
  }
];

export const COMPLIMENTARY_SAMPLES = [
  { id: 'sample-n5', name: 'N°5 Extrait de Parfum (1.5ml)' },
  { id: 'sample-coco', name: 'Coco Mademoiselle Intense (1.5ml)' },
  { id: 'sample-sycomore', name: 'Les Exclusifs - Sycomore (1.5ml)' },
  { id: 'sample-coromandel', name: 'Les Exclusifs - Coromandel (1.5ml)' },
];
