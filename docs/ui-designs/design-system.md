# Mkadamnasi Design System

> Tanzania's First Anonymous Rating, Voting & Ranking Platform

## Brand Identity

### Logo
- **Primary Mark**: Stylized ballot box with Tanzania flag colors accent
- **Wordmark**: "Mkadamnasi" in SF Pro Display Bold
- **Tagline**: "Sauti Yako, Siri Yako" (Your Voice, Your Secret)

### Brand Values
- Anonymity & Privacy
- Transparency & Trust
- Tanzanian Identity
- Democratic Participation

---

## Color Palette

### Primary Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `brand-orange` | `#FF6B35` | Primary CTA buttons, active states, brand accent |
| `dark-orange` | `#E85A2A` | Button hover/pressed states, emphasis |
| `light-orange` | `#FFF4EE` | Orange tinted backgrounds, selected states |

### Neutral Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `deep-navy` | `#1A2332` | Primary text, headers, dark backgrounds |
| `dark-gray` | `#4A5568` | Secondary text, subtitles |
| `medium-gray` | `#9CA3AF` | Placeholder text, disabled states |
| `light-gray` | `#E5E7EB` | Borders, dividers, input outlines |
| `off-white` | `#F8F9FA` | Page backgrounds, card backgrounds |
| `white` | `#FFFFFF` | Card surfaces, input backgrounds |

### Semantic Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `success-green` | `#10B981` | Success states, positive ratings, verified |
| `warning-yellow` | `#F59E0B` | Warning states, moderate ratings |
| `error-red` | `#EF4444` | Error states, negative ratings, destructive |
| `info-blue` | `#3B82F6` | Information, links, neutral actions |

### Rating Colors (5-Star Gradient)
| Stars | Hex | Label |
|-------|-----|-------|
| 5 ★ | `#10B981` | Excellent |
| 4 ★ | `#34D399` | Good |
| 3 ★ | `#F59E0B` | Average |
| 2 ★ | `#F97316` | Poor |
| 1 ★ | `#EF4444` | Terrible |

---

## Typography

### Font Family
- **Primary (iOS)**: SF Pro Display
- **Primary (Android)**: Roboto
- **Monospace**: SF Mono / Roboto Mono (for codes, stats)

### Type Scale
| Style | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `h1` | 28px | Bold (700) | 34px | Screen titles |
| `h2` | 24px | SemiBold (600) | 30px | Section headers |
| `h3` | 20px | SemiBold (600) | 26px | Card titles |
| `h4` | 18px | Medium (500) | 24px | Subsections |
| `body-lg` | 16px | Regular (400) | 24px | Primary body text |
| `body` | 14px | Regular (400) | 20px | Secondary body text |
| `body-sm` | 12px | Regular (400) | 16px | Captions, labels |
| `caption` | 10px | Medium (500) | 14px | Timestamps, micro labels |
| `button` | 16px | SemiBold (600) | 20px | Button labels |
| `input` | 16px | Regular (400) | 20px | Input text |

---

## Spacing System (8pt Grid)

| Token | Value | Usage |
|-------|-------|-------|
| `space-xs` | 4px | Tight spacing, icon gaps |
| `space-sm` | 8px | Small padding, list item gaps |
| `space-md` | 12px | Medium padding |
| `space-base` | 16px | Standard padding, card padding |
| `space-lg` | 20px | Section gaps |
| `space-xl` | 24px | Large section gaps |
| `space-2xl` | 32px | Screen section spacing |
| `space-3xl` | 40px | Major section breaks |
| `space-4xl` | 48px | Screen top/bottom padding |

### Screen Margins
- **Horizontal padding**: 16px (both sides)
- **Safe area top**: Dynamic (notch-aware)
- **Safe area bottom**: 34px (home indicator)
- **Bottom nav height**: 64px

---

## Component Specifications

### Buttons

#### Primary Button
- **Height**: 48px
- **Border Radius**: 12px
- **Background**: `#FF6B35`
- **Text**: White, 16px SemiBold
- **Pressed State**: `#E85A2A`
- **Disabled**: 40% opacity
- **Shadow**: `0 2px 8px rgba(255, 107, 53, 0.3)`
- **Full Width**: 100% minus 32px horizontal margin

#### Secondary Button
- **Height**: 48px
- **Border Radius**: 12px
- **Background**: White
- **Border**: 1.5px solid `#FF6B35`
- **Text**: `#FF6B35`, 16px SemiBold
- **Pressed State**: `#FFF4EE` background

#### Ghost Button
- **Height**: 48px
- **Border Radius**: 12px
- **Background**: Transparent
- **Text**: `#FF6B35`, 16px SemiBold
- **Pressed State**: `#FFF4EE` background

