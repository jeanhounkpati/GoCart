import { inngest } from "./client";
import prisma from "@/lib/prisma";

// Inngest function to save data to the database
export const SyncUserCreation = inngest.createFunction(
  { id: "sync-user-create" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { data } = event;
    try {
      await prisma.user.create({
        data: {
          id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          image: data.image_url,
        },
      });
    } catch (error) {
      console.error("User creation failed:", error);
    }
  }
);

// Inngest function to update user data in database
export const SyncUserUpdation = inngest.createFunction(
  { id: "sync-user-update" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { data } = event;
    try {
      await prisma.user.update({
        where: {
          id: data.id,
        },
        data: {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          image: data.image_url,
        },
      });
    } catch (error) {
      console.error("User update failed:", error);
    }
  }
);

// Inngest function to delete user from database
export const SyncUserDeletion = inngest.createFunction(
  { id: "sync-user-delete" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { data } = event;
    try {
      await prisma.user.delete({
        where: {
          id: data.id,
        },
      });
    } catch (error) {
      console.error("User deletion failed:", error);
    }
  }
);

// Inngest function to delete coupon on expiry
export const deleteCouponOnExpiry = inngest.createFunction(
  { id: "delete-expired-coupon" },
  { event: "coupon/expired" },
  async ({ event, step }) => {
    const { data } = event;

    const expiryDate = new Date(data.expires_at);

    await step.sleepUntil("wait-for-expiry", expiryDate);

    await step.run("delete-coupon-from-database", async () => {
      await prisma.coupon.delete({
        where: {
          code: data.code,
        },
      });
    });
  }
);