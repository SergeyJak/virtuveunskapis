export const navigation = [
  { label: 'Projekti', href: '/portfolio' },
  { label: 'Virtuves', href: '/portfolio?category=kitchens' },
  { label: 'Skapji', href: '/portfolio?category=wardrobes' },
  { label: 'Materiāli', href: '/#materials' },
  { label: 'Par mums', href: '/#about' },
  { label: 'Kontakti', href: '/contacts' },
]

export const categories = [
  { slug: 'kitchens', title: 'Virtuves', image: '/images/categories/kitchens.jpg' },
  { slug: 'wardrobes', title: 'Skapji', image: '/images/categories/wardrobes.jpg' },
  { slug: 'closets', title: 'Garderobes', image: '/images/categories/closets.jpg' },
  { slug: 'bathrooms', title: 'Vannas istabas', image: '/images/categories/bathrooms.jpg' },
  { slug: 'tv-units', title: 'TV zonas', image: '/images/categories/tv-units.jpg' },
]

export type Project = {
  slug: string
  title: string
  location: string
  category: string
  cover: string
  description: string
  materials: string[]
}

export const projects: Project[] = [
  {
    slug: 'moderna-virtuve-marupe',
    title: 'Moderna virtuve',
    location: 'Mārupe',
    category: 'Virtuves',
    cover: '/images/projects/kitchen-light.jpg',
    description: 'Gaiša, funkcionāla virtuve ar pārdomātu uzglabāšanu un dabīgu materiālu akcentiem.',
    materials: ['MDF fasādes', 'Kvarca darba virsma', 'Blum furnitūra'],
  },
  {
    slug: 'virtuve-ar-salu',
    title: 'Virtuve ar salu',
    location: 'Rīga, Teika',
    category: 'Virtuves',
    cover: '/images/projects/kitchen-island.jpg',
    description: 'Plaša virtuve ar centrālo salu, integrētu tehniku un siltu apgaismojumu.',
    materials: ['Finieris', 'Kompaktā plātne', 'Hettich furnitūra'],
  },
  {
    slug: 'vannas-istaba-purvciems',
    title: 'Vannas istaba',
    location: 'Rīga, Purvciems',
    category: 'Vannas istabas',
    cover: '/images/projects/bathroom.jpg',
    description: 'Mēbeles mitrai videi ar precīzu pielāgošanu telpas izmēriem.',
    materials: ['Mitruma izturīgs MDF', 'Akmens virsma'],
  },
  {
    slug: 'tumsa-virtuve-centrs',
    title: 'Tumša virtuve',
    location: 'Rīga, Centrs',
    category: 'Virtuves',
    cover: '/images/projects/kitchen-dark.jpg',
    description: 'Izteiksmīga tumša virtuve ar siltu koka faktūru un kvalitatīvu furnitūru.',
    materials: ['Ozola finieris', 'Matēts MDF', 'Blum furnitūra'],
  },
]
