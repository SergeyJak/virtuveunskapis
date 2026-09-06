import type { Locale } from './i18n'
import type { Project } from './site'

type ProjectCopy = { title: string; category: string; description: string }

const wardrobeTitles = {
  lv: [
    'Iebūvēts skapis līdz griestiem',
    'Skapis ar glabāšanas sistēmu',
    'Iebūvēts skapis',
    'Garderobes sistēma',
    'Iebūvēts skapis pēc izmēra',
    'Pilna augstuma skapis',
    'Skapis ar plauktu sistēmu',
    'Iebūvēta garderobe',
    'Skapis pēc individuāliem izmēriem',
    'Garderobes sistēma līdz griestiem',
    'Iebūvēts garderobes skapis',
    'Plašs iebūvētais skapis',
    'Individuāls garderobes risinājums',
  ],
  ru: [
    'Встроенный шкаф до потолка',
    'Шкаф с системой хранения',
    'Встроенный шкаф',
    'Гардеробная система',
    'Встроенный шкаф по размерам',
    'Шкаф во всю высоту',
    'Шкаф с системой полок',
    'Встроенная гардеробная',
    'Шкаф по индивидуальным размерам',
    'Гардеробная система до потолка',
    'Встроенный гардеробный шкаф',
    'Просторный встроенный шкаф',
    'Индивидуальное гардеробное решение',
  ],
  en: [
    'Floor-to-ceiling fitted wardrobe',
    'Wardrobe with storage system',
    'Fitted wardrobe',
    'Wardrobe system',
    'Made-to-measure fitted wardrobe',
    'Full-height wardrobe',
    'Wardrobe with shelving system',
    'Built-in dressing area',
    'Made-to-measure wardrobe',
    'Floor-to-ceiling wardrobe system',
    'Fitted dressing wardrobe',
    'Spacious fitted wardrobe',
    'Custom wardrobe solution',
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
