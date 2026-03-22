import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Sasa hivi';
  if (diffMins < 60) return `Dakika ${diffMins} zilizopita`;
  if (diffHours < 24) return `Saa ${diffHours} zilizopita`;
  if (diffDays < 7) return `Siku ${diffDays} zilizopita`;
  return d.toLocaleDateString('sw-TZ');
}

export function generateShareUrl(type: 'vote' | 'rating', id: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mkadamnasi.co.tz';
  return `${baseUrl}/${type === 'vote' ? 'v' : 'r'}/${id}`;
}

export function getAnonymousId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('mkd_anon_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('mkd_anon_id', id);
  }
  return id;
}

export function getRatingColor(rating: number): string {
  if (rating >= 4.5) return '#10B981';
  if (rating >= 3.5) return '#34D399';
  if (rating >= 2.5) return '#F59E0B';
  if (rating >= 1.5) return '#F97316';
  return '#EF4444';
}

export function getRatingLabel(rating: number): string {
  if (rating >= 4.5) return 'Bora sana';
  if (rating >= 3.5) return 'Nzuri';
  if (rating >= 2.5) return 'Wastani';
  if (rating >= 1.5) return 'Mbaya';
  return 'Mbaya sana';
}
