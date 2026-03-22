ALEXEY LISTOPAD ESTATE — CATALOG SYSTEM

What this system does:
- works.json stores all painting data
- gallery.html automatically builds the cards
- artwork.html automatically opens a dedicated page for each painting
- filters are built-in: high / mid / fast
- images use lazy loading for speed

IMPORTANT TRUTH:
Because the site is static (GitHub + Netlify), it cannot automatically detect new image files just because they were uploaded.
To add a new painting, you must do TWO things:
1) upload the image into /images/
2) add one new object into works.json

FAST ADD STEPS:
1. Put new optimized image into images/
2. Open works.json
3. Copy one existing work object
4. Change:
   - id
   - title
   - year
   - medium
   - dimensions
   - signature
   - tier (high / mid / fast)
   - status
   - priceLabel
   - image
   - alt
   - description
   - sortOrder
5. Commit changes

Example new object:

{
  "id": "new-painting-id",
  "title": "New Painting",
  "year": "circa 1990s",
  "medium": "Oil on canvas",
  "dimensions": "80 × 60 cm",
  "signature": "Signed A.L.",
  "tier": "high",
  "status": "available",
  "priceLabel": "Price upon request",
  "image": "images/new_painting.jpg",
  "alt": "New Painting by Alexey Listopad",
  "description": "Short collector-facing text.",
  "sortOrder": 5
}

IMAGE ADVICE:
- Do NOT upload huge originals to the live site
- Recommended web size:
  longest side about 1800 px
- JPEG quality around 80–88
- Keep each image ideally under 700 KB if possible

TIER MEANING:
- high = strongest, anchor works
- mid = core estate works
- fast = quicker-sale works
