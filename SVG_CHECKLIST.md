# SVG Checklist - What to Look For

## SVGs that work with CSS mask-image:
1. **Has proper viewBox** - Should have `viewBox` attribute (e.g., `viewBox="0 0 368 368"`)
2. **Has paths with fills** - Paths should have `fill` attributes (color doesn't matter for mask)
3. **Proper SVG structure** - Should be valid XML/SVG
4. **Standard coordinate system** - Coordinates in reasonable ranges (0-1000 typically works well)

## SVGs that might NOT work:
1. **Missing viewBox** - Without viewBox, sizing can be wrong
2. **Empty or broken paths** - SVGs with no actual content
3. **External references** - SVGs that reference external files
4. **Complex clipPaths** - Some clipPaths might interfere (like `clip-path="url(#clipPath1757)"`)
5. **Very large coordinate systems** - Like explosion.svg with coordinates in thousands (5160.99, etc.)
6. **Transform matrices** - Complex transforms like `transform="matrix(1, 0, 0, 1, -4857.158782958984, -3.314793109893799)"` can cause issues

## What I Found:

### Working SVGs (like basket.svg):
- Standard viewBox: `viewBox="0 0 368 368"`
- Normal coordinates
- Simple structure

### Problematic SVGs (like explosion.svg):
- Has viewBox but coordinates are in thousands: `viewBox="232.1787 70.1954 277.3218 220.9796"`
- Uses clip-path references: `clip-path="url(#clipPath1757)"`
- Has transform matrices that shift coordinates
- This might cause the mask to not apply correctly

## Quick Test:
Open the SVG in a browser directly:
- `http://localhost:5173/themes/core/explosion.svg`
- `http://localhost:5173/themes/at home/basket.svg`

If it displays correctly in the browser, it should work with mask-image.

## Common Issues:
- **Solid blocks instead of shapes**: Usually means the mask isn't applying - check browser console for 404 errors or CORS issues
- **Wrong size**: Check viewBox attribute
- **No image at all**: SVG file might be corrupted or empty
- **Mask not working**: Try opening the SVG URL directly - if it doesn't load, the path might be wrong

## Solution:
If an SVG shows as a solid block, it's likely because:
1. The mask-image URL isn't loading (check browser console)
2. The SVG has complex transforms/clipPaths that interfere
3. The viewBox is causing sizing issues

**Fix**: Simplify the SVG or use a different SVG file for that icon.

