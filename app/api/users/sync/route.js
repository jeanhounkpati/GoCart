import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { ensureUserExists } from '@/lib/syncClerkUser';

export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await ensureUserExists(userId);

    return NextResponse.json({
      success: true,
      user: {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        image: user?.image,
      },
    });
  } catch (error) {
    console.error('Clerk sync failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
