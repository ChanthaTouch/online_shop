# Favicon Setup Guide

## Current Status
✅ Custom coffee-themed SVG favicon created (`/public/favicon.svg`)
✅ HTML updated to use new favicon
✅ Meta tags added for better SEO and social sharing

## What You See Now
- **Icon**: Coffee cup with steam (brown/tan colors)
- **Title**: "Life&Coffee - Premium Coffee & Beverages"
- **Theme**: Warm coffee colors (#8B4513)

## To Generate Additional Favicon Formats

For best browser compatibility, you should generate multiple favicon sizes:

### Option 1: Online Tool (Easiest)
1. Go to https://favicon.io/favicon-converter/
2. Upload `frontend/public/favicon.svg`
3. Download the generated package
4. Extract and replace files in `frontend/public/`

### Option 2: Using ImageMagick (Command Line)
```bash
# Install ImageMagick first
# Then run:
cd frontend/public
convert favicon.svg -resize 16x16 favicon-16x16.png
convert favicon.svg -resize 32x32 favicon-32x32.png
convert favicon.svg -resize 180x180 apple-touch-icon.png
convert favicon.svg -resize 192x192 android-chrome-192x192.png
convert favicon.svg -resize 512x512 android-chrome-512x512.png
```

### Option 3: Design Your Own
If you want a custom logo instead of the coffee cup:
1. Create your logo in Figma, Illustrator, or Canva
2. Export as SVG (128x128px or larger)
3. Replace `frontend/public/favicon.svg`
4. Generate other sizes using Option 1 or 2

## Files to Generate
- `favicon.ico` (16x16, 32x32, 48x48 multi-size)
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png` (180x180)
- `android-chrome-192x192.png`
- `android-chrome-512x512.png`

## After Generating
1. Place all files in `frontend/public/`
2. Rebuild: `npm run build`
3. Clear browser cache to see changes
4. Test on different devices/browsers

## Current Favicon Colors
- Cup: Tan/Beige (#D4A574 to #8B6F47)
- Coffee: Dark Brown (#6F4E37 to #3E2723)
- Steam: Light Brown (#8B7355)
- Background: Cream (#FFF8E7)
