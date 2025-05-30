import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import prisma from "../../lib/prisma";
import { Lucia, Session, User } from "lucia";
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
export const getUser = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId =
      (await cookies()).get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);
    // next.js throws when you attempt to set cookie when rendering page
    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        (await cookies()).set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        (await cookies()).set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
    } catch {}
    return result;
  }
);

// Utility function to check if user has required role
export async function hasRequiredRole(requiredRole: Role): Promise<boolean> {
  const { user } = await getUser();
  return user?.role === requiredRole;
}

// Utility function to ensure user has required role (throws error if not)
export async function ensureRole(requiredRole: Role): Promise<User> {
  const { user } = await getUser();

  if (!user) {
    throw new Error("Authentication required");
  }

  if (user.role !== requiredRole) {
    throw new Error(`Access denied. Required role: ${requiredRole}`);
  }

  return user;
}

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
