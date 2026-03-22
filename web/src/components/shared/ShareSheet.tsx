'use client';

import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import BottomSheet from '../ui/BottomSheet';

interface ShareSheetProps {
  open: boolean;
  onClose: () => void;
  url: string;
  title: string;
  description?: string;
}

const shareTargets = [
  { id: 'whatsapp', name: 'WhatsApp', bg: 'bg-social-whatsapp', icon: '📱' },
  { id: 'facebook', name: 'Facebook', bg: 'bg-social-facebook', icon: '📘' },
  { id: 'twitter', name: 'X', bg: 'bg-social-twitter', icon: '🐦' },
  { id: 'telegram', name: 'Telegram', bg: 'bg-social-telegram', icon: '✈️' },
];

export default function ShareSheet({ open, onClose, url, title, description }: ShareSheetProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = (target: string) => {
    const text = `${title}${description ? ` - ${description}` : ''}\n${url}`;
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(url);

    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(title)}`,
    };

    if (urls[target]) window.open(urls[target], '_blank');
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <BottomSheet open={open} onClose={onClose} title="Shiriki">
      <div className="space-y-4">
        {/* Share targets */}
        <div className="flex justify-around">
          {shareTargets.map((target) => (
            <button
              key={target.id}
              onClick={() => handleShare(target.id)}
              className="flex flex-col items-center gap-2"
            >
              <div className={`w-14 h-14 rounded-full ${target.bg} flex items-center justify-center text-2xl`}>
                {target.icon}
              </div>
              <span className="text-xs text-neutral-700">{target.name}</span>
            </button>
          ))}
        </div>

        {/* Copy link */}
        <button
          onClick={handleCopy}
          className="w-full flex items-center gap-3 px-4 py-3 bg-neutral-100 rounded-xl"
        >
          {copied ? (
            <Check size={18} className="text-semantic-success shrink-0" />
          ) : (
            <Copy size={18} className="text-neutral-500 shrink-0" />
          )}
          <span className="flex-1 text-sm text-neutral-700 truncate text-left">{url}</span>
          <span className="text-sm font-semibold text-brand-primary shrink-0">
            {copied ? 'Imenakiliwa!' : 'Nakili'}
          </span>
        </button>
      </div>
    </BottomSheet>
  );
}
