import crypto from 'node:crypto';

import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

/**
 * POST /api/upload
 * Returns signed params for direct client→Cloudinary upload.
 */
export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error('[Upload] Missing Cloudinary env vars');
      return NextResponse.json(
        { error: 'Upload service not configured' },
        { status: 503 },
      );
    }

    const timestamp = Math.round(Date.now() / 1000);
    const folder = 'darkom/listings';

    const signatureString = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto
      .createHash('sha1')
      .update(signatureString)
      .digest('hex');

    return NextResponse.json({
      signature,
      timestamp,
      folder,
      apiKey,
      cloudName,
    });
  } catch (error) {
    console.error('[POST /api/upload]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
