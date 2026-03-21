# Screen 33: Vote Results Share Image Generator

## Stitch Prompt

### Screen Info
- **Screen Name**: Share Image Generator
- **Platform**: Mobile (iOS/Android)
- **Dimensions**: 390 × 844px (iPhone 14)
- **Background**: `#1A2332` (dark theme for this screen)

### Layout Structure

#### Status Bar (0-44px)
- System status bar, light/white icons on dark background

#### Top App Bar (44-100px)
- **Left**: Close "✕" icon (24px, White)
- **Center**: "Tengeneza Picha" (Generate Image) — 18px SemiBold, White
- **Right**: "Hifadhi" (Save) — 14px SemiBold, `#FF6B35`

#### Image Preview Area (108-480px)
- **Container**: Centered, 350px × 350px, with subtle shadow
- **Generated Image Preview** (1:1 aspect ratio for Instagram):
  - **Background**: Gradient `#FF6B35` → `#E85A2A` (diagonal)
  - **Mkadamnasi logo**: Top-left, small (24px), white, with "Mkadamnasi" text
  - **Vote/Rating Title**: Center-top area, 22px Bold, White, max 3 lines
  - **Results Visualization**:
    - For Votes: Horizontal bar chart with percentages, white bars on semi-transparent bg
    - For Ratings: Large star rating display with average score
  - **Stats**: "👥 1,234 walipiga kura" — 14px, White 80% opacity
  - **CTA**: "Piga kura wewe pia!" (Vote too!) — 14px SemiBold, White
  - **QR Code**: Bottom-right corner, 48px, white on transparent
  - **Watermark**: "mkadamnasi.co.tz" — 10px, White 60% opacity, bottom-center

#### Template Selector (496-576px)
- **Label**: "Chagua Muundo" (Choose Template) — 14px Medium, White 70%
- **Horizontal scroll** (12px below, 16px left margin, 12px gap):
  - **Template 1** — Orange Gradient (active):
    - Thumbnail: 64px × 64px, 8px radius, 2px `#FF6B35` border
    - Gradient: `#FF6B35` → `#E85A2A`
  - **Template 2** — Dark Navy:
    - Thumbnail: 64px × 64px, 8px radius
    - Gradient: `#1A2332` → `#2D3748`
  - **Template 3** — Green Fresh:
    - Thumbnail: 64px × 64px, 8px radius
    - Gradient: `#10B981` → `#059669`
  - **Template 4** — Tanzania Flag:
    - Thumbnail: 64px × 64px, 8px radius
    - Colors: Green, Blue, Yellow, Black diagonal stripes
  - **Template 5** — Minimal White:
    - Thumbnail: 64px × 64px, 8px radius
    - White bg with `#FF6B35` accents

#### Aspect Ratio Selector (592-636px)
- **Label**: "Ukubwa" (Size) — 14px Medium, White 70%
- **Chip row** (8px below, centered):
  - "1:1" — Active chip: `#FF6B35` bg, white text, 36px height, pill
  - "9:16" — Inactive chip: `#2D3748` bg, white 60% text
  - "16:9" — Inactive chip: same as above
- **Description**: "Kwa Instagram Post" / "Kwa Stories" / "Kwa Twitter" — 12px, White 50%, center

#### Action Buttons (660-760px)
- **Primary Button**: "Shiriki Sasa" (Share Now)
  - Full width minus 32px, 48px height, 12px radius
  - `#FF6B35` background, white text, 16px SemiBold
  - Icon: Share (20px) left of text

- **Secondary Button** (12px below): "Pakua Picha" (Download Image)
  - Full width minus 32px, 48px height, 12px radius
  - Transparent bg, 1.5px White 30% border, White text, 16px SemiBold
  - Icon: Download (20px) left of text

#### Bottom Safe Area (810-844px)
- 34px safe area

### Interactions
- **Template thumbnails**: Tap to switch template, image preview updates immediately
- **Aspect ratio chips**: Tap to change, preview resizes with animation
- **Share Now**: Open system share sheet with generated image
- **Download**: Save image to photo library, show success toast
- **Save (top-right)**: Same as download
- **Pinch to zoom**: Zoom into preview image
- **Close**: Return to previous screen

### Design Tokens
```
screen-bg: #1A2332
card-dark: #2D3748
brand-orange: #FF6B35
dark-orange: #E85A2A
text-white: #FFFFFF
text-muted: rgba(255, 255, 255, 0.7)
text-subtle: rgba(255, 255, 255, 0.5)
active-border: #FF6B35
inactive-bg: #2D3748
```
