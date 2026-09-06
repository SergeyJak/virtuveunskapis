import type { Locale } from './i18n'
import type { Project } from './site'

export function localizeProject(project: Project, lang: Locale) {
  if (lang === 'lv') {
    return { title: project.title, category: project.category, description: project.description }
  }

  const source = project.sourceName.toLowerCase()
  const title = project.title.toLowerCase()

  if (lang === 'ru') {
    if (project.categorySlug === 'wardrobes') {
      const number = project.sourceName.replace(/^skapis-?/i, '').trim()
      return {
        title: number ? `Шкаф ${number}` : 'Шкаф',
        category: 'Шкафы',
        description: 'Шкаф, изготовленный по индивидуальным размерам.',
      }
    }

    if (project.categorySlug === 'bathrooms') {
      const jurmala = source.includes('jurmala') || title.includes('jūrmal')
      return {
        title: jurmala ? 'Мебель для ванной в Юрмале' : 'Мебель для ванной',
        category: 'Ванные комнаты',
        description: 'Мебель для ванной, изготовленная по индивидуальным размерам.',
      }
    }

    if (source === '467' || title.includes('467')) return { title: 'Кухня для 467 серии', category: 'Кухни', description: 'Кухня, изготовленная по индивидуальным размерам для планировки 467 серии.' }
    if (source === '602' || title.includes('602')) return { title: 'Кухня для 602 серии', category: 'Кухни', description: 'Кухня, изготовленная по индивидуальным размерам для планировки 602 серии.' }
    if (source.includes('лит') || title.includes('lietuv')) return { title: 'Кухня для литовского проекта', category: 'Кухни', description: 'Кухня, изготовленная по индивидуальным размерам.' }
    if (source.includes('нов') || title.includes('jaunam')) return { title: 'Кухня для нового проекта', category: 'Кухни', description: 'Кухня, изготовленная по индивидуальным размерам.' }
    return { title: 'Кухня', category: 'Кухни', description: 'Кухня, изготовленная по индивидуальным размерам.' }
  }

  if (project.categorySlug === 'wardrobes') {
    const number = project.sourceName.replace(/^skapis-?/i, '').trim()
    return {
      title: number ? `Wardrobe ${number}` : 'Wardrobe',
      category: 'Wardrobes',
      description: 'A wardrobe made to individual dimensions.',
    }
  }

  if (project.categorySlug === 'bathrooms') {
    const jurmala = source.includes('jurmala') || title.includes('jūrmal')
    return {
      title: jurmala ? 'Bathroom furniture in Jūrmala' : 'Bathroom furniture',
      category: 'Bathrooms',
      description: 'Bathroom furniture made to individual dimensions.',
    }
  }

  if (source === '467' || title.includes('467')) return { title: 'Kitchen for a 467-series apartment', category: 'Kitchens', description: 'A kitchen made to individual dimensions for a 467-series layout.' }
  if (source === '602' || title.includes('602')) return { title: 'Kitchen for a 602-series apartment', category: 'Kitchens', description: 'A kitchen made to individual dimensions for a 602-series layout.' }
  if (source.includes('лит') || title.includes('lietuv')) return { title: 'Kitchen for a Lithuanian-series apartment', category: 'Kitchens', description: 'A kitchen made to individual dimensions.' }
  if (source.includes('нов') || title.includes('jaunam')) return { title: 'Kitchen for a new-build project', category: 'Kitchens', description: 'A kitchen made to individual dimensions.' }
  return { title: 'Kitchen', category: 'Kitchens', description: 'A kitchen made to individual dimensions.' }
}