#### Small Button
- **Height**: 36px
- **Border Radius**: 8px
- **Padding**: 0 16px
- **Text**: 14px SemiBold

#### Icon Button
- **Size**: 44px × 44px (touch target)
- **Icon Size**: 24px
- **Border Radius**: 12px

### Input Fields

#### Text Input
- **Height**: 56px
- **Border Radius**: 12px
- **Border**: 1.5px solid `#E5E7EB`
- **Focus Border**: `#FF6B35`
- **Background**: White
- **Padding**: 0 16px
- **Text**: 16px Regular, `#1A2332`
- **Placeholder**: 16px Regular, `#9CA3AF`
- **Label**: 12px Medium, `#4A5568`, positioned 8px above

#### Text Area
- **Min Height**: 120px
- **Border Radius**: 12px
- **Padding**: 16px
- **Character Count**: Bottom-right, 12px, `#9CA3AF`

#### Search Input
- **Height**: 48px
- **Border Radius**: 24px (pill shape)
- **Background**: `#F8F9FA`
- **Icon**: Search icon, 20px, `#9CA3AF`, left-aligned
- **Padding Left**: 44px (after icon)

### Cards

#### Standard Card
- **Border Radius**: 16px
- **Padding**: 16px
- **Background**: White
- **Shadow**: `0 1px 3px rgba(0, 0, 0, 0.08)`
- **Border**: 1px solid `#F3F4F6`

#### Elevated Card
- **Border Radius**: 16px
- **Padding**: 16px
- **Background**: White
- **Shadow**: `0 4px 12px rgba(0, 0, 0, 0.1)`

#### Category Card
- **Width**: Auto (horizontal scroll)
- **Border Radius**: 12px
- **Padding**: 12px
- **Height**: 100px
- **Background**: Gradient or themed

### Rating Components

#### Star Rating Display
- **Star Size**: 20px (default), 32px (large), 14px (small)
- **Star Color (filled)**: `#F59E0B`
- **Star Color (empty)**: `#E5E7EB`
- **Gap**: 4px between stars
- **Half-star**: Supported

#### Star Rating Input
- **Star Size**: 40px
- **Touch Target**: 48px per star
- **Animation**: Scale up to 1.2x on tap, spring back
- **Color Transition**: Animate fill on selection

#### Rating Bar (Horizontal)
- **Height**: 8px
- **Border Radius**: 4px
- **Background**: `#E5E7EB`
- **Fill**: Colored per rating level
- **Label**: Left-aligned star count, right-aligned percentage

### Navigation

#### Bottom Navigation Bar
- **Height**: 64px + safe area
- **Background**: White
- **Shadow**: `0 -2px 10px rgba(0, 0, 0, 0.05)`
- **Items**: 5 (Home, Search, Create (+), Activity, Profile)
- **Icon Size**: 24px
- **Label**: 10px Medium
- **Active Color**: `#FF6B35`
- **Inactive Color**: `#9CA3AF`
- **Center Button (Create)**: 56px circle, `#FF6B35` background, white "+" icon, elevated

#### Top App Bar
- **Height**: 56px
- **Background**: White or transparent
- **Title**: 18px SemiBold, `#1A2332`, center-aligned
- **Back Button**: Left, 24px chevron icon
- **Action Buttons**: Right, up to 2 icons

#### Tab Bar
- **Height**: 44px
- **Indicator**: 3px bottom border, `#FF6B35`
- **Active Tab**: `#FF6B35`, SemiBold
- **Inactive Tab**: `#9CA3AF`, Regular
- **Animation**: Slide indicator on switch

### Chips & Tags

#### Filter Chip
- **Height**: 36px
- **Border Radius**: 18px (pill)
- **Padding**: 0 16px
- **Background (inactive)**: `#F8F9FA`
- **Background (active)**: `#FF6B35`
- **Text (inactive)**: 14px, `#4A5568`
- **Text (active)**: 14px, White

#### Category Tag
- **Height**: 28px
- **Border Radius**: 6px
- **Padding**: 0 10px
- **Background**: `#FFF4EE`
- **Text**: 12px Medium, `#FF6B35`

### Modals & Sheets

#### Bottom Sheet
- **Border Radius**: 20px (top-left, top-right)
- **Handle**: 40px × 4px, `#E5E7EB`, centered, 12px from top
- **Padding**: 24px horizontal, 16px top (below handle)
- **Background**: White
- **Overlay**: Black 40% opacity
- **Animation**: Slide up from bottom, 300ms ease-out

#### Dialog Modal
- **Width**: Screen width - 48px
- **Border Radius**: 16px
- **Padding**: 24px
- **Background**: White
- **Overlay**: Black 40% opacity
- **Animation**: Fade in + scale from 0.95, 200ms

