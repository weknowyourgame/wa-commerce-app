import { auth } from 'lib/auth';
import { prisma } from 'lib/db';
import { getOrCreateMerchant } from 'lib/merchants';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const merchant = await getOrCreateMerchant(session.user.id);
    const data = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'description', 'price'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Validate price
    if (isNaN(data.price) || data.price <= 0) {
      return NextResponse.json({ error: 'Price must be a positive number' }, { status: 400 });
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        imageUrl: data.imageUrl || null,
        merchantId: merchant.id,
      },
    });

    return NextResponse.json({ 
      success: true, 
      product 
    });

  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const merchant = await getOrCreateMerchant(session.user.id);

    // Get products for this merchant
    const products = await prisma.product.findMany({
      where: {
        merchantId: merchant.id,
      },
      include: {
        orders: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ 
      success: true, 
      products 
    });

  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 