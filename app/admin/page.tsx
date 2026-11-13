import type { Metadata } from 'next'
import { AdminPanel } from './AdminPanel'

export const metadata: Metadata = { title: 'Администрирование', robots: { index: false, follow: false } }
export const dynamic = 'force-dynamic'
export default function AdminPage() { return <AdminPanel /> }
