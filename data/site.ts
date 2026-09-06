import generatedProjects from './generated-projects.json'

export const navigation = [
  { label: 'Projekti', href: '/portfolio' },
  { label: 'Virtuves', href: '/portfolio?category=kitchens' },
  { label: 'Skapji', href: '/portfolio?category=wardrobes' },
  { label: 'Materiāli', href: '/#materials' },
  { label: 'Par mums', href: '/#about' },
  { label: 'Kontakti', href: '/contacts' },
]

export const businessContacts = {
  phoneDisplay: '+371 22 323 266', phoneHref: 'tel:+37122323266', email: 'andrej.petjko@gmail.com', emailHref: 'mailto:andrej.petjko@gmail.com', address: 'Latgales iela 322o, Rīga, LV-1063',
}

export const categories = [
  { slug: 'kitchens', title: 'Virtuves', image: '/images/categories/kitchens.jpg' },
  { slug: 'wardrobes', title: 'Skapji', image: '/images/categories/wardrobes.jpg' },
  { slug: 'bathrooms', title: 'Vannas istabas', image: '/images/categories/bathrooms.jpg' },
]

export type Project = {
  slug: string
  sourceName: string
  title: string
  category: string
  categorySlug: 'kitchens' | 'wardrobes' | 'bathrooms'
  cover: string
  description: string
  images: string[]
}

const categoryCopy = {
  kitchens: { title: 'Virtuve', category: 'Virtuves', description: 'Individuāli izgatavota virtuve pēc konkrētās telpas izmēriem un klienta ieceres.' },
  wardrobes: { title: 'Skapis', category: 'Skapji', description: 'Pēc individuāliem izmēriem izgatavots skapja risinājums.' },
  bathrooms: { title: 'Vannas istabas mēbeles', category: 'Vannas istabas', description: 'Pēc individuāliem izmēriem izgatavotas mēbeles vannas istabai.' },
} as const

function displayName(category: Project['categorySlug'], sourceName: string) {
  if (category === 'kitchens') {
    if (sourceName === '467') return 'Virtuve 467. sērijai'
    if (sourceName === '602') return 'Virtuve 602. sērijai'
    if (sourceName === 'Лит') return 'Virtuve lietuviešu projektam'
    if (sourceName === 'Новые') return 'Virtuve jaunam projektam'
  }
  if (category === 'wardrobes') return `Skapis ${sourceName.replace(/^skapis-?/i, '')}`
  if (/Jurmala/i.test(sourceName)) return 'Vannas istabas mēbeles Jūrmalā'
  return categoryCopy[category].title
}

export const projects: Project[] = (generatedProjects as Array<{ slug: string; category: Project['categorySlug']; sourceName: string; images: string[] }>).map((project) => ({
  slug: project.slug,
  sourceName: project.sourceName,
  title: displayName(project.category, project.sourceName),
  category: categoryCopy[project.category].category,
  categorySlug: project.category,
  cover: project.images[0],
  description: categoryCopy[project.category].description,
  images: project.images,
}))
