import { inngest } from "./client";
import prisma from "@/lib/prisma";

// Inngest function to save data to the database
export const SyncUserCreation = inngest.createFunction(
  { id: "sync-user-create" },
  { event: "clerk/user.created" },
  async ({ event}) => {
    const {data} = event
    await  prisma.user.create({
        data:{
            id:data.id,
            email:data.email_addresses[0].email_address,
            email:'$(data.first_name} ${data.last_name)',
            image:data.image_url,
  },
})
  }
);
//Inngest function to update user data in database
export const SyncUserUpdation = inngest.createFunction(
    { id: "sync-user-update" },
    { event: "clerk/user.updated" },
    async ({ event}) => {
      const {data} = event
        await  prisma.user.update({
            where:{id:data.id},
            data:{
                email:data.email_addresses[0].email_address,
                name:`${data.first_name} ${data.last_name}`,
                image:data.image_url,
      },
  })
    }
);
//Inngest function to delete user from database
export const SyncUserDeletion = inngest.createFunction(
    { id: "sync-user-delete" }, 
    { event: "clerk/user.deleted" },
    async ({ event}) => {
      const {data} = event
        await  prisma.user.delete({
            where:{id:data.id},
  })
    }
);