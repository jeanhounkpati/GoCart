import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import imagekit from '@/configs/imageKit';

//create the store

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        //Get the data from the form
        const formData = await request.formData();
        const name = formData.get("name");
        const description = formData.get("description");
        const username = formData.get("username");
        const email = formData.get("email");
        const contact = formData.get("contact");
        const address = formData.get("address");
        const image = formData.get("image");

        //Validate the data
        if (!name || !description || !username || !email || !contact || !address || !image) {
            return NextResponse.json({ error: "Missing store info" }, { status: 400 });
        }
        //check if user have already registered a store
        const store = await prisma.store.findFirst({
            where: { userId: userId }
        });
        //if store is already registered then send status of store
        if (store) {
            return NextResponse.json({ status: store.status });
        }
        //check if username is already taken
        const isUsernameTaken = await prisma.store.findFirst({
            where: { username: username.toLowerCase() }
        });
        if (isUsernameTaken) {
            return NextResponse.json({ error: "Username is already taken" }, { status: 400 });
        }

        //image upload to imagekit
        const buffer = Buffer.from(await image.arrayBuffer());
        const response = await imagekit.files.upload({
            file: buffer,
            fileName: image.name,
            folder: "logos",
        });
        const optimizedImage = imagekit.url({
            src: response.filePath,
            transformation: [
                { format: "webp", width: "512", quality: "auto" }
            ]
        });
        //create the store
        const newStore = await prisma.store.create({
            data: {
                userId,
                name,
                description,
                username: username.toLowerCase(),
                email,
                contact,
                address,
                image: optimizedImage
            }
        });
        // link a store to the user
        await prisma.user.update({
            where: { id: userId },
            data: { store: { connect: { id: newStore.id } } }
        });
        return NextResponse.json({ message: "Applied, waiting for approval" });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

//check if user have already registered a store if yes then return the status of the store
export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        const store = await prisma.store.findFirst({
            where: { userId: userId }
        });
        if (store) {
            return NextResponse.json({ status: store.status });
        }
        return NextResponse.json({ status: "not registered" });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}