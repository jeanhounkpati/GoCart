import { clerkClient } from "@clerk/nextjs/server";

const authAdmin = async (userId) => {
    try {
        if (!userId) return false;
        const user = await clerkClient.users.getUser(userId);
        const envAdmins = (process.env.ADMIN_EMAIL || "").replace(/"/g, "").split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
        const userEmail = (user?.emailAddresses?.[0]?.emailAddress || "").trim().toLowerCase();
        console.info('authAdmin check:', { userId, userEmail, envAdmins });
        return envAdmins.includes(userEmail);
    } catch (error) {
        console.log(error);
        return false;
    }
};
export default authAdmin;
        