import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { authSeller } from "@/lib/auth";

// toggle stock of a product
export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const { productId } = await request.json();
        if (!productId) {
            return NextResponse.json({ error: "missing details: productId" }, { status: 404 });
        }

        const storeId = await authSeller(userId);
        if (!storeId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        //check if product exists
        const product = await prisma.product.findFirst({
            where: {
                id: productId, storeId: storeId
            }
        });
        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        await prisma.product.update({
            where: { id: productId },
            data: { inStock: !product.inStock }
        });
        return NextResponse.json({ message: "Product stock updated successfully" });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}