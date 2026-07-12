# Task ID

002

# Status

TODO

# Priority

High

# Current Task

## Goal

Реализовать только Header и Hero главной страницы максимально близко к референсу:

`docs/references/home-concept.png`

Не изменять остальные секции страницы.

## Files allowed

Read:

- AGENTS.md
- .agents/RULES.md
- docs/DECISIONS.md
- docs/references/home-concept.png
- app/page.tsx
- app/globals.css
- components/Header.tsx
- data/site.ts

Allowed to modify:

- app/page.tsx
- app/globals.css
- components/Header.tsx

## Files forbidden

Не изменять:

- components/Footer.tsx
- components/ProjectCard.tsx
- data/site.ts
- public/**
- package.json
- package-lock.json
- остальные страницы и компоненты

## Requirements

### Header

- Прозрачный поверх Hero.
- Логотип слева.
- Основная навигация по центру.
- Переключатель языков LV / RU / EN.
- CTA `Sazināties` справа.
- Мобильное меню должно продолжать работать.
- Не добавлять новые зависимости.

### Hero

- Использовать существующее изображение.
- Максимально повторить композицию референса.
- Крупный латышский заголовок:
  `Mēbeles, ko vēlaties katru dienu redzēt mājās`
- Подзаголовок:
  `Projektējam, izgatavojam un uzstādām mēbeles pēc individuāliem izmēriem Rīgā un visā Latvijā.`
- Основной CTA:
  `Apskatīt projektus`
- Второй CTA:
  `Sazināties ar mums`
- Сохранить хорошую читаемость текста.
- Hero должен корректно выглядеть на desktop и mobile.
- Не добавлять декоративный текст, статистику или новые блоки.

## Verification

Выполнить:

```bash
npm run build