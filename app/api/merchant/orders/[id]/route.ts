import { auth } from 'lib/auth';
import { prisma } from 'lib/db';
import { getOrCreateMerchant } from 'lib/merchants';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const merchant = await getOrCreateMerchant(session.user.id);
    const data = await request.json();

    // Check if order belongs to this merchant
    const existingOrder = await prisma.order.findFirst({
      where: {
        id: params.id,
        merchantId: merchant.id,
      },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Update order status
    const order = await prisma.order.update({
      where: {
        id: params.id,
      },
      data: {
        status: data.status,
        paidAt: data.status === 'CONFIRMED' ? new Date() : null,
      },
      include: {
        product: true,
        customer: true,
      },
    });

    return NextResponse.json({ 
      success: true, 
      order 
    });

  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 