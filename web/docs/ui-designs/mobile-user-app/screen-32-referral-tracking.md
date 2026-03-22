# Screen 32: Referral Tracking Dashboard

## Stitch Prompt

### Screen Info
- **Screen Name**: Referral Tracking Dashboard
- **Platform**: Mobile (iOS/Android)
- **Dimensions**: 390 × 844px (iPhone 14)
- **Background**: `#F8F9FA`

### Layout Structure

#### Status Bar (0-44px)
- System status bar, dark icons

#### Top App Bar (44-100px)
- **Left**: Back arrow (24px, `#1A2332`)
- **Center**: "Rufaa Zangu" (My Referrals) — 18px SemiBold, `#1A2332`
- **Right**: Share icon (24px, `#4A5568`)

#### Referral Stats Cards (108-220px)
- **Horizontal scroll**, 16px left margin, 12px gap between cards
- **Card 1** — "Jumla ya Rufaa" (Total Referrals):
  - Size: 160px × 100px, 12px radius, white bg, shadow
  - Icon: Users group (24px, `#FF6B35`) top-left
  - Number: "47" — 28px Bold, `#1A2332`
  - Label: "Watu waliojiunga" (People joined) — 12px, `#4A5568`

- **Card 2** — "Wiki Hii" (This Week):
  - Size: 160px × 100px, 12px radius, `#FFF4EE` bg
  - Icon: TrendUp (24px, `#10B981`) top-left
  - Number: "8" — 28px Bold, `#FF6B35`
  - Label: "+23% kuliko wiki iliyopita" — 12px, `#10B981`

- **Card 3** — "Pointi Zilizopatikana" (Points Earned):
  - Size: 160px × 100px, 12px radius, white bg, shadow
  - Icon: Star/coin (24px, `#F59E0B`) top-left
  - Number: "2,350" — 28px Bold, `#1A2332`
  - Label: "Pointi za rufaa" — 12px, `#4A5568`

#### Your Referral Code Section (236-340px)
- **Container**: White card, 16px radius, 16px padding, 16px horizontal margin
- **Title**: "Msimbo Wako wa Rufaa" (Your Referral Code) — 16px SemiBold, `#1A2332`
- **Code Display** (12px below):
  - Container: `#F8F9FA` bg, 12px radius, 56px height, centered
  - Code: "MKAD-ABCD-1234" — 24px Monospace Bold, `#FF6B35`, letter-spacing 2px
  - Copy icon button: Right side, 44px touch target
- **Share Button** (12px below):
  - Full width, 44px height, `#FF6B35` bg, 10px radius
  - Text: "Shiriki Msimbo" (Share Code) — 14px SemiBold, White
  - Icon: Share (18px) left of text
- **Reward Info**: "Pata pointi 50 kwa kila rufaa!" (Get 50 points per referral!) — 12px, `#10B981`, center-aligned, 8px below button

#### Referral Tiers Section (356-460px)
- **Title**: "Viwango vya Rufaa" (Referral Tiers) — 16px SemiBold, `#1A2332`, 16px left margin
- **Tier Cards** (12px below, 16px horizontal margin, 8px gap):

  - **Tier 1 — Bronze** (active, highlighted):
    - Row: 60px height, white bg, 12px radius, 12px padding, `#FF6B35` left border (3px)
    - Badge: Bronze circle (32px, `#CD7F32` bg)
    - Text: "Bronze — 10+ rufaa" — 14px SemiBold, `#1A2332`
    - Status: "✓ Umefikia!" (Achieved!) — 12px, `#10B981`
    - Reward: "+100 pointi" — 12px, `#FF6B35`

  - **Tier 2 — Silver** (active):
    - Same layout, `#C0C0C0` badge
    - Text: "Silver — 25+ rufaa"
    - Status: "✓ Umefikia!"
    - Reward: "+300 pointi"

  - **Tier 3 — Gold** (next target):
    - Same layout, `#FFD700` badge, dashed left border
    - Text: "Gold — 50+ rufaa"
    - Progress: "47/50" — 12px, `#4A5568`
    - Progress bar: thin, partially filled

  - **Tier 4 — Diamond** (locked):
    - Same layout, `#B9F2FF` badge with lock overlay
    - Text: "Diamond — 100+ rufaa"
    - Status: Lock icon + "Imefungwa" (Locked) — 12px, `#9CA3AF`

#### Recent Referrals List (476-750px)
- **Section Title**: "Rufaa za Hivi Karibuni" (Recent Referrals) — 16px SemiBold, `#1A2332`, 16px left margin
- **List Items** (white bg, full width, 72px per item, 1px `#F3F4F6` divider):

  - **Item**:
    - Avatar: 40px circle, anonymous silhouette on `#F8F9FA`
    - Name: "Mtumiaji #47" (User #47) — 14px SemiBold, `#1A2332`
    - Subtitle: "Alijiunga Leo, 2:30 PM" (Joined Today) — 12px, `#9CA3AF`
    - Points badge: "+50" — pill, `#E6FFFA` bg, `#10B981` text, 12px

  - (Repeat for 5+ items, scrollable)

#### Bottom Safe Area
- 64px bottom nav + 34px safe area

### Interactions
- **Copy code**: Copy referral code to clipboard, toast confirmation
- **Share Code**: Open share sheet with referral code and message
- **Share icon (top)**: Same as share code
- **Tier cards**: Tap to see tier details and benefits
- **Referral list items**: Non-interactive (anonymous)
- **Pull to refresh**: Refresh referral stats

### Design Tokens
```
background: #F8F9FA
card-bg: #FFFFFF
brand-orange: #FF6B35
light-orange-bg: #FFF4EE
success-green: #10B981
warning-yellow: #F59E0B
bronze: #CD7F32
silver: #C0C0C0
gold: #FFD700
diamond: #B9F2FF
```
