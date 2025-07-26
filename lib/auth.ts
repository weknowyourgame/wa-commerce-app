import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";

export const auth = betterAuth({
  // Use your existing Prisma client
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  
  // Only Google OAuth for merchant dashboard
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
    // Only allow specific emails for merchant access
    signIn: async (user) => {
      // Add your merchant emails here
      const allowedEmails = [
        'merchant1@gmail.com',
        'merchant2@gmail.com',
        // Add more merchant emails as needed
      ];
      
      return allowedEmails.includes(user.email);
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