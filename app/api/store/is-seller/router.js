import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { authSeller } from "@/lib/auth";

// Auth Seller
export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        const storeId = await authSeller(userId);
        if (!storeId) {
            return NextResponse.json({ error: 'not authorized' }, { status: 401 });
        }
        const storeInfo = await prisma.store.findUnique({
            where: { userId: userId }
        });
        return NextResponse.json({ isSeller: true, storeInfo });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
            