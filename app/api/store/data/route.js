import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

// Get store info & info products

export async function GET(request) {
    try {
        //Get store username from query params
        const { searchParams } = new URL(request.url);
        const username = searchParams.get("username").toLowerCase();
        if(!username){
            return NextResponse.json({error:"Username is required"}, {status:400} );
        }
        //Get store info and inStock products with ratings
        const store = await prisma.store.findUnique({
            where: { username, isActive: true },
            include: {
                product: {
                    where: { inStock: true },
                    include: { rating: true }
                }
            }
        });
    
        if(!store) {
            return NextResponse.json({ error: "Store not found" }, { status: 404 });
        }
        return NextResponse.json(store);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}