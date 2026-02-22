'use client';

import { useState } from 'react';

import Image from 'next/image';

import { SignedIn, SignedOut } from '@clerk/nextjs';
import {
  Button,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  Textarea,
} from '@darkom/ui';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquare, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';

type ContactModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  seller: {
    id: string;
    fullName: string | null;
    avatarUrl: string | null;
    phone: string | null;
  };
  listingId: string;
};

export function ContactModal({
  open,
  onOpenChange,
  seller,
  listingId,
}: ContactModalProps) {
  const t = useTranslations('contact');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after close animation
    setTimeout(() => {
      setMessage('');
      setSent(false);
    }, 200);
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    setSending(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toId: seller.id,
          listingId,
          content: message.trim(),
        }),
      });

      if (response.ok) {
        setSent(true);
        setMessage('');
      }
    } catch {
      // Error handled silently — user can retry
    } finally {
      setSending(false);
    }
  };

  const phoneNumber = seller.phone?.replace(/\s/g, '');
  const whatsappUrl = phoneNumber
    ? `https://wa.me/${phoneNumber.startsWith('+') ? phoneNumber.slice(1) : `216${phoneNumber}`}`
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay onClose={handleClose} />
      <DialogContent size="sm" onClose={handleClose}>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogClose onClose={handleClose} />
        </DialogHeader>
        <DialogBody>
          {/* Seller info */}
          <div className="flex items-center gap-3 pb-4">
            {seller.avatarUrl ? (
              <Image
                src={seller.avatarUrl}
                alt={seller.fullName ?? ''}
                width={48}
                height={48}
                className="rounded-full"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600 font-semibold">
                {seller.fullName?.charAt(0)?.toUpperCase() ?? '?'}
              </div>
            )}
            <div>
              <p className="font-semibold">{seller.fullName}</p>
            </div>
          </div>

          <SignedIn>
            {/* Phone & WhatsApp buttons */}
            <div className="flex gap-3">
              {seller.phone && (
                <a
                  href={`tel:${phoneNumber}`}
                  className="flex-1"
                >
                  <Button variant="outline" size="md" className="w-full">
                    <Phone size={16} />
                    {t('call')}
                  </Button>
                </a>
              )}
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button variant="accent" size="md" className="w-full">
                    <MessageSquare size={16} />
                    {t('whatsapp')}
                  </Button>
                </a>
              )}
            </div>

            {/* Message form */}
            <div className="mt-4">
              <p className="mb-2 text-sm text-neutral-500">
                {t('orSendMessage')}
              </p>
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg bg-success-50 p-4 text-center text-sm text-success-700"
                  >
                    {t('sent')}
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t('messagePlaceholder')}
                      rows={3}
                      className="resize-none"
                    />
                    <Button
                      variant="primary"
                      size="md"
                      className="mt-3 w-full"
                      onClick={handleSend}
                      disabled={!message.trim() || sending}
                    >
                      {sending ? '...' : t('send')}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </SignedIn>

          <SignedOut>
            <div className="rounded-lg bg-neutral-50 p-6 text-center">
              <p className="mb-4 text-sm text-neutral-600">
                {t('signInToContact')}
              </p>
              <Link href="/sign-in">
                <Button variant="primary" size="md">
                  {t('signIn')}
                </Button>
              </Link>
            </div>
          </SignedOut>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
