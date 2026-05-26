'use client';

import { useActionState } from 'react';
import { loginAction, type LoginState } from './actions';

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="identifier" className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
          Email or Username
        </label>
        <input
          id="identifier"
          name="identifier"
          type="text"
          required
          autoComplete="username"
          className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white outline-none transition-colors focus:border-teal/50"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white outline-none transition-colors focus:border-teal/50"
        />
      </div>

      {state.error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {state.error}
        </div>
      )}

      <button
        disabled={pending}
        className="w-full rounded-2xl bg-primary px-5 py-4 font-semibold text-black transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? 'Checking...' : 'Sign in'}
      </button>
    </form>
  );
}
