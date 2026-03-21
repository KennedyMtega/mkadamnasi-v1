# Screen 31: Share Vote/Rating

## Stitch Prompt

### Screen Info
- **Screen Name**: Share Vote/Rating
- **Platform**: Mobile (iOS/Android)
- **Dimensions**: 390 × 844px (iPhone 14)
- **Background**: Black overlay 40% opacity over previous screen

### Layout Structure

#### Bottom Sheet Container
- **Position**: Anchored to bottom
- **Height**: ~520px
- **Border Radius**: 20px top-left, 20px top-right
- **Background**: White
- **Handle**: 40px × 4px, `#E5E7EB`, centered, 12px from top

#### Sheet Header (16-72px from sheet top)
- **Title**: "Shiriki" (Share) — 20px SemiBold, `#1A2332`, center-aligned
- **Close button**: "✕" icon (24px, `#4A5568`) right-aligned, 16px from right edge

#### Vote/Rating Preview Card (80-200px from sheet top)
- **Container**: `#F8F9FA` background, 12px radius, 16px padding, 16px horizontal margin
- **Content**:
  - **Category badge**: Pill shape, `#FFF4EE` bg, `#FF6B35` text, 12px
  - **Title**: Vote/rating title — 16px SemiBold, `#1A2332`, max 2 lines
  - **Stats row**: "👥 1,234 kura" (votes) — 13px, `#4A5568`
  - **Mini chart**: Small horizontal bar chart showing top 2 results (if applicable)

#### Quick Share Row (216-296px from sheet top)
- **Label**: "Shiriki kupitia" (Share via) — 14px Medium, `#4A5568`, left-aligned, 16px margin
- **Horizontal scroll row** (12px below, 16px left margin):
  - **WhatsApp**:
    - Circle: 56px, `#25D366` background
    - Icon: WhatsApp logo, 28px, white
    - Label: "WhatsApp" — 11px, `#4A5568`, center-aligned below
  - **Instagram**:
    - Circle: 56px, gradient (`#833AB4` → `#FD1D1D` → `#FCAF45`)
    - Icon: Instagram logo, 28px, white
    - Label: "Instagram" — 11px, `#4A5568`
  - **Twitter/X**:
    - Circle: 56px, `#1A2332` background
    - Icon: X logo, 24px, white
    - Label: "X" — 11px, `#4A5568`
  - **Facebook**:
    - Circle: 56px, `#1877F2` background
    - Icon: Facebook logo, 28px, white
    - Label: "Facebook" — 11px, `#4A5568`
  - **Telegram**:
    - Circle: 56px, `#0088CC` background
    - Icon: Telegram logo, 28px, white
    - Label: "Telegram" — 11px, `#4A5568`
  - **More**:
    - Circle: 56px, `#F8F9FA` background, 1px `#E5E7EB` border
    - Icon: Three dots, 24px, `#4A5568`
    - Label: "Zaidi" (More) — 11px, `#4A5568`

#### Copy Link Section (312-368px from sheet top)
- **Container**: Full width minus 32px, 48px height, `#F8F9FA` bg, 12px radius
- **Layout**: Row
  - **Link icon**: 20px, `#9CA3AF`, 16px from left
  - **URL text**: "mkadamnasi.co.tz/v/abc123" — 14px Regular, `#4A5568`, truncated
  - **Copy button**: "Nakili" (Copy) — 14px SemiBold, `#FF6B35`, right-aligned, 16px from right
- **On copy**: Button changes to "Imenakiliwa! ✓" (Copied!) in `#10B981` for 2 seconds

#### Generate Share Image (384-440px from sheet top)
- **Button**: Full width minus 32px, 48px height, 12px radius
  - `#1A2332` background, white text
  - Icon: Image/camera icon (20px) left of text
  - Text: "Tengeneza Picha ya Kushiriki" (Generate Share Image) — 14px SemiBold
  - Subtitle: "Kwa Instagram Stories na WhatsApp Status" — 11px, `#9CA3AF`

#### QR Code Section (456-510px from sheet top)
- **Layout**: Centered
- **QR Code**: 80px × 80px, `#1A2332` on white, with small Mkadamnasi logo in center
- **Label**: "Scan kupiga kura" (Scan to vote) — 12px, `#9CA3AF`, center-aligned

### Interactions
- **Drag handle**: Pull down to dismiss bottom sheet
- **WhatsApp**: Open WhatsApp share intent with pre-filled message and link
- **Instagram**: Open Instagram Stories with generated share image
- **Twitter/X**: Open X compose with pre-filled tweet and link
- **Facebook**: Open Facebook share dialog
- **Telegram**: Open Telegram share intent
- **More**: Open system share sheet
- **Copy Link**: Copy to clipboard, show success state
- **Generate Share Image**: Navigate to Share Image Generator screen
- **QR Code**: Tap to enlarge QR code in modal

### Design Tokens
```
overlay-bg: rgba(0, 0, 0, 0.4)
sheet-bg: #FFFFFF
sheet-radius: 20px
handle-color: #E5E7EB
whatsapp-green: #25D366
facebook-blue: #1877F2
twitter-dark: #1A2332
telegram-blue: #0088CC
instagram-gradient: linear-gradient(#833AB4, #FD1D1D, #FCAF45)
```
