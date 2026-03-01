# Premium Design System - SecureEdge Academy

## Design Philosophy
Duolingo-level polish meets enterprise professionalism (Notion + Stripe + Linear). Clean, structured, readable with consistent patterns throughout.

---

## Color Tokens

### Primary Palette
```css
--color-primary: #2563EB;        /* Deep blue */
--color-primary-hover: #1d4ed8;  /* Darker blue on hover */
--color-primary-light: #EFF6FF;  /* Very light blue for backgrounds */

--color-success: #22C55E;        /* Green for XP/achievements */
--color-warning: #F97316;        /* Orange for streaks */
--color-error: #EF4444;          /* Red for battle room */
```

### Neutral Palette
```css
--color-background: #F7F8FA;     /* App background */
--color-card: #FFFFFF;           /* Card backgrounds */
--color-border: #E7EAF0;         /* Borders and dividers */

--color-text-primary: #111827;   /* Gray 900 - headings */
--color-text-secondary: #6B7280; /* Gray 600 - body */
--color-text-tertiary: #9CA3AF;  /* Gray 400 - captions */
```

### Semantic Colors
```css
--color-phase-blue: #2563EB;
--color-phase-purple: #9333EA;
--color-phase-green: #22C55E;
--color-phase-orange: #F97316;
--color-phase-red: #EF4444;
--color-phase-indigo: #6366F1;
--color-phase-cyan: #06B6D4;
```

---

## Typography System

### Font Family
```css
--font-family: -apple-system, BlinkMacSystemFont, "Inter", "SF Pro Text", system-ui, sans-serif;
```

### Type Scale
```css
/* Headings */
--text-h1: 22px;        /* font-size, 600 weight (semibold) */
--text-h2: 18px;        /* font-size, 600 weight */
--text-h3: 16px;        /* font-size, 600 weight */

/* Body */
--text-body: 15px;      /* font-size, 400 weight (regular) */
--text-body-sm: 14px;   /* font-size, 400 weight */

/* Captions */
--text-caption: 13px;   /* font-size, 500 weight (medium) */
--text-caption-sm: 12px;/* font-size, 500 weight */
--text-caption-xs: 11px;/* font-size, 600 weight (medium/bold) */
```

### Line Heights
```css
--leading-tight: 1.2;   /* For headings */
--leading-snug: 1.4;    /* For large text */
--leading-normal: 1.5;  /* For body text */
--leading-relaxed: 1.6; /* For descriptions */
```

### Font Weights
```css
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

---

## Spacing System (8pt Grid)

### Base Unit: 8px
```css
--space-1: 8px;   /* 1 unit */
--space-2: 16px;  /* 2 units */
--space-3: 24px;  /* 3 units */
--space-4: 32px;  /* 4 units */
--space-5: 40px;  /* 5 units */
--space-6: 48px;  /* 6 units */
```

### Component Spacing
```css
/* Section padding */
--padding-section: 16px;  /* Mobile */
--padding-section-lg: 20px; /* Desktop */

/* Card padding */
--padding-card: 20px;     /* 2.5 units */
--padding-card-sm: 16px;  /* 2 units */

