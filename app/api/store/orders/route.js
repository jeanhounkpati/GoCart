import {getAuth} from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { authSeller } from "@/lib/auth";
//Update seller order status
export async function PUT(request) {
    try {
        const { userId } = getAuth(request);
        const storeId = await authSeller(userId);
        if (!storeId) {
            return NextResponse.json({ error: 'not authorized' }, { status: 401 });
        }

        const { orderId, status } = await request.json();
        //Check if order belongs to seller
        await prisma.order.update({
            where: { id: orderId, storeId: storeId },
            data: { status: status }
        });
        return NextResponse.json({ message: 'Order status updated successfully' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}

//Get all orders for seller
export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        const storeId = await authSeller(userId);
        if (!storeId) {
            return NextResponse.json({ error: 'not authorized' }, { status: 401 });
        }
        const orders = await prisma.order.findMany({
            where: { storeId: storeId },
            include: {user: true,address: true, orderItems: true},
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ orders });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}