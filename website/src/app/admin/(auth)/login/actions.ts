'use server';

import { AuthError } from 'next-auth';
import { signIn } from '@/auth';

export interface LoginState {
  error?: string;
}

export async function loginAction(_state: LoginState, formData: FormData): Promise<LoginState> {
  try {
    await signIn('credentials', {
      identifier: String(formData.get('identifier') ?? ''),
      password: String(formData.get('password') ?? ''),
      redirectTo: '/admin',
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Invalid email, password, or inactive admin account.' };
    }
    throw error;
  }
}
