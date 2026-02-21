import { verifyWebhook } from '@clerk/backend/webhooks';
import { NextResponse } from 'next/server';

import { PrismaClient } from '@darkom/db';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const evt = await verifyWebhook(request);

    switch (evt.type) {
      case 'user.created': {
        const primaryEmail = evt.data.email_addresses.find(
          (e: { id: string; email_address: string }) =>
            e.id === evt.data.primary_email_address_id,
        );

        await prisma.profile.create({
          data: {
            clerkId: evt.data.id,
            email: primaryEmail?.email_address ?? null,
            fullName:
              [evt.data.first_name, evt.data.last_name]
                .filter(Boolean)
                .join(' ') || null,
            avatarUrl: evt.data.image_url ?? null,
          },
        });
        break;
      }

      case 'user.updated': {
        const primaryEmail = evt.data.email_addresses.find(
          (e: { id: string; email_address: string }) =>
            e.id === evt.data.primary_email_address_id,
        );

        await prisma.profile.update({
          where: { clerkId: evt.data.id },
          data: {
            email: primaryEmail?.email_address ?? null,
            fullName:
              [evt.data.first_name, evt.data.last_name]
                .filter(Boolean)
                .join(' ') || null,
            avatarUrl: evt.data.image_url ?? null,
          },
        });
        break;
      }

      case 'user.deleted': {
        if (evt.data.id) {
          await prisma.profile.delete({
            where: { clerkId: evt.data.id },
          });
        }
        break;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Clerk Webhook]', error);

    if (error instanceof Error && error.message.includes('verify')) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
