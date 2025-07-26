import { auth } from 'lib/auth';
import { completeOnboarding, getOrCreateMerchant, OnboardingData } from 'lib/merchants';
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
    const data: OnboardingData = await request.json();

    // Validate required fields
    const requiredFields = ['businessName', 'businessDescription', 'businessAddress', 'upiNumber', 'phoneNumber', 'businessCategory'];
    for (const field of requiredFields) {
      if (!data[field as keyof OnboardingData]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Complete onboarding
    const updatedMerchant = await completeOnboarding(merchant.id, data);

    return NextResponse.json({ 
      success: true, 
      merchant: updatedMerchant 
    });

  } catch (error) {
    console.error('Onboarding error:', error);
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

    return NextResponse.json({ 
      merchant,
      isOnboarded: merchant.isOnboarded,
      onboardingStep: merchant.onboardingStep
    });

  } catch (error) {
    console.error('Get onboarding status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 