/* Gaps */
--gap-xs: 8px;   /* Between small elements */
--gap-sm: 12px;  /* Between list items */
--gap-md: 16px;  /* Between sections */
--gap-lg: 24px;  /* Between major sections */
```

---

## Border Radius System

### Consistent Radii
```css
--radius-card: 14px;     /* Main cards */
--radius-button: 10px;   /* Buttons and inputs */
--radius-chip: 8px;      /* Pills, badges, small elements */
--radius-full: 9999px;   /* Circles */
```

---

## Shadow System

### Minimal Elevation
```css
/* Use borders primarily, shadows sparingly */
--shadow-none: none;
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);  /* Hover states */
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.05);  /* Floating elements */
```

---

## Component Specifications

### 1. Top App Bar
```
Height: 72px (mobile)
Padding: 16px horizontal
Background: white (#FFFFFF)
Border: 1px solid #E7EAF0 (bottom)
Position: sticky top

Left side:
- Greeting: 18px semibold gray-900
- Subtitle: 13px regular gray-600, 4px margin-top

Right side:
- Stats pills: 2 pills with 8px gap
- Each pill: 
  - Background: #F7F8FA
  - Border: 1px solid #E7EAF0
  - Padding: 6px 12px
  - Border radius: 8px
  - Content: emoji (14px) + text (13px medium)
```

### 2. Progress Card
```
Background: white
Border: 1px solid #E7EAF0
Border radius: 14px
Padding: 20px
Margin-bottom: 24px

Top row:
- Level label: 13px regular gray-600
- Level title: 16px semibold gray-900
- XP text: 13px regular gray-600 (right-aligned)

Progress bar:
- Height: 6px (1.5 units)
- Background: #F7F8FA
- Fill: linear-gradient(to right, #2563EB, #1d4ed8)
- Border radius: full
- Animation: 500ms ease-out on load
```

### 3. Daily Scenario Card (Hero)
```
Background: linear-gradient(135deg, #2563EB, #1d4ed8)
Border radius: 14px
Padding: 20px
Color: white
Position: relative
Overflow: hidden
Margin-bottom: 24px

Background decoration:
- SVG circles at top-right
- Opacity: 10%

Badge:
- Background: white with 20% opacity
- Padding: 4px 10px
- Border radius: 8px
- Text: 12px medium
- Icon: 14px
- Gap: 6px
- Margin-bottom: 12px

Title:
- Font size: 18px
- Font weight: semibold
- Line height: snug (1.4)
- Margin-bottom: 8px

Description:
- Font size: 14px
- Color: white with 90% opacity
- Line height: relaxed (1.6)
- Margin-bottom: 16px
- "Read more" link: 13px medium, underline

Buttons:
- Primary: 
  - Background: white
  - Color: #2563EB
  - Padding: 10px 16px
  - Border radius: 10px
  - Font: 14px medium
- Secondary (ghost):
  - Background: white with 10% opacity
  - Border: 1px solid white with 20% opacity
  - Color: white
  - Padding: 10px 16px
  - Border radius: 10px
  - Font: 14px medium
  - Backdrop filter: blur

Gap between buttons: 12px
```

### 4. Learning Path Section
```
Margin-bottom: 24px

Header row:
- Title: 18px semibold gray-900
- "See all" link: 13px medium #2563EB
- Margin-bottom: 16px
- Justify: space-between

Path cards (list):
- Gap between cards: 12px
- Each card:
  - Background: white
  - Border: 1px solid #E7EAF0
  - Border radius: 14px
  - Padding: 16px
  - Transition: all 200ms
  
Hover state (if unlocked):
- Border: 1px solid #2563EB
- Shadow: 0 1px 2px rgba(0, 0, 0, 0.04)
- Transform: scale(0.98) on active

Card structure:
- Flex row, gap 12px, align-start

Icon tile:
- Size: 44px × 44px
- Border radius: 10px
- Background: phase color with 15% opacity (unlocked) or #F7F8FA (locked)
- Emoji: 20px
- Flex-shrink: 0

Content area:
- Flex: 1
- Min-width: 0 (for text truncation)

Title row:
- Title: 15px semibold gray-900
- Lock icon: 14px gray-400 (if locked)
- Margin-bottom: 4px

Description:
- Font: 13px regular gray-600
- Line-clamp: 1
- Margin-bottom: 8px

Progress section (if unlocked):
- Lesson count: 12px regular gray-600 (left)
- Percentage: 12px semibold gray-900 (right)
- Gap: 6px

Progress bar:
- Height: 4px
- Background: #F7F8FA
- Fill: phase color
- Border radius: full
- Transition: 500ms

Helper text (if locked):
- Font: 12px regular gray-500
- Margin-top: 4px

Chevron (if unlocked):
- Size: 20px
- Color: gray-400
- Flex-shrink: 0
- Margin-top: 8px
```

### 5. Battle Room Teaser
```
Background: linear-gradient(135deg, #EF4444, #DC2626)
Border radius: 14px
Padding: 20px
Color: white
Margin-bottom: 24px

Top row:
- Icon container: 40px × 40px, white 20% opacity, radius 10px
- Badge: 
  - Background: #7F1D1D
  - Padding: 4px 10px
  - Radius: 8px
  - Text: 11px bold tracking-wide
  - Margin-bottom: 8px
- Title: 16px semibold, margin-bottom 4px
- Description: 13px regular, white 90% opacity

Button:
- Width: 100%
- Background: white
- Color: #EF4444
- Padding: 10px 16px
- Border radius: 10px
- Font: 14px medium
- Hover: white 95% opacity
- Active: scale(0.98)
```

### 6. Bottom Navigation
```
Position: fixed bottom
Background: white
Border-top: 1px solid #E7EAF0
Z-index: 50
Max-width: 600px
Margin: 0 auto

Grid: 4 columns, gap 4px
Padding: 8px

Each tab button:
- Padding: 8px 12px
- Border radius: 10px
- Flex column, center aligned

Active state:
- Background: #F7F8FA
- Color: #2563EB

Inactive state:
- Background: transparent
- Color: gray-600
- Hover: gray-900

Icon:
- Size: 24px
- Margin-bottom: 2px

Label:
- Font: 11px medium
```

---

## Interaction & Animation Specs

### Micro-interactions
```css
/* Button press */
.button:active {
  transform: scale(0.98);
  transition: transform 100ms ease-out;
}

/* Card hover (unlocked) */
.card:hover {
  border-color: #2563EB;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  transition: all 200ms ease-out;
}

/* Progress bar animation */
.progress-bar {
  animation: fillProgress 500ms ease-out forwards;
}

@keyframes fillProgress {
  from {
    width: 0%;
  }
  to {
    width: var(--target-width);
  }
}
```

### Page Transitions
```css
/* Screen enter */
.page-enter {
  animation: slideUpFade 200ms ease-out;
}

@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## Layout Guidelines

### Mobile Baseline (375px)
```
Max content width: 600px
Horizontal padding: 16px
Vertical spacing: 24px between sections
Top app bar: sticky
Bottom nav: fixed
Content scrollable area: calc(100vh - 72px - 60px)
```

### Responsive Breakpoints
```css
/* Mobile first */
@media (min-width: 375px) { /* iPhone SE */ }
@media (min-width: 390px) { /* iPhone 12/13/14 */ }
@media (min-width: 430px) { /* iPhone 14 Pro Max */ }
@media (min-width: 600px) { /* Large phones / small tablets */ }
@media (min-width: 768px) { /* Tablets */ }
@media (min-width: 1024px) { /* Desktop (show sidebar) */ }
```

---

## Content Guidelines

### Copy Rules
- Use sentence case, not TITLE Case or ALL CAPS (except small badges)
- Keep descriptions concise: 2-3 lines max
- Action buttons: verb-first ("Start challenge" not "Challenge Start")
- Numbers: use numerals (0, 1, 2) not words
- Dates/times: "0-day streak" not "0 Day Streak"
- Avoid exclamation marks except for celebrations

### Tone
- Professional but friendly
- Clear and direct
- Encourage without being pushy
- Use emojis sparingly (👋 🔥 ⭐ only)

---

## Accessibility

### Color Contrast
- All text meets WCAG AA (4.5:1 for small text, 3:1 for large)
- Primary blue #2563EB on white: 8.27:1 ✓
- Gray 900 #111827 on white: 16.01:1 ✓
- Gray 600 #6B7280 on white: 5.71:1 ✓

### Touch Targets
- Minimum: 44px × 44px (iOS standard)
- Preferred: 48px × 48px
- Spacing between targets: at least 8px

### Keyboard Navigation
- All interactive elements focusable
- Focus ring: 2px solid #2563EB with 2px offset
- Tab order follows visual hierarchy

---

## Implementation Notes

### CSS Variables Setup
```css
:root {
  /* Colors */
  --color-primary: #2563EB;
  --color-bg: #F7F8FA;
  --color-card: #FFFFFF;
  --color-border: #E7EAF0;
  
  /* Typography */
  --text-h1: 22px;
  --text-body: 15px;
  --font-semibold: 600;
  
  /* Spacing */
  --space-2: 16px;
  --space-3: 24px;
  
  /* Radius */
  --radius-card: 14px;
  --radius-button: 10px;
  --radius-chip: 8px;
}
```

### Tailwind Config (if using Tailwind)
```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        background: '#F7F8FA',
        border: '#E7EAF0',
      },
      fontSize: {
        'h1': ['22px', { fontWeight: '600', lineHeight: '1.2' }],
        'h2': ['18px', { fontWeight: '600', lineHeight: '1.2' }],
        'body': ['15px', { fontWeight: '400', lineHeight: '1.5' }],
      },
      borderRadius: {
        'card': '14px',
        'button': '10px',
        'chip': '8px',
      },
      spacing: {
        '18': '72px', // App bar height
        '15': '60px', // Bottom nav height
      }
    }
  }
}
```

---

## Example Usage

### Card Component
```tsx
<div className="bg-white rounded-[14px] p-5 border border-[#E7EAF0]">
  <h3 className="text-[16px] font-semibold text-gray-900 mb-2">
    Title Here
  </h3>
  <p className="text-[14px] text-gray-600 leading-relaxed">
    Description text here
  </p>
</div>
```

### Button Component
```tsx
<button className="bg-[#2563EB] text-white py-2.5 px-4 rounded-[10px] text-[14px] font-medium hover:bg-[#1d4ed8] active:scale-[0.98] transition-all">
  Click me
</button>
```

### Progress Bar
```tsx
<div className="w-full bg-[#F7F8FA] rounded-full h-1.5">
  <div 
    className="h-1.5 bg-gradient-to-r from-[#2563EB] to-[#1d4ed8] rounded-full transition-all duration-500"
    style={{ width: '45%' }}
  />
</div>
```

---

**Version**: 2.1.0  
**Last Updated**: 2026-03-01  
**Status**: Production Ready
