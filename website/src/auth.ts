import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { compare } from 'bcryptjs';
import { z } from 'zod';
import type { UserRole, UserStatus } from '@prisma/client';
import { prisma } from '@/lib/server/prisma';
import { checkRateLimit } from '@/lib/server/rate-limit';

const credentialsSchema = z.object({
  identifier: z.string().min(1).transform((value) => value.toLowerCase().trim()),
  password: z.string().min(1),
});

const userRoles: UserRole[] = ['OWNER', 'ADMIN', 'EDITOR', 'VIEWER'];
const userStatuses: UserStatus[] = ['ACTIVE', 'INVITED', 'SUSPENDED'];

function isUserRole(value: unknown): value is UserRole {
  return typeof value === 'string' && userRoles.includes(value as UserRole);
}

function isUserStatus(value: unknown): value is UserStatus {
  return typeof value === 'string' && userStatuses.includes(value as UserStatus);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/admin/login',
  },
  trustHost: true,
  providers: [
    Credentials({
      name: 'Admin credentials',
      credentials: {
        identifier: { label: 'Email or Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse({
          identifier: credentials?.identifier,
          password: credentials?.password
        });
        if (!parsed.success) return null;

        // Rate limit by identifier
        const rateLimit = await checkRateLimit({
          identifier: parsed.data.identifier,
          action: 'admin_login',
          limit: 10,
          windowMs: 15 * 60 * 1000,
        });

        if (!rateLimit.allowed) {
          throw new Error('Too many login attempts. Please try again later.');
        }

        const user = await prisma.user.findFirst({
          where: { 
            OR: [
              { email: parsed.data.identifier },
              { name: parsed.data.identifier }
            ]
          },
          select: {
            id: true,
            email: true,
            name: true,
            passwordHash: true,
            role: true,
            status: true,
          },
        });

        if (!user?.passwordHash || user.status !== 'ACTIVE') {
          return null;
        }

        const passwordMatches = await compare(parsed.data.password, user.passwordHash);
        if (!passwordMatches) return null;

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
        };
      },
    }),
  ],
  useSecureCookies: process.env.NODE_ENV === 'production',
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-auth.session-token' : 'auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.status = user.status;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === 'string' ? token.id : '';
        session.user.role = isUserRole(token.role) ? token.role : 'VIEWER';
        session.user.status = isUserStatus(token.status) ? token.status : 'INVITED';
      }
      return session;
    },
  },
});
