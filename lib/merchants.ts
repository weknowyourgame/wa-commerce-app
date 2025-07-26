import { prisma } from './db';
import type { MerchantWithProducts } from './types';

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