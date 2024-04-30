import { AdapterUser, NextAuthConfig } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import { prisma } from "@/lib/db";
import { error } from "@/lib/utils";
import { Adapter } from "next-auth/adapters";
import { PrismaAdapter } from "@auth/prisma-adapter";

function CustomPrismaAdapter(p: typeof prisma) {
  return {
    ...PrismaAdapter(p),
    async createUser(data: AdapterUser) {
      return prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          title: data.title,
          image: data.image,
        },
      });
    },
  };
}

const authConfig: NextAuthConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  adapter: CustomPrismaAdapter(prisma) as unknown as Adapter,
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/",
  },
  providers: [
    AzureADProvider({
      id: "azure-ad",
      name: "University of Windsor",
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
      allowDangerousEmailAccountLinking: true,
      wellKnown: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/v2.0/.well-known/openid-configuration?appid=${process.env.AZURE_AD_CLIENT_ID}`,
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
      profile: async (profile, tokens) => {
        // https://docs.microsoft.com/en-us/graph/api/profilephoto-get?view=graph-rest-1.0#examples
        const response = await fetch(
          `https://graph.microsoft.com/v1.0/me/photos/${240}x${240}/$value`,
          {
            headers: { Authorization: `Bearer ${tokens.access_token}` },
          }
        );

        // Confirm that profile photo was returned
        let image;
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

        // if the user exists in the database, update the user
        const user = await prisma.user.findUnique({
          where: { email: profile.email },
        });

        if (user) {
          await prisma.user.update({
            where: { email: profile.email },
            data: {
              title: jobTitle,
              image: image ?? null,
            },
          });
        }

        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          title: jobTitle,
          image: image ?? null,
        };
      },
    }),
  ],
  callbacks: {
    async signIn(params) {
      const user = params.user as AdapterUser;
      const userInBlackList = await prisma.blackList.findUnique({
        where: { email: user.email! },
      });

      const lowerCaseTitle = user.title?.toLowerCase();

      if (
        !userInBlackList &&
        lowerCaseTitle &&
        (lowerCaseTitle.includes("student") || lowerCaseTitle.includes("alumni"))
      ) {
        return true;
      }
      return error(
        "It seems like you are not a student or an alumni, if you think this is a mistake, please contact us.",
        "/",
        false
      );
    },
    async jwt({ token, profile }) {
      if (profile) token.title = profile.title;
      return token;
    },
    async session({ session }) {
      try {
        if (!session?.user?.email) return session;

        const userData = await prisma.user.findUnique({
          where: { email: session.user.email },
        });

        if (userData) {
          session.user.id = userData.id;
          session.user.title = userData.title;
          session.user.role = userData.role;
        }
      } catch (error) {
        console.error("Failed to fetch user data (session callback):", error);
      }
      return session;
    },
  },
};

export default authConfig;
