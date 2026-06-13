import prisma from "@/lib/prisma";

export async function authSeller(userId) {
    const store = await prisma.store.findFirst({
        where: { userId: userId, status: 'approved' }
    });
    return store ? store.id : null;
}