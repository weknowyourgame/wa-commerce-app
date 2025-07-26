import { auth } from 'lib/auth';
import { prisma } from 'lib/db';
import { getOrCreateMerchant } from 'lib/merchants';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
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

    // Check if product belongs to this merchant
    const product = await prisma.product.findFirst({
      where: {
        id: params.id,
        merchantId: merchant.id,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Delete product
    await prisma.product.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Product deleted successfully' 
    });

  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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

    // Check if product belongs to this merchant
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: params.id,
        merchantId: merchant.id,
      },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

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

    // Update product
    const product = await prisma.product.update({
      where: {
        id: params.id,
      },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        imageUrl: data.imageUrl || null,
      },
    });

    return NextResponse.json({ 
      success: true, 
      product 
    });

  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 