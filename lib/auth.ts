import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";

export const auth = betterAuth({
  // Use your existing Prisma client
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  
  // Enable email and password authentication
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  
  // Google OAuth for merchant dashboard
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  
  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
  
  // Callbacks
  callbacks: {
    // Allow all Google sign-ins for now (you can restrict this later)
    signIn: async (user) => {
      console.log('Sign in attempt for:', user.email);
      // For testing, allow all Google sign-ins
      // Later you can restrict to specific emails:
      // const allowedEmails = ['merchant1@gmail.com', 'merchant2@gmail.com'];
      // return allowedEmails.includes(user.email);
      return true;
    },
    
    // Customize session data
    session: (session, user) => {
      return {
        ...session,
        user: {
          ...session.user,
          isMerchant: true,
        },
      };
    },
  },
});