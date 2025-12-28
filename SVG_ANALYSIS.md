# SVG Analysis - Working vs Non-Working

## Pattern Found:

### ✅ WORKING SVGs (dungeon, scroll, castle):
- **viewBox starts at 0,0**: `viewBox="0 0 512 512"` or `viewBox="0 0 64 64"`
- **No complex transforms**: Simple structure
- **No clip-path references**: Direct paths
- **Standard coordinates**: Normal ranges

### ❌ NON-WORKING SVG (for sale):
- **viewBox has offset**: `viewBox="264.0303 88.0945 277.4111 197.332"` (starts at 264, 88)
- **Huge transform offset**: `transform="matrix(1, 0, 0, 1, -8705.265035629274, 2.7608189582824707)"`
- **Clip-path references**: `clip-path="url(#clipPath3069)"`
- **Large coordinates**: Paths use coordinates in thousands

### ⚠️ INTERESTING (footprints - working despite issues):
- Has similar issues (transform, clip-path) but still works
- Might be because the mask can still apply despite transforms

## The Key Difference:
**viewBox starting at 0,0** seems to be the most important factor. SVGs with `viewBox="0 0 ..."` work, while those with offsets like `viewBox="264.0303 88.0945 ..."` don't work with CSS mask-image.

## Solution:
For SVGs that don't work, we could:
1. Normalize the viewBox to start at 0,0
2. Remove transform offsets
3. Simplify clip-paths
4. Or use a different rendering approach for problematic SVGs

