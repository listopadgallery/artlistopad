ALEXEY LISTOPAD ESTATE — TOP GALLERY VERSION

WHAT IS INSIDE
- 4 multilingual home pages: index.html / fr.html / es.html / de.html
- gallery.html powered by works.json
- artwork.html for each work
- music controls in the header: ⟡ / 1 / 2
- two local ambient audio files: music1.wav / music2.wav
- images folder
- elegant static CSS, mobile-friendly

HOW TO ADD A NEW PAINTING
1. Optimize the image first:
   - JPG
   - longest side around 1600–2000 px
   - ideally under 700 KB
2. Upload the image into /images/
3. Open works.json
4. Copy one existing work object
5. Change:
   - id
   - title
   - year
   - medium
   - dimensions
   - signature
   - tier (high / mid / fast)
   - status
   - image
   - alt
   - description
   - sortOrder
6. Commit changes in GitHub

IMPORTANT TRUTH
Because the site is static, uploading an image alone is not enough.
You must also add one JSON record in works.json.

MENU / LANGUAGE
- Home pages keep language-specific text
- gallery.html and artwork.html switch UI labels by ?lang=en/fr/es/de automatically
- links from each home page already pass the correct language

MUSIC
- Click ⟡ to start or stop
- Click 1 or 2 to choose track

EMAIL
listopad.gallery@yahoo.com
