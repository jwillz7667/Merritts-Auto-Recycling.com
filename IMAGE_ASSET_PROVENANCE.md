# Image asset provenance

## Governing rule

The rebuild may use image content from the old Merritt's Auto Recycling site and no other source. No generated image, web-search image, new stock image, or unrelated library image is included.

## Selected files

| New path                                 | Legacy source path                        | SHA-256                                                            | Usage                             |
| ---------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------ | --------------------------------- |
| `/images/legacy/merritts-tow-truck.avif` | `/images/optimized/footer-tow-truck.avif` | `7c4c247952eb8cd1ff6765d335e6e6815a71e692a6fe03f4c0119c6a3a4dd273` | Hero and business context         |
| `/images/legacy/merritts-tow-truck.webp` | `/images/optimized/footer-tow-truck.webp` | `c4379e81b86884b16c9a3712de2907e76a4901eada3f94209e8b0e7d852cdb5f` | Hero fallback                     |
| `/images/legacy/merritts-tow-truck.jpg`  | `/images/optimized/footer-tow-truck.jpg`  | `3c2b1871b82fa347f4d399664d32f54d49710f9b9e03e9e23137598f297ae535` | Hero fallback and social metadata |
| `/images/legacy/junk-car-removal.jpg`    | `/images/slider/slide2.jpg`               | `b63e632ea43ee2fe9371b0002a1fcae225eb4498d17dcd5e54b954fa6d9452b0` | Vehicle-removal content           |
| `/images/legacy/auto-recycling-yard.jpg` | `/images/slider/slide3.jpg`               | `aacccb1f33ddbc61764c354b6938993abec5daee2ba604cdb0c32c721a5c1911` | Auto-recycling content            |

## Non-photographic assets

`public/brand/*.svg` is a new, code-native logo system created for this rebuild. Inline SVG icons are functional interface elements. Neither category is representational image content.

## Launch verification

- Confirm Merritt's owns or has continuing rights to each legacy photo.
- Confirm the truck photo accurately represents Merritt's current or historical operation and is approved for prominent use.
- Confirm no visible person, plate, address, or third-party mark creates a privacy or licensing issue.
- Preserve this manifest if filenames are optimized or moved.

## Responsive hero derivatives — October 16, 2026

These smaller encodings come only from the approved 1600 × 1070 `merritts-tow-truck.jpg` above, using Sharp 0.35.5. They preserve the full frame and aspect ratio; no content, crop or retouching was added. Widths are 640 and 960 pixels, AVIF quality 60 and WebP quality 80. The existing originals and social preview remain available.

| Path | SHA-256 | Bytes |
| --- | --- | --- |
| `/images/legacy/merritts-tow-truck-640.avif` | e161d318d29ae9428a9445fa664463b8773623cb86197dce4f2fde829eaae841 | 41195 |
| `/images/legacy/merritts-tow-truck-640.webp` | 8bb4967f0c5665d6666b6d65cdc4d0166f09978c0f0f5f5978fe07c427a2b918 | 59696 |
| `/images/legacy/merritts-tow-truck-960.avif` | 19b29bbd077bdb1c34603ca79d1e0df93f1fa2f21bb9d78fc805a32d80950c9c | 83982 |
| `/images/legacy/merritts-tow-truck-960.webp` | 3c6b135199c511cf63c8e64e0f2adfa6a1e0ca276100c2c6f34e118bcbd4c68f | 120530 |
