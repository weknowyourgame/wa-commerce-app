import { prisma } from './db';
import type { ProductWithMerchant } from './types';

export async function getProducts({
  query,
  merchantId,
  limit = 100
}: {
  query?: string;
  merchantId?: string;
  limit?: number;
} = {}): Promise<ProductWithMerchant[]> {
  const where: any = {};
  
  if (query) {
    where.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } }
    ];
  }
  
  if (merchantId) {
    where.merchantId = merchantId;
  }

  return await prisma.product.findMany({
    where,
    include: {
      merchant: true
    },
    take: limit,
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export async function getProduct(id: string): Promise<ProductWithMerchant | null> {
  return await prisma.product.findUnique({
    where: { id },
    include: {
      merchant: true
    }
  });
}

export async function getProductsByMerchant(merchantId: string): Promise<ProductWithMerchant[]> {
  return await prisma.product.findMany({
    where: { merchantId },
    include: {
      merchant: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export async function getFeaturedProducts(limit: number = 6): Promise<ProductWithMerchant[]> {
  // For now, we'll get the most recent products as featured
  // You can modify this logic based on your business requirements
  return await prisma.product.findMany({
    include: {
      merchant: true
    },
    take: limit,
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export async function searchProducts(query: string, limit: number = 20): Promise<ProductWithMerchant[]> {
  return await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }
      ]
    },
    include: {
      merchant: true
    },
    take: limit,
    orderBy: {
      createdAt: 'desc'
    }
  });
} 