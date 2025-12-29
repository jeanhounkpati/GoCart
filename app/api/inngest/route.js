import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { SyncUserCreation, SyncUserUpdation, SyncUserDeletion } from "@/inngest/functions";



// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    SyncUserCreation,
    SyncUserUpdation,
    SyncUserDeletion,
    /* your functions will be passed here later! */
  ],
});