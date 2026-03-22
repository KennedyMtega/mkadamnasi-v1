# Screen 30: Vote/Rating Draft Saved

## Stitch Prompt

### Screen Info
- **Screen Name**: Draft Saved Confirmation
- **Platform**: Mobile (iOS/Android)
- **Dimensions**: 390 × 844px (iPhone 14)
- **Background**: `#F8F9FA`

### Layout Structure

#### Status Bar (0-44px)
- System status bar (time, signal, battery)
- Dark icons on light background

#### Top App Bar (44-100px)
- **Left**: Back arrow icon (24px, `#1A2332`)
- **Center**: "Rasimu Imehifadhiwa" (Draft Saved) — 18px SemiBold, `#1A2332`
- **Right**: Close "✕" icon (24px, `#4A5568`)

#### Success Illustration Area (100-300px)
- **Center**: Large animated checkmark inside a circle
  - Circle: 120px diameter, `#10B981` background with 15% opacity
  - Checkmark: 48px, `#10B981`, animated draw-in (500ms)
- **Below circle (12px gap)**:
  - "Rasimu Imehifadhiwa!" — 24px Bold, `#1A2332`, center-aligned
  - "Unaweza kuiendelea wakati wowote" (You can continue anytime) — 14px Regular, `#4A5568`, center-aligned, 8px below title

#### Draft Preview Card (316-480px)
- **Container**: White card, 16px radius, 16px padding, 16px horizontal margin
- **Shadow**: `0 1px 3px rgba(0, 0, 0, 0.08)`
- **Content**:
  - **Top Row**:
    - Draft type badge: "Kura" (Vote) or "Kadirio" (Rating) — pill shape, `#FFF4EE` bg, `#FF6B35` text, 12px Medium
    - Timestamp: "Imehifadhiwa sasa hivi" (Saved just now) — 12px, `#9CA3AF`, right-aligned
  - **Title** (8px below): Draft title text — 16px SemiBold, `#1A2332`, max 2 lines, ellipsis
  - **Preview**: First 2 options shown — 14px Regular, `#4A5568`, bullet points
  - **Progress Bar** (12px below):
    - Label: "Maendeleo" (Progress) — 12px Medium, `#4A5568`
    - Bar: 8px height, 100% width, `#E5E7EB` background, `#FF6B35` fill (percentage based on completion)
    - Percentage: "65%" — 12px SemiBold, `#FF6B35`, right-aligned

#### Action Buttons (500-620px)
- **Primary Button**: "Endelea Kuhariri" (Continue Editing)
  - Full width (minus 32px margin), 48px height, 12px radius
  - `#FF6B35` background, white text, 16px SemiBold
  - Icon: Edit pencil (20px) left of text

- **Secondary Button** (12px below): "Angalia Rasimu Zote" (View All Drafts)
  - Full width (minus 32px margin), 48px height, 12px radius
  - White background, 1.5px `#FF6B35` border, `#FF6B35` text, 16px SemiBold
  - Icon: List icon (20px) left of text

- **Ghost Button** (8px below): "Futa Rasimu" (Delete Draft)
  - Full width, 48px height, transparent background
  - `#EF4444` text, 14px Medium
  - Icon: Trash icon (18px) left of text

#### Auto-Save Info (640-700px)
- **Info Card**: Light blue background (`#EBF5FF`), 12px radius, 16px padding, 16px horizontal margin
- **Icon**: Info circle (20px, `#3B82F6`) left-aligned
- **Text**: "Rasimu zinahifadhiwa kiotomatiki. Utapata arifa ya kukumbushwa baada ya siku 7." (Drafts are auto-saved. You'll get a reminder notification after 7 days.) — 13px Regular, `#1A2332`

#### Bottom Safe Area (810-844px)
- 34px safe area padding

### Interactions
- **Continue Editing**: Navigate back to the vote/rating creation screen with draft loaded
- **View All Drafts**: Navigate to drafts list screen
- **Delete Draft**: Show confirmation dialog ("Una uhakika?" / Are you sure?) with Cancel/Delete options
- **Back Arrow**: Navigate to home screen
- **Close**: Navigate to home screen
- **Checkmark Animation**: Draw-in animation on screen load, subtle bounce at end

### Design Tokens
```
background: #F8F9FA
card-bg: #FFFFFF
card-shadow: 0 1px 3px rgba(0, 0, 0, 0.08)
card-radius: 16px
primary-text: #1A2332
secondary-text: #4A5568
success-color: #10B981
brand-orange: #FF6B35
error-red: #EF4444
info-blue: #3B82F6
info-bg: #EBF5FF
```
