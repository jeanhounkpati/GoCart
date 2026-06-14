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
  } catch (error) {
    console.error("ensureUserExists error:", error);
  }
}
