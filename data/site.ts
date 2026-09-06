export const navigation = [
  { label: 'Projekti', href: '/portfolio' },
  { label: 'Virtuves', href: '/portfolio?category=kitchens' },
  { label: 'Skapji', href: '/portfolio?category=wardrobes' },
  { label: 'Materiāli', href: '/#materials' },
  { label: 'Par mums', href: '/#about' },
  { label: 'Kontakti', href: '/contacts' },
]

export const businessContacts = {
  phoneDisplay: '+371 22 323 266',
  phoneHref: 'tel:+37122323266',
  email: 'andrej.petjko@gmail.com',
  emailHref: 'mailto:andrej.petjko@gmail.com',
  address: 'Latgales iela 322o, Rīga, LV-1063',
}

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
  category: string
  cover: string
  description: string
}

export const projects: Project[] = [
  {
    slug: 'virtuve-467-serija',
    title: 'Virtuve 467. sērijai',
    category: 'Virtuves',
    cover: '/images/projects/kitchen-light.jpg',
    description: 'Individuāli pielāgots virtuves risinājums 467. sērijas plānojumam.',
  },
  {
    slug: 'virtuve-602-serija',
    title: 'Virtuve 602. sērijai',
    category: 'Virtuves',
    cover: '/images/projects/kitchen-island.jpg',
    description: 'Virtuves risinājums 602. sērijas mājoklim, pielāgojot projektu konkrētās telpas izmēriem.',
  },
  {
    slug: 'virtuve-individuals-projekts',
    title: 'Virtuve pēc individuāla projekta',
    category: 'Virtuves',
    cover: '/images/projects/kitchen-dark.jpg',
    description: 'Virtuve pēc individuāliem izmēriem un klienta ieceres, no projekta līdz uzstādīšanai.',
  },
  {
    slug: 'vannas-istabas-mebeles',
    title: 'Vannas istabas mēbeles',
    category: 'Vannas istabas',
    cover: '/images/projects/bathroom.jpg',
    description: 'Individuāli izgatavotas mēbeles, kas pielāgotas konkrētās telpas izmēriem un vajadzībām.',
  },
]
