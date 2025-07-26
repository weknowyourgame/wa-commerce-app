import { prisma } from './db';
import type { MerchantWithProducts } from './types';

export interface OnboardingData {
  businessName: string;
  businessDescription: string;
  businessAddress: string;
  upiNumber: string;
  website?: string;
  phoneNumber: string;
  businessCategory: string;
}

export async function getMerchants(): Promise<MerchantWithProducts[]> {
  return await prisma.merchant.findMany({
    include: {
      products: {
        orderBy: {
          createdAt: 'desc'
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export async function getMerchant(id: string): Promise<MerchantWithProducts | null> {
  return await prisma.merchant.findUnique({
    where: { id },
    include: {
      products: {
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });
}

export async function getMerchantByApiToken(apiToken: string): Promise<MerchantWithProducts | null> {
  return await prisma.merchant.findFirst({
    where: { apiToken },
    include: {
      products: {
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });
}

export async function getOrCreateMerchant(userId: string) {
  let merchant = await prisma.merchant.findUnique({
    where: { userId },
    include: { user: true }
  });

  if (!merchant) {
    merchant = await prisma.merchant.create({
      data: {
        userId,
        apiToken: crypto.randomUUID(),
        isOnboarded: false,
        onboardingStep: 0,
      },
      include: { user: true }
    });
  }

  return merchant;
}

export async function updateOnboardingStep(merchantId: string, step: number) {
  return await prisma.merchant.update({
    where: { id: merchantId },
    data: { onboardingStep: step }
  });
}

export async function completeOnboarding(merchantId: string, data: OnboardingData) {
  return await prisma.merchant.update({
    where: { id: merchantId },
    data: {
      businessInfo: {
        name: data.businessName,
        description: data.businessDescription,
        address: data.businessAddress,
        phoneNumber: data.phoneNumber,
        category: data.businessCategory,
      },
      upiNumber: data.upiNumber,
      website: data.website || null,
      isOnboarded: true,
      onboardingStep: 4, // Final step
    }
  });
}

export async function getCurrentMerchant() {
  // This will be called from server components with session
  return null; // Will be implemented in server components
} 