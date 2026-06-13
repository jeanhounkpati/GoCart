import { getAuth } from "@clerk/nextjs/server";

export async function getToken(request) {
  const { userId } = getAuth(request);
  if (!userId) {
    throw new Error("Unauthorized: no userId found in token");
  }
  return { userId };
}
