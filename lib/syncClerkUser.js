import { clerkClient } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function ensureUserExists(userId, clerkUser) {
  if (!userId) return null;

  const resolvedUser = clerkUser ?? (await clerkClient.users.getUser(userId));

  if (!resolvedUser) return null;

  const primaryEmail =
    resolvedUser.emailAddresses?.find(
      (email) => email.id === resolvedUser.primaryEmailAddressId
    )?.emailAddress ||
    resolvedUser.emailAddresses?.[0]?.emailAddress ||
    '';

  const fullName = [resolvedUser.firstName, resolvedUser.lastName]
    .filter(Boolean)
    .join(' ')
    .trim();

  const name = fullName || resolvedUser.username || primaryEmail || 'Clerk User';
  const image = resolvedUser.imageUrl || '';

  const user = await prisma.user.upsert({
    where: { id: userId },
    create: {
      id: userId,
      name,
      email: primaryEmail,
      image,
      cart: {},
    },
    update: {
      name,
      email: primaryEmail,
      image,
    },
  });

  return user;
}
