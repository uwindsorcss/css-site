import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface AdapterUser extends BaseAdapterUser {
    email: profile.email;
    name: profile.name;
    title: string;
    image: string | null;
  }

  interface Profile extends User {}

  interface Session {
    user: User;
  }
}
