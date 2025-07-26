import { OrderStatus } from '@prisma/client';
import { prisma } from './db';
import type { OrderWithRelations } from './types';

export async function getOrders({
  customerId,
  merchantId,
  status
}: {
  customerId?: string;
  merchantId?: string;
  status?: OrderStatus;
} = {}): Promise<OrderWithRelations[]> {
  const where: any = {};
  
  if (customerId) {
    where.customerId = customerId;
  }
  
  if (merchantId) {
    where.merchantId = merchantId;
  }
  
  if (status) {
    where.status = status;
  }

  return await prisma.order.findMany({
    where,
    include: {
      customer: true,
      merchant: true,
      product: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export async function getOrder(id: string): Promise<OrderWithRelations | null> {
  return await prisma.order.findUnique({
    where: { id },
    include: {
      customer: true,
      merchant: true,
      product: true
    }
  });
}

export async function createOrder(data: {
  customerId: string;
  merchantId: string;
  productId: string;
  amount: number;
  txnId?: string;
}): Promise<OrderWithRelations> {
  return await prisma.order.create({
    data,
    include: {
      customer: true,
      merchant: true,
      product: true
    }
  });
}

export async function updateOrderStatus(id: string, status: OrderStatus, txnId?: string): Promise<OrderWithRelations> {
  const updateData: any = { status };
  
  if (txnId) {
    updateData.txnId = txnId;
  }
  
  if (status === OrderStatus.CONFIRMED) {
    updateData.paidAt = new Date();
  }

  return await prisma.order.update({
    where: { id },
    data: updateData,
    include: {
      customer: true,
      merchant: true,
      product: true
    }
  });
} 