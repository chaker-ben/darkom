'use client';

import { useState } from 'react';

import {
  Button,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@darkom/ui';
import { Loader2, Pencil, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';

import { useDeleteListing } from '../hooks/use-delete-listing';

type ListingActionsProps = {
  listingId: string;
};

export function ListingActions({ listingId }: ListingActionsProps) {
  const t = useTranslations('dashboard.actions');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deleteListing = useDeleteListing();

  const handleDelete = () => {
    deleteListing.mutate(listingId, {
      onSuccess: () => {
        setDeleteOpen(false);
      },
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Link href={`/listings/${listingId}/edit`}>
        <Button variant="ghost" size="sm">
          <Pencil size={14} />
          {t('edit')}
        </Button>
      </Link>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setDeleteOpen(true)}
        className="text-red-600 hover:bg-red-50 hover:text-red-700"
      >
        <Trash2 size={14} />
        {t('delete')}
      </Button>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogOverlay onClose={() => setDeleteOpen(false)} />
        <DialogContent size="sm" onClose={() => setDeleteOpen(false)}>
          <DialogHeader>
            <DialogTitle>{t('confirmDelete')}</DialogTitle>
            <DialogClose onClose={() => setDeleteOpen(false)} />
          </DialogHeader>
          <DialogBody>
            <p className="text-sm text-neutral-600">{t('confirmDeleteDesc')}</p>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteOpen(false)}
              disabled={deleteListing.isPending}
            >
              {t('cancel')}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleteListing.isPending}
            >
              {deleteListing.isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Trash2 size={14} />
              )}
              {t('delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
