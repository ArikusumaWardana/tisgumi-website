import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import prisma from "../../lib/prisma";
import { Lucia } from "lucia";
import { Role } from "@prisma/client";
import { cache } from "react";
import { cookies } from "next/headers";

// Prisma adapter
const adapter = new PrismaAdapter(prisma.session, prisma.user);

// Lucia instance
export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      id: attributes.id,
      email: attributes.email,
      name: attributes.name,
      phone: attributes.phone,
      role: attributes.role,
    };
  },
});

// Get user from session
export const getUser = cache(async () => {
  const sessionId =
    (await cookies()).get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) return { user: null, session: null };
  const { user, session } = await lucia.validateSession(sessionId);
  try {
    if (session && session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
  } catch {
    // Next.js throws error when attempting to set cookies when rendering page
  }
  return { user, session };
});

// Lucia types
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    UserId: number;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

// Database user attributes
interface DatabaseUserAttributes {
  id: number;
  email: string;
  name: string;
  phone: string;
  role: Role;
}
