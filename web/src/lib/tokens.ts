/**
 * Mkadamnasi Design Tokens
 * Single source of truth for all design values.
 * Components MUST use these tokens — never hardcode colors, sizes, or spacing.
 */

// ─── Color Tokens ────────────────────────────────────────────────
export const color = {
  // Brand
  brand: {
    primary: 'var(--color-brand-primary)',
    primaryDark: 'var(--color-brand-primary-dark)',
    primaryLight: 'var(--color-brand-primary-light)',
  },
  // Neutral
  neutral: {
    900: 'var(--color-neutral-900)', // deep navy, primary text
    700: 'var(--color-neutral-700)', // dark gray, secondary text
    500: 'var(--color-neutral-500)', // medium gray, placeholder
    300: 'var(--color-neutral-300)', // light gray, borders
    100: 'var(--color-neutral-100)', // off-white, backgrounds
    0: 'var(--color-neutral-0)',     // white
  },
  // Semantic
  semantic: {
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    error: 'var(--color-error)',
    info: 'var(--color-info)',
  },
  // Rating scale
  rating: {
    1: 'var(--color-rating-1)',
    2: 'var(--color-rating-2)',
    3: 'var(--color-rating-3)',
    4: 'var(--color-rating-4)',
    5: 'var(--color-rating-5)',
  },
  // Social
  social: {
    whatsapp: 'var(--color-social-whatsapp)',
    facebook: 'var(--color-social-facebook)',
    twitter: 'var(--color-social-twitter)',
    instagram: 'var(--color-social-instagram)',
    telegram: 'var(--color-social-telegram)',
  },
  // Payment
  payment: {
    mpesa: 'var(--color-payment-mpesa)',
    tigopesa: 'var(--color-payment-tigopesa)',
    airtel: 'var(--color-payment-airtel)',
    halopesa: 'var(--color-payment-halopesa)',
  },
} as const;

// ─── Spacing Tokens ──────────────────────────────────────────────
export const spacing = {
  xs: 'var(--space-xs)',     // 4px
  sm: 'var(--space-sm)',     // 8px
  md: 'var(--space-md)',     // 12px
  base: 'var(--space-base)', // 16px
  lg: 'var(--space-lg)',     // 20px
  xl: 'var(--space-xl)',     // 24px
  '2xl': 'var(--space-2xl)', // 32px
  '3xl': 'var(--space-3xl)', // 40px
  '4xl': 'var(--space-4xl)', // 48px
} as const;

// ─── Size Tokens ─────────────────────────────────────────────────
export const size = {
  // Button heights
  button: {
    sm: 'var(--size-button-sm)',   // 36px
    md: 'var(--size-button-md)',   // 48px
    lg: 'var(--size-button-lg)',   // 56px
  },
  // Input heights
  input: {
    sm: 'var(--size-input-sm)',    // 40px
    md: 'var(--size-input-md)',    // 48px
    lg: 'var(--size-input-lg)',    // 56px
  },
  // Icon sizes
  icon: {
    xs: 'var(--size-icon-xs)',     // 14px
    sm: 'var(--size-icon-sm)',     // 18px
    md: 'var(--size-icon-md)',     // 24px
    lg: 'var(--size-icon-lg)',     // 32px
    xl: 'var(--size-icon-xl)',     // 40px
  },
  // Avatar sizes
  avatar: {
    sm: 'var(--size-avatar-sm)',   // 32px
    md: 'var(--size-avatar-md)',   // 40px
    lg: 'var(--size-avatar-lg)',   // 56px
    xl: 'var(--size-avatar-xl)',   // 80px
  },
  // Touch target
  touchTarget: 'var(--size-touch-target)', // 44px
  // Navigation
  nav: {
    bottomHeight: 'var(--size-nav-bottom)',   // 64px
    sidebarWidth: 'var(--size-nav-sidebar)',  // 256px
    topBarHeight: 'var(--size-nav-topbar)',   // 56px
  },
} as const;

