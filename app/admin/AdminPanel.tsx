'use client'

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, Check, ExternalLink, ImagePlus, LayoutGrid, LogOut, Plus, RefreshCw, Search, ShieldCheck, Users, X } from 'lucide-react'
import type { ManagedProject } from '@/lib/admin-projects'
import type { AnalyticsEvent, VisitorRow } from '@/lib/admin-analytics'
import styles from './admin.module.css'

type VisitorData = { items: VisitorRow[]; total: number; page: number; limit: number; summary: { uniqueVisitors: number; sessions: number; pageViews: number; returningVisitors: number; contactClicks: number }; trend: { date: string; views: number }[]; retentionDays: number }
type Draft = { slug?: string; title: string; description: string; categorySlug: string; images: string[]; published: boolean; order: number }
const categoryLabels: Record<string,string> = { kitchens: 'Кухни', wardrobes: 'Шкафы', bathrooms: 'Ванные комнаты' }
const emptyDraft = (): Draft => ({ title: '', description: '', categorySlug: 'kitchens', images: [], published: false, order: -1 })
const formatDate = (value: string) => new Date(value).toLocaleString('ru-RU', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
const eventLabels: Record<string,string> = { page_view: 'Просмотр страницы', project_view: 'Просмотр проекта', category_select: 'Выбор категории', contact_click: 'Переход к контактам' }

export function AdminPanel() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const [configured, setConfigured] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [tab, setTab] = useState<'projects' | 'visitors'>('projects')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState<ManagedProject[]>([])
  const [category, setCategory] = useState('')
  const [projectSearch, setProjectSearch] = useState('')
  const [draft, setDraft] = useState<Draft | null>(null)
  const [dirty, setDirty] = useState(false)
  const [visitors, setVisitors] = useState<VisitorData | null>(null)
  const [period, setPeriod] = useState('30')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [visitorSearch, setVisitorSearch] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [sort, setSort] = useState('lastSeen')
  const [page, setPage] = useState(1)
  const [includeBots, setIncludeBots] = useState(false)
  const [detail, setDetail] = useState<{ visitor: VisitorRow; events: AnalyticsEvent[] } | null>(null)

  const dialogRef = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!detail) return
    const previous = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const dialog = dialogRef.current
    const focusables = () => dialog?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]')
    focusables()?.[0]?.focus()
    function keyboard(event: KeyboardEvent) {
      if (event.key === 'Escape') { event.preventDefault(); setDetail(null) }
      if (event.key !== 'Tab') return
      const controls = focusables()
      if (!controls?.length) return
      const first = controls[0], last = controls[controls.length - 1]
      if (event.shiftKey && (document.activeElement === first || !dialog?.contains(document.activeElement))) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && (document.activeElement === last || !dialog?.contains(document.activeElement))) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', keyboard)
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', keyboard); if (previous?.isConnected) previous.focus() }
  }, [detail])

  const api = useCallback(async (path: string, options?: RequestInit) => {
    const response = await fetch(`/api/admin/${path}`, { ...options, cache: 'no-store', headers: options?.body instanceof FormData ? undefined : { 'Content-Type': 'application/json' } })
    const data = await response.json()
    if (!response.ok) {
      if (response.status === 401 && path !== 'login') { setAuthenticated(false); setDetail(null) }
      throw new Error(data.error || 'Не удалось выполнить запрос.')
    }
    return data
  }, [])
  useEffect(() => { let active = true; api('session').then(data => { if (active) { setConfigured(data.configured); setAuthenticated(data.authenticated) } }).catch(e => { if (active) { setError(e.message); setAuthenticated(false) } }); return () => { active = false } }, [api])

  const visitorQuery = new URLSearchParams({ days: period, search: appliedSearch, sort, page: String(page), includeBots: String(includeBots), ...(from ? { from } : {}), ...(to ? { to } : {}) }).toString()
  const loadProjects = useCallback(async () => { const result = await api('projects'); setProjects(result.items) }, [api])
  useEffect(() => {
    if (!authenticated) return
    let active = true
    setLoading(true); setError('')
    const endpoint = tab === 'projects' ? 'projects' : `visitors?${visitorQuery}`
    api(endpoint).then(data => { if (active) { if (tab === 'projects') setProjects(data.items); else setVisitors(data) } }).catch(e => { if (active) setError(e.message) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [authenticated, tab, visitorQuery, api])

  async function login(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError('')
    try { await api('login', { method: 'POST', body: JSON.stringify({ username, password }) }); setPassword(''); setAuthenticated(true) }
    catch (e) { setError((e as Error).message) } finally { setBusy(false) }
  }
  function closeDraft() {
    if (busy) return false
    if (dirty && !window.confirm('Закрыть без сохранения изменений?')) return false
    setDraft(null); setDirty(false); return true
  }
  function edit(project?: ManagedProject) {
    if (draft && !closeDraft()) return
    setError(''); setNotice(''); setDirty(false)
    setDraft(project ? { ...project, images: [...project.images] } : emptyDraft())
  }
  function update(change: Partial<Draft>) { setDraft(value => value ? { ...value, ...change } : value); setDirty(true) }
  async function save(event: FormEvent) {
    event.preventDefault(); if (!draft) return
    setBusy(true); setError(''); setNotice('')
    try {
      await api('projects', { method: 'POST', body: JSON.stringify(draft) })
      setDraft(null); setDirty(false); setNotice('Проект сохранён. Изменения уже доступны на сайте.')
      await loadProjects()
    } catch (e) { setError((e as Error).message) } finally { setBusy(false) }
  }
  async function upload(files: FileList | null) {
    if (!files?.length || !draft) return
    setBusy(true); setError('')
    try {
      if (draft.images.length + files.length > 40) throw new Error('В проекте может быть не более 40 фотографий.')
      const form = new FormData(); Array.from(files).forEach(file => form.append('files', file))
      const result = await api('uploads', { method: 'POST', body: form })
      update({ images: [...draft.images, ...result.images] })
    } catch (e) { setError((e as Error).message) } finally { setBusy(false) }
  }
  function movePhoto(index: number, direction: number) {
    if (!draft) return
    const images = [...draft.images]; const other = index + direction
    ;[images[index], images[other]] = [images[other], images[index]]
    update({ images })
  }
  async function showVisitor(id: string) {
    setError(''); setLoading(true)
    try { setDetail(await api(`visitors/${encodeURIComponent(id)}?${visitorQuery}`)) }
    catch (e) { setError((e as Error).message) } finally { setLoading(false) }
  }
  async function logout() {
    if (draft && !closeDraft()) return
    setBusy(true); setError('')
    try { await api('logout', { method: 'POST', body: '{}' }); setAuthenticated(false); setDetail(null); setProjects([]); setVisitors(null) }
    catch (e) { setError((e as Error).message) } finally { setBusy(false) }
  }

  if (authenticated === null) return <main id="main-content" className={styles.login}><p role="status">Проверяем доступ…</p></main>
  if (!authenticated) return <main id="main-content" className={styles.login}>
    <a className={styles.backLink} href="/">← На сайт</a>
    <form className={styles.loginCard} onSubmit={login}>
      <div className={styles.logoMark}><ShieldCheck size={26}/></div><p className={styles.eyebrow}>VIRTUVE UN SKAPIS</p><h1>Управление сайтом</h1><p className={styles.muted}>Проекты, фотографии и посетители — в одном месте.</p>
      {!configured && <div className={styles.message}>Первый запуск: задайте ADMIN_PASSWORD_HASH и ADMIN_SESSION_SECRET на сервере. Инструкция находится в docs/admin-setup.md.</div>}
      <label>Имя пользователя<input name="username" autoComplete="username" required maxLength={80} value={username} onChange={e => setUsername(e.target.value)}/></label>
      <label>Пароль администратора<input name="password" type="password" autoComplete="current-password" required maxLength={256} value={password} onChange={e => setPassword(e.target.value)}/></label>
      {error && <p className={styles.error} role="alert">{error}</p>}
      <button className={styles.primary} disabled={busy || !configured}>{busy ? 'Входим…' : 'Войти'}<ArrowRight size={18}/></button>
      <span className={styles.loginFoot}>Доступ только для администратора</span>
    </form>
  </main>

  const visible = projects.filter(p => (!category || p.categorySlug === category) && (!projectSearch || p.title.toLowerCase().includes(projectSearch.toLowerCase())))
  return <div className={styles.app}>
    <aside className={styles.sidebar}>
      <a className={styles.brand} href="/">VIRTUVE<span>UN SKAPIS<span className={styles.brandDot}>.</span></span></a><span className={styles.sidebarLabel}>УПРАВЛЕНИЕ САЙТОМ</span>
      <nav aria-label="Администрирование"><button className={tab === 'projects' ? styles.navActive : ''} onClick={() => { if (draft && !closeDraft()) return; setTab('projects'); setDetail(null) }}><LayoutGrid size={19}/>Проекты<span>{projects.length || '—'}</span></button><button className={tab === 'visitors' ? styles.navActive : ''} onClick={() => { if (draft && !closeDraft()) return; setTab('visitors'); setDetail(null) }}><Users size={19}/>Посетители</button></nav>
      <div className={styles.sidebarBottom}><a href="/" target="_blank" rel="noreferrer"><ExternalLink size={16}/>Открыть сайт</a><button onClick={logout} disabled={busy}><LogOut size={16}/>Выйти</button><small>Администратор · защищённый доступ</small></div>
    </aside>
    <main id="main-content" className={styles.main}>
      <header className={styles.header}><div><p className={styles.eyebrow}>ВАШЕ РАБОЧЕЕ ПРОСТРАНСТВО</p><h1>{tab === 'projects' ? 'Проекты и фотографии' : 'Посетители сайта'}</h1><p className={styles.muted}>{tab === 'projects' ? 'Показывайте лучшие работы. Обновления появляются сразу после сохранения.' : 'Кто приходит на сайт, что смотрит и как связывается с вами.'}</p></div>{tab === 'projects' && !draft && <button className={styles.primary} onClick={() => edit()}><Plus size={18}/>Добавить проект</button>}</header>
      {error && <div className={styles.error} role="alert">{error}</div>}{notice && <div className={styles.success} role="status"><Check size={17}/>{notice}</div>}
      {tab === 'projects' ? <>
        {draft ? <form onSubmit={save} className={styles.editor}>
          <div className={styles.editorHeading}><div><p className={styles.eyebrow}>{draft.slug ? 'РЕДАКТИРОВАНИЕ' : 'НОВЫЙ ПРОЕКТ'}</p><h2>{draft.title || 'Расскажите о своей работе'}</h2></div><button type="button" className={styles.iconButton} aria-label="Закрыть редактор" onClick={closeDraft} disabled={busy}><X/></button></div>
          <fieldset disabled={busy} className={styles.fields}>
            <label>Название проекта<input required maxLength={160} value={draft.title} onChange={e => update({ title: e.target.value })} placeholder="Например, кухня в Риге"/></label>
            <div className={styles.twoColumns}><label>Категория<select value={draft.categorySlug} onChange={e => update({ categorySlug: e.target.value })}>{Object.entries(categoryLabels).map(([slug,label]) => <option key={slug} value={slug}>{label}</option>)}</select></label><label>Порядок в портфолио<input type="number" required min={-100000} max={100000} value={draft.order} onChange={e => update({ order: Number(e.target.value) })}/><small>Меньшее число — выше в списке.</small></label></div>
            <label>Описание<textarea rows={3} maxLength={4000} value={draft.description} onChange={e => update({ description: e.target.value })} placeholder="Материалы, особенности и детали проекта"/></label>
            <div className={styles.photoHeading}><div><h3>Фотографии <span>{draft.images.length}/40</span></h3><p className={styles.muted}>Первая фотография — обложка. JPEG, PNG или WebP, до 8 МБ каждая.</p></div><label className={styles.uploadButton}><ImagePlus size={18}/>Загрузить фото<input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={e => { void upload(e.target.files); e.target.value = '' }}/></label></div>
            {!draft.images.length && <div className={styles.uploadEmpty}><ImagePlus size={36}/><h3>Добавьте фотографии проекта</h3><p>До 10 файлов и 32 МБ за одну загрузку.</p></div>}
            <div className={styles.photoGrid}>{draft.images.map((image,index) => <div className={styles.photo} key={image}><img src={image} alt={`Фото ${index + 1}`} loading="lazy"/>{index === 0 && <span className={styles.coverBadge}>Обложка</span>}<div className={styles.photoActions}><button type="button" disabled={index === 0} onClick={() => movePhoto(index,-1)} aria-label={`Переместить фото ${index+1} назад`}><ArrowLeft size={16}/></button><button type="button" disabled={index === draft.images.length-1} onClick={() => movePhoto(index,1)} aria-label={`Переместить фото ${index+1} вперёд`}><ArrowRight size={16}/></button><button type="button" onClick={() => update({ images: draft.images.filter(x => x !== image) })} aria-label={`Удалить фото ${index+1} из проекта`}><X size={16}/></button></div></div>)}</div>
            <label className={styles.check}><input type="checkbox" checked={draft.published} onChange={e => update({ published: e.target.checked })}/><span>Опубликовать на сайте<small>Выключите, чтобы сохранить проект как черновик или скрыть его.</small></span></label>
          </fieldset>
          <div className={styles.editorFooter}><button type="button" className={styles.secondary} disabled={busy} onClick={closeDraft}>Отмена</button><button className={styles.primary} disabled={busy || !draft.images.length}>{busy ? 'Сохраняем…' : 'Сохранить проект'}<Check size={17}/></button></div>
        </form> : <>
          <div className={styles.stats}><div><span>Всего проектов</span><strong>{projects.length}</strong></div><div><span>Опубликовано</span><strong>{projects.filter(p => p.published).length}</strong></div><div><span>Черновики</span><strong>{projects.filter(p => !p.published).length}</strong></div></div>
          <div className={styles.toolbar}><div className={styles.pills}><button className={!category ? styles.pillActive : ''} onClick={() => setCategory('')}>Все проекты</button>{Object.entries(categoryLabels).map(([slug,label]) => <button key={slug} className={category === slug ? styles.pillActive : ''} onClick={() => setCategory(slug)}>{label}</button>)}</div><label className={styles.search}><Search size={17}/><input aria-label="Поиск проектов" placeholder="Найти проект" value={projectSearch} onChange={e => setProjectSearch(e.target.value)}/></label></div>
          {loading ? <p role="status" className={styles.empty}>Загружаем проекты…</p> : visible.length ? <div className={styles.projectGrid}>{visible.map(p => <article key={p.slug} className={styles.projectCard}><button className={styles.cardImage} onClick={() => edit(p)} aria-label={`Редактировать ${p.title}`}><img src={p.cover} alt={p.title} loading="lazy"/><span className={p.published ? styles.published : styles.draftBadge}>{p.published ? 'На сайте' : 'Черновик'}</span><span className={styles.photoCount}>{p.images.length} фото</span></button><div className={styles.cardBody}><span className={styles.categoryName}>{categoryLabels[p.categorySlug]}</span><h2>{p.title}</h2><div><button onClick={() => edit(p)}>Редактировать <ArrowRight size={15}/></button>{p.published && <a href={`/projects/${p.slug}`} target="_blank" rel="noreferrer" aria-label={`Открыть ${p.title} на сайте`}><ExternalLink size={17}/></a>}</div></div></article>)}</div> : <div className={styles.empty}><LayoutGrid size={32}/><h2>Проектов не найдено</h2><p>Измените фильтр или добавьте новую работу.</p></div>}
        </>}
      </> : <>
        <div className={styles.visitorFilters}><div className={styles.pills}>{['7','14','30'].map(days => <button key={days} className={period === days && !from && !to ? styles.pillActive : ''} onClick={() => { setPeriod(days); setFrom(''); setTo(''); setPage(1) }}>{days} дней</button>)}</div><label>С<input type="date" value={from} onChange={e => { setFrom(e.target.value); setPage(1) }}/></label><label>По<input type="date" value={to} onChange={e => { setTo(e.target.value); setPage(1) }}/></label><button className={styles.iconButton} aria-label="Обновить статистику" disabled={loading} onClick={async () => { setLoading(true); setError(''); try { setVisitors(await api(`visitors?${visitorQuery}`)) } catch(e) { setError((e as Error).message) } finally { setLoading(false) } }}><RefreshCw size={18}/></button></div>
        {visitors && <><div className={`${styles.stats} ${styles.visitorStats}`}>{[['Посетители',visitors.summary.uniqueVisitors],['Сессии',visitors.summary.sessions],['Просмотры',visitors.summary.pageViews],['Вернулись',visitors.summary.returningVisitors],['Контакты',visitors.summary.contactClicks]].map(([label,value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
        <section className={styles.chart}><div><h2>Просмотры по дням</h2><span className={styles.muted}>Время в таблице — местное, границы дат — UTC.</span></div>{visitors.trend.length ? <div className={styles.bars} role="img" aria-label="Просмотры страниц по дням">{visitors.trend.map(row => <div key={row.date} title={`${row.date}: ${row.views} просмотров`}><span>{row.views}</span><i style={{ height: `${Math.max(4, row.views / Math.max(...visitors.trend.map(r => r.views)) * 90)}px` }}/><small>{row.date.slice(5)}</small></div>)}</div> : <p className={styles.muted}>В этом периоде просмотров пока нет.</p>}</section></>}
        <div className={styles.toolbar}><form className={styles.search} onSubmit={e => { e.preventDefault(); setAppliedSearch(visitorSearch); setPage(1) }}><Search size={17}/><input aria-label="Поиск посетителей" placeholder="ID, источник, устройство или страница" value={visitorSearch} onChange={e => setVisitorSearch(e.target.value)}/><button>Найти</button></form><label className={styles.sort}>Сортировка<select value={sort} onChange={e => { setSort(e.target.value); setPage(1) }}><option value="lastSeen">Последняя активность</option><option value="pageViews">Больше просмотров</option></select></label><label className={styles.check}><input type="checkbox" checked={includeBots} onChange={e => { setIncludeBots(e.target.checked); setPage(1) }}/>Включая ботов</label></div>
        {loading && <p role="status">Обновляем статистику…</p>}
        <div className={styles.tableWrap}><table><thead><tr><th>Посетитель</th><th>Источник</th><th>Устройство</th><th>Просмотры</th><th>Сессии</th><th>Последний визит</th></tr></thead><tbody>{visitors?.items.map(v => <tr key={v.visitorId}><td><button className={styles.visitorLink} onClick={() => showVisitor(v.visitorId)}>{v.visitorId.slice(0,8)}… <ArrowRight size={14}/></button><small>{v.ip || 'IP не определён'}</small></td><td>{v.source === 'direct' ? 'Прямой заход' : v.source}<small>{v.locale.toUpperCase()}</small></td><td>{v.device}<small>{v.browser}</small></td><td>{v.pageViews}</td><td>{v.sessions}{v.sessions > 1 && <small>Повторный визит</small>}</td><td>{formatDate(v.lastSeen)}</td></tr>)}</tbody></table>{!loading && !visitors?.items.length && <div className={styles.empty}><Users size={32}/><h2>Пока нет посетителей</h2><p>Визиты появятся после посещения публичного сайта. Сессии администратора исключены.</p></div>}</div>
        <div className={styles.pagination}><span>{visitors?.total || 0} посетителей · страница {page}</span><div><button className={styles.secondary} disabled={page <= 1 || loading} onClick={() => setPage(p => p-1)}><ArrowLeft size={16}/>Назад</button><button className={styles.secondary} disabled={!visitors || page * visitors.limit >= visitors.total || loading} onClick={() => setPage(p => p+1)}>Далее<ArrowRight size={16}/></button></div></div><p className={styles.footnote}>Хранение: {visitors?.retentionDays || 90} дней, максимум 50 000 событий. География не определяется без настроенного источника GeoIP.</p>
      </>}
      {detail && <div className={styles.modalBackdrop} onClick={e => { if(e.target === e.currentTarget) setDetail(null) }}><section ref={dialogRef} className={styles.detail} role="dialog" aria-modal="true" aria-label="История посетителя" onKeyDown={e => { if (e.key === 'Escape') setDetail(null) }}><button className={styles.iconButton} onClick={() => setDetail(null)} aria-label="Закрыть историю"><X/></button><p className={styles.eyebrow}>ИСТОРИЯ ПОСЕТИТЕЛЯ</p><h2>{detail.visitor.visitorId.slice(0,8)}…</h2><p className={styles.muted}>{detail.visitor.device} · {detail.visitor.browser} · {detail.visitor.locale.toUpperCase()}</p><dl className={styles.detailInfo}><div><dt>Первый визит в периоде</dt><dd>{formatDate(detail.visitor.firstSeen)}</dd></div><div><dt>Источник</dt><dd>{detail.visitor.source}</dd></div><div><dt>Страница входа</dt><dd>{detail.visitor.landingPage}</dd></div><div><dt>IP</dt><dd>{detail.visitor.ip || 'Не определён'}</dd></div></dl><h3>Действия за выбранный период</h3><ol className={styles.timeline}>{detail.events.map(event => <li key={event.id}><time>{formatDate(event.timestamp)}</time><strong>{eventLabels[event.eventType] || event.eventType}{event.target ? ` · ${categoryLabels[event.target] || event.target}` : ''}</strong><span>{event.page}</span></li>)}</ol>{detail.events.length === 1000 && <p>Показаны последние 1000 событий.</p>}</section></div>}
    </main>
  </div>
}
