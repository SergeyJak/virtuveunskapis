export type Locale = 'lv' | 'ru' | 'en'

export function normalizeLocale(value?: string): Locale {
  return value === 'ru' || value === 'en' ? value : 'lv'
}

export function withLocale(href: string, locale: Locale) {
  if (locale === 'lv') return href
  const [path, query = ''] = href.split('?')
  const params = new URLSearchParams(query)
  params.set('lang', locale)
  const suffix = params.toString()
  return suffix ? `${path}?${suffix}` : path
}

export const copy = {
  lv: {
    nav: { projects: 'Projekti', kitchens: 'Virtuves', wardrobes: 'Skapji', materials: 'Materiāli', about: 'Par mums', contacts: 'Kontakti', contactCta: 'Sazināties' },
    home: {
      heroTitle: ['Mēbeles,', 'ko vēlaties katru', 'dienu redzēt mājās'],
      heroText: 'Projektējam, izgatavojam un uzstādām mēbeles pēc individuāliem izmēriem Rīgā un visā Latvijā.',
      projectsCta: 'Apskatīt projektus', contactCta: 'Sazināties ar mums',
      aboutEyebrow: 'Par uzņēmumu', aboutTitle: 'Vairāk nekā 20 gadus mēbeļu ražošanā',
      aboutLead: 'Radām virtuves un citas mēbeles, kur kvalitāte, funkcionalitāte un dizains strādā kopā.',
      aboutText: 'Mums ir sava moderna ražotne un profesionālu galdnieku komanda. Izgatavojam gan standarta, gan sarežģītus individuālus risinājumus pēc klienta telpas, rasējumiem un vēlmēm, visu darbu veicot paši bez apakšuzņēmējiem.',
      stats: [['20+ gadi','Pieredze mēbeļu ražošanā'],['Sava ražotne','Ražošanu un kvalitāti kontrolējam paši'],['No A līdz Z','No mērīšanas līdz gatavai uzstādīšanai']],
      categoriesTitle: 'Atrodiet mēbeles savam mājoklim', allProjects: 'Visi projekti', latest: 'Jaunākie projekti', viewAll: 'Skatīt visus',
      processTitle: 'Kā notiek sadarbība', process: [['01','Pieteikums','Atstājiet pieteikumu vai piezvaniet mums.'],['02','Izmērs','Veicam mērīšanu objektā.'],['03','Dizains','Izstrādājam projektu un saskaņojam.'],['04','Ražošana','Izgatavojam mēbeles mūsu ražotnē.'],['05','Montāža','Piegādājam un uzstādām.']],
      materialsEyebrow: 'Kvalitāte detaļās', materialsTitle: 'Materiāli un izpildījums, kam var uzticēties', materialsText: 'Labs rezultāts nav tikai skaists skats. Tas ir pārdomāts dizains, kvalitatīvi materiāli un precīzs darbs katrā projekta posmā.', materialsCta: 'Pārrunāt savu projektu'
    },
    portfolio: { eyebrow: 'Portfolio', title: 'Mūsu projekti', text: 'Mēbeļu risinājumu piemēri dažādiem plānojumiem un individuāliem pasūtījumiem.', all: 'Visi', kitchens: 'Virtuves', bathrooms: 'Vannas istabas' },
    contacts: { eyebrow: 'Kontakti', title: 'Pastāstiet par savu ieceri', lead: 'Norādiet, kādas mēbeles vēlaties izgatavot. Mēs sazināsimies un precizēsim projekta detaļas.', phone: 'Tālrunis', email: 'E-pasts', location: 'Atrašanās vieta', formEyebrow: 'Pieteikums', formTitle: 'Sāksim ar jūsu ideju', formText: 'Atstājiet pamatinformāciju, un mēs sazināsimies, lai izrunātu detaļas.' },
    footer: { nav: 'Navigācija', contacts: 'Kontakti', text: 'Mēbeles pēc individuāliem izmēriem Rīgā un visā Latvijā. No pirmās ieceres līdz gatavai montāžai.', accent: 'Mēbeles pēc individuāla pasūtījuma' },
    project: { back: '← Atpakaļ uz projektiem', custom: 'Individuāls pasūtījums', discuss: 'Apspriest projektu', fitEyebrow: 'Pielāgošana', fitTitle: 'Pēc jūsu telpas izmēriem', fitText: 'Izgatavojam mēbeles pēc individuāliem izmēriem, pielāgojot risinājumu konkrētam plānojumam un klienta vēlmēm.', executionEyebrow: 'Izpildījums', executionTitle: 'No mērīšanas līdz uzstādīšanai', executionText: 'Pasūtījumu uzraugām visos posmos un darbus veicam paši, izmantojot savu ražotni un profesionālu galdnieku komandu.', next: 'Nākamais solis', similar: 'Vai vēlaties līdzīgu risinājumu?', similarText: 'Pastāstiet par telpu un ieceri. Mēs palīdzēsim sagatavot risinājumu, kas pielāgots jūsu izmēriem un vajadzībām.' }
  },
  ru: {
    nav: { projects: 'Проекты', kitchens: 'Кухни', wardrobes: 'Шкафы', materials: 'Материалы', about: 'О нас', contacts: 'Контакты', contactCta: 'Связаться' },
    home: {
      heroTitle: ['Мебель,', 'которую хочется видеть', 'дома каждый день'],
      heroText: 'Проектируем, изготавливаем и устанавливаем мебель по индивидуальным размерам в Риге и по всей Латвии.',
      projectsCta: 'Смотреть проекты', contactCta: 'Связаться с нами',
      aboutEyebrow: 'О компании', aboutTitle: 'Более 20 лет в производстве мебели',
      aboutLead: 'Создаём кухни и другую мебель, где качество, функциональность и дизайн работают вместе.',
      aboutText: 'У нас собственное современное производство и команда профессиональных столяров. Изготавливаем как стандартные, так и сложные индивидуальные решения по размерам помещения, чертежам и пожеланиям заказчика, выполняя все работы самостоятельно без субподрядчиков.',
      stats: [['20+ лет','Опыт в производстве мебели'],['Своё производство','Контролируем производство и качество сами'],['От А до Я','От замера до готовой установки']],
      categoriesTitle: 'Найдите мебель для своего дома', allProjects: 'Все проекты', latest: 'Последние проекты', viewAll: 'Смотреть все',
      processTitle: 'Как проходит работа', process: [['01','Заявка','Оставьте заявку или позвоните нам.'],['02','Замер','Выполняем замер на объекте.'],['03','Дизайн','Разрабатываем и согласовываем проект.'],['04','Производство','Изготавливаем мебель на собственном производстве.'],['05','Монтаж','Доставляем и устанавливаем.']],
      materialsEyebrow: 'Качество в деталях', materialsTitle: 'Материалы и исполнение, которым можно доверять', materialsText: 'Хороший результат это не только красивый вид. Это продуманный дизайн, качественные материалы и точная работа на каждом этапе проекта.', materialsCta: 'Обсудить свой проект'
    },
    portfolio: { eyebrow: 'Портфолио', title: 'Наши проекты', text: 'Примеры мебельных решений для разных планировок и индивидуальных заказов.', all: 'Все', kitchens: 'Кухни', bathrooms: 'Ванные комнаты' },
    contacts: { eyebrow: 'Контакты', title: 'Расскажите о своей идее', lead: 'Укажите, какую мебель вы хотите изготовить. Мы свяжемся с вами и уточним детали проекта.', phone: 'Телефон', email: 'E-mail', location: 'Адрес', formEyebrow: 'Заявка', formTitle: 'Начнём с вашей идеи', formText: 'Оставьте основную информацию, и мы свяжемся с вами, чтобы обсудить детали.' },
    footer: { nav: 'Навигация', contacts: 'Контакты', text: 'Мебель по индивидуальным размерам в Риге и по всей Латвии. От первой идеи до готового монтажа.', accent: 'Мебель по индивидуальному заказу' },
    project: { back: '← Назад к проектам', custom: 'Индивидуальный заказ', discuss: 'Обсудить проект', fitEyebrow: 'Адаптация', fitTitle: 'По размерам вашего помещения', fitText: 'Изготавливаем мебель по индивидуальным размерам, адаптируя решение к конкретной планировке и пожеланиям заказчика.', executionEyebrow: 'Исполнение', executionTitle: 'От замера до установки', executionText: 'Контролируем заказ на всех этапах и выполняем работы сами, используя собственное производство и команду профессиональных столяров.', next: 'Следующий шаг', similar: 'Хотите похожее решение?', similarText: 'Расскажите о помещении и вашей идее. Мы поможем подготовить решение под ваши размеры и потребности.' }
  },
  en: {
    nav: { projects: 'Projects', kitchens: 'Kitchens', wardrobes: 'Wardrobes', materials: 'Materials', about: 'About us', contacts: 'Contacts', contactCta: 'Contact us' },
    home: {
      heroTitle: ['Furniture', 'you want to see', 'at home every day'],
      heroText: 'We design, manufacture and install made-to-measure furniture in Riga and throughout Latvia.',
      projectsCta: 'View projects', contactCta: 'Contact us',
      aboutEyebrow: 'About the company', aboutTitle: 'More than 20 years in furniture manufacturing',
      aboutLead: 'We create kitchens and other furniture where quality, function and design work together.',
      aboutText: 'We have our own modern production facility and a team of professional carpenters. We make both standard and complex custom solutions based on the room, drawings and customer preferences, completing the work ourselves without subcontractors.',
      stats: [['20+ years','Experience in furniture manufacturing'],['Own production','We control production and quality ourselves'],['From A to Z','From measurement to final installation']],
      categoriesTitle: 'Find furniture for your home', allProjects: 'All projects', latest: 'Latest projects', viewAll: 'View all',
      processTitle: 'How we work', process: [['01','Request','Send a request or call us.'],['02','Measurement','We measure the space on site.'],['03','Design','We prepare and agree the project.'],['04','Production','We manufacture the furniture in our own facility.'],['05','Installation','We deliver and install it.']],
      materialsEyebrow: 'Quality in every detail', materialsTitle: 'Materials and workmanship you can trust', materialsText: 'A good result is more than a beautiful look. It comes from thoughtful design, quality materials and precise work at every stage.', materialsCta: 'Discuss your project'
    },
    portfolio: { eyebrow: 'Portfolio', title: 'Our projects', text: 'Examples of furniture solutions for different layouts and custom orders.', all: 'All', kitchens: 'Kitchens', bathrooms: 'Bathrooms' },
    contacts: { eyebrow: 'Contacts', title: 'Tell us about your idea', lead: 'Tell us what furniture you would like to have made. We will contact you and clarify the project details.', phone: 'Phone', email: 'Email', location: 'Location', formEyebrow: 'Request', formTitle: 'Let’s start with your idea', formText: 'Leave the basic information and we will contact you to discuss the details.' },
    footer: { nav: 'Navigation', contacts: 'Contacts', text: 'Made-to-measure furniture in Riga and throughout Latvia. From the first idea to final installation.', accent: 'Custom-made furniture' },
    project: { back: '← Back to projects', custom: 'Custom order', discuss: 'Discuss the project', fitEyebrow: 'Custom fit', fitTitle: 'Made for your space', fitText: 'We make furniture to individual dimensions, adapting the solution to the specific layout and customer preferences.', executionEyebrow: 'Execution', executionTitle: 'From measurement to installation', executionText: 'We supervise the order at every stage and carry out the work ourselves using our own production facility and professional carpentry team.', next: 'Next step', similar: 'Would you like a similar solution?', similarText: 'Tell us about your space and idea. We will help prepare a solution tailored to your dimensions and needs.' }
  }
} as const
