import Link from 'next/link';
import { BarChart3, ClipboardList, FileImage, FileText, Gauge, HelpCircle, Lock, MessageSquare, Settings, Shield, Users } from 'lucide-react';
import type { Session } from 'next-auth';
import { signOutAction } from '@/app/admin/(protected)/actions';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: Gauge },
  { label: 'Leads', href: '/admin/leads', icon: ClipboardList },
  { label: 'Services', href: '/admin/content/services', icon: FileText },
  { label: 'Case Studies', href: '/admin/content/case-studies', icon: MessageSquare },
  { label: 'Insights', href: '/admin/content/insights', icon: FileText },
  { label: 'Testimonials', href: '/admin/content/testimonials', icon: Shield },
  { label: 'FAQs', href: '/admin/content/faqs', icon: HelpCircle },
  { label: 'Media', href: '/admin/media', icon: FileImage },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Audit Logs', href: '/admin/audit-logs', icon: Lock },
];

export function AdminShell({ children, session }: { children: React.ReactNode; session: Session }) {
  return (
    <div className="min-h-screen bg-[#06070b] text-white">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/10 bg-[#090d14] px-5 py-6 lg:flex lg:flex-col">
        <Link href="/admin" className="mb-8 block">
          <p className="text-xs uppercase tracking-[0.24em] text-teal">CodingBull</p>
          <h1 className="mt-2 text-xl font-bold font-[family-name:var(--font-outfit)]">Growth Admin</h1>
        </Link>

        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/[0.05] hover:text-white"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 pt-5">
          <p className="text-xs text-white/40">{session.user.email}</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/30">{session.user.role}</p>
          <form action={signOutAction} className="mt-4">
            <button className="w-full rounded-xl border border-white/10 px-3 py-2 text-sm text-white/60 transition-colors hover:border-rose-400/40 hover:text-rose-200">
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#06070b]/90 px-5 py-4 backdrop-blur-xl lg:hidden">
          <div className="flex items-center justify-between gap-4">
            <Link href="/admin" className="font-bold">Growth Admin</Link>
            <form action={signOutAction}>
              <button className="text-xs text-white/50">Sign out</button>
            </form>
          </div>
          <nav className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="shrink-0 rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/60">
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        <main className="min-h-screen px-5 py-8 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
