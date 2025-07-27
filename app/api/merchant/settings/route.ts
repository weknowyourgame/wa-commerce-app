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

    return NextResponse.json({ 
      success: true, 
      merchant 
    });

  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
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
    const requiredFields = ['businessName', 'businessCategory', 'phoneNumber', 'upiNumber', 'businessAddress'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Update merchant settings
    const updatedMerchant = await prisma.merchant.update({
      where: { id: merchant.id },
      data: {
        businessInfo: {
          name: data.businessName,
          category: data.businessCategory,
          phoneNumber: data.phoneNumber,
          address: data.businessAddress,
          description: data.businessDescription || null,
        },
        upiNumber: data.upiNumber,
        website: data.website || null,
      },
    });

    return NextResponse.json({ 
      success: true, 
      merchant: updatedMerchant 
    });

  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 