// ─── Radius Tokens ───────────────────────────────────────────────
export const radius = {
  sm: 'var(--radius-sm)',       // 6px
  md: 'var(--radius-md)',       // 8px
  lg: 'var(--radius-lg)',       // 12px
  xl: 'var(--radius-xl)',       // 16px
  '2xl': 'var(--radius-2xl)',   // 20px
  full: 'var(--radius-full)',   // 9999px
} as const;

// ─── Shadow Tokens ───────────────────────────────────────────────
export const shadow = {
  sm: 'var(--shadow-sm)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)',
  brand: 'var(--shadow-brand)',
  topNav: 'var(--shadow-top-nav)',
} as const;

// ─── Typography Tokens ──────────────────────────────────────────
export const typography = {
  family: {
    sans: 'var(--font-sans)',
    mono: 'var(--font-mono)',
  },
  size: {
    h1: 'var(--text-h1)',           // 28px
    h2: 'var(--text-h2)',           // 24px
    h3: 'var(--text-h3)',           // 20px
    h4: 'var(--text-h4)',           // 18px
    bodyLg: 'var(--text-body-lg)',   // 16px
    body: 'var(--text-body)',       // 14px
    bodySm: 'var(--text-body-sm)',   // 12px
    caption: 'var(--text-caption)',  // 10px
  },
  weight: {
    regular: 'var(--font-regular)',   // 400
    medium: 'var(--font-medium)',     // 500
    semibold: 'var(--font-semibold)', // 600
    bold: 'var(--font-bold)',         // 700
  },
  lineHeight: {
    tight: 'var(--leading-tight)',     // 1.2
    normal: 'var(--leading-normal)',   // 1.5
    relaxed: 'var(--leading-relaxed)', // 1.625
  },
} as const;

// ─── Animation Tokens ────────────────────────────────────────────
export const animation = {
  duration: {
    micro: 'var(--duration-micro)',     // 100ms
    fast: 'var(--duration-fast)',       // 200ms
    normal: 'var(--duration-normal)',   // 300ms
    slow: 'var(--duration-slow)',       // 350ms
  },
  easing: {
    default: 'var(--ease-default)',     // ease-in-out
    in: 'var(--ease-in)',              // ease-in
    out: 'var(--ease-out)',            // ease-out
    spring: 'var(--ease-spring)',       // cubic-bezier(0.4, 0, 0.2, 1)
  },
} as const;

// ─── Breakpoint Tokens ───────────────────────────────────────────
export const breakpoint = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ─── Z-Index Tokens ──────────────────────────────────────────────
export const zIndex = {
  base: 'var(--z-base)',         // 0
  dropdown: 'var(--z-dropdown)', // 10
  sticky: 'var(--z-sticky)',     // 20
  overlay: 'var(--z-overlay)',   // 30
  modal: 'var(--z-modal)',       // 40
  toast: 'var(--z-toast)',       // 50
} as const;

// ─── Tailwind token class mappings ───────────────────────────────
// These map semantic names to Tailwind utility classes using the CSS variables.
// Use these in components with cn() instead of hardcoded Tailwind classes.
export const tw = {
  // Text colors
  textPrimary: 'text-neutral-900',
  textSecondary: 'text-neutral-700',
  textMuted: 'text-neutral-500',
  textBrand: 'text-brand-primary',
  textSuccess: 'text-semantic-success',
  textError: 'text-semantic-error',
  textWarning: 'text-semantic-warning',
  textInfo: 'text-semantic-info',
  // Background colors
  bgPage: 'bg-neutral-100',
  bgCard: 'bg-neutral-0',
  bgMuted: 'bg-neutral-100',
  bgBrand: 'bg-brand-primary',
  bgBrandLight: 'bg-brand-primary-light',
  bgBrandDark: 'bg-brand-primary-dark',
  bgSuccess: 'bg-semantic-success',
  bgError: 'bg-semantic-error',
  // Border colors
  borderDefault: 'border-neutral-300',
  borderBrand: 'border-brand-primary',
  borderSuccess: 'border-semantic-success',
  borderError: 'border-semantic-error',
} as const;
