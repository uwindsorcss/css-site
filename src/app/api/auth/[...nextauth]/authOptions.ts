import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { User } from "@prisma/client";
import { error } from "@/lib/utils";

function CustomPrismaAdapter(p: typeof prisma) {
  return {
    ...PrismaAdapter(p),
    async createUser(data: User) {
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

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  // @ts-ignore
  adapter: CustomPrismaAdapter(prisma),
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
      allowDangerousEmailAccountLinking: true,
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
    },
  ],
  callbacks: {
    // @ts-ignore
    async signIn({ user }: { user: User }) {
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
    // @ts-ignore
    async jwt({ token, profile }: { token: any; profile: any }) {
      if (profile) {
        token.title = profile.title;
      }
      return token;
    },
    // @ts-ignore
    async session({ session, user }: { session: any; user: User }) {
      const userInJson = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      if (session.user) {
        session.user.id = user.id;
        session.user.title = user.title;
        session.user.role = userInJson?.role;
      }
      return session;
    },
  },
};
