import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db";

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/",
  },
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    {
      id: "azure-ad",
      name: "University of Windsor",
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      type: "oauth",
      wellKnown: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/v2.0/.well-known/openid-configuration?appid=${process.env.AZURE_AD_CLIENT_ID}`,
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
      async profile(profile, tokens) {
        // https://docs.microsoft.com/en-us/graph/api/profilephoto-get?view=graph-rest-1.0#examples
        const response = await fetch(
          `https://graph.microsoft.com/v1.0/me/photos/${240}x${240}/$value`,
          { headers: { Authorization: `Bearer ${tokens.access_token}` } }
        );

        // Confirm that profile photo was returned
        let image;
        // TODO: Do this without Buffer
        if (response.ok && typeof Buffer !== "undefined") {
          try {
            const pictureBuffer = await response.arrayBuffer();
            const pictureBase64 = Buffer.from(pictureBuffer).toString("base64");
            image = `data:image/jpeg;base64, ${pictureBase64}`;
          } catch {}
        }

        //get user role
        const jobTitle = await fetch(`https://graph.microsoft.com/v1.0/me`, {
          headers: { Authorization: `Bearer ${tokens.access_token}` },
        }).then((res) => res.json().then((data) => data.jobTitle));

        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          title: jobTitle,
          image: image ?? null,
        };
      },
    },
  ],
  callbacks: {
    async signIn({ user }) {
      const userInJson = await prisma.blackList.findUnique({
        where: { email: user.email },
      });

      if (
        user.title !== null &&
        user?.title.toLowerCase().includes("student") &&
        !userInJson
      ) {
        return true;
      }
      return false;
    },
    async jwt({ token, profile }) {
      if (profile) {
        token.title = profile.title;
      }
      return token;
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.title = user.title;
        session.user.id = user.id;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
