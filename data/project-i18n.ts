import type { Locale } from './i18n'
import type { Project } from './site'

type ProjectCopy = { title: string; category: string; description: string }

const wardrobeTitles = {
  lv: [
    'Iebūvēts skapis līdz griestiem',
    'Skapis ar atvērtu glabāšanas sistēmu',
    'Iebūvēts skapis guļamistabai',
    'Plaša garderobes sistēma',
    'Iebūvēts skapis nišā',
    'Skapis ar pilna augstuma durvīm',
    'Garderobes skapis ar plauktiem',
    'Iebūvēta garderobes zona',
    'Skapis kompaktai telpai',
    'Garderobes sistēma līdz griestiem',
    'Iebūvēts skapis ar atvērtām nišām',
    'Plašs iebūvētais skapis',
    'Garderobes risinājums guļamistabai',
  ],
  ru: [
    'Встроенный шкаф до потолка',
    'Шкаф с открытой системой хранения',
    'Встроенный шкаф в спальне',
    'Просторная гардеробная система',
    'Встроенный шкаф в нише',
    'Шкаф с дверями во всю высоту',
    'Гардеробный шкаф с полками',
    'Встроенная гардеробная зона',
    'Шкаф для компактного пространства',
    'Гардеробная система до потолка',
    'Встроенный шкаф с открытыми нишами',
    'Просторный встроенный шкаф',
    'Гардеробное решение для спальни',
  ],
  en: [
    'Floor-to-ceiling fitted wardrobe',
    'Wardrobe with open storage',
    'Fitted bedroom wardrobe',
    'Spacious wardrobe system',
    'Built-in niche wardrobe',
    'Full-height fitted wardrobe',
    'Wardrobe with shelving',
    'Built-in dressing area',
    'Wardrobe for a compact space',
    'Floor-to-ceiling wardrobe system',
    'Fitted wardrobe with open niches',
    'Spacious fitted wardrobe',
    'Bedroom wardrobe solution',
  ],
} as const

function wardrobeIndex(sourceName: string) {
  const match = sourceName.match(/skapis-?(\d+)/i)
  return match ? Math.max(0, Number(match[1]) - 1) : 0
}

function wardrobeTitle(project: Project, lang: Locale) {
  const titles = wardrobeTitles[lang]
  return titles[wardrobeIndex(project.sourceName) % titles.length]
}

export function localizeProject(project: Project, lang: Locale): ProjectCopy {
  const source = project.sourceName.toLowerCase()
  const title = project.title.toLowerCase()

  if (project.categorySlug === 'wardrobes') {
    const category = lang === 'ru' ? 'Шкафы' : lang === 'en' ? 'Wardrobes' : 'Skapji'
    const description = lang === 'ru'
      ? 'Шкаф, изготовленный по индивидуальным размерам.'
      : lang === 'en'
        ? 'A wardrobe made to individual dimensions.'
        : 'Pēc individuāliem izmēriem izgatavots skapja risinājums.'
    return { title: wardrobeTitle(project, lang), category, description }
  }

  if (project.categorySlug === 'bathrooms') {
    const jurmala = source.includes('jurmala') || title.includes('jūrmal')
    if (lang === 'ru') return { title: jurmala ? 'Мебель для ванной в Юрмале' : 'Мебель для ванной по индивидуальным размерам', category: 'Ванные комнаты', description: 'Мебель для ванной, изготовленная по индивидуальным размерам.' }
    if (lang === 'en') return { title: jurmala ? 'Bathroom furniture in Jūrmala' : 'Custom bathroom furniture', category: 'Bathrooms', description: 'Bathroom furniture made to individual dimensions.' }
    return { title: jurmala ? 'Vannas istabas mēbeles Jūrmalā' : 'Vannas istabas mēbeles pēc izmēra', category: 'Vannas istabas', description: project.description }
  }

  if (lang === 'ru') {
    if (source === '467' || title.includes('467')) return { title: 'Кухня для 467 серии', category: 'Кухни', description: 'Кухня, изготовленная по индивидуальным размерам для планировки 467 серии.' }
    if (source === '602' || title.includes('602')) return { title: 'Кухня для 602 серии', category: 'Кухни', description: 'Кухня, изготовленная по индивидуальным размерам для планировки 602 серии.' }
    if (source.includes('лит') || title.includes('lietuv')) return { title: 'Кухня для литовского проекта', category: 'Кухни', description: 'Кухня, изготовленная по индивидуальным размерам.' }
    if (source.includes('нов') || title.includes('jaunam')) return { title: 'Кухня для нового проекта', category: 'Кухни', description: 'Кухня, изготовленная по индивидуальным размерам.' }
    return { title: 'Кухня по индивидуальному проекту', category: 'Кухни', description: 'Кухня, изготовленная по индивидуальным размерам.' }
  }

  if (lang === 'en') {
    if (source === '467' || title.includes('467')) return { title: 'Kitchen for a 467-series apartment', category: 'Kitchens', description: 'A kitchen made to individual dimensions for a 467-series layout.' }
    if (source === '602' || title.includes('602')) return { title: 'Kitchen for a 602-series apartment', category: 'Kitchens', description: 'A kitchen made to individual dimensions for a 602-series layout.' }
    if (source.includes('лит') || title.includes('lietuv')) return { title: 'Kitchen for a Lithuanian-series apartment', category: 'Kitchens', description: 'A kitchen made to individual dimensions.' }
    if (source.includes('нов') || title.includes('jaunam')) return { title: 'Kitchen for a new-build project', category: 'Kitchens', description: 'A kitchen made to individual dimensions.' }
    return { title: 'Custom kitchen project', category: 'Kitchens', description: 'A kitchen made to individual dimensions.' }
  }

  return { title: project.title, category: project.category, description: project.description }
}
