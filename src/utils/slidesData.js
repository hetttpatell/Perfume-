// Helper to convert database product records into HeroSlider slide structures
export const mapProductsToSlides = (products = []) => {
  if (!Array.isArray(products) || products.length === 0) {
    return SLIDES;
  }
  return products.map((prod, index) => ({
    id: String(index + 1).padStart(2, '0'),
    productId: prod.id,
    shortTitle: prod.heroTitle || prod.name || 'LUNE',
    stepLabel: prod.heroSubtitle || prod.frenchName || prod.category || 'HAUTE PARFUMERIE',
    title: prod.heroTitle || prod.name || 'LUNE PARFUM',
    subtitle: prod.heroSubtitle || prod.frenchName || prod.subtitle || 'THE SIGNATURE IMPRESSION',
    oneLiner: prod.heroQuote || prod.description || 'An audacious harmony of crisp green notes and rare white florals.',
    tagline: prod.badge || 'HAUTE COUTURE',
    description: prod.description || '',
    bg: '#FFFFFF',
    text: '#111111',
    secondaryText: '#555555',
    accent: '#C08A3E',
    noteCategory: prod.category || 'EXTRAIT DE PARFUM',
    keyNotes: [
      prod.heroNote1 || prod.notes?.top?.split(',')[0] || 'Galbanum',
      prod.heroNote2 || prod.notes?.heart?.split(',')[0] || 'Iris Pallida',
      prod.heroNote3 || prod.notes?.base?.split(',')[0] || 'Vetiver'
    ],
    image: prod.heroImageUrl || prod.image || '/SVGs/Perfume-SVG.png',
    pose: { rotation: [0, 0, 0] }
  }));
};

export const SLIDES = [
  {
    id: '01',
    productId: 'n19-extrait',
    shortTitle: 'LUNE EXTRAIT',
    stepLabel: "L'Extrait Flacon Baudruchage",
    title: 'LUNE EXTRAIT DE PARFUM',
    subtitle: "L'EXTRAIT FLACON BAUDRUCHAGE",
    oneLiner: 'The pinnacle of Haute Parfumerie. Formulated with rare Iris Pallida butter cultivated over 6 years in Florence.',
    tagline: 'HAUTE COUTURE',
    description: 'The pinnacle of Haute Parfumerie. Formulated with rare Iris Pallida butter cultivated over 6 years in Florence.',
    bg: '#FFFFFF',
    text: '#111111',
    secondaryText: '#555555',
    accent: '#C08A3E',
    noteCategory: 'EXTRAIT DE PARFUM',
    keyNotes: ['Galbanum', 'Iris Pallida', 'Haitian Vetiver'],
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    pose: {
      rotation: [0, 0, 0],
    },
  },
  {
    id: '02',
    shortTitle: 'BERGAMOT',
    stepLabel: 'TOP NOTES',
    title: 'BERGAMOT & NEROLI',
    subtitle: 'VIBRANT BOTANICAL OVERTURE',
    oneLiner: 'An exhilarating burst of Italian Bergamot, Neroli, and resinous Galbanum.',
    tagline: 'Luminous Opening Accord',
    description: 'An exhilarating burst of Italian Bergamot, sun-drenched Neroli, and resinous Galbanum that ignites the senses with sharp, refined vitality.',
    bg: '#FFFFFF',
    text: '#111111',
    secondaryText: '#555555',
    accent: '#EA580C',
    noteCategory: 'CITRUS & GALBANUM',
    keyNotes: ['Calabrian Bergamot', 'Grasse Neroli', 'Iranian Galbanum'],
    image: '/SVGs/Perfume-SVG.png',
    pose: {
      rotation: [0.08, Math.PI / 3, 0],
    },
  },
  {
    id: '03',
    shortTitle: 'IRIS',
    stepLabel: 'HEART NOTES',
    title: 'IRIS PALLIDA & ROSE',
    subtitle: 'FLORAL NOBILITY & ELEGANCE',
    oneLiner: 'Precious Florentine Iris Pallida interwoven with May Rose absolute and Jasmine.',
    tagline: 'Powdery Velvet Core',
    description: 'The precious Iris Pallida from Florence unveils its velvety iris butter tone, seamlessly interwoven with May Rose absolute and silk Jasmine.',
    bg: '#FFFFFF',
    text: '#111111',
    secondaryText: '#555555',
    accent: '#D946EF',
    noteCategory: 'PRECIOUS FLORALS',
    keyNotes: ['Florentine Iris', 'May Rose Absolute', 'Grasse Jasmine'],
    image: '/SVGs/Perfume-SVG.png',
    pose: {
      rotation: [-0.05, Math.PI * 0.7, 0.03],
    },
  },
  {
    id: '04',
    shortTitle: 'VETIVER',
    stepLabel: 'BASE NOTES',
    title: 'VETIVER & CEDAR',
    subtitle: 'EARTHY & WOODEN ANCHOR',
    oneLiner: 'Deep Haitian Vetiver and Sandalwood grounding a trail of smoked woods.',
    tagline: 'Smoky Amber Drydown',
    description: 'Deep Haitian Vetiver and creamed Sandalwood ground the composition with an enduring, sophisticated trail of smoked woods and quiet warmth.',
    bg: '#FFFFFF',
    text: '#111111',
    secondaryText: '#555555',
    accent: '#0284C7',
    noteCategory: 'WOODS & AMBER',
    keyNotes: ['Haitian Vetiver', 'Virginia Cedarwood', 'White Musk'],
    image: '/SVGs/Perfume-SVG.png',
    pose: {
      rotation: [0.1, Math.PI, -0.05],
    },
  }
];
