'use client';

export function getTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return (localStorage.getItem('mkd_theme') as 'light' | 'dark') || 'light';
}

export function setTheme(theme: 'light' | 'dark') {
  localStorage.setItem('mkd_theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
}

export function toggleTheme(): 'light' | 'dark' {
  const current = getTheme();
  const next = current === 'light' ? 'dark' : 'light';
  setTheme(next);
  return next;
}

export function initTheme() {
  const theme = getTheme();
  document.documentElement.setAttribute('data-theme', theme);
}
