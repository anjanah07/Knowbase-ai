// import NextAuth from "next-auth";
// import Google from "next-auth/providers/google";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { db } from "@/lib/db";

// export const {
//   handlers: { GET, POST },
//   auth,
//   signIn,
//   signOut,
// } = NextAuth({
//   adapter: PrismaAdapter(db),
//   session: { strategy: "database" },
//   providers: [
//     Google({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],
//   callbacks: {
//     async session({ session, user }) {
//       // add user.id to session.user for convenience
//       // @ts-ignore
//       if (session.user) session.user.id = user.id;
//       return session;
//     },
//   },
// });