### Toasts & Snackbars

#### Toast
- **Height**: Auto (min 48px)
- **Border Radius**: 12px
- **Margin**: 16px horizontal, 16px from top
- **Background**: `#1A2332`
- **Text**: White, 14px Medium
- **Icon**: 20px, left-aligned
- **Duration**: 3 seconds, auto-dismiss
- **Animation**: Slide down from top

### Badges & Indicators

#### Notification Badge
- **Size**: 18px (with count), 10px (dot only)
- **Background**: `#EF4444`
- **Text**: White, 10px Bold
- **Position**: Top-right of parent, offset -4px

#### Status Indicator
- **Size**: 8px circle
- **Colors**: Green (active), Yellow (pending), Red (issue), Gray (inactive)

### Avatars

#### User Avatar
- **Sizes**: 32px (small), 40px (medium), 56px (large), 80px (profile)
- **Border Radius**: 50% (circle)
- **Default**: Initials on `#FF6B35` background, white text
- **Anonymous**: Gray silhouette icon on `#F8F9FA` background

### Lists

#### List Item
- **Min Height**: 56px
- **Padding**: 16px horizontal
- **Divider**: 1px `#F3F4F6`, full-width or inset (16px left)
- **Touch Feedback**: `#F8F9FA` background on press

---

## Animation & Motion

### Timing
| Type | Duration | Easing |
|------|----------|--------|
| Micro (button press) | 100ms | ease-out |
| Small (chip toggle) | 200ms | ease-in-out |
| Medium (sheet open) | 300ms | ease-out |
| Large (screen transition) | 350ms | cubic-bezier(0.4, 0, 0.2, 1) |

### Transitions
- **Page Enter**: Slide right + fade in (350ms)
- **Page Exit**: Slide left + fade out (300ms)
- **Modal Enter**: Slide up + fade in (300ms)
- **Modal Exit**: Slide down + fade out (250ms)
- **List Item**: Stagger appear, 50ms delay per item

---

## Iconography

### Style
- **Type**: Outlined (default), Filled (active states)
- **Size**: 24px (standard), 20px (small), 32px (large)
- **Stroke Width**: 1.5px
- **Color**: Inherits from parent text color

### Required Icons
- Home, Search, Plus (create), Bell (activity), User (profile)
- Star (rating), ThumbUp/ThumbDown, Share, Bookmark
- Filter, Sort, Category grid
- Lock (anonymous), Shield (privacy), Eye/EyeOff
- Camera, Image, Mic
- Settings, Help, Report, Premium/Crown
- M-Pesa logo, Tigo Pesa logo, Airtel Money logo
- WhatsApp, Instagram, Twitter/X, Facebook, Copy link
- Trophy, Badge, Flame (streak), Gift (reward)
- Chart/Graph, TrendUp, TrendDown
- Check, Close, ChevronLeft, ChevronRight, ChevronDown
- Edit, Delete, More (three dots)

---

## Accessibility

### Touch Targets
- **Minimum**: 44px × 44px
- **Recommended**: 48px × 48px
- **Spacing between targets**: Minimum 8px

### Contrast Ratios
- **Normal text**: 4.5:1 minimum (WCAG AA)
- **Large text (18px+)**: 3:1 minimum
- **Interactive elements**: 3:1 minimum against background

### Screen Reader
- All interactive elements have labels
- Images have alt text
- Form fields have associated labels
- Error messages announced automatically

---

## Platform-Specific Notes

### iOS
- Use SF Pro Display/Text font family
- Respect safe area insets (notch, home indicator)
- Use iOS-style back gesture (swipe from left edge)
- Haptic feedback on key interactions (rating, vote submit)

### Android
- Use Roboto font family
- Respect system navigation bar
- Use Material ripple effect for touch feedback
- Support system back button/gesture

---

## Swahili Language Considerations

### UI Text Guidelines
- Primary language: Swahili
- Secondary language: English (settings toggle)
- Button text: Short, action-oriented Swahili
- Error messages: Clear, non-technical Swahili
- Category names: Swahili with English subtitle where needed

### Common UI Labels
| Swahili | English | Context |
|---------|---------|---------|
| Piga Kura | Vote Now | Primary CTA |
| Kadiria | Rate | Rating CTA |
| Tafuta | Search | Search bar |
| Mwanzo | Home | Navigation |
| Shughuli | Activity | Navigation |
| Wasifu | Profile | Navigation |
| Unda | Create | Create button |
| Shiriki | Share | Share action |
| Hifadhi | Save | Save action |
| Tuma | Submit | Submit action |
| Ghairi | Cancel | Cancel action |
| Bado Siri | Still Anonymous | Anonymity indicator |
