import { auth } from 'lib/auth';
import { prisma } from 'lib/db';
import { getOrCreateMerchant } from 'lib/merchants';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const merchant = await getOrCreateMerchant(session.user.id);

    // Get orders for this merchant
    const orders = await prisma.order.findMany({
      where: {
        merchantId: merchant.id,
      },
      include: {
        product: true,
        customer: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ 
      success: true, 
      orders 
    });

  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 