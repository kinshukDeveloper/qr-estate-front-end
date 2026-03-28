'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useFavourites } from '@/contexts/FavouritesContext';
import { PriceAlertModal } from './PriceAlertModal';

interface SaveButtonProps {
  listingId: string;
  listingTitle?: string;
  listingPrice?: number;
  /** 'icon' = heart only, 'full' = heart + text + count */
  variant?: 'icon' | 'full';
  className?: string;
  showCount?: boolean;
}

export function SaveButton({
  listingId,
  listingTitle,
  listingPrice,
  variant = 'icon',
  className = '',
  showCount = false,
}: SaveButtonProps) {
  const { isSaved, toggle, getSaveCount, isLoading } = useFavourites();
  const [showAlertModal, setShowAlertModal] = useState(false);
  const saved = isSaved(listingId);
  const count = getSaveCount(listingId);
  const loading = isLoading(listingId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggle(listingId);

    // On first save, prompt for price alert subscription
    if (!saved) {
      setTimeout(() => setShowAlertModal(true), 400);
    }
  };

  if (variant === 'icon') {
    return (
      <>
        <button
          onClick={handleClick}
          disabled={loading}
          title={saved ? 'Remove from saved' : 'Save listing'}
          className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200
            ${saved
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : 'bg-black/40 text-white/60 border border-white/10 hover:text-white hover:border-white/20'
            }
            ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 active:scale-95'}
            ${className}`}
        >
          <Heart
            size={14}
            className={`transition-all duration-200 ${saved ? 'fill-red-400' : ''}`}
          />
          {/* Burst animation on save */}
          {saved && !loading && (
            <span className="absolute inset-0 rounded-full animate-ping bg-red-400/20 pointer-events-none" />
          )}
        </button>

        {showAlertModal && (
          <PriceAlertModal
            listingId={listingId}
            listingTitle={listingTitle}
            listingPrice={listingPrice}
            onClose={() => setShowAlertModal(false)}
          />
        )}
      </>
    );
  }

  // variant === 'full'
  return (
    <>
      <button
        onClick={handleClick}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium text-sm transition-all duration-200
          ${saved
            ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/15'
            : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'
          }
          ${loading ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}
          ${className}`}
      >
        <Heart
          size={15}
          className={`transition-all duration-200 ${saved ? 'fill-red-400' : ''} ${loading ? 'animate-pulse' : ''}`}
        />
        <span>{saved ? 'Saved' : 'Save'}</span>
        {showCount && count > 0 && (
          <span className="text-xs opacity-60">({count})</span>
        )}
      </button>

      {showAlertModal && (
        <PriceAlertModal
          listingId={listingId}
          listingTitle={listingTitle}
          listingPrice={listingPrice}
          onClose={() => setShowAlertModal(false)}
        />
      )}
    </>
  );
}
