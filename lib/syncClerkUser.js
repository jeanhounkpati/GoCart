import { clerkClient } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function ensureUserExists(userId) {
  if (!userId) return;
  try {
    const user = await clerkClient.users.getUser(userId);
    const email = user?.emailAddresses?.[0]?.emailAddress ?? "";
    const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.username || "";
    const image = user?.profileImageUrl || user?.imageUrl || "";

    await prisma.user.upsert({
      where: { id: user.id },
      update: { email, name, image },
      create: { id: user.id, email, name: name || "User", image: image || "" },
    });
    console.info(`ensureUserExists: upserted user ${userId}`);
  } catch (error) {
    console.error("ensureUserExists error fetching from Clerk:", error?.message || error);
    // Fallback: ensure a minimal user record exists so Prisma updates won't fail
    try {
      await prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: { id: userId, email: "", name: "User", image: "" },
      });
      console.info(`ensureUserExists: fallback upsert created minimal user ${userId}`);
    } catch (innerErr) {
      console.error("ensureUserExists fallback error:", innerErr?.message || innerErr);
    }
  }
}
