//Update user cart
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ensureUserExists } from '@/lib/syncClerkUser';
export async function PUT(request) {
    try {
        const { userId } = getAuth(request);
        await ensureUserExists(userId);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const { cart } = await request.json();

        //save the cart to the user object
        await prisma.user.update({
            where: { id: userId },
            data: { cart: cart },
        });

        return NextResponse.json({ message: 'Cart updated successfully' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
// Get user cart
export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        await ensureUserExists(userId);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        return NextResponse.json({ cart: user?.cart || [] });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


    