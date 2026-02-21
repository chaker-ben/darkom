import { auth } from '@clerk/nextjs/server';

import type { Profile } from '@darkom/db';

import { prisma } from './prisma';

/**
 * Get the current user's profile from DB, or null if not authenticated.
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const profile = await prisma.profile.findUnique({
    where: { clerkId: userId },
  });

  return profile;
}

/**
 * Get the current user's profile from DB, or throw if not authenticated.
 */
export async function requireProfile(): Promise<Profile> {
  const profile = await getCurrentProfile();

  if (!profile) {
    throw new Error('Unauthorized: no profile found');
  }

  return profile;
}
