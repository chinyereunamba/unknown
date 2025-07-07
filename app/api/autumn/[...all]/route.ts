// app/api/autumn/[...all]/route.ts

import { autumnHandler } from "autumn-js/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const { GET, POST } = autumnHandler({
  identify: async (request) => {
    // get the user from your auth provider (NextAuth.js)
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return { customerId: undefined }; // Autumn can't proceed without this
    }

    return { customerId: session.user.email };
    // return {
    //   customerId: session?.user?.id || undefined,
    //   customerData: {
    //     name: session?.user?.name || undefined,
    //     email: session?.user?.email || undefined,
    //   },
    // };
  },
});
