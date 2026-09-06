# Task ID

013

# Status

TODO

# Priority

High

# Current Task

## Goal

Переделать только Hero страницы проекта `/projects/[slug]`, чтобы он выглядел на уровне главной страницы.

---

## Files allowed

Read:

- AGENTS.md
- .agents/RULES.md
- docs/DECISIONS.md
- app/projects/[slug]/page.tsx
- app/globals.css
- data/site.ts

Allowed to modify:

- app/projects/[slug]/page.tsx
- app/globals.css

---

## Files forbidden

Не изменять:

- app/page.tsx
- app/portfolio/**
- app/contacts/**
- components/**
- data/**
- public/**
- package.json
- package-lock.json

---

## Requirements

- Изменить только Hero страницы проекта.
- Hero должен занимать примерно 70–90vh на desktop.
- Использовать существующее изображение проекта.
- Показать название проекта поверх изображения.
- Показать локацию и категорию рядом с названием.
- Добавить тёмный градиент для читаемости текста.
- Добавить CTA `Apspriest projektu`.
- Сохранить текущий блок материалов, описание, галерею и нижний CTA без изменений.
- Desktop и mobile должны выглядеть цельно.
- Не добавлять новые зависимости.

---

## Verification

Выполнить:

```bash
npm run build

# Task ID

014

# Status

TODO

# Priority

High

# Current Task

## Goal

Переделать только страницу `/portfolio`, чтобы она соответствовала премиальному стилю главной страницы и страниц проектов.

---

## Files allowed

Read:

- AGENTS.md
- .agents/RULES.md
- docs/DECISIONS.md
- app/portfolio/page.tsx
- app/globals.css
- components/ProjectCard.tsx
- data/site.ts

Allowed to modify:

- app/portfolio/page.tsx
- app/globals.css
- components/ProjectCard.tsx

---

## Files forbidden

Не изменять:

- app/page.tsx
- app/projects/**
- app/contacts/**
- components/Header.tsx
- components/Footer.tsx
- data/**
- public/**
- package.json
- package-lock.json

---

## Requirements

- Изменить только страницу Portfolio.
- Сохранить существующие проекты, данные, slug, ссылки и маршруты.
- Сохранить заголовок `Mūsu projekti`.
- Сделать страницу визуально согласованной с главной и project details page.
- Улучшить:
  - верхний intro-блок;
  - фильтры категорий;
  - сетку проектов;
  - отступы;
  - визуальную иерархию;
  - desktop и mobile layout.
- Карточки проектов должны быть крупными, image-first и премиальными.
- Фильтры должны выглядеть современно, но не должны ломать текущую функциональность.
- Не добавлять новые зависимости.
- Не добавлять новые проекты или выдуманный контент.
- Не изменять Header и Footer.
- Не изменять другие страницы.

---

## Verification

Выполнить:

```bash
npm run build