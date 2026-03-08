# Image Assets

## Directory structure

Each module gets its own subdirectory named after the module ID (matching the filename in `_data/modules/`):

```
images/
  <module-id>/
    hero.jpg      # modal hero image
    thumb.jpg     # card thumbnail (optional)
  icons/          # SVG pack-type icons (site UI, not per-module)
```

## Specifications

### Hero image (`image` field)
- **Aspect ratio:** 16:7 (panoramic)
- **Recommended size:** 1560×683px or similar at that ratio
- **Usage:** Displayed full-width in the module detail modal
- **Cropping:** `object-fit: cover`, anchored center - keep the focal subject horizontally centered

### Card thumbnail (`thumbnail` field, optional)
- **Aspect ratio:** 16:9
- **Recommended size:** 560×315px
- **Usage:** Displayed on the landing page card grid; falls back to the hero image if omitted
- **Cropping:** `object-fit: cover`, anchored center - keep the focal subject centered
- **Note:** Providing a dedicated thumbnail improves initial page load and gives precise control over what's visible at 16:9 vs 16:7

## Naming convention

- `hero.webp`: modal hero
- `thumb.webp`: card thumbnail (omit if you want the hero to serve both)
- Additional screenshots for the lightbox can be named descriptively (e.g. `sheet-overview.webp`, `spells-tab.webp`) and referenced in the `screenshots` array in the module frontmatter

## Format

WebP is preferred for all module images (hero and thumbnail). It gives better compression than JPEG at equivalent quality and is universally supported in modern browsers. PNG for anything with transparency or fine line art (e.g. icons). Keep hero images under ~300 KB and thumbnails under ~80 KB where possible.

> Note: lossless JPEG crop (`jpegtran`) exists but requires the crop rectangle to align to 8×16px DCT block boundaries, making it impractical to rely on. Generate assets in WebP from the start.
