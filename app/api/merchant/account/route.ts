import { auth } from 'lib/auth';
import { prisma } from 'lib/db';
import { getOrCreateMerchant } from 'lib/merchants';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const merchant = await getOrCreateMerchant(session.user.id);

    // Delete all related data first (due to foreign key constraints)
    await prisma.$transaction([
      // Delete orders
      prisma.order.deleteMany({
        where: { merchantId: merchant.id }
      }),
      // Delete products
      prisma.product.deleteMany({
        where: { merchantId: merchant.id }
      }),
      // Delete webhook events
      prisma.webhookEvent.deleteMany({
        where: { merchantId: merchant.id }
      }),
      // Delete merchant
      prisma.merchant.delete({
        where: { id: merchant.id }
      }),
      // Delete user (this will cascade to sessions and accounts)
      prisma.user.delete({
        where: { id: session.user.id }
      })
    ]);

    return NextResponse.json({ 
      success: true, 
      message: 'Account deleted successfully' 
    });

  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 