import type { Metadata } from 'next';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = {
  title: 'Admin Login | CodingBull',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-[#06070b] px-5 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md flex-col justify-center">
        <div className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal">CodingBull Admin</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight font-[family-name:var(--font-outfit)]">Sign in</h1>
          <p className="mt-3 text-sm leading-6 text-white/50">
            Manage leads, content, conversion analytics, and website growth operations.
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_80px_rgba(45,212,191,0.08)]">